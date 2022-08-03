(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.cloudgame_sdk = {}));
})(this, (function (exports) { 'use strict';

	// SDK配置集合：相关变量
	var SDK_CONFIG = {
	    ws: null,
	    socket: null,
	    controlWs: null,
	    jmuxer: null,
	    webglPlayer: null,
	    aacPlayer: null,
	    myVideo: null,
	    myContainer: null,
	    // ping保持keeplive心跳
	    flag: null,
	    noRestart: false,
	    isVisuable: true,
	    isFeed: true,
	    isDrag: false,
	    isFinish: false,
	    hasSwitch: false,
	    isWaitSps: false,
	    disconnect: false,
	    isPay: false,
	    // 是否横屏
	    isLandscape: false,
	    isEntered: false,
	    videoWidth: 1080,
	    videoHeight: 1920,
	    // todo...
	    winHeight: null,
	    lastTime: null,
	    curTime: new Date().getTime(),
	    requestTime: new Date().getTime(),
	    oldTime: new Date().getTime(),
	    newTime: new Date().getTime(),
	    // 设置超时时间： 10分钟
	    outTime: 600000,
	    outsetInterval: null,
	    pingTimer: null,
	    // 排队拿卡
	    queueGetCard: null,
	    lineupTime: 5000,
	    clickPlay: 0,
	    decodeCount: 0,
	    h264Buffer: [],
	    aacQueue: [],
	    // 清晰度
	    sharpnessLevel: 2,
	    JMuxerOptions: {
	        node: 'playerVideo',
	        flushingTime: 33,
	        fps: 30,
	        mode: 'video',
	        debug: false
	    },
	    // 推流相关
	    socketURL: '',
	    socketExtranetURL: '',
	    sn: '',
	    token: '',
	    payURL: '',
	    // 接口相关
	    apiURL: 'http://14.18.190.140:9090',
	    getSdkTokenURL: '/api/blade-game/sdk/auth/token',
	    lineUpURL: '/api/blade-game/sdk/lineup',
	};
	var CARD_INFO = {
	    appId: "",
	    cardId: -1,
	    cardToken: "",
	    extranetIp: "",
	    extranetPort: -1,
	    id: -1,
	    internetHttp: "",
	    internetHttps: "",
	    intranetIp: "",
	    noRestart: "",
	    resourceId: -1,
	    sn: "",
	    socketExtranetPort: -1,
	    userCardId: "",
	    userTime: 0,
	    version: "",
	};
	var SOFT_SDK_CONFIG = {
	    decodeWoker: null,
	    webSocketWorker: null,
	    golbalYuvData: null,
	    isFinish: false,
	    isFeed: true,
	    h264Queue: [],
	    decodeCount: 1,
	    maxWidth: 1080,
	    maxHeight: 1920,
	    renderCount: 0,
	    fpsCount: 0,
	    decodeSuccessCount: 0,
	    decodeCostSum: 0,
	    lastTime: new Date().getTime(),
	    lastRequestTime: 0,
	    globalYuvPtr: undefined,
	    curFrameWidth: undefined,
	    curFrameHeight: undefined,
	};

	//https://blog.csdn.net/lizhijian21/article/details/80982403
	var ceil = function (val) {
	    return Math.ceil(val);
	};
	// 获取buf 的前n个bit组成的值
	var u = function (bitCount, input) {
	    var ret = 0;
	    for (var i = 0; i < bitCount; i++) {
	        ret <<= 1;
	        if (input.data[Math.floor(input.index / 8)] & (0x80 >> (input.index % 8))) {
	            ret += 1;
	        }
	        input.index++;
	    }
	    return ret;
	};
	/*无符号指数哥伦布编码(UE)
	*哥伦布编码的码字code_word由三部分组成：code_word = [M个0] + [1] + [Info]
	*其中，Info是一个携带信息的M位数据，每个哥伦布码的长度为（2M+1）位，每个码字都可由code_num产生。
	*根据码字code_word解码出code_num值的过程如下：
	*1. 首先读入M位以"1"为结尾的0；
	*2. 根据得到的M，读入接下来的M位Info数据；
	*3. 根据这个公式得到计算结果code_num = Info – 1 + 2M
	*/
	var ue = function (input, len) {
	    var zeroNum = 0;
	    while (input.index < len * 8) {
	        // 遇到1则停止，统计0的个数
	        if (input.data[Math.floor(input.index / 8)] & (0x80 >> (input.index % 8))) {
	            break;
	        }
	        zeroNum++;
	        input.index++;
	    }
	    input.index++;
	    var ret = 0;
	    // 计算
	    for (var i = 0; i < zeroNum; i++) {
	        ret <<= 1;
	        if (input.data[Math.floor(input.index / 8)] & (0x80 >> input.index % 8)) {
	            ret += 1;
	        }
	        input.index++;
	    }
	    return (1 << zeroNum) - 1 + ret;
	};
	// 有符号哥伦布编码
	var se = function (input, len) {
	    var ueVal = ue(input, len);
	    var k = ueVal;
	    var nValue = ceil(k / 2);
	    if (ueVal % 2 == 0)
	        nValue = -nValue;
	    return nValue;
	};
	var spsParser = function (buf) {
	    var startBitIndex = 0;
	    // 去除00 00 00 01竞争码
	    buf = buf.slice(4);
	    var len = buf.length;
	    // 输入参数
	    var input = {
	        data: buf,
	        index: startBitIndex
	    };
	    u(1, input);
	    u(2, input);
	    var nal_unit_type = u(5, input);
	    var chroma_format_idc;
	    if (nal_unit_type == 7) {
	        var profile_idc = u(8, input);
	        u(1, input);
	        u(1, input);
	        u(1, input);
	        u(1, input);
	        u(1, input);
	        u(1, input);
	        u(2, input);
	        u(8, input);
	        ue(input, len);
	        if (profile_idc == 100 || profile_idc == 110 || profile_idc == 122 || profile_idc == 144) {
	            chroma_format_idc = ue(input, len);
	            if (chroma_format_idc == 3) {
	                u(1, input);
	            }
	            ue(input, len);
	            ue(input, len);
	            u(1, input);
	            var seq_scaling_matrix_present_flag = u(1, input);
	            var seq_scaling_list_present_flag = new Uint8Array(8);
	            if (seq_scaling_matrix_present_flag) {
	                for (var i = 0; i < 8; i++) {
	                    seq_scaling_list_present_flag[i] = u(1, input);
	                }
	            }
	        }
	        ue(input, len);
	        var pic_order_cnt_type = ue(input, len);
	        if (pic_order_cnt_type == 0) ;
	        else if (pic_order_cnt_type == 1) {
	            u(1, input);
	            se(input, len);
	            se(input, len);
	            var num_ref_frames_in_pic_order_cnt_cycle = ue(input, len);
	            var offset_for_ref_frame = new Uint8Array[num_ref_frames_in_pic_order_cnt_cycle];
	            for (var j = 0; j < num_ref_frames_in_pic_order_cnt_cycle; j++) {
	                offset_for_ref_frame[j] = se(input, len);
	            }
	        }
	        ue(input, len);
	        u(1, input);
	        var pic_width_in_mbs_minus1 = ue(input, len);
	        var pic_height_in_map_units_minus1 = ue(input, len);
	        var width = (pic_width_in_mbs_minus1 + 1) * 16; //可能还要进行裁剪处理
	        var height = (pic_height_in_map_units_minus1 + 1) * 16;
	        var frame_mbs_only_flag = u(1, input);
	        if (!frame_mbs_only_flag) {
	            u(1, input);
	        }
	        u(1, input);
	        var frame_cropping_flag = u(1, input);
	        if (frame_cropping_flag) {
	            var frame_crop_left_offset = ue(input, len);
	            var frame_crop_right_offset = ue(input, len);
	            var frame_crop_top_offset = ue(input, len);
	            var frame_crop_bottom_offset = ue(input, len);
	            var crop_unit_x = 1;
	            var crop_unit_y = 2 - frame_mbs_only_flag;
	            if (chroma_format_idc == 1) { // 4:2:0
	                crop_unit_x = 2;
	                crop_unit_y = 2 * (2 - frame_mbs_only_flag);
	            }
	            else if (chroma_format_idc == 2) { // 4:2:2
	                crop_unit_x = 2;
	                crop_unit_y = 2 - frame_mbs_only_flag;
	            }
	            width -= crop_unit_x * (frame_crop_left_offset + frame_crop_right_offset);
	            height -= crop_unit_y * (frame_crop_top_offset + frame_crop_bottom_offset);
	        }
	        return {
	            width: width,
	            height: height
	        };
	    }
	};

	var keycodeMode = {
	    48: 7,
	    49: 8,
	    50: 9,
	    51: 10,
	    52: 11,
	    53: 12,
	    54: 13,
	    55: 14,
	    56: 15,
	    57: 16,
	    96: 7,
	    97: 8,
	    98: 9,
	    99: 10,
	    100: 11,
	    101: 12,
	    102: 13,
	    103: 14,
	    104: 15,
	    105: 16,
	    65: 29,
	    66: 30,
	    67: 31,
	    68: 32,
	    69: 33,
	    70: 34,
	    71: 35,
	    72: 36,
	    73: 37,
	    74: 38,
	    75: 39,
	    76: 40,
	    77: 41,
	    78: 42,
	    79: 43,
	    80: 44,
	    81: 45,
	    82: 46,
	    83: 47,
	    84: 48,
	    85: 49,
	    86: 50,
	    87: 51,
	    88: 52,
	    89: 53,
	    90: 54,
	    13: 66,
	    27: 111,
	    38: 19,
	    40: 20,
	    37: 21,
	    39: 22,
	    36: 122,
	    35: 123,
	    8: 67,
	    46: 112,
	    45: 124,
	    9: 61,
	    144: 143,
	    20: 115,
	    19: 121,
	    145: 116,
	    33: 92,
	    34: 93,
	    188: 55,
	    190: 56,
	    110: 56,
	    32: 62,
	    192: 68,
	    189: 69,
	    187: 70,
	    219: 71,
	    221: 72,
	    220: 73,
	    186: 74,
	    222: 75,
	    191: 76,
	    107: 81, // 键盘->安卓:  +
	};

	//此文件实现将控制命令封装成协议，具体协议内容请看：
	//链接：http://note.youdao.com/noteshare?id=dabda6c613adef7a416bd2625cd770a1

	// bcc校验码计算
	// arry: 要计算的数组
	// 返回计算协议中校验位的校验码
	const calBcc = (arry) => {
		var bcc = 0;
		for (let i = 0; i < arry.length; i++) {
			bcc ^= arry[i];
		}
		return bcc;
	};

	// 数组打印，调试用
	const PrintArry = (data) => {
		var str = "";
		for (let i = 0; i < data.length; i++) {
			str = str + data[i].toString(16).padStart(2, '0');
		}
		str = str.toUpperCase();
		return str;
	};

	// 账号透传
	const ExexuteSetAccountTransparent = (uid, token) => {
		// var jsonObj = {"data":{"keyCode":code}, "event":"keyCode"};
		var jsonObj = {
			//消息类型
			event: 'passthrough',
			//接入方发送的数据
			data: {
				aiqu_game_event_key: "login_event",
				aiqu_game_data_key: {
					"uid": uid,
					"token": token
				}
			}
		};
		var json = JSON.stringify(jsonObj);
		// var sn = "RK3923C1201900139";
		// return makeFrame(sn, 0, json);
		return json
	};

	// 设置分辨率
	const ExexuteSetPhoneSize = (width, height) => {
		// var jsonObj = {"data":{"keyCode":code}, "event":"keyCode"};
		var jsonObj = {
			data: {
				width: width,
				height: height
			},
			type: 'setPhoneSize'
		};
		var json = JSON.stringify(jsonObj);
		// var sn = "RK3923C1201900139";
		// return makeFrame(sn, 0, json);
		return json
	};

	const ExexuteSendBitRate = (data) => {
		// var jsonObj = {"data":{"keyCode":code}, "event":"keyCode"};
		var jsonObj = {
			data: {
				definition: data
			},
			type: '2'
		};
		var json = JSON.stringify(jsonObj);
		// var sn = "RK3923C1201900139";
		// return makeFrame(sn, 0, json);
		return json
	};

	//触发键盘事件, code表示键盘值
	const ExexuteKeyDown = (code) => {
		// var jsonObj = {"data":{"keyCode":code}, "event":"keyCode"};
		var jsonObj = {
			data: {
				keyCode: code
			},
			type: 'keyCode'
		};
		var json = JSON.stringify(jsonObj);
		// var sn = "RK3923C1201900139";
		// return makeFrame(sn, 0, json);
		return json

	};
	//触发鼠标按下事件，x：x坐标， y：y坐标

	const ExexuteMouseDown = (x, y) => {
		// var jsonObj = {"data":{"action":0, "count":1, "pointerId":0,"x":x, "y":y}, "event":"0"};
		var jsonObj = {
			data: {
				action: 0,
				count: 1,
				id: 0,
				x: x,
				y: y
			},
			type: 'event',
		};
		var json = JSON.stringify(jsonObj);
		// var sn = "RK3923C1201900139";
		// return  makeFrame(sn, 0, json);
		console.log("打印点击json", json);
		return json
	};
	// 触发鼠标移动事件，x：x坐标， y：y坐标
	const ExexuteMouseMove = (x, y) => {
		// var jsonObj = {"data":{"action":2, "count":1, "pointerId":0,"x":x, "y":y}, "event":"2"};
		// var json = JSON.stringify(jsonObj);
		// var sn = "RK3923C1201900139";
		// return  makeFrame(sn, 0, json);	 
		var jsonObj = {
			data: {
				action: 2,
				count: 1,
				id: 0,
				x: x,
				y: y
			},
			type: 'event',
		};
		var json = JSON.stringify(jsonObj);
		return json
	};
	//触发鼠标抬起事件，x：x坐标， y：y坐标
	const ExexuteMouseUp = (x, y) => {
		// var jsonObj = {"data":{"action":1, "count":1, "pointerId":0,"x":x, "y":y}, "event":"1"};
		// var json = JSON.stringify(jsonObj);
		// var sn = "RK3923C1201900139";
		// return makeFrame(sn, 0, json);	 
		var jsonObj = {
			data: {
				action: 1,
				count: 1,
				id: 0,
				x: x,
				y: y
			},
			type: 'event',
		};
		var json = JSON.stringify(jsonObj);
		return json
	};

	const makeFrameExtend = (sn, dataType, body) => {
		var index = 0;
		var dataLen = body.length;
		var frameLen = dataLen + 26;
		var outPut = new Uint8Array(frameLen);
		outPut[index++] = 0x68;
		outPut[index++] = (dataLen & 0xff000000) >> 24;
		outPut[index++] = (dataLen & 0x00ff0000) >> 16;
		outPut[index++] = (dataLen & 0x0000ff00) >> 8;
		outPut[index++] = dataLen & 0x000000ff;
		outPut[index++] = 0; //类型为client

		//sn号赋值，string转ascii
		for (let i = 0; i < sn.length; i++) {
			outPut[index++] = sn[i].charCodeAt();
		}

		outPut[index++] = dataType; //指定数据类型为json
		//json string转ascii
		for (let i = 0; i < body.length; i++) {
			outPut[index++] = body[i];
		}

		var bccBuffer = outPut.slice(1, frameLen - 3 + 1); //忽略协议头和协议尾
		outPut[index++] = calBcc(bccBuffer);
		outPut[index++] = 0x16;
		//var str = PrintArry(outPut);
		//console.log("打印数组:%s", PrintArry(outPut));
		//return PrintArry(outPut);
		return outPut;
	};

	//根据报文识别屏幕方向, 0横屏，1竖屏
	const CheckScreenDirection = (data) => {
		if (data[0] == 0 && data[1] == 0 && data[2] == 0 && data[3] == 1) {
			if (data[4] == 1 && data[5] == 1) {
				if (data[6] == 1) {
					let screen = data[7];
					return screen;
				}
			}
		}
	};

	//查询屏幕方向
	const GetScreenState = () => {
		var sn = "RK3923C1201900139";
		var outPut = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x02]);
		return makeFrameExtend(sn, 5, outPut);
	};

	//生成鉴权报文
	const VerifyCode = (sn, code) => {
		var len = code.length + 1;
		// "utf-8"
		var codeBuffer = new TextEncoder("utf-8").encode(code); //获取字符串ascii码
		var buffer = new Uint8Array(len);
		buffer[0] = 0x04;
		for (let i = 0; i < codeBuffer.length; i++) {
			buffer[i + 1] = codeBuffer[i];
		}
		return makeFrameExtend(sn, 6, buffer);
	};

	//
	const CheckVerifyCode = (data) => {
		var dataLen = data.length - 26;
		var body = data.slice(24, 24 + dataLen);
		console.log("打印:" + PrintArry(body));
		if (body[3] == 0x03) {
			return true;
		}
		return false;
	};

	//通道配置
	const ConfigChannel = (sn, channelName) => {
		var chanelBuffer = new TextEncoder("utf-8").encode(channelName);
		var outPut = [];
		outPut.push(0x07);

		for (let i = 0; i < chanelBuffer.length; i++) {
			outPut.push(chanelBuffer[i]);
		}
		return makeFrameExtend(sn, 6, outPut);
	};

	//多端登录数据解析
	const checkMultiLoginInfo = (input) => {
		var dataLen = input.length - 26; //得到json 长度
		var jsonHex = input.slice(24, 24 + dataLen); //截取json hex二进制数据		
		var jsonStr = new TextDecoder("utf-8").decode(jsonHex);
		console.log("取得json 字符串:" + jsonStr);
		var jsonObj = JSON.parse(jsonStr);
		return jsonObj;
	};

	//切换清晰度
	const makeSharpness = (level) => {
		var jsonObj = {
			"type": 2,
			"data": {
				"definition": level, //值为1到5 个等级
				"clientType": "h5", //pc android ios  h5
				"sceneType": "cloudGame", //cloudPhone   cloudGame
			}
		};
		var jsonStr = JSON.stringify(jsonObj);
		return jsonStr
	};

	//I 帧请求报文生成
	const RequestIFrame = () => {
		var sn = "RK3923C1201900139";
		var outPut = new Uint8Array([0x20]);
		return makeFrameExtend(sn, 6, outPut);
	};

	var Module$1 = typeof Module$1 !== "undefined" ? Module$1: {};
	var window$1 = typeof window$1 !== "undefined" ? window$1: null;
	var importScripts = typeof importScripts !== "undefined" ? importScripts: null;
	var moduleOverrides = {};
	var key;
	for (key in Module$1) {
	    if (Module$1.hasOwnProperty(key)) {
	        moduleOverrides[key] = Module$1[key];
	    }
	}
	var ENVIRONMENT_IS_WEB = false;
	var ENVIRONMENT_IS_WORKER = false;
	var ENVIRONMENT_IS_NODE = false;
	var ENVIRONMENT_IS_SHELL = false;
	ENVIRONMENT_IS_WEB = typeof window$1 === "object";
	ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
	ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
	ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
	var scriptDirectory = "";
	function locateFile(path) {
	    if (Module$1["locateFile"]) {
	        return Module$1["locateFile"](path, scriptDirectory)
	    }
	    return scriptDirectory + path
	}
	var read_, readBinary;
	var nodeFS;
	var nodePath;
	if (ENVIRONMENT_IS_NODE) {
	    if (ENVIRONMENT_IS_WORKER) {
	        scriptDirectory = require("path").dirname(scriptDirectory) + "/";
	    } else {
	        scriptDirectory = __dirname + "/";
	    }
	    read_ = function shell_read(filename, binary) {
	        if (!nodeFS) nodeFS = require("fs");
	        if (!nodePath) nodePath = require("path");
	        filename = nodePath["normalize"](filename);
	        return nodeFS["readFileSync"](filename, binary ? null: "utf8")
	    };
	    readBinary = function readBinary(filename) {
	        var ret = read_(filename, true);
	        if (!ret.buffer) {
	            ret = new Uint8Array(ret);
	        }
	        assert(ret.buffer);
	        return ret
	    };
	    if (process["argv"].length > 1) {
	        process["argv"][1].replace(/\\/g, "/");
	    }
	    process["argv"].slice(2);
	    if (typeof module !== "undefined") {
	        module["exports"] = Module$1;
	    }
	    process["on"]("uncaughtException",
	    function(ex) {
	        if (! (ex instanceof ExitStatus)) {
	            throw ex
	        }
	    });
	    process["on"]("unhandledRejection", abort);
	    Module$1["inspect"] = function() {
	        return "[Emscripten Module object]"
	    };
	} else if (ENVIRONMENT_IS_SHELL) {
	    if (typeof read != "undefined") {
	        read_ = function shell_read(f) {
	            return read(f)
	        };
	    }
	    readBinary = function readBinary(f) {
	        var data;
	        if (typeof readbuffer === "function") {
	            return new Uint8Array(readbuffer(f))
	        }
	        data = read(f, "binary");
	        assert(typeof data === "object");
	        return data
	    };
	    if (typeof scriptArgs != "undefined") {
	        scriptArgs;
	    } else if (typeof arguments != "undefined") {
	        arguments;
	    }
	    if (typeof print !== "undefined") {
	        if (typeof console === "undefined") console = {};
	        console.log = print;
	        console.warn = console.error = typeof printErr !== "undefined" ? printErr: print;
	    }
	} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
	    if (ENVIRONMENT_IS_WORKER) {
	        scriptDirectory = self.location.href;
	    } else if (typeof document !== "undefined" && document.currentScript) {
	        scriptDirectory = document.currentScript.src;
	    }
	    if (scriptDirectory.indexOf("blob:") !== 0) {
	        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
	    } else {
	        scriptDirectory = "";
	    } {
	        read_ = function shell_read(url) {
	            var xhr = new XMLHttpRequest;
	            xhr.open("GET", url, false);
	            xhr.send(null);
	            return xhr.responseText
	        };
	        if (ENVIRONMENT_IS_WORKER) {
	            readBinary = function readBinary(url) {
	                var xhr = new XMLHttpRequest;
	                xhr.open("GET", url, false);
	                xhr.responseType = "arraybuffer";
	                xhr.send(null);
	                return new Uint8Array(xhr.response)
	            };
	        }
	    }
	} else ;
	var out = Module$1["print"] || console.log.bind(console);
	var err = Module$1["printErr"] || console.warn.bind(console);
	for (key in moduleOverrides) {
	    if (moduleOverrides.hasOwnProperty(key)) {
	        Module$1[key] = moduleOverrides[key];
	    }
	}
	moduleOverrides = null;
	if (Module$1["arguments"]) Module$1["arguments"];
	if (Module$1["thisProgram"]) Module$1["thisProgram"];
	if (Module$1["quit"]) Module$1["quit"];
	var wasmBinary;
	if (Module$1["wasmBinary"]) wasmBinary = Module$1["wasmBinary"];
	if (Module$1["noExitRuntime"]) Module$1["noExitRuntime"];
	if (typeof WebAssembly !== "object") {
	    abort("no native wasm support detected");
	}
	var wasmMemory;
	var ABORT = false;
	function assert(condition, text) {
	    if (!condition) {
	        abort("Assertion failed: " + text);
	    }
	}
	var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
	function UTF8ArrayToString(heap, idx, maxBytesToRead) {
	    var endIdx = idx + maxBytesToRead;
	    var endPtr = idx;
	    while (heap[endPtr] && !(endPtr >= endIdx))++endPtr;
	    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
	        return UTF8Decoder.decode(heap.subarray(idx, endPtr))
	    } else {
	        var str = "";
	        while (idx < endPtr) {
	            var u0 = heap[idx++];
	            if (! (u0 & 128)) {
	                str += String.fromCharCode(u0);
	                continue
	            }
	            var u1 = heap[idx++] & 63;
	            if ((u0 & 224) == 192) {
	                str += String.fromCharCode((u0 & 31) << 6 | u1);
	                continue
	            }
	            var u2 = heap[idx++] & 63;
	            if ((u0 & 240) == 224) {
	                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
	            } else {
	                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
	            }
	            if (u0 < 65536) {
	                str += String.fromCharCode(u0);
	            } else {
	                var ch = u0 - 65536;
	                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
	            }
	        }
	    }
	    return str
	}
	function UTF8ToString(ptr, maxBytesToRead) {
	    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
	}
	var HEAPU8, HEAP32;
	function updateGlobalBufferAndViews(buf) {
	    Module$1["HEAP8"] = new Int8Array(buf);
	    Module$1["HEAP16"] = new Int16Array(buf);
	    Module$1["HEAP32"] = HEAP32 = new Int32Array(buf);
	    Module$1["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
	    Module$1["HEAPU16"] = new Uint16Array(buf);
	    Module$1["HEAPU32"] = new Uint32Array(buf);
	    Module$1["HEAPF32"] = new Float32Array(buf);
	    Module$1["HEAPF64"] = new Float64Array(buf);
	}
	Module$1["INITIAL_MEMORY"] || 10485760;
	var wasmTable;
	var __ATPRERUN__ = [];
	var __ATINIT__ = [];
	var __ATMAIN__ = [];
	var __ATPOSTRUN__ = [];
	function preRun() {
	    if (Module$1["preRun"]) {
	        if (typeof Module$1["preRun"] == "function") Module$1["preRun"] = [Module$1["preRun"]];
	        while (Module$1["preRun"].length) {
	            addOnPreRun(Module$1["preRun"].shift());
	        }
	    }
	    callRuntimeCallbacks(__ATPRERUN__);
	}
	function initRuntime() {
	    callRuntimeCallbacks(__ATINIT__);
	}
	function preMain() {
	    callRuntimeCallbacks(__ATMAIN__);
	}
	function postRun() {
	    if (Module$1["postRun"]) {
	        if (typeof Module$1["postRun"] == "function") Module$1["postRun"] = [Module$1["postRun"]];
	        while (Module$1["postRun"].length) {
	            addOnPostRun(Module$1["postRun"].shift());
	        }
	    }
	    callRuntimeCallbacks(__ATPOSTRUN__);
	}
	function addOnPreRun(cb) {
	    __ATPRERUN__.unshift(cb);
	}
	function addOnPostRun(cb) {
	    __ATPOSTRUN__.unshift(cb);
	}
	var runDependencies = 0;
	var dependenciesFulfilled = null;
	function addRunDependency(id) {
	    runDependencies++;
	    if (Module$1["monitorRunDependencies"]) {
	        Module$1["monitorRunDependencies"](runDependencies);
	    }
	}
	function removeRunDependency(id) {
	    runDependencies--;
	    if (Module$1["monitorRunDependencies"]) {
	        Module$1["monitorRunDependencies"](runDependencies);
	    }
	    if (runDependencies == 0) {
	        if (dependenciesFulfilled) {
	            var callback = dependenciesFulfilled;
	            dependenciesFulfilled = null;
	            callback();
	        }
	    }
	}
	Module$1["preloadedImages"] = {};
	Module$1["preloadedAudios"] = {};
	function abort(what) {
	    if (Module$1["onAbort"]) {
	        Module$1["onAbort"](what);
	    }
	    what += "";
	    err(what);
	    ABORT = true;
	    what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
	    var e = new WebAssembly.RuntimeError(what);
	    throw e
	}
	function hasPrefix(str, prefix) {
	    return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
	}
	var dataURIPrefix = "data:application/octet-stream;base64,";
	function isDataURI(filename) {
	    return hasPrefix(filename, dataURIPrefix)
	}
	var fileURIPrefix = "file://";
	function isFileURI(filename) {
	    return hasPrefix(filename, fileURIPrefix)
	}
	var wasmBinaryFile = "./aac.wasm";
	if (!isDataURI(wasmBinaryFile)) {
	    wasmBinaryFile = locateFile(wasmBinaryFile);
	}
	function getBinary(file) {
	    try {
	        if (file == wasmBinaryFile && wasmBinary) {
	            return new Uint8Array(wasmBinary)
	        }
	        if (readBinary) {
	            return readBinary(file)
	        } else {
	            throw "both async and sync fetching of the wasm failed"
	        }
	    } catch(err) {
	        abort(err);
	    }
	}
	function getBinaryPromise() {
	    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
	        return fetch(wasmBinaryFile, {
	            credentials: "same-origin"
	        }).then(function(response) {
	            if (!response["ok"]) {
	                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
	            }
	            return response["arrayBuffer"]()
	        }).
	        catch(function() {
	            return getBinary(wasmBinaryFile)
	        })
	    }
	    return Promise.resolve().then(function() {
	        return getBinary(wasmBinaryFile)
	    })
	}
	function createWasm() {
	    var info = {
	        "a": asmLibraryArg
	    };
	    function receiveInstance(instance, module) {
	        var exports = instance.exports;
	        Module$1["asm"] = exports;
	        wasmMemory = Module$1["asm"]["g"];
	        updateGlobalBufferAndViews(wasmMemory.buffer);
	        wasmTable = Module$1["asm"]["h"];
	        removeRunDependency();
	    }
	    addRunDependency();
	    function receiveInstantiatedSource(output) {
	        receiveInstance(output["instance"]);
	    }
	    function instantiateArrayBuffer(receiver) {
	        return getBinaryPromise().then(function(binary) {
	            return WebAssembly.instantiate(binary, info)
	        }).then(receiver,
	        function(reason) {
	            err("failed to asynchronously prepare wasm: " + reason);
	            abort(reason);
	        })
	    }
	    function instantiateAsync() {
	        if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
	            return fetch(wasmBinaryFile, {
	                credentials: "same-origin"
	            }).then(function(response) {
	                var result = WebAssembly.instantiateStreaming(response, info);
	                return result.then(receiveInstantiatedSource,
	                function(reason) {
	                    err("wasm streaming compile failed: " + reason);
	                    err("falling back to ArrayBuffer instantiation");
	                    return instantiateArrayBuffer(receiveInstantiatedSource)
	                })
	            })
	        } else {
	            return instantiateArrayBuffer(receiveInstantiatedSource)
	        }
	    }
	    if (Module$1["instantiateWasm"]) {
	        try {
	            var exports = Module$1["instantiateWasm"](info, receiveInstance);
	            return exports
	        } catch(e) {
	            err("Module.instantiateWasm callback failed with error: " + e);
	            return false
	        }
	    }
	    instantiateAsync();
	    return {}
	}
	function callRuntimeCallbacks(callbacks) {
	    while (callbacks.length > 0) {
	        var callback = callbacks.shift();
	        if (typeof callback == "function") {
	            callback(Module$1);
	            continue
	        }
	        var func = callback.func;
	        if (typeof func === "number") {
	            if (callback.arg === undefined) {
	                wasmTable.get(func)();
	            } else {
	                wasmTable.get(func)(callback.arg);
	            }
	        } else {
	            func(callback.arg === undefined ? null: callback.arg);
	        }
	    }
	}
	function ___assert_fail(condition, filename, line, func) {
	    abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
	}
	function _emscripten_memcpy_big(dest, src, num) {
	    HEAPU8.copyWithin(dest, src, src + num);
	}
	function abortOnCannotGrowMemory(requestedSize) {
	    abort("OOM");
	}
	function _emscripten_resize_heap(requestedSize) {
	    abortOnCannotGrowMemory();
	}
	var SYSCALLS = {
	    mappings: {},
	    buffers: [null, [], []],
	    printChar: function(stream, curr) {
	        var buffer = SYSCALLS.buffers[stream];
	        if (curr === 0 || curr === 10) { (stream === 1 ? out: err)(UTF8ArrayToString(buffer, 0));
	            buffer.length = 0;
	        } else {
	            buffer.push(curr);
	        }
	    },
	    varargs: undefined,
	    get: function() {
	        SYSCALLS.varargs += 4;
	        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
	        return ret
	    },
	    getStr: function(ptr) {
	        var ret = UTF8ToString(ptr);
	        return ret
	    },
	    get64: function(low, high) {
	        return low
	    }
	};
	function _fd_close(fd) {
	    return 0
	}
	function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}
	function _fd_write(fd, iov, iovcnt, pnum) {
	    var num = 0;
	    for (var i = 0; i < iovcnt; i++) {
	        var ptr = HEAP32[iov + i * 8 >> 2];
	        var len = HEAP32[iov + (i * 8 + 4) >> 2];
	        for (var j = 0; j < len; j++) {
	            SYSCALLS.printChar(fd, HEAPU8[ptr + j]);
	        }
	        num += len;
	    }
	    HEAP32[pnum >> 2] = num;
	    return 0
	}
	__ATINIT__.push({
	    func: function() {
	        ___wasm_call_ctors();
	    }
	});
	var asmLibraryArg = {
	    "b": ___assert_fail,
	    "d": _emscripten_memcpy_big,
	    "e": _emscripten_resize_heap,
	    "f": _fd_close,
	    "c": _fd_seek,
	    "a": _fd_write
	};
	createWasm();
	var ___wasm_call_ctors = Module$1["___wasm_call_ctors"] = function() {
	    return (___wasm_call_ctors = Module$1["___wasm_call_ctors"] = Module$1["asm"]["i"]).apply(null, arguments)
	};
	Module$1["_feedData"] = function() {
	    return (Module$1["_feedData"] = Module$1["asm"]["j"]).apply(null, arguments)
	};
	Module$1["_destroyDecoder"] = function() {
	    return (Module$1["_destroyDecoder"] = Module$1["asm"]["k"]).apply(null, arguments)
	};
	Module$1["_malloc"] = function() {
	    return (Module$1["_malloc"] = Module$1["asm"]["l"]).apply(null, arguments)
	};
	Module$1["_free"] = function() {
	    return (Module$1["_free"] = Module$1["asm"]["m"]).apply(null, arguments)
	};
	var calledRun;
	function ExitStatus(status) {
	    this.name = "ExitStatus";
	    this.message = "Program terminated with exit(" + status + ")";
	    this.status = status;
	}
	dependenciesFulfilled = function runCaller() {
	    if (!calledRun) run();
	    if (!calledRun) dependenciesFulfilled = runCaller;
	};
	function run(args) {
	    if (runDependencies > 0) {
	        return
	    }
	    preRun();
	    if (runDependencies > 0) return;
	    function doRun() {
	        if (calledRun) return;
	        calledRun = true;
	        Module$1["calledRun"] = true;
	        if (ABORT) return;
	        initRuntime();
	        preMain();
	        if (Module$1["onRuntimeInitialized"]) Module$1["onRuntimeInitialized"]();
	        postRun();
	    }
	    if (Module$1["setStatus"]) {
	        Module$1["setStatus"]("Running...");
	        setTimeout(function() {
	            setTimeout(function() {
	                Module$1["setStatus"]("");
	            },
	            1);
	            doRun();
	        },
	        1);
	    } else {
	        doRun();
	    }
	}
	Module$1["run"] = run;
	if (Module$1["preInit"]) {
	    if (typeof Module$1["preInit"] == "function") Module$1["preInit"] = [Module$1["preInit"]];
	    while (Module$1["preInit"].length > 0) {
	        Module$1["preInit"].pop()();
	    }
	}
	run();

	// 导出Module
	const AAC_MODULE = {
	    Module: Module$1
	};

	// 需要暴露出去的状态值
	exports.GameEventToOutSide = -1;
	// 防抖函数 start -------------------------
	var bounce = function (delay, cb) {
	    var timer;
	    return function (value) {
	        clearTimeout(timer);
	        timer = setTimeout(function () {
	            cb(value);
	        }, delay);
	    };
	};
	var fn = function (value) {
	    console.log('### GameEventToOutSide 被设置为：  ', value);
	    exports.GameEventToOutSide = value;
	};
	var bounceFun = bounce(300, fn);
	// 防抖函数 end -------------------------
	/**
	 *  当前手机设备
	 * @returns {{isAndroid: boolean, isIOS: boolean}}
	 *  0 : android
	 *  1 : ios
	 *  2 : 未知设备
	 */
	var judgeDeviceType = function () {
	    var ua = window.navigator.userAgent.toLocaleLowerCase();
	    var isIOS = /iphone|ipad|ipod/.test(ua);
	    var isAndroid = /android/.test(ua);
	    return { type: isIOS ? 1 : isAndroid ? 0 : 2 };
	};

	// 额外配置
	var NSUInteger = {
	    GameEventInterfaceGetAuthModeError: 3000,
	    /*获取鉴权模式返回错误*/
	    GameEventInterfaceGetAuthModeError404: 3001,
	    /*获取鉴权模式接口失败*/
	    // GameEventInterfaceGetAuthRiskError: 3010,/*风控鉴权返回错误*/
	    // GameEventInterfaceGetAuthRiskError404: 3011,/*风控鉴权接口失败*/
	    GameEventInterfaceGetGameLineupError: 3020,
	    /*排队接口返回错误*/
	    GameEventInterfaceGetGameLineupError404: 3021,
	    /*排队接口接口失败*/
	    GameEventInterfaceGetGameLineupMsg: 4000,
	    /*排队拿卡*/
	    GameEventGetCardOkMsg: 4010,
	    /*拿到安卓卡*/
	    GameEventWebSocketOkMsg: 4011,
	    /*信令通道链接成功*/
	    GameEventCardConnectOkMsg: 4102,
	    /*安卓卡链接成功*/
	    GameEventTipMsg: 5000,
	    /*各种成功后的提示信息*/ // ========================= todo ============
	    GameEventWebSocketTipMsg: 9000,
	    /*信令通道接收到的正常消息转发*/ // ========================= todo ============
	    // GameEventWebSocketCloseMsg: 9001,/*信令通道被关闭*/
	    GameEventReConnectFailMsg: 9002,
	    /*云游戏重连失败*/
	    GameEventConnectBeClose: 9003,
	    /*云游戏推流关闭*/
	    GameEventWebSocketPay: 10000,
	    /*云游戏支付透传*/
	    GameEventWebSocketAiqu: 10001,
	    /*云游戏爱趣定制透传消息*/ // ========================= todo ============
	};
	var extraData = {
	    remainingTimeData: {},
	    payData: {},
	    // 爱趣相关
	    aiquData: '',
	    accountLoginStatus: '',
	    accountPayStatus: '',
	};

	const JMuxer = (function () {

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _defineProperty(obj, key, value) {
	    if (key in obj) {
	      Object.defineProperty(obj, key, {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	    } else {
	      obj[key] = value;
	    }

	    return obj;
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  function _isNativeReflectConstruct() {
	    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	    if (Reflect.construct.sham) return false;
	    if (typeof Proxy === "function") return true;

	    try {
	      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (typeof call === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _createSuper(Derived) {
	    var hasNativeReflectConstruct = _isNativeReflectConstruct();

	    return function _createSuperInternal() {
	      var Super = _getPrototypeOf(Derived),
	          result;

	      if (hasNativeReflectConstruct) {
	        var NewTarget = _getPrototypeOf(this).constructor;

	        result = Reflect.construct(Super, arguments, NewTarget);
	      } else {
	        result = Super.apply(this, arguments);
	      }

	      return _possibleConstructorReturn(this, result);
	    };
	  }

	  function _unsupportedIterableToArray(o, minLen) {
	    if (!o) return;
	    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	    var n = Object.prototype.toString.call(o).slice(8, -1);
	    if (n === "Object" && o.constructor) n = o.constructor.name;
	    if (n === "Map" || n === "Set") return Array.from(o);
	    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	  }

	  function _arrayLikeToArray(arr, len) {
	    if (len == null || len > arr.length) len = arr.length;

	    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	    return arr2;
	  }

	  function _createForOfIteratorHelper(o, allowArrayLike) {
	    var it;

	    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	        if (it) o = it;
	        var i = 0;

	        var F = function () {};

	        return {
	          s: F,
	          n: function () {
	            if (i >= o.length) return {
	              done: true
	            };
	            return {
	              done: false,
	              value: o[i++]
	            };
	          },
	          e: function (e) {
	            throw e;
	          },
	          f: F
	        };
	      }

	      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	    }

	    var normalCompletion = true,
	        didErr = false,
	        err;
	    return {
	      s: function () {
	        it = o[Symbol.iterator]();
	      },
	      n: function () {
	        var step = it.next();
	        normalCompletion = step.done;
	        return step;
	      },
	      e: function (e) {
	        didErr = true;
	        err = e;
	      },
	      f: function () {
	        try {
	          if (!normalCompletion && it.return != null) it.return();
	        } finally {
	          if (didErr) throw err;
	        }
	      }
	    };
	  }

	  var logger;
	  var errorLogger;
	  function setLogger() {
	    /*eslint-disable */
	    logger = console.log;
	    errorLogger = console.error;
	    /*eslint-enable */
	  }
	  function log(message) {
	    if (logger) {
	      for (var _len = arguments.length, optionalParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        optionalParams[_key - 1] = arguments[_key];
	      }

	      logger.apply(void 0, [message].concat(optionalParams));
	    }
	  }
	  function error(message) {
	    if (errorLogger) {
	      for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        optionalParams[_key2 - 1] = arguments[_key2];
	      }

	      errorLogger.apply(void 0, [message].concat(optionalParams));
	    }
	  }

	  var NALU = /*#__PURE__*/function () {
	    _createClass(NALU, null, [{
	      key: "type",
	      value: function type(nalu) {
	        if (nalu.ntype in NALU.TYPES) {
	          return NALU.TYPES[nalu.ntype];
	        } else {
	          return 'UNKNOWN';
	        }
	      }
	    }, {
	      key: "NDR",
	      get: function get() {
	        return 1;
	      }
	    }, {
	      key: "IDR",
	      get: function get() {
	        return 5;
	      }
	    }, {
	      key: "SEI",
	      get: function get() {
	        return 6;
	      }
	    }, {
	      key: "SPS",
	      get: function get() {
	        return 7;
	      }
	    }, {
	      key: "PPS",
	      get: function get() {
	        return 8;
	      }
	    }, {
	      key: "AUD",
	      get: function get() {
	        return 9;
	      }
	    }, {
	      key: "TYPES",
	      get: function get() {
	        var _ref;

	        return _ref = {}, _defineProperty(_ref, NALU.IDR, 'IDR'), _defineProperty(_ref, NALU.SEI, 'SEI'), _defineProperty(_ref, NALU.SPS, 'SPS'), _defineProperty(_ref, NALU.PPS, 'PPS'), _defineProperty(_ref, NALU.NDR, 'NDR'), _defineProperty(_ref, NALU.AUD, 'AUD'), _ref;
	      }
	    }]);

	    function NALU(data) {
	      _classCallCheck(this, NALU);

	      this.payload = data;
	      this.nri = (this.payload[0] & 0x60) >> 5; // nal_ref_idc

	      this.ntype = this.payload[0] & 0x1f;
	      this.isvcl = this.ntype == 1 || this.ntype == 5;
	      this.stype = ''; // slice_type

	      this.isfmb = false; // first_mb_in_slice
	    }

	    _createClass(NALU, [{
	      key: "toString",
	      value: function toString() {
	        return "".concat(NALU.type(this), ": NRI: ").concat(this.getNri());
	      }
	    }, {
	      key: "getNri",
	      value: function getNri() {
	        return this.nri;
	      }
	    }, {
	      key: "type",
	      value: function type() {
	        return this.ntype;
	      }
	    }, {
	      key: "isKeyframe",
	      value: function isKeyframe() {
	        return this.ntype === NALU.IDR || this.stype === 7;
	      }
	    }, {
	      key: "getPayload",
	      value: function getPayload() {
	        return this.payload;
	      }
	    }, {
	      key: "getPayloadSize",
	      value: function getPayloadSize() {
	        return this.payload.byteLength;
	      }
	    }, {
	      key: "getSize",
	      value: function getSize() {
	        return 4 + this.getPayloadSize();
	      }
	    }, {
	      key: "getData",
	      value: function getData() {
	        var result = new Uint8Array(this.getSize());
	        var view = new DataView(result.buffer);
	        view.setUint32(0, this.getSize() - 4);
	        result.set(this.getPayload(), 4);
	        return result;
	      }
	    }]);

	    return NALU;
	  }();

	  /**
	   * Parser for exponential Golomb codes, a variable-bitwidth number encoding scheme used by h264.
	  */
	  var ExpGolomb = /*#__PURE__*/function () {
	    function ExpGolomb(data) {
	      _classCallCheck(this, ExpGolomb);

	      this.data = data;
	      this.index = 0;
	      this.bitLength = data.byteLength * 8;
	    }

	    _createClass(ExpGolomb, [{
	      key: "skipBits",
	      value: function skipBits(size) {
	        // console.log(`  skip bits: size=${size}, ${this.index}.`);
	        if (this.bitsAvailable < size) {
	          //throw new Error('no bytes available');
	          return false;
	        }

	        this.index += size;
	      }
	    }, {
	      key: "readBits",
	      value: function readBits(size) {
	        var moveIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	        // console.log(`  read bits: size=${size}, ${this.index}.`);
	        var result = this.getBits(size, this.index, moveIndex); // console.log(`    read bits: result=${result}`);

	        return result;
	      }
	    }, {
	      key: "getBits",
	      value: function getBits(size, offsetBits) {
	        var moveIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	        if (this.bitsAvailable < size) {
	          //throw new Error('no bytes available');
	          return 0;
	        }

	        var offset = offsetBits % 8;

	        var _byte = this.data[offsetBits / 8 | 0] & 0xff >>> offset;

	        var bits = 8 - offset;

	        if (bits >= size) {
	          if (moveIndex) {
	            this.index += size;
	          }

	          return _byte >> bits - size;
	        } else {
	          if (moveIndex) {
	            this.index += bits;
	          }

	          var nextSize = size - bits;
	          return _byte << nextSize | this.getBits(nextSize, offsetBits + bits, moveIndex);
	        }
	      }
	    }, {
	      key: "skipLZ",
	      value: function skipLZ() {
	        var leadingZeroCount;

	        for (leadingZeroCount = 0; leadingZeroCount < this.bitLength - this.index; ++leadingZeroCount) {
	          if (this.getBits(1, this.index + leadingZeroCount, false) !== 0) {
	            // console.log(`  skip LZ  : size=${leadingZeroCount}, ${this.index}.`);
	            this.index += leadingZeroCount;
	            return leadingZeroCount;
	          }
	        }

	        return leadingZeroCount;
	      }
	    }, {
	      key: "skipUEG",
	      value: function skipUEG() {
	        this.skipBits(1 + this.skipLZ());
	      }
	    }, {
	      key: "skipEG",
	      value: function skipEG() {
	        this.skipBits(1 + this.skipLZ());
	      }
	    }, {
	      key: "readUEG",
	      value: function readUEG() {
	        var prefix = this.skipLZ();
	        return this.readBits(prefix + 1) - 1;
	      }
	    }, {
	      key: "readEG",
	      value: function readEG() {
	        var value = this.readUEG();

	        if (0x01 & value) {
	          // the number is odd if the low order bit is set
	          return 1 + value >>> 1; // add 1 to make it even, and divide by 2
	        } else {
	          return -1 * (value >>> 1); // divide by two then make it negative
	        }
	      }
	    }, {
	      key: "readBoolean",
	      value: function readBoolean() {
	        return this.readBits(1) === 1;
	      }
	    }, {
	      key: "readUByte",
	      value: function readUByte() {
	        var numberOfBytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	        return this.readBits(numberOfBytes * 8);
	      }
	    }, {
	      key: "readUShort",
	      value: function readUShort() {
	        return this.readBits(16);
	      }
	    }, {
	      key: "readUInt",
	      value: function readUInt() {
	        return this.readBits(32);
	      }
	    }, {
	      key: "bitsAvailable",
	      get: function get() {
	        return this.bitLength - this.index;
	      }
	    }]);

	    return ExpGolomb;
	  }();

	  var H264Parser = /*#__PURE__*/function () {
	    _createClass(H264Parser, null, [{
	      key: "extractNALu",
	      value: function extractNALu(buffer) {
	        var i = 0,
	            length = buffer.byteLength,
	            value,
	            state = 0,
	            result = [],
	            lastIndex;

	        while (i < length) {
	          value = buffer[i++]; // finding 3 or 4-byte start codes (00 00 01 OR 00 00 00 01)

	          switch (state) {
	            case 0:
	              if (value === 0) {
	                state = 1;
	              }

	              break;

	            case 1:
	              if (value === 0) {
	                state = 2;
	              } else {
	                state = 0;
	              }

	              break;

	            case 2:
	            case 3:
	              if (value === 0) {
	                state = 3;
	              } else if (value === 1 && i < length) {
	                if (lastIndex) {
	                  result.push(buffer.subarray(lastIndex, i - state - 1));
	                }

	                lastIndex = i;
	                state = 0;
	              } else {
	                state = 0;
	              }

	              break;
	          }
	        }

	        if (lastIndex) {
	          result.push(buffer.subarray(lastIndex, length));
	        }

	        return result;
	      }
	      /**
	       * Advance the ExpGolomb decoder past a scaling list. The scaling
	       * list is optionally transmitted as part of a sequence parameter
	       * set and is not relevant to transmuxing.
	       * @param decoder {ExpGolomb} exp golomb decoder
	       * @param count {number} the number of entries in this scaling list
	       * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
	       */

	    }, {
	      key: "skipScalingList",
	      value: function skipScalingList(decoder, count) {
	        var lastScale = 8,
	            nextScale = 8,
	            deltaScale;

	        for (var j = 0; j < count; j++) {
	          if (nextScale !== 0) {
	            deltaScale = decoder.readEG();
	            nextScale = (lastScale + deltaScale + 256) % 256;
	          }

	          lastScale = nextScale === 0 ? lastScale : nextScale;
	        }
	      }
	      /**
	       * Read a sequence parameter set and return some interesting video
	       * properties. A sequence parameter set is the H264 metadata that
	       * describes the properties of upcoming video frames.
	       * @param data {Uint8Array} the bytes of a sequence parameter set
	       * @return {object} an object with configuration parsed from the
	       * sequence parameter set, including the dimensions of the
	       * associated video frames.
	       */

	    }, {
	      key: "readSPS",
	      value: function readSPS(data) {
	        var decoder = new ExpGolomb(data);
	        var frameCropLeftOffset = 0,
	            frameCropRightOffset = 0,
	            frameCropTopOffset = 0,
	            frameCropBottomOffset = 0,
	            sarScale = 1,
	            profileIdc,
	            numRefFramesInPicOrderCntCycle,
	            picWidthInMbsMinus1,
	            picHeightInMapUnitsMinus1,
	            frameMbsOnlyFlag,
	            scalingListCount;
	        decoder.readUByte();
	        profileIdc = decoder.readUByte(); // profile_idc

	        decoder.readBits(5); // constraint_set[0-4]_flag, u(5)

	        decoder.skipBits(3); // reserved_zero_3bits u(3),

	        decoder.readUByte(); // level_idc u(8)

	        decoder.skipUEG(); // seq_parameter_set_id
	        // some profiles have more optional data we don't need

	        if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
	          var chromaFormatIdc = decoder.readUEG();

	          if (chromaFormatIdc === 3) {
	            decoder.skipBits(1); // separate_colour_plane_flag
	          }

	          decoder.skipUEG(); // bit_depth_luma_minus8

	          decoder.skipUEG(); // bit_depth_chroma_minus8

	          decoder.skipBits(1); // qpprime_y_zero_transform_bypass_flag

	          if (decoder.readBoolean()) {
	            // seq_scaling_matrix_present_flag
	            scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;

	            for (var i = 0; i < scalingListCount; ++i) {
	              if (decoder.readBoolean()) {
	                // seq_scaling_list_present_flag[ i ]
	                if (i < 6) {
	                  H264Parser.skipScalingList(decoder, 16);
	                } else {
	                  H264Parser.skipScalingList(decoder, 64);
	                }
	              }
	            }
	          }
	        }

	        decoder.skipUEG(); // log2_max_frame_num_minus4

	        var picOrderCntType = decoder.readUEG();

	        if (picOrderCntType === 0) {
	          decoder.readUEG(); // log2_max_pic_order_cnt_lsb_minus4
	        } else if (picOrderCntType === 1) {
	          decoder.skipBits(1); // delta_pic_order_always_zero_flag

	          decoder.skipEG(); // offset_for_non_ref_pic

	          decoder.skipEG(); // offset_for_top_to_bottom_field

	          numRefFramesInPicOrderCntCycle = decoder.readUEG();

	          for (var _i = 0; _i < numRefFramesInPicOrderCntCycle; ++_i) {
	            decoder.skipEG(); // offset_for_ref_frame[ i ]
	          }
	        }

	        decoder.skipUEG(); // max_num_ref_frames

	        decoder.skipBits(1); // gaps_in_frame_num_value_allowed_flag

	        picWidthInMbsMinus1 = decoder.readUEG();
	        picHeightInMapUnitsMinus1 = decoder.readUEG();
	        frameMbsOnlyFlag = decoder.readBits(1);

	        if (frameMbsOnlyFlag === 0) {
	          decoder.skipBits(1); // mb_adaptive_frame_field_flag
	        }

	        decoder.skipBits(1); // direct_8x8_inference_flag

	        if (decoder.readBoolean()) {
	          // frame_cropping_flag
	          frameCropLeftOffset = decoder.readUEG();
	          frameCropRightOffset = decoder.readUEG();
	          frameCropTopOffset = decoder.readUEG();
	          frameCropBottomOffset = decoder.readUEG();
	        }

	        if (decoder.readBoolean()) {
	          // vui_parameters_present_flag
	          if (decoder.readBoolean()) {
	            // aspect_ratio_info_present_flag
	            var sarRatio;
	            var aspectRatioIdc = decoder.readUByte();

	            switch (aspectRatioIdc) {
	              case 1:
	                sarRatio = [1, 1];
	                break;

	              case 2:
	                sarRatio = [12, 11];
	                break;

	              case 3:
	                sarRatio = [10, 11];
	                break;

	              case 4:
	                sarRatio = [16, 11];
	                break;

	              case 5:
	                sarRatio = [40, 33];
	                break;

	              case 6:
	                sarRatio = [24, 11];
	                break;

	              case 7:
	                sarRatio = [20, 11];
	                break;

	              case 8:
	                sarRatio = [32, 11];
	                break;

	              case 9:
	                sarRatio = [80, 33];
	                break;

	              case 10:
	                sarRatio = [18, 11];
	                break;

	              case 11:
	                sarRatio = [15, 11];
	                break;

	              case 12:
	                sarRatio = [64, 33];
	                break;

	              case 13:
	                sarRatio = [160, 99];
	                break;

	              case 14:
	                sarRatio = [4, 3];
	                break;

	              case 15:
	                sarRatio = [3, 2];
	                break;

	              case 16:
	                sarRatio = [2, 1];
	                break;

	              case 255:
	                {
	                  sarRatio = [decoder.readUByte() << 8 | decoder.readUByte(), decoder.readUByte() << 8 | decoder.readUByte()];
	                  break;
	                }
	            }

	            if (sarRatio) {
	              sarScale = sarRatio[0] / sarRatio[1];
	            }
	          }

	          if (decoder.readBoolean()) {
	            decoder.skipBits(1);
	          }

	          if (decoder.readBoolean()) {
	            decoder.skipBits(4);

	            if (decoder.readBoolean()) {
	              decoder.skipBits(24);
	            }
	          }

	          if (decoder.readBoolean()) {
	            decoder.skipUEG();
	            decoder.skipUEG();
	          }

	          if (decoder.readBoolean()) {
	            decoder.readUInt();
	            decoder.readUInt();
	            decoder.readBoolean();
	          }
	        }

	        return {
	          width: Math.ceil(((picWidthInMbsMinus1 + 1) * 16 - frameCropLeftOffset * 2 - frameCropRightOffset * 2) * sarScale),
	          height: (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16 - (frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset)
	        };
	      }
	    }, {
	      key: "parseHeader",
	      value: function parseHeader(unit) {
	        var decoder = new ExpGolomb(unit.getPayload()); // skip NALu type

	        decoder.readUByte();
	        unit.isfmb = decoder.readUEG() === 0;
	        unit.stype = decoder.readUEG();
	      }
	    }]);

	    function H264Parser(remuxer) {
	      _classCallCheck(this, H264Parser);

	      this.remuxer = remuxer;
	      this.track = remuxer.mp4track;
	    }

	    _createClass(H264Parser, [{
	      key: "parseSPS",
	      value: function parseSPS(sps) {
	        var config = H264Parser.readSPS(new Uint8Array(sps));
	        this.track.width = config.width;
	        this.track.height = config.height;
	        this.track.sps = [new Uint8Array(sps)];
	        this.track.codec = 'avc1.';
	        var codecarray = new DataView(sps.buffer, sps.byteOffset + 1, 4);

	        for (var i = 0; i < 3; ++i) {
	          var h = codecarray.getUint8(i).toString(16);

	          if (h.length < 2) {
	            h = '0' + h;
	          }

	          this.track.codec += h;
	        }
	      }
	    }, {
	      key: "parsePPS",
	      value: function parsePPS(pps) {
	        this.track.pps = [new Uint8Array(pps)];
	      }
	    }, {
	      key: "parseNAL",
	      value: function parseNAL(unit) {
	        if (!unit) return false;
	        var push = false;

	        switch (unit.type()) {
	          case NALU.IDR:
	          case NALU.NDR:
	            push = true;
	            break;

	          case NALU.PPS:
	            if (!this.track.pps) {
	              this.parsePPS(unit.getPayload());

	              if (!this.remuxer.readyToDecode && this.track.pps && this.track.sps) {
	                this.remuxer.readyToDecode = true;
	              }
	            }

	            push = true;
	            break;

	          case NALU.SPS:
	            if (!this.track.sps) {
	              this.parseSPS(unit.getPayload());

	              if (!this.remuxer.readyToDecode && this.track.pps && this.track.sps) {
	                this.remuxer.readyToDecode = true;
	              }
	            }

	            push = true;
	            break;

	          case NALU.AUD:
	            log('AUD - ignoing');
	            break;

	          case NALU.SEI:
	            log('SEI - ignoing');
	            break;
	        }

	        return push;
	      }
	    }]);

	    return H264Parser;
	  }();

	  var aacHeader;
	  var AACParser = /*#__PURE__*/function () {
	    _createClass(AACParser, null, [{
	      key: "getHeaderLength",
	      value: function getHeaderLength(data) {
	        return data[1] & 0x01 ? 7 : 9; // without CRC 7 and with CRC 9 Refs: https://wiki.multimedia.cx/index.php?title=ADTS
	      }
	    }, {
	      key: "getFrameLength",
	      value: function getFrameLength(data) {
	        return (data[3] & 0x03) << 11 | data[4] << 3 | (data[5] & 0xE0) >>> 5; // 13 bits length ref: https://wiki.multimedia.cx/index.php?title=ADTS
	      }
	    }, {
	      key: "isAACPattern",
	      value: function isAACPattern(data) {
	        return data[0] === 0xff && (data[1] & 0xf0) === 0xf0 && (data[1] & 0x06) === 0x00;
	      }
	    }, {
	      key: "extractAAC",
	      value: function extractAAC(buffer) {
	        var i = 0,
	            length = buffer.byteLength,
	            result = [],
	            headerLength,
	            frameLength;

	        if (!AACParser.isAACPattern(buffer)) {
	          error('Invalid ADTS audio format');
	          return result;
	        }

	        headerLength = AACParser.getHeaderLength(buffer);

	        if (!aacHeader) {
	          aacHeader = buffer.subarray(0, headerLength);
	        }

	        while (i < length) {
	          frameLength = AACParser.getFrameLength(buffer);
	          result.push(buffer.subarray(headerLength, frameLength));
	          buffer = buffer.slice(frameLength);
	          i += frameLength;
	        }

	        return result;
	      }
	    }, {
	      key: "samplingRateMap",
	      get: function get() {
	        return [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
	      }
	    }, {
	      key: "getAACHeaderData",
	      get: function get() {
	        return aacHeader;
	      }
	    }]);

	    function AACParser(remuxer) {
	      _classCallCheck(this, AACParser);

	      this.remuxer = remuxer;
	      this.track = remuxer.mp4track;
	    }

	    _createClass(AACParser, [{
	      key: "setAACConfig",
	      value: function setAACConfig() {
	        var objectType,
	            sampleIndex,
	            channelCount,
	            config = new Uint8Array(2),
	            headerData = AACParser.getAACHeaderData;
	        if (!headerData) return;
	        objectType = ((headerData[2] & 0xC0) >>> 6) + 1;
	        sampleIndex = (headerData[2] & 0x3C) >>> 2;
	        channelCount = (headerData[2] & 0x01) << 2;
	        channelCount |= (headerData[3] & 0xC0) >>> 6;
	        /* refer to http://wiki.multimedia.cx/index.php?title=MPEG-4_Audio#Audio_Specific_Config */

	        config[0] = objectType << 3;
	        config[0] |= (sampleIndex & 0x0E) >> 1;
	        config[1] |= (sampleIndex & 0x01) << 7;
	        config[1] |= channelCount << 3;
	        this.track.codec = 'mp4a.40.' + objectType;
	        this.track.channelCount = channelCount;
	        this.track.config = config;
	        this.remuxer.readyToDecode = true;
	      }
	    }]);

	    return AACParser;
	  }();

	  var Event = /*#__PURE__*/function () {
	    function Event(type) {
	      _classCallCheck(this, Event);

	      this.listener = {};
	      this.type = type | '';
	    }

	    _createClass(Event, [{
	      key: "on",
	      value: function on(event, fn) {
	        if (!this.listener[event]) {
	          this.listener[event] = [];
	        }

	        this.listener[event].push(fn);
	        return true;
	      }
	    }, {
	      key: "off",
	      value: function off(event, fn) {
	        if (this.listener[event]) {
	          var index = this.listener[event].indexOf(fn);

	          if (index > -1) {
	            this.listener[event].splice(index, 1);
	          }

	          return true;
	        }

	        return false;
	      }
	    }, {
	      key: "offAll",
	      value: function offAll() {
	        this.listener = {};
	      }
	    }, {
	      key: "dispatch",
	      value: function dispatch(event, data) {
	        if (this.listener[event]) {
	          this.listener[event].map(function (each) {
	            each.apply(null, [data]);
	          });
	          return true;
	        }

	        return false;
	      }
	    }]);

	    return Event;
	  }();

	  /**
	   * Generate MP4 Box
	   * taken from: https://github.com/dailymotion/hls.js
	   */
	  var MP4 = /*#__PURE__*/function () {
	    function MP4() {
	      _classCallCheck(this, MP4);
	    }

	    _createClass(MP4, null, [{
	      key: "init",
	      value: function init() {
	        MP4.types = {
	          avc1: [],
	          // codingname
	          avcC: [],
	          btrt: [],
	          dinf: [],
	          dref: [],
	          esds: [],
	          ftyp: [],
	          hdlr: [],
	          mdat: [],
	          mdhd: [],
	          mdia: [],
	          mfhd: [],
	          minf: [],
	          moof: [],
	          moov: [],
	          mp4a: [],
	          mvex: [],
	          mvhd: [],
	          sdtp: [],
	          stbl: [],
	          stco: [],
	          stsc: [],
	          stsd: [],
	          stsz: [],
	          stts: [],
	          tfdt: [],
	          tfhd: [],
	          traf: [],
	          trak: [],
	          trun: [],
	          trex: [],
	          tkhd: [],
	          vmhd: [],
	          smhd: []
	        };
	        var i;

	        for (i in MP4.types) {
	          if (MP4.types.hasOwnProperty(i)) {
	            MP4.types[i] = [i.charCodeAt(0), i.charCodeAt(1), i.charCodeAt(2), i.charCodeAt(3)];
	          }
	        }

	        var videoHdlr = new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x00, // pre_defined
	        0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x56, 0x69, 0x64, 0x65, 0x6f, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
	        ]);
	        var audioHdlr = new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x00, // pre_defined
	        0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
	        ]);
	        MP4.HDLR_TYPES = {
	          video: videoHdlr,
	          audio: audioHdlr
	        };
	        var dref = new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x01, // entry_count
	        0x00, 0x00, 0x00, 0x0c, // entry_size
	        0x75, 0x72, 0x6c, 0x20, // 'url' type
	        0x00, // version 0
	        0x00, 0x00, 0x01 // entry_flags
	        ]);
	        var stco = new Uint8Array([0x00, // version
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x00 // entry_count
	        ]);
	        MP4.STTS = MP4.STSC = MP4.STCO = stco;
	        MP4.STSZ = new Uint8Array([0x00, // version
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x00, // sample_size
	        0x00, 0x00, 0x00, 0x00 // sample_count
	        ]);
	        MP4.VMHD = new Uint8Array([0x00, // version
	        0x00, 0x00, 0x01, // flags
	        0x00, 0x00, // graphicsmode
	        0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // opcolor
	        ]);
	        MP4.SMHD = new Uint8Array([0x00, // version
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, // balance
	        0x00, 0x00 // reserved
	        ]);
	        MP4.STSD = new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x01]); // entry_count

	        var majorBrand = new Uint8Array([105, 115, 111, 109]); // isom

	        var avc1Brand = new Uint8Array([97, 118, 99, 49]); // avc1

	        var minorVersion = new Uint8Array([0, 0, 0, 1]);
	        MP4.FTYP = MP4.box(MP4.types.ftyp, majorBrand, minorVersion, majorBrand, avc1Brand);
	        MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, dref));
	      }
	    }, {
	      key: "box",
	      value: function box(type) {
	        for (var _len = arguments.length, payload = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	          payload[_key - 1] = arguments[_key];
	        }

	        var size = 8,
	            i = payload.length,
	            len = i,
	            result; // calculate the total size we need to allocate

	        while (i--) {
	          size += payload[i].byteLength;
	        }

	        result = new Uint8Array(size);
	        result[0] = size >> 24 & 0xff;
	        result[1] = size >> 16 & 0xff;
	        result[2] = size >> 8 & 0xff;
	        result[3] = size & 0xff;
	        result.set(type, 4); // copy the payload into the result

	        for (i = 0, size = 8; i < len; ++i) {
	          // copy payload[i] array @ offset size
	          result.set(payload[i], size);
	          size += payload[i].byteLength;
	        }

	        return result;
	      }
	    }, {
	      key: "hdlr",
	      value: function hdlr(type) {
	        return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
	      }
	    }, {
	      key: "mdat",
	      value: function mdat(data) {
	        return MP4.box(MP4.types.mdat, data);
	      }
	    }, {
	      key: "mdhd",
	      value: function mdhd(timescale, duration) {
	        return MP4.box(MP4.types.mdhd, new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x02, // creation_time
	        0x00, 0x00, 0x00, 0x03, // modification_time
	        timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
	        duration >> 24, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
	        0x55, 0xc4, // 'und' language (undetermined)
	        0x00, 0x00]));
	      }
	    }, {
	      key: "mdia",
	      value: function mdia(track) {
	        return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale, track.duration), MP4.hdlr(track.type), MP4.minf(track));
	      }
	    }, {
	      key: "mfhd",
	      value: function mfhd(sequenceNumber) {
	        return MP4.box(MP4.types.mfhd, new Uint8Array([0x00, 0x00, 0x00, 0x00, // flags
	        sequenceNumber >> 24, sequenceNumber >> 16 & 0xFF, sequenceNumber >> 8 & 0xFF, sequenceNumber & 0xFF // sequence_number
	        ]));
	      }
	    }, {
	      key: "minf",
	      value: function minf(track) {
	        if (track.type === 'audio') {
	          return MP4.box(MP4.types.minf, MP4.box(MP4.types.smhd, MP4.SMHD), MP4.DINF, MP4.stbl(track));
	        } else {
	          return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.VMHD), MP4.DINF, MP4.stbl(track));
	        }
	      }
	    }, {
	      key: "moof",
	      value: function moof(sn, baseMediaDecodeTime, track) {
	        return MP4.box(MP4.types.moof, MP4.mfhd(sn), MP4.traf(track, baseMediaDecodeTime));
	      }
	      /**
	       * @param tracks... (optional) {array} the tracks associated with this movie
	       */

	    }, {
	      key: "moov",
	      value: function moov(tracks, duration, timescale) {
	        var i = tracks.length,
	            boxes = [];

	        while (i--) {
	          boxes[i] = MP4.trak(tracks[i]);
	        }

	        return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(timescale, duration)].concat(boxes).concat(MP4.mvex(tracks)));
	      }
	    }, {
	      key: "mvex",
	      value: function mvex(tracks) {
	        var i = tracks.length,
	            boxes = [];

	        while (i--) {
	          boxes[i] = MP4.trex(tracks[i]);
	        }

	        return MP4.box.apply(null, [MP4.types.mvex].concat(boxes));
	      }
	    }, {
	      key: "mvhd",
	      value: function mvhd(timescale, duration) {
	        var bytes = new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        0x00, 0x00, 0x00, 0x01, // creation_time
	        0x00, 0x00, 0x00, 0x02, // modification_time
	        timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
	        duration >> 24 & 0xFF, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
	        0x00, 0x01, 0x00, 0x00, // 1.0 rate
	        0x01, 0x00, // 1.0 volume
	        0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
	        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
	        0xff, 0xff, 0xff, 0xff // next_track_ID
	        ]);
	        return MP4.box(MP4.types.mvhd, bytes);
	      }
	    }, {
	      key: "sdtp",
	      value: function sdtp(track) {
	        var samples = track.samples || [],
	            bytes = new Uint8Array(4 + samples.length),
	            flags,
	            i; // leave the full box header (4 bytes) all zero
	        // write the sample table

	        for (i = 0; i < samples.length; i++) {
	          flags = samples[i].flags;
	          bytes[i + 4] = flags.dependsOn << 4 | flags.isDependedOn << 2 | flags.hasRedundancy;
	        }

	        return MP4.box(MP4.types.sdtp, bytes);
	      }
	    }, {
	      key: "stbl",
	      value: function stbl(track) {
	        return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.box(MP4.types.stts, MP4.STTS), MP4.box(MP4.types.stsc, MP4.STSC), MP4.box(MP4.types.stsz, MP4.STSZ), MP4.box(MP4.types.stco, MP4.STCO));
	      }
	    }, {
	      key: "avc1",
	      value: function avc1(track) {
	        var sps = [],
	            pps = [],
	            i,
	            data,
	            len; // assemble the SPSs

	        for (i = 0; i < track.sps.length; i++) {
	          data = track.sps[i];
	          len = data.byteLength;
	          sps.push(len >>> 8 & 0xFF);
	          sps.push(len & 0xFF);
	          sps = sps.concat(Array.prototype.slice.call(data)); // SPS
	        } // assemble the PPSs


	        for (i = 0; i < track.pps.length; i++) {
	          data = track.pps[i];
	          len = data.byteLength;
	          pps.push(len >>> 8 & 0xFF);
	          pps.push(len & 0xFF);
	          pps = pps.concat(Array.prototype.slice.call(data));
	        }

	        var avcc = MP4.box(MP4.types.avcC, new Uint8Array([0x01, // version
	        sps[3], // profile
	        sps[4], // profile compat
	        sps[5], // level
	        0xfc | 3, // lengthSizeMinusOne, hard-coded to 4 bytes
	        0xE0 | track.sps.length // 3bit reserved (111) + numOfSequenceParameterSets
	        ].concat(sps).concat([track.pps.length // numOfPictureParameterSets
	        ]).concat(pps))),
	            // "PPS"
	        width = track.width,
	            height = track.height; // console.log('avcc:' + Hex.hexDump(avcc));

	        return MP4.box(MP4.types.avc1, new Uint8Array([0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, // reserved
	        0x00, 0x01, // data_reference_index
	        0x00, 0x00, // pre_defined
	        0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
	        width >> 8 & 0xFF, width & 0xff, // width
	        height >> 8 & 0xFF, height & 0xff, // height
	        0x00, 0x48, 0x00, 0x00, // horizresolution
	        0x00, 0x48, 0x00, 0x00, // vertresolution
	        0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x01, // frame_count
	        0x12, 0x62, 0x69, 0x6E, 0x65, // binelpro.ru
	        0x6C, 0x70, 0x72, 0x6F, 0x2E, 0x72, 0x75, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // compressorname
	        0x00, 0x18, // depth = 24
	        0x11, 0x11]), // pre_defined = -1
	        avcc, MP4.box(MP4.types.btrt, new Uint8Array([0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
	        0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
	        0x00, 0x2d, 0xc6, 0xc0])) // avgBitrate
	        );
	      }
	    }, {
	      key: "esds",
	      value: function esds(track) {
	        var configlen = track.config.byteLength;
	        var data = new Uint8Array(26 + configlen + 3);
	        data.set([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        0x03, // descriptor_type
	        0x17 + configlen, // length
	        0x00, 0x01, // es_id
	        0x00, // stream_priority
	        0x04, // descriptor_type
	        0x0f + configlen, // length
	        0x40, // codec : mpeg4_audio
	        0x15, // stream_type
	        0x00, 0x00, 0x00, // buffer_size
	        0x00, 0x00, 0x00, 0x00, // maxBitrate
	        0x00, 0x00, 0x00, 0x00, // avgBitrate
	        0x05, // descriptor_type
	        configlen]);
	        data.set(track.config, 26);
	        data.set([0x06, 0x01, 0x02], 26 + configlen); // return new Uint8Array([
	        //     0x00, // version 0
	        //     0x00, 0x00, 0x00, // flags
	        //
	        //     0x03, // descriptor_type
	        //     0x17+configlen, // length
	        //     0x00, 0x01, //es_id
	        //     0x00, // stream_priority
	        //
	        //     0x04, // descriptor_type
	        //     0x0f+configlen, // length
	        //     0x40, //codec : mpeg4_audio
	        //     0x15, // stream_type
	        //     0x00, 0x00, 0x00, // buffer_size
	        //     0x00, 0x00, 0x00, 0x00, // maxBitrate
	        //     0x00, 0x00, 0x00, 0x00, // avgBitrate
	        //
	        //     0x05 // descriptor_type
	        // ].concat([configlen]).concat(track.config).concat([0x06, 0x01, 0x02])); // GASpecificConfig)); // length + audio config descriptor

	        return data;
	      }
	    }, {
	      key: "mp4a",
	      value: function mp4a(track) {
	        var audiosamplerate = track.audiosamplerate;
	        return MP4.box(MP4.types.mp4a, new Uint8Array([0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, 0x00, // reserved
	        0x00, 0x01, // data_reference_index
	        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, track.channelCount, // channelcount
	        0x00, 0x10, // sampleSize:16bits
	        0x00, 0x00, // pre_defined
	        0x00, 0x00, // reserved2
	        audiosamplerate >> 8 & 0xFF, audiosamplerate & 0xff, //
	        0x00, 0x00]), MP4.box(MP4.types.esds, MP4.esds(track)));
	      }
	    }, {
	      key: "stsd",
	      value: function stsd(track) {
	        if (track.type === 'audio') {
	          return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp4a(track));
	        } else {
	          return MP4.box(MP4.types.stsd, MP4.STSD, MP4.avc1(track));
	        }
	      }
	    }, {
	      key: "tkhd",
	      value: function tkhd(track) {
	        var id = track.id,
	            duration = track.duration,
	            width = track.width,
	            height = track.height,
	            volume = track.volume;
	        return MP4.box(MP4.types.tkhd, new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x07, // flags
	        0x00, 0x00, 0x00, 0x00, // creation_time
	        0x00, 0x00, 0x00, 0x00, // modification_time
	        id >> 24 & 0xFF, id >> 16 & 0xFF, id >> 8 & 0xFF, id & 0xFF, // track_ID
	        0x00, 0x00, 0x00, 0x00, // reserved
	        duration >> 24, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
	        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
	        0x00, 0x00, // layer
	        0x00, 0x00, // alternate_group
	        volume >> 0 & 0xff, volume % 1 * 10 >> 0 & 0xff, // track volume // FIXME
	        0x00, 0x00, // reserved
	        0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
	        width >> 8 & 0xFF, width & 0xFF, 0x00, 0x00, // width
	        height >> 8 & 0xFF, height & 0xFF, 0x00, 0x00 // height
	        ]));
	      }
	    }, {
	      key: "traf",
	      value: function traf(track, baseMediaDecodeTime) {
	        var sampleDependencyTable = MP4.sdtp(track),
	            id = track.id;
	        return MP4.box(MP4.types.traf, MP4.box(MP4.types.tfhd, new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF // track_ID
	        ])), MP4.box(MP4.types.tfdt, new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        baseMediaDecodeTime >> 24, baseMediaDecodeTime >> 16 & 0XFF, baseMediaDecodeTime >> 8 & 0XFF, baseMediaDecodeTime & 0xFF // baseMediaDecodeTime
	        ])), MP4.trun(track, sampleDependencyTable.length + 16 + // tfhd
	        16 + // tfdt
	        8 + // traf header
	        16 + // mfhd
	        8 + // moof header
	        8), // mdat header
	        sampleDependencyTable);
	      }
	      /**
	       * Generate a track box.
	       * @param track {object} a track definition
	       * @return {Uint8Array} the track box
	       */

	    }, {
	      key: "trak",
	      value: function trak(track) {
	        track.duration = track.duration || 0xffffffff;
	        return MP4.box(MP4.types.trak, MP4.tkhd(track), MP4.mdia(track));
	      }
	    }, {
	      key: "trex",
	      value: function trex(track) {
	        var id = track.id;
	        return MP4.box(MP4.types.trex, new Uint8Array([0x00, // version 0
	        0x00, 0x00, 0x00, // flags
	        id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF, // track_ID
	        0x00, 0x00, 0x00, 0x01, // default_sample_description_index
	        0x00, 0x00, 0x00, 0x00, // default_sample_duration
	        0x00, 0x00, 0x00, 0x00, // default_sample_size
	        0x00, 0x01, 0x00, 0x01 // default_sample_flags
	        ]));
	      }
	    }, {
	      key: "trun",
	      value: function trun(track, offset) {
	        var samples = track.samples || [],
	            len = samples.length,
	            arraylen = 12 + 16 * len,
	            array = new Uint8Array(arraylen),
	            i,
	            sample,
	            duration,
	            size,
	            flags,
	            cts;
	        offset += 8 + arraylen;
	        array.set([0x00, // version 0
	        0x00, 0x0f, 0x01, // flags
	        len >>> 24 & 0xFF, len >>> 16 & 0xFF, len >>> 8 & 0xFF, len & 0xFF, // sample_count
	        offset >>> 24 & 0xFF, offset >>> 16 & 0xFF, offset >>> 8 & 0xFF, offset & 0xFF // data_offset
	        ], 0);

	        for (i = 0; i < len; i++) {
	          sample = samples[i];
	          duration = sample.duration;
	          size = sample.size;
	          flags = sample.flags;
	          cts = sample.cts;
	          array.set([duration >>> 24 & 0xFF, duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF, // sample_duration
	          size >>> 24 & 0xFF, size >>> 16 & 0xFF, size >>> 8 & 0xFF, size & 0xFF, // sample_size
	          flags.isLeading << 2 | flags.dependsOn, flags.isDependedOn << 6 | flags.hasRedundancy << 4 | flags.paddingValue << 1 | flags.isNonSync, flags.degradPrio & 0xF0 << 8, flags.degradPrio & 0x0F, // sample_flags
	          cts >>> 24 & 0xFF, cts >>> 16 & 0xFF, cts >>> 8 & 0xFF, cts & 0xFF // sample_composition_time_offset
	          ], 12 + 16 * i);
	        }

	        return MP4.box(MP4.types.trun, array);
	      }
	    }, {
	      key: "initSegment",
	      value: function initSegment(tracks, duration, timescale) {
	        if (!MP4.types) {
	          MP4.init();
	        }

	        var movie = MP4.moov(tracks, duration, timescale),
	            result;
	        result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
	        result.set(MP4.FTYP);
	        result.set(movie, MP4.FTYP.byteLength);
	        return result;
	      }
	    }]);

	    return MP4;
	  }();

	  var track_id = 1;
	  var BaseRemuxer = /*#__PURE__*/function () {
	    _createClass(BaseRemuxer, null, [{
	      key: "getTrackID",
	      value: function getTrackID() {
	        return track_id++;
	      }
	    }]);

	    function BaseRemuxer() {
	      _classCallCheck(this, BaseRemuxer);

	      this.seq = 1;
	    }

	    _createClass(BaseRemuxer, [{
	      key: "flush",
	      value: function flush() {
	        this.seq++;
	        this.mp4track.len = 0;
	        this.mp4track.samples = [];
	      }
	    }, {
	      key: "isReady",
	      value: function isReady() {
	        if (!this.readyToDecode || !this.samples.length) return null;
	        return true;
	      }
	    }]);

	    return BaseRemuxer;
	  }();

	  var AACRemuxer = /*#__PURE__*/function (_BaseRemuxer) {
	    _inherits(AACRemuxer, _BaseRemuxer);

	    var _super = _createSuper(AACRemuxer);

	    function AACRemuxer() {
	      var _this;

	      _classCallCheck(this, AACRemuxer);

	      _this = _super.call(this);
	      _this.readyToDecode = false;
	      _this.nextDts = 0;
	      _this.dts = 0;
	      _this.timescale = 1000;
	      _this.mp4track = {
	        id: BaseRemuxer.getTrackID(),
	        type: 'audio',
	        channelCount: 0,
	        len: 0,
	        fragmented: true,
	        timescale: _this.timescale,
	        duration: _this.timescale,
	        samples: [],
	        config: '',
	        codec: ''
	      };
	      _this.samples = [];
	      _this.aac = new AACParser(_assertThisInitialized(_this));
	      return _this;
	    }

	    _createClass(AACRemuxer, [{
	      key: "resetTrack",
	      value: function resetTrack() {
	        this.readyToDecode = false;
	        this.mp4track.codec = '';
	        this.mp4track.channelCount = '';
	        this.mp4track.config = '';
	        this.mp4track.timescale = this.timescale;
	      }
	    }, {
	      key: "remux",
	      value: function remux(frames) {
	        if (frames.length > 0) {
	          for (var i = 0; i < frames.length; i++) {
	            var frame = frames[i];
	            var payload = frame.units;
	            var size = payload.byteLength;
	            this.samples.push({
	              units: payload,
	              size: size,
	              duration: frame.duration
	            });
	            this.mp4track.len += size;

	            if (!this.readyToDecode) {
	              this.aac.setAACConfig();
	            }
	          }
	        }
	      }
	    }, {
	      key: "getPayload",
	      value: function getPayload() {
	        if (!this.isReady()) {
	          return null;
	        }

	        var payload = new Uint8Array(this.mp4track.len);
	        var offset = 0;
	        var samples = this.mp4track.samples;
	        var mp4Sample, duration;
	        this.dts = this.nextDts;

	        while (this.samples.length) {
	          var sample = this.samples.shift();
	              sample.units;
	          duration = sample.duration;

	          if (duration <= 0) {
	            log("remuxer: invalid sample duration at DTS: ".concat(this.nextDts, " :").concat(duration));
	            this.mp4track.len -= sample.size;
	            continue;
	          }

	          this.nextDts += duration;
	          mp4Sample = {
	            size: sample.size,
	            duration: duration,
	            cts: 0,
	            flags: {
	              isLeading: 0,
	              isDependedOn: 0,
	              hasRedundancy: 0,
	              degradPrio: 0,
	              dependsOn: 1
	            }
	          };
	          payload.set(sample.units, offset);
	          offset += sample.size;
	          samples.push(mp4Sample);
	        }

	        if (!samples.length) return null;
	        return new Uint8Array(payload.buffer, 0, this.mp4track.len);
	      }
	    }]);

	    return AACRemuxer;
	  }(BaseRemuxer);

	  var H264Remuxer = /*#__PURE__*/function (_BaseRemuxer) {
	    _inherits(H264Remuxer, _BaseRemuxer);

	    var _super = _createSuper(H264Remuxer);

	    function H264Remuxer() {
	      var _this;

	      _classCallCheck(this, H264Remuxer);

	      _this = _super.call(this);
	      _this.readyToDecode = false;
	      _this.nextDts = 0;
	      _this.dts = 0;
	      _this.timescale = 1000;
	      _this.mp4track = {
	        id: BaseRemuxer.getTrackID(),
	        type: 'video',
	        len: 0,
	        fragmented: true,
	        sps: '',
	        pps: '',
	        width: 0,
	        height: 0,
	        timescale: _this.timescale,
	        duration: _this.timescale,
	        samples: []
	      };
	      _this.samples = [];
	      _this.h264 = new H264Parser(_assertThisInitialized(_this));
	      return _this;
	    }

	    _createClass(H264Remuxer, [{
	      key: "resetTrack",
	      value: function resetTrack() {
	        this.readyToDecode = false;
	        this.mp4track.sps = '';
	        this.mp4track.pps = '';
	      }
	    }, {
	      key: "remux",
	      value: function remux(frames) {
	        var _iterator = _createForOfIteratorHelper(frames),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var frame = _step.value;
	            var units = [];
	            var size = 0;

	            var _iterator2 = _createForOfIteratorHelper(frame.units),
	                _step2;

	            try {
	              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	                var unit = _step2.value;

	                if (this.h264.parseNAL(unit)) {
	                  units.push(unit);
	                  size += unit.getSize();
	                }
	              }
	            } catch (err) {
	              _iterator2.e(err);
	            } finally {
	              _iterator2.f();
	            }

	            if (units.length > 0 && this.readyToDecode) {
	              this.mp4track.len += size;
	              this.samples.push({
	                units: units,
	                size: size,
	                keyFrame: frame.keyFrame,
	                duration: frame.duration
	              });
	            }
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }
	      }
	    }, {
	      key: "getPayload",
	      value: function getPayload() {
	        if (!this.isReady()) {
	          return null;
	        }

	        var payload = new Uint8Array(this.mp4track.len);
	        var offset = 0;
	        var samples = this.mp4track.samples;
	        var mp4Sample, duration;
	        this.dts = this.nextDts;

	        while (this.samples.length) {
	          var sample = this.samples.shift(),
	              units = sample.units;
	          duration = sample.duration;

	          if (duration <= 0) {
	            log("remuxer: invalid sample duration at DTS: ".concat(this.nextDts, " :").concat(duration));
	            this.mp4track.len -= sample.size;
	            continue;
	          }

	          this.nextDts += duration;
	          mp4Sample = {
	            size: sample.size,
	            duration: duration,
	            cts: 0,
	            flags: {
	              isLeading: 0,
	              isDependedOn: 0,
	              hasRedundancy: 0,
	              degradPrio: 0,
	              isNonSync: sample.keyFrame ? 0 : 1,
	              dependsOn: sample.keyFrame ? 2 : 1
	            }
	          };

	          var _iterator3 = _createForOfIteratorHelper(units),
	              _step3;

	          try {
	            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	              var unit = _step3.value;
	              payload.set(unit.getData(), offset);
	              offset += unit.getSize();
	            }
	          } catch (err) {
	            _iterator3.e(err);
	          } finally {
	            _iterator3.f();
	          }

	          samples.push(mp4Sample);
	        }

	        if (!samples.length) return null;
	        return new Uint8Array(payload.buffer, 0, this.mp4track.len);
	      }
	    }]);

	    return H264Remuxer;
	  }(BaseRemuxer);

	  function appendByteArray(buffer1, buffer2) {
	    var tmp = new Uint8Array((buffer1.byteLength | 0) + (buffer2.byteLength | 0));
	    tmp.set(buffer1, 0);
	    tmp.set(buffer2, buffer1.byteLength | 0);
	    return tmp;
	  }
	  function secToTime(sec) {
	    var seconds,
	        hours,
	        minutes,
	        result = '';
	    seconds = Math.floor(sec);
	    hours = parseInt(seconds / 3600, 10) % 24;
	    minutes = parseInt(seconds / 60, 10) % 60;
	    seconds = seconds < 0 ? 0 : seconds % 60;

	    if (hours > 0) {
	      result += (hours < 10 ? '0' + hours : hours) + ':';
	    }

	    result += (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
	    return result;
	  }

	  var RemuxController = /*#__PURE__*/function (_Event) {
	    _inherits(RemuxController, _Event);

	    var _super = _createSuper(RemuxController);

	    function RemuxController(streaming) {
	      var _this;

	      _classCallCheck(this, RemuxController);

	      _this = _super.call(this, 'remuxer');
	      _this.initialized = false;
	      _this.trackTypes = [];
	      _this.tracks = {};
	      _this.mediaDuration = streaming ? Infinity : 1000;
	      return _this;
	    }

	    _createClass(RemuxController, [{
	      key: "addTrack",
	      value: function addTrack(type) {
	        if (type === 'video' || type === 'both') {
	          this.tracks.video = new H264Remuxer();
	          this.trackTypes.push('video');
	        }

	        if (type === 'audio' || type === 'both') {
	          this.tracks.audio = new AACRemuxer();
	          this.trackTypes.push('audio');
	        }
	      }
	    }, {
	      key: "reset",
	      value: function reset() {
	        var _iterator = _createForOfIteratorHelper(this.trackTypes),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var type = _step.value;
	            this.tracks[type].resetTrack();
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }

	        this.initialized = false;
	      }
	    }, {
	      key: "destroy",
	      value: function destroy() {
	        this.tracks = {};
	        this.offAll();
	      }
	    }, {
	      key: "flush",
	      value: function flush() {
	        if (!this.initialized) {
	          if (this.isReady()) {
	            this.dispatch('ready');

	            var _iterator2 = _createForOfIteratorHelper(this.trackTypes),
	                _step2;

	            try {
	              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	                var type = _step2.value;
	                var track = this.tracks[type];
	                var data = {
	                  type: type,
	                  payload: MP4.initSegment([track.mp4track], this.mediaDuration, track.mp4track.timescale)
	                };
	                this.dispatch('buffer', data);
	              }
	            } catch (err) {
	              _iterator2.e(err);
	            } finally {
	              _iterator2.f();
	            }

	            log('Initial segment generated.');
	            this.initialized = true;
	            this.flush();
	          }
	        } else {
	          var _iterator3 = _createForOfIteratorHelper(this.trackTypes),
	              _step3;

	          try {
	            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	              var _type = _step3.value;
	              var _track = this.tracks[_type];

	              var pay = _track.getPayload();

	              if (pay && pay.byteLength) {
	                var moof = MP4.moof(_track.seq, _track.dts, _track.mp4track);
	                var mdat = MP4.mdat(pay);
	                var payload = appendByteArray(moof, mdat);
	                var _data = {
	                  type: _type,
	                  payload: payload,
	                  dts: _track.dts
	                };
	                this.dispatch('buffer', _data);
	                var duration = secToTime(_track.dts / 1000);
	                log("put segment (".concat(_type, "): ").concat(_track.seq, " dts: ").concat(_track.dts, " frames: ").concat(_track.mp4track.samples.length, " second: ").concat(duration));

	                _track.flush();
	              }
	            }
	          } catch (err) {
	            _iterator3.e(err);
	          } finally {
	            _iterator3.f();
	          }
	        }
	      }
	    }, {
	      key: "isReady",
	      value: function isReady() {
	        var _iterator4 = _createForOfIteratorHelper(this.trackTypes),
	            _step4;

	        try {
	          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
	            var type = _step4.value;
	            if (!this.tracks[type].readyToDecode || !this.tracks[type].samples.length) return false;
	          }
	        } catch (err) {
	          _iterator4.e(err);
	        } finally {
	          _iterator4.f();
	        }

	        return true;
	      }
	    }, {
	      key: "remux",
	      value: function remux(data) {
	        var _iterator5 = _createForOfIteratorHelper(this.trackTypes),
	            _step5;

	        try {
	          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
	            var type = _step5.value;
	            var frames = data[type];
	            if (type === 'audio' && this.tracks.video && !this.tracks.video.readyToDecode) continue;
	            /* if video is present, don't add audio until video get ready */

	            if (frames.length > 0) {
	              this.tracks[type].remux(frames);
	            }
	          }
	        } catch (err) {
	          _iterator5.e(err);
	        } finally {
	          _iterator5.f();
	        }

	        this.flush();
	      }
	    }]);

	    return RemuxController;
	  }(Event);

	  var BufferController = /*#__PURE__*/function (_Event) {
	    _inherits(BufferController, _Event);

	    var _super = _createSuper(BufferController);

	    function BufferController(sourceBuffer, type) {
	      var _this;

	      _classCallCheck(this, BufferController);

	      _this = _super.call(this, 'buffer');
	      _this.type = type;
	      _this.queue = new Uint8Array();
	      _this.cleaning = false;
	      _this.pendingCleaning = 0;
	      _this.cleanOffset = 30;
	      _this.cleanRanges = [];
	      _this.sourceBuffer = sourceBuffer;

	      _this.sourceBuffer.addEventListener('updateend', function () {
	        if (_this.pendingCleaning > 0) {
	          _this.initCleanup(_this.pendingCleaning);

	          _this.pendingCleaning = 0;
	        }

	        _this.cleaning = false;

	        if (_this.cleanRanges.length) {
	          _this.doCleanup();

	          return;
	        }
	      });

	      _this.sourceBuffer.addEventListener('error', function () {
	        _this.dispatch('error', {
	          type: _this.type,
	          name: 'buffer',
	          error: 'buffer error'
	        });
	      });

	      return _this;
	    }

	    _createClass(BufferController, [{
	      key: "destroy",
	      value: function destroy() {
	        this.queue = null;
	        this.sourceBuffer = null;
	        this.offAll();
	      }
	    }, {
	      key: "doCleanup",
	      value: function doCleanup() {
	        if (!this.cleanRanges.length) {
	          this.cleaning = false;
	          return;
	        }

	        var range = this.cleanRanges.shift();
	        log("".concat(this.type, " remove range [").concat(range[0], " - ").concat(range[1], ")"));
	        this.cleaning = true;
	        this.sourceBuffer.remove(range[0], range[1]);
	      }
	    }, {
	      key: "initCleanup",
	      value: function initCleanup(cleanMaxLimit) {
	        if (this.sourceBuffer.updating) {
	          this.pendingCleaning = cleanMaxLimit;
	          return;
	        }

	        if (this.sourceBuffer.buffered && this.sourceBuffer.buffered.length && !this.cleaning) {
	          for (var i = 0; i < this.sourceBuffer.buffered.length; ++i) {
	            var start = this.sourceBuffer.buffered.start(i);
	            var end = this.sourceBuffer.buffered.end(i);

	            if (cleanMaxLimit - start > this.cleanOffset) {
	              end = cleanMaxLimit - this.cleanOffset;

	              if (start < end) {
	                this.cleanRanges.push([start, end]);
	              }
	            }
	          }

	          this.doCleanup();
	        }
	      }
	    }, {
	      key: "doAppend",
	      value: function doAppend() {
	        if (!this.queue.length) return;

	        if (this.sourceBuffer.updating) {
	          return;
	        }

	        try {
	          this.sourceBuffer.appendBuffer(this.queue);
	          this.queue = new Uint8Array();
	        } catch (e) {
	          if (e.name === 'QuotaExceededError') {
	            log("".concat(this.type, " buffer quota full"));
	            this.dispatch('error', {
	              type: this.type,
	              name: 'QuotaExceeded',
	              error: 'buffer error'
	            });
	            return;
	          }

	          error("Error occured while appending ".concat(this.type, " buffer -  ").concat(e.name, ": ").concat(e.message));
	          this.dispatch('error', {
	            type: this.type,
	            name: 'unexpectedError',
	            error: 'buffer error'
	          });
	        }
	      }
	    }, {
	      key: "feed",
	      value: function feed(data) {
	        this.queue = appendByteArray(this.queue, data);
	      }
	    }]);

	    return BufferController;
	  }(Event);

	  window.MediaSource = window.MediaSource || window.WebKitMediaSource;

	  var JMuxmer = /*#__PURE__*/function (_Event) {
	    _inherits(JMuxmer, _Event);

	    var _super = _createSuper(JMuxmer);

	    _createClass(JMuxmer, null, [{
	      key: "isSupported",
	      value: function isSupported(codec) {
	        return window.MediaSource && window.MediaSource.isTypeSupported(codec);
	      }
	    }]);

	    function JMuxmer(options) {
	      var _this;

	      _classCallCheck(this, JMuxmer);

	      _this = _super.call(this, 'jmuxer');
	      window.MediaSource = window.MediaSource || window.WebKitMediaSource;
	      var defaults = {
	        node: '',
	        mode: 'both',
	        // both, audio, video
	        flushingTime: 1500,
	        clearBuffer: true,
	        onReady: null,
	        // function called when MSE is ready to accept frames
	        fps: 30,
	        debug: false
	      };
	      _this.options = Object.assign({}, defaults, options);

	      if (_this.options.debug) {
	        setLogger();
	      }

	      if (typeof _this.options.node === 'string' && _this.options.node == '') {
	        error('no video element were found to render, provide a valid video element');
	      }

	      if (!_this.options.fps) {
	        _this.options.fps = 30;
	      }

	      _this.frameDuration = 1000 / _this.options.fps | 0; // todo remove

	      _this.node = typeof _this.options.node === 'string' ? document.getElementById(_this.options.node) : _this.options.node;
	      _this.sourceBuffers = {};
	      _this.isMSESupported = !!window.MediaSource;

	      if (!_this.isMSESupported) {
	        throw 'Oops! Browser does not support media source extension.';
	      }

	      _this.setupMSE();

	      _this.remuxController = new RemuxController(_this.options.clearBuffer);

	      _this.remuxController.addTrack(_this.options.mode);

	      _this.mseReady = false;
	      _this.lastCleaningTime = Date.now();
	      _this.kfPosition = [];
	      _this.kfCounter = 0;
	      /* events callback */

	      _this.remuxController.on('buffer', _this.onBuffer.bind(_assertThisInitialized(_this)));

	      _this.remuxController.on('ready', _this.createBuffer.bind(_assertThisInitialized(_this)));

	      _this.startInterval();

	      return _this;
	    }

	    _createClass(JMuxmer, [{
	      key: "setupMSE",
	      value: function setupMSE() {
	        this.mediaSource = new MediaSource();
	        this.node.src = URL.createObjectURL(this.mediaSource);
	        this.mediaSource.addEventListener('sourceopen', this.onMSEOpen.bind(this));
	        this.mediaSource.addEventListener('sourceclose', this.onMSEClose.bind(this));
	        this.mediaSource.addEventListener('webkitsourceopen', this.onMSEOpen.bind(this));
	        this.mediaSource.addEventListener('webkitsourceclose', this.onMSEClose.bind(this));
	      }
	    }, {
	      key: "feed",
	      value: function feed(data) {
	        var remux = false,
	            slices,
	            duration,
	            chunks = {
	          video: [],
	          audio: []
	        };
	        if (!data || !this.remuxController) return;
	        duration = data.duration ? parseInt(data.duration) : 0;

	        if (data.video) {
	          slices = H264Parser.extractNALu(data.video);

	          if (slices.length > 0) {
	            chunks.video = this.getVideoFrames(slices, duration);
	            remux = true;
	          }
	        }

	        if (data.audio) {
	          slices = AACParser.extractAAC(data.audio);

	          if (slices.length > 0) {
	            chunks.audio = this.getAudioFrames(slices, duration);
	            remux = true;
	          }
	        }

	        if (!remux) {
	          error('Input object must have video and/or audio property. Make sure it is a valid typed array');
	          return;
	        }

	        this.remuxController.remux(chunks);
	      }
	    }, {
	      key: "getVideoFrames",
	      value: function getVideoFrames(nalus, duration) {
	        var _this2 = this;

	        var units = [],
	            frames = [],
	            fd = 0,
	            tt = 0,
	            keyFrame = false,
	            vcl = false;

	        var _iterator = _createForOfIteratorHelper(nalus),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var nalu = _step.value;
	            var unit = new NALU(nalu);

	            if (unit.type() === NALU.IDR || unit.type() === NALU.NDR) {
	              H264Parser.parseHeader(unit);
	            }

	            if (units.length && vcl && (unit.isfmb || !unit.isvcl)) {
	              frames.push({
	                units: units,
	                keyFrame: keyFrame
	              });
	              units = [];
	              keyFrame = false;
	              vcl = false;
	            }

	            units.push(unit);
	            keyFrame = keyFrame || unit.isKeyframe();
	            vcl = vcl || unit.isvcl;
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }

	        if (units.length) {
	          if (vcl || !frames.length) {
	            frames.push({
	              units: units,
	              keyFrame: keyFrame
	            });
	          } else {
	            var last = frames.length - 1;
	            frames[last].units = frames[last].units.concat(units);
	          }
	        }

	        fd = duration ? duration / frames.length | 0 : this.frameDuration;
	        tt = duration ? duration - fd * frames.length : 0;
	        frames.map(function (frame) {
	          frame.duration = fd;

	          if (tt > 0) {
	            frame.duration++;
	            tt--;
	          }

	          _this2.kfCounter++;

	          if (frame.keyFrame && _this2.options.clearBuffer) {
	            _this2.kfPosition.push(_this2.kfCounter * fd / 1000);
	          }
	        });
	        log("jmuxer: No. of frames of the last chunk: ".concat(frames.length));
	        return frames;
	      }
	    }, {
	      key: "getAudioFrames",
	      value: function getAudioFrames(aacFrames, duration) {
	        var frames = [],
	            fd = 0,
	            tt = 0;

	        var _iterator2 = _createForOfIteratorHelper(aacFrames),
	            _step2;

	        try {
	          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	            var units = _step2.value;
	            frames.push({
	              units: units
	            });
	          }
	        } catch (err) {
	          _iterator2.e(err);
	        } finally {
	          _iterator2.f();
	        }

	        fd = duration ? duration / frames.length | 0 : this.frameDuration;
	        tt = duration ? duration - fd * frames.length : 0;
	        frames.map(function (frame) {
	          frame.duration = fd;

	          if (tt > 0) {
	            frame.duration++;
	            tt--;
	          }
	        });
	        return frames;
	      }
	    }, {
	      key: "destroy",
	      value: function destroy() {
	        this.stopInterval();

	        if (this.mediaSource) {
	          try {
	            if (this.bufferControllers) {
	              this.mediaSource.endOfStream();
	            }
	          } catch (e) {
	            error("mediasource is not available to end ".concat(e.message));
	          }

	          this.mediaSource = null;
	        }

	        if (this.remuxController) {
	          this.remuxController.destroy();
	          this.remuxController = null;
	        }

	        if (this.bufferControllers) {
	          for (var type in this.bufferControllers) {
	            this.bufferControllers[type].destroy();
	          }

	          this.bufferControllers = null;
	        }

	        this.node = false;
	        this.mseReady = false;
	        this.videoStarted = false;
	      }
	    }, {
	      key: "createBuffer",
	      value: function createBuffer() {
	        if (!this.mseReady || !this.remuxController || !this.remuxController.isReady() || this.bufferControllers) return;
	        this.bufferControllers = {};

	        for (var type in this.remuxController.tracks) {
	          var track = this.remuxController.tracks[type];

	          if (!JMuxmer.isSupported("".concat(type, "/mp4; codecs=\"").concat(track.mp4track.codec, "\""))) {
	            error('Browser does not support codec');
	            return false;
	          }

	          var sb = this.mediaSource.addSourceBuffer("".concat(type, "/mp4; codecs=\"").concat(track.mp4track.codec, "\""));
	          this.bufferControllers[type] = new BufferController(sb, type);
	          this.sourceBuffers[type] = sb;
	          this.bufferControllers[type].on('error', this.onBufferError.bind(this));
	        }
	      }
	    }, {
	      key: "startInterval",
	      value: function startInterval() {
	        var _this3 = this;

	        this.interval = setInterval(function () {
	          if (_this3.bufferControllers) {
	            _this3.releaseBuffer();

	            _this3.clearBuffer();
	          }
	        }, this.options.flushingTime);
	      }
	    }, {
	      key: "stopInterval",
	      value: function stopInterval() {
	        if (this.interval) {
	          clearInterval(this.interval);
	        }
	      }
	    }, {
	      key: "releaseBuffer",
	      value: function releaseBuffer() {
	        for (var type in this.bufferControllers) {
	          this.bufferControllers[type].doAppend();
	        }
	      }
	    }, {
	      key: "getSafeClearOffsetOfBuffer",
	      value: function getSafeClearOffsetOfBuffer(offset) {
	        var maxLimit = this.options.mode === 'audio' && offset || 0,
	            adjacentOffset;

	        for (var i = 0; i < this.kfPosition.length; i++) {
	          if (this.kfPosition[i] >= offset) {
	            break;
	          }

	          adjacentOffset = this.kfPosition[i];
	        }

	        if (adjacentOffset) {
	          this.kfPosition = this.kfPosition.filter(function (kfDelimiter) {
	            if (kfDelimiter < adjacentOffset) {
	              maxLimit = kfDelimiter;
	            }

	            return kfDelimiter >= adjacentOffset;
	          });
	        }

	        return maxLimit;
	      }
	    }, {
	      key: "clearBuffer",
	      value: function clearBuffer() {
	        if (this.options.clearBuffer && Date.now() - this.lastCleaningTime > 10000) {
	          for (var type in this.bufferControllers) {
	            var cleanMaxLimit = this.getSafeClearOffsetOfBuffer(this.node.currentTime);
	            this.bufferControllers[type].initCleanup(cleanMaxLimit);
	          }

	          this.lastCleaningTime = Date.now();
	        }
	      }
	    }, {
	      key: "onBuffer",
	      value: function onBuffer(data) {
	        if (this.bufferControllers && this.bufferControllers[data.type]) {
	          this.bufferControllers[data.type].feed(data.payload);
	        }
	      }
	      /* Events on MSE */

	    }, {
	      key: "onMSEOpen",
	      value: function onMSEOpen() {
	        this.mseReady = true;

	        if (typeof this.options.onReady === 'function') {
	          this.options.onReady();
	          this.options.onReady = null;
	        }

	        this.createBuffer();
	      }
	    }, {
	      key: "onMSEClose",
	      value: function onMSEClose() {
	        this.mseReady = false;
	        this.videoStarted = false;
	      }
	    }, {
	      key: "onBufferError",
	      value: function onBufferError(data) {
	        if (data.name == 'QuotaExceeded') {
	          this.bufferControllers[data.type].initCleanup(this.node.currentTime);
	          return;
	        }

	        if (this.mediaSource.sourceBuffers.length > 0 && this.sourceBuffers[data.type]) {
	          this.mediaSource.removeSourceBuffer(this.sourceBuffers[data.type]);
	        }

	        if (this.mediaSource.sourceBuffers.length == 0) {
	          try {
	            this.mediaSource.endOfStream();
	          } catch (e) {
	            error('mediasource is not available to end');
	          }
	        }
	      }
	    }]);

	    return JMuxmer;
	  }(Event);

	  return JMuxmer;

	}());

	function Texture(gl) {
	    this.gl = gl;
	    this.texture = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, this.texture);

	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		

	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	Texture.prototype.bind = function (n, program, name) {
	    var gl = this.gl;
	    gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2][n]);
	    gl.bindTexture(gl.TEXTURE_2D, this.texture);
	    gl.uniform1i(gl.getUniformLocation(program, name), n);
	};

	Texture.prototype.fill = function (width, height, data) {
	    var gl = this.gl;
	    gl.bindTexture(gl.TEXTURE_2D, this.texture);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
	};

	function WebGLPlayer(canvas, options) {
	    this.canvas = canvas;
	    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	    this.initGL(options);
	}

	WebGLPlayer.prototype.initGL = function (options) {
	    if (!this.gl) {
	        console.log("[ER] WebGL not supported.");
	        return;
	    }

	    var gl = this.gl;
	    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	    var program = gl.createProgram();
	    var vertexShaderSource = [
	        "attribute highp vec4 aVertexPosition;",
	        "attribute vec2 aTextureCoord;",
	        "varying highp vec2 vTextureCoord;",
	        "void main(void) {",
	        " gl_Position = aVertexPosition;",
	        " vTextureCoord = aTextureCoord;",
	        "}"
	    ].join("\n");
	    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	    gl.shaderSource(vertexShader, vertexShaderSource);
	    gl.compileShader(vertexShader);
	    var fragmentShaderSource = [
	        "precision highp float;",
	        "varying lowp vec2 vTextureCoord;",
	        "uniform sampler2D YTexture;",
	        "uniform sampler2D UTexture;",
	        "uniform sampler2D VTexture;",
	        "const mat4 YUV2RGB = mat4",
	        "(",
	        " 1.1643828125, 0, 1.59602734375, -.87078515625,",
	        " 1.1643828125, -.39176171875, -.81296875, .52959375,",
	        " 1.1643828125, 2.017234375, 0, -1.081390625,",
	        " 0, 0, 0, 1",
	        ");",
	        "void main(void) {",
	        " gl_FragColor = vec4( texture2D(YTexture, vTextureCoord).x, texture2D(UTexture, vTextureCoord).x, texture2D(VTexture, vTextureCoord).x, 1) * YUV2RGB;",
	        "}"
	    ].join("\n");

	    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	    gl.shaderSource(fragmentShader, fragmentShaderSource);
	    gl.compileShader(fragmentShader);
	    gl.attachShader(program, vertexShader);
	    gl.attachShader(program, fragmentShader);
	    gl.linkProgram(program);
	    gl.useProgram(program);
		
	    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	        console.log("[ER] Shader link failed.");
	    }
	    var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
	    gl.enableVertexAttribArray(vertexPositionAttribute);
	    var textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
	    gl.enableVertexAttribArray(textureCoordAttribute);

	    var verticesBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	    var texCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	    gl.y = new Texture(gl);
	    gl.u = new Texture(gl);
	    gl.v = new Texture(gl);
	    gl.y.bind(0, program, "YTexture");
	    gl.u.bind(1, program, "UTexture");
	    gl.v.bind(2, program, "VTexture");
	};

	WebGLPlayer.prototype.renderFrame = function (videoFrame, width, height, uOffset, vOffset) {
	    if (!this.gl) {
	        console.log("[ER] Render frame failed due to WebGL not supported.");
	        return;
	    }

	    var gl = this.gl;
	    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	    gl.clearColor(0.0, 0.0, 0.0, 0.0);
	    gl.clear(gl.COLOR_BUFFER_BIT);

	    gl.y.fill(width, height, videoFrame.subarray(0, uOffset));
	    gl.u.fill(width >> 1, height >> 1, videoFrame.subarray(uOffset, uOffset + vOffset));
	    gl.v.fill(width >> 1, height >> 1, videoFrame.subarray(uOffset + vOffset, videoFrame.length));

	    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};


	WebGLPlayer.prototype.clearScreen = function (videoFrame) {
	    if (!this.gl) {
	        console.log("[ER] Render frame failed due to WebGL not supported.");
	        return;
	    }

	    var gl = this.gl;
	    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	    gl.clearColor(0.0, 0.0, 0.0, 0.0);
	    gl.clear(gl.COLOR_BUFFER_BIT);
	    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};

	WebGLPlayer.prototype.fullscreen = function () {
	    var canvas = this.canvas;
	    if (canvas.RequestFullScreen) {
	        canvas.RequestFullScreen();
	    } else if (canvas.webkitRequestFullScreen) {
	        canvas.webkitRequestFullScreen();
	    } else if (canvas.mozRequestFullScreen) {
	        canvas.mozRequestFullScreen();
	    } else if (canvas.msRequestFullscreen) {
	        canvas.msRequestFullscreen();
	    } else {
	        alert("This browser doesn't supporter fullscreen");
	    }
	};

	WebGLPlayer.prototype.exitfullscreen = function (){
	    if (document.exitFullscreen) {
	        document.exitFullscreen();
	    } else if (document.webkitExitFullscreen) {
	        document.webkitExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	        document.mozCancelFullScreen();
	    } else if (document.msExitFullscreen) {
	        document.msExitFullscreen();
	    } else {
	        alert("Exit fullscreen doesn't work");
	    }
	};

	function PCMPlayer(option) {
	    this.init(option);
	}

	PCMPlayer.prototype.init = function (option) {
	    var defaults = {
	        channels: 2,
	        sampleRate: 44100,
	        flushTime: 22,
	        debug: false,
	    };
	    this.option = Object.assign({}, defaults, option);
	    this.samples = new Float32Array();
	    this.flush = this.flush.bind(this);
	    this.interval = setInterval(this.flush, this.option.flushingTime);
	    this.maxValue = this.getMaxValue();
	    this.typedArray = this.getTypedArray();
	    this.createContext();
	};

	PCMPlayer.prototype.getMaxValue = function () {
	    var encodings = {
	        '8bitInt': 128,
	        '16bitInt': 32768,
	        '32bitInt': 2147483648,
	        '32bitFloat': 1
	    };

	    return encodings[this.option.encoding] ? encodings[this.option.encoding] : encodings['16bitInt'];
	};

	PCMPlayer.prototype.getTypedArray = function () {
	    var typedArrays = {
	        '8bitInt': Int8Array,
	        '16bitInt': Int16Array,
	        '32bitInt': Int32Array,
	        '32bitFloat': Float32Array
	    };

	    return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays['16bitInt'];
	};

	PCMPlayer.prototype.createContext = function () {
	    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	    // console.log(this.audioCtx);
	    if (this.audioCtx.state === 'suspended' && 'ontouchstart' in window) {
	        var unlock = () => { this.audioCtx.resume(); };
	        document.body.addEventListener('touchstart', unlock, false);
	    }
	    this.gainNode = this.audioCtx.createGain();
	    this.gainNode.gain.value = 1;
	    this.gainNode.connect(this.audioCtx.destination);
	    this.startTime = this.audioCtx.currentTime;
	};

	PCMPlayer.prototype.isTypedArray = function (data) {
	    return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer);
	};

	PCMPlayer.prototype.feed = function (data) {
	    if (!this.isTypedArray(data)) return;
	    data = this.getFormatedValue(data);
	    var tmp = new Float32Array(this.samples.length + data.length);
	    tmp.set(this.samples, 0);
	    tmp.set(data, this.samples.length);
	    this.samples = tmp;
	};

	PCMPlayer.prototype.getFormatedValue = function (data) {
	    var data = new this.typedArray(data.buffer),
	        float32 = new Float32Array(data.length),
	        i;

	    for (i = 0; i < data.length; i++) {
	        float32[i] = data[i] / this.maxValue;
	    }
	    return float32;
	};

	PCMPlayer.prototype.volume = function (volume) {
	    this.gainNode.gain.value = volume;
	};

	PCMPlayer.prototype.destroy = function () {
	    if (this.interval) {
	        clearInterval(this.interval);
	    }
	    this.samples = null;
	    this.audioCtx.close();
	    this.audioCtx = null;
	};

	PCMPlayer.prototype.flush = function () {
	    if (!this.samples.length) return;
	    var bufferSource = this.audioCtx.createBufferSource(),
	        length = this.samples.length / this.option.channels,
	        audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate),
	        audioData,
	        channel,
	        offset,
	        i,
	        decrement;

	    for (channel = 0; channel < this.option.channels; channel++) {
	        audioData = audioBuffer.getChannelData(channel);
	        offset = channel;
	        decrement = 50;
	        for (i = 0; i < length; i++) {
	            audioData[i] = this.samples[offset];
	            /* fadein */
	            if (i < 50) {
	                audioData[i] = (audioData[i] * i) / 50;
	            }
	            /* fadeout*/
	            if (i >= (length - 51)) {
	                audioData[i] = (audioData[i] * decrement--) / 50;
	            }
	            offset += this.option.channels;
	        }
	    }

	    if (this.startTime < this.audioCtx.currentTime) {
	        this.startTime = this.audioCtx.currentTime;
	    }
	    bufferSource.buffer = audioBuffer;
	    bufferSource.connect(this.gainNode);
	    bufferSource.start(this.startTime);
	    this.startTime += audioBuffer.duration;
	    this.samples = new Float32Array();
	};

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var jquery = createCommonjsModule(function (module) {
	/*!
	 * jQuery JavaScript Library v3.6.0
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright OpenJS Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2021-03-02T17:08Z
	 */
	( function( global, factory ) {

		{

			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		}

	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : commonjsGlobal, function( window, noGlobal ) {

	var arr = [];

	var getProto = Object.getPrototypeOf;

	var slice = arr.slice;

	var flat = arr.flat ? function( array ) {
		return arr.flat.call( array );
	} : function( array ) {
		return arr.concat.apply( [], array );
	};


	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call( Object );

	var support = {};

	var isFunction = function isFunction( obj ) {

			// Support: Chrome <=57, Firefox <=52
			// In some browsers, typeof returns "function" for HTML <object> elements
			// (i.e., `typeof document.createElement( "object" ) === "function"`).
			// We don't want to classify *any* DOM node as a function.
			// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
			// Plus for old WebKit, typeof returns "function" for HTML collections
			// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
			return typeof obj === "function" && typeof obj.nodeType !== "number" &&
				typeof obj.item !== "function";
		};


	var isWindow = function isWindow( obj ) {
			return obj != null && obj === obj.window;
		};


	var document = window.document;



		var preservedScriptAttributes = {
			type: true,
			src: true,
			nonce: true,
			noModule: true
		};

		function DOMEval( code, node, doc ) {
			doc = doc || document;

			var i, val,
				script = doc.createElement( "script" );

			script.text = code;
			if ( node ) {
				for ( i in preservedScriptAttributes ) {

					// Support: Firefox 64+, Edge 18+
					// Some browsers don't support the "nonce" property on scripts.
					// On the other hand, just using `getAttribute` is not enough as
					// the `nonce` attribute is reset to an empty string whenever it
					// becomes browsing-context connected.
					// See https://github.com/whatwg/html/issues/2369
					// See https://html.spec.whatwg.org/#nonce-attributes
					// The `node.getAttribute` check was added for the sake of
					// `jQuery.globalEval` so that it can fake a nonce-containing node
					// via an object.
					val = node[ i ] || node.getAttribute && node.getAttribute( i );
					if ( val ) {
						script.setAttribute( i, val );
					}
				}
			}
			doc.head.appendChild( script ).parentNode.removeChild( script );
		}


	function toType( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module



	var
		version = "3.6.0",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {

			// Return all the elements in a clean array
			if ( num == null ) {
				return slice.call( this );
			}

			// Return just the one element from the set
			return num < 0 ? this[ num + this.length ] : this[ num ];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		even: function() {
			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
				return ( i + 1 ) % 2;
			} ) );
		},

		odd: function() {
			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
				return i % 2;
			} ) );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !isFunction( target ) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					copy = options[ name ];

					// Prevent Object.prototype pollution
					// Prevent never-ending loop
					if ( name === "__proto__" || target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = Array.isArray( copy ) ) ) ) {
						src = target[ name ];

						// Ensure proper type for the source value
						if ( copyIsArray && !Array.isArray( src ) ) {
							clone = [];
						} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
							clone = {};
						} else {
							clone = src;
						}
						copyIsArray = false;

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend( {

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isPlainObject: function( obj ) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}

			proto = getProto( obj );

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		},

		isEmptyObject: function( obj ) {
			var name;

			for ( name in obj ) {
				return false;
			}
			return true;
		},

		// Evaluates a script in a provided context; falls back to the global one
		// if not specified.
		globalEval: function( code, options, doc ) {
			DOMEval( code, { nonce: options && options.nonce }, doc );
		},

		each: function( obj, callback ) {
			var length, i = 0;

			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
							[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return flat( ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );

	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}

	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
		function( _i, name ) {
			class2type[ "[object " + name + "]" ] = name.toLowerCase();
		} );

	function isArrayLike( obj ) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = toType( obj );

		if ( isFunction( obj ) || isWindow( obj ) ) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.3.6
	 * https://sizzlejs.com/
	 *
	 * Copyright JS Foundation and other contributors
	 * Released under the MIT license
	 * https://js.foundation/
	 *
	 * Date: 2021-02-16
	 */
	( function( window ) {
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		nonnativeSelectorCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// Instance methods
		hasOwn = ( {} ).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		pushNative = arr.push,
		push = arr.push,
		slice = arr.slice,

		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[ i ] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
			"ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",

		// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
		identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
			"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +

			// "Attribute values must be CSS identifiers [capture 5]
			// or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
			whitespace + "*\\]",

		pseudos = ":(" + identifier + ")(?:\\((" +

			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
			whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
			"*" ),
		rdescend = new RegExp( whitespace + "|>" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace +
				"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
				"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rhtml = /HTML$/i,
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,

		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
		funescape = function( escape, nonHex ) {
			var high = "0x" + escape.slice( 1 ) - 0x10000;

			return nonHex ?

				// Strip the backslash prefix from a non-hex escape sequence
				nonHex :

				// Replace a hexadecimal escape sequence with the encoded Unicode code point
				// Support: IE <=11+
				// For values outside the Basic Multilingual Plane (BMP), manually construct a
				// surrogate pair
				high < 0 ?
					String.fromCharCode( high + 0x10000 ) :
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		fcssescape = function( ch, asCodePoint ) {
			if ( asCodePoint ) {

				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if ( ch === "\0" ) {
					return "\uFFFD";
				}

				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice( 0, -1 ) + "\\" +
					ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
			}

			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		},

		inDisabledFieldset = addCombinator(
			function( elem ) {
				return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
			},
			{ dir: "parentNode", next: "legend" }
		);

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			( arr = slice.call( preferredDoc.childNodes ) ),
			preferredDoc.childNodes
		);

		// Support: Android<4.0
		// Detect silently failing push.apply
		// eslint-disable-next-line no-unused-expressions
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				pushNative.apply( target, slice.call( els ) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;

				// Can't trust NodeList.length
				while ( ( target[ j++ ] = els[ i++ ] ) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, match, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
			setDocument( context );
			context = context || document;

			if ( documentIsHTML ) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

					// ID selector
					if ( ( m = match[ 1 ] ) ) {

						// Document context
						if ( nodeType === 9 ) {
							if ( ( elem = context.getElementById( m ) ) ) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}

						// Element context
						} else {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && ( elem = newContext.getElementById( m ) ) &&
								contains( context, elem ) &&
								elem.id === m ) {

								results.push( elem );
								return results;
							}
						}

					// Type selector
					} else if ( match[ 2 ] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;

					// Class selector
					} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
						context.getElementsByClassName ) {

						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!nonnativeSelectorCache[ selector + " " ] &&
					( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

					// Support: IE 8 only
					// Exclude object elements
					( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

					newSelector = selector;
					newContext = context;

					// qSA considers elements outside a scoping root when evaluating child or
					// descendant combinators, which is not what we want.
					// In such cases, we work around the behavior by prefixing every selector in the
					// list with an ID selector referencing the scope context.
					// The technique has to be used as well when a leading combinator is used
					// as such selectors are not recognized by querySelectorAll.
					// Thanks to Andrew Dupont for this technique.
					if ( nodeType === 1 &&
						( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;

						// We can use :scope instead of the ID hack if the browser
						// supports it & if we're not changing the context.
						if ( newContext !== context || !support.scope ) {

							// Capture the context ID, setting it first if necessary
							if ( ( nid = context.getAttribute( "id" ) ) ) {
								nid = nid.replace( rcssescape, fcssescape );
							} else {
								context.setAttribute( "id", ( nid = expando ) );
							}
						}

						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						while ( i-- ) {
							groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
								toSelector( groups[ i ] );
						}
						newSelector = groups.join( "," );
					}

					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
						nonnativeSelectorCache( selector, true );
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {

			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {

				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return ( cache[ key + " " ] = value );
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */
	function assert( fn ) {
		var el = document.createElement( "fieldset" );

		try {
			return !!fn( el );
		} catch ( e ) {
			return false;
		} finally {

			// Remove from its parent by default
			if ( el.parentNode ) {
				el.parentNode.removeChild( el );
			}

			// release memory in IE
			el = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split( "|" ),
			i = arr.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[ i ] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				a.sourceIndex - b.sourceIndex;

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( ( cur = cur.nextSibling ) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return ( name === "input" || name === "button" ) && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	function createDisabledPseudo( disabled ) {

		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function( elem ) {

			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if ( "form" in elem ) {

				// Check for inherited disabledness on relevant non-disabled elements:
				// * listed form-associated elements in a disabled fieldset
				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
				// * option elements in a disabled optgroup
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
				// All such elements have a "form" property.
				if ( elem.parentNode && elem.disabled === false ) {

					// Option elements defer to a parent optgroup if present
					if ( "label" in elem ) {
						if ( "label" in elem.parentNode ) {
							return elem.parentNode.disabled === disabled;
						} else {
							return elem.disabled === disabled;
						}
					}

					// Support: IE 6 - 11
					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
					return elem.isDisabled === disabled ||

						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
				}

				return elem.disabled === disabled;

			// Try to winnow out elements that can't be disabled before trusting the disabled property.
			// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
			// even exist on them, let alone have a boolean value.
			} else if ( "label" in elem ) {
				return elem.disabled === disabled;
			}

			// Remaining elements are neither :enabled nor :disabled
			return false;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction( function( argument ) {
			argument = +argument;
			return markFunction( function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
						seed[ j ] = !( matches[ j ] = seed[ j ] );
					}
				}
			} );
		} );
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

		// Support: IE <=8
		// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
		// https://bugs.jquery.com/ticket/4833
		return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, subWindow,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );

		// Support: IE 9 - 11+, Edge 12 - 18+
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( preferredDoc != document &&
			( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

			// Support: IE 11, Edge
			if ( subWindow.addEventListener ) {
				subWindow.addEventListener( "unload", unloadHandler, false );

			// Support: IE 9 - 10 only
			} else if ( subWindow.attachEvent ) {
				subWindow.attachEvent( "onunload", unloadHandler );
			}
		}

		// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
		// Safari 4 - 5 only, Opera <=11.6 - 12.x only
		// IE/Edge & older browsers don't support the :scope pseudo-class.
		// Support: Safari 6.0 only
		// Safari 6.0 supports :scope but it's an alias of :root there.
		support.scope = assert( function( el ) {
			docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
			return typeof el.querySelectorAll !== "undefined" &&
				!el.querySelectorAll( ":scope fieldset div" ).length;
		} );

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert( function( el ) {
			el.className = "i";
			return !el.getAttribute( "className" );
		} );

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert( function( el ) {
			el.appendChild( document.createComment( "" ) );
			return !el.getElementsByTagName( "*" ).length;
		} );

		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert( function( el ) {
			docElem.appendChild( el ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		} );

		// ID filter and find
		if ( support.getById ) {
			Expr.filter[ "ID" ] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute( "id" ) === attrId;
				};
			};
			Expr.find[ "ID" ] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var elem = context.getElementById( id );
					return elem ? [ elem ] : [];
				}
			};
		} else {
			Expr.filter[ "ID" ] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode( "id" );
					return node && node.value === attrId;
				};
			};

			// Support: IE 6 - 7 only
			// getElementById is not reliable as a find shortcut
			Expr.find[ "ID" ] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var node, i, elems,
						elem = context.getElementById( id );

					if ( elem ) {

						// Verify the id attribute
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}

						// Fall back on getElementsByName
						elems = context.getElementsByName( id );
						i = 0;
						while ( ( elem = elems[ i++ ] ) ) {
							node = elem.getAttributeNode( "id" );
							if ( node && node.value === id ) {
								return [ elem ];
							}
						}
					}

					return [];
				}
			};
		}

		// Tag
		Expr.find[ "TAG" ] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,

					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( ( elem = results[ i++ ] ) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See https://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert( function( el ) {

				var input;

				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// https://bugs.jquery.com/ticket/12359
				docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !el.querySelectorAll( "[selected]" ).length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push( "~=" );
				}

				// Support: IE 11+, Edge 15 - 18+
				// IE 11/Edge don't find elements on a `[name='']` query in some cases.
				// Adding a temporary attribute to the document before the selection works
				// around the issue.
				// Interestingly, IE 10 & older don't seem to have the issue.
				input = document.createElement( "input" );
				input.setAttribute( "name", "" );
				el.appendChild( input );
				if ( !el.querySelectorAll( "[name='']" ).length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
						whitespace + "*(?:''|\"\")" );
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !el.querySelectorAll( ":checked" ).length ) {
					rbuggyQSA.push( ":checked" );
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibling-combinator selector` fails
				if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push( ".#.+[+~]" );
				}

				// Support: Firefox <=3.6 - 5 only
				// Old Firefox doesn't throw on a badly-escaped identifier.
				el.querySelectorAll( "\\\f" );
				rbuggyQSA.push( "[\\r\\n\\f]" );
			} );

			assert( function( el ) {
				el.innerHTML = "<a href='' disabled='disabled'></a>" +
					"<select disabled='disabled'><option/></select>";

				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement( "input" );
				input.setAttribute( "type", "hidden" );
				el.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( el.querySelectorAll( "[name=d]" ).length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Support: IE9-11+
				// IE's :disabled selector does not pick up the children of disabled fieldsets
				docElem.appendChild( el ).disabled = true;
				if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Support: Opera 10 - 11 only
				// Opera 10-11 does not throw on post-comma invalid pseudos
				el.querySelectorAll( "*,:x" );
				rbuggyQSA.push( ",.*:" );
			} );
		}

		if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector ) ) ) ) {

			assert( function( el ) {

				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( el, "*" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( el, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			} );
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				) );
			} :
			function( a, b ) {
				if ( b ) {
					while ( ( b = b.parentNode ) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

				// Choose the first element that is related to our preferred document
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if ( a == document || a.ownerDocument == preferredDoc &&
					contains( preferredDoc, a ) ) {
					return -1;
				}

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if ( b == document || b.ownerDocument == preferredDoc &&
					contains( preferredDoc, b ) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {

			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				/* eslint-disable eqeqeq */
				return a == document ? -1 :
					b == document ? 1 :
					/* eslint-enable eqeqeq */
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( ( cur = cur.parentNode ) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( ( cur = cur.parentNode ) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[ i ] === bp[ i ] ) {
				i++;
			}

			return i ?

				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[ i ], bp[ i ] ) :

				// Otherwise nodes in our document sort first
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				/* eslint-disable eqeqeq */
				ap[ i ] == preferredDoc ? -1 :
				bp[ i ] == preferredDoc ? 1 :
				/* eslint-enable eqeqeq */
				0;
		};

		return document;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		setDocument( elem );

		if ( support.matchesSelector && documentIsHTML &&
			!nonnativeSelectorCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||

					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch ( e ) {
				nonnativeSelectorCache( expr, true );
			}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {

		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( ( context.ownerDocument || context ) != document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {

		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( ( elem.ownerDocument || elem ) != document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],

			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
	};

	Sizzle.escape = function( sel ) {
		return ( sel + "" ).replace( rcssescape, fcssescape );
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( ( elem = results[ i++ ] ) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {

				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[ 1 ] = match[ 1 ].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
					match[ 5 ] || "" ).replace( runescape, funescape );

				if ( match[ 2 ] === "~=" ) {
					match[ 3 ] = " " + match[ 3 ] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {

				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[ 1 ] = match[ 1 ].toLowerCase();

				if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

					// nth-* requires argument
					if ( !match[ 3 ] ) {
						Sizzle.error( match[ 0 ] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[ 4 ] = +( match[ 4 ] ?
						match[ 5 ] + ( match[ 6 ] || 1 ) :
						2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
					match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

					// other types prohibit arguments
				} else if ( match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[ 6 ] && match[ 2 ];

				if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[ 3 ] ) {
					match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&

					// Get excess from tokenize (recursively)
					( excess = tokenize( unquoted, true ) ) &&

					// advance to the next closing parenthesis
					( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

					// excess is a negative index
					match[ 0 ] = match[ 0 ].slice( 0, excess );
					match[ 2 ] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() {
						return true;
					} :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					( pattern = new RegExp( "(^|" + whitespace +
						")" + className + "(" + whitespace + "|$)" ) ) && classCache(
							className, function( elem ) {
								return pattern.test(
									typeof elem.className === "string" && elem.className ||
									typeof elem.getAttribute !== "undefined" &&
										elem.getAttribute( "class" ) ||
									""
								);
					} );
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					/* eslint-disable max-len */

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
					/* eslint-enable max-len */

				};
			},

			"CHILD": function( type, what, _argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, _context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( ( node = node[ dir ] ) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {

											return false;
										}
									}

									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( ( node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							} else {

								// Use previously-cached element index if available
								if ( useCache ) {

									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || ( node[ expando ] = {} );

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										( outerCache[ node.uniqueID ] = {} );

									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {

									// Use the same loop as above to seek `elem` from the start
									while ( ( node = ++nodeIndex && node && node[ dir ] ||
										( diff = nodeIndex = 0 ) || start.pop() ) ) {

										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {

											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] ||
													( node[ expando ] = {} );

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													( outerCache[ node.uniqueID ] = {} );

												uniqueCache[ type ] = [ dirruns, diff ];
											}

											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {

				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction( function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[ i ] );
								seed[ idx ] = !( matches[ idx ] = matched[ i ] );
							}
						} ) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {

			// Potentially complex pseudos
			"not": markFunction( function( selector ) {

				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction( function( seed, matches, _context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( ( elem = unmatched[ i ] ) ) {
								seed[ i ] = !( matches[ i ] = elem );
							}
						}
					} ) :
					function( elem, _context, xml ) {
						input[ 0 ] = elem;
						matcher( input, null, xml, results );

						// Don't keep the element (issue #299)
						input[ 0 ] = null;
						return !results.pop();
					};
			} ),

			"has": markFunction( function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			} ),

			"contains": markFunction( function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
				};
			} ),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {

				// lang value must be a valid identifier
				if ( !ridentifier.test( lang || "" ) ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( ( elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
					return false;
				};
			} ),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement &&
					( !document.hasFocus || document.hasFocus() ) &&
					!!( elem.type || elem.href || ~elem.tabIndex );
			},

			// Boolean properties
			"enabled": createDisabledPseudo( false ),
			"disabled": createDisabledPseudo( true ),

			"checked": function( elem ) {

				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return ( nodeName === "input" && !!elem.checked ) ||
					( nodeName === "option" && !!elem.selected );
			},

			"selected": function( elem ) {

				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					// eslint-disable-next-line no-unused-expressions
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {

				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos[ "empty" ]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( ( attr = elem.getAttribute( "type" ) ) == null ||
						attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo( function() {
				return [ 0 ];
			} ),

			"last": createPositionalPseudo( function( _matchIndexes, length ) {
				return [ length - 1 ];
			} ),

			"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			} ),

			"even": createPositionalPseudo( function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),

			"odd": createPositionalPseudo( function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),

			"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
				var i = argument < 0 ?
					argument + length :
					argument > length ?
						length :
						argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),

			"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} )
		}
	};

	Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
				if ( match ) {

					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[ 0 ].length ) || soFar;
				}
				groups.push( ( tokens = [] ) );
			}

			matched = false;

			// Combinators
			if ( ( match = rcombinators.exec( soFar ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,

					// Cast descendant combinators to space
					type: match[ 0 ].replace( rtrim, " " )
				} );
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
					( match = preFilters[ type ]( match ) ) ) ) {
					matched = match.shift();
					tokens.push( {
						value: matched,
						type: type,
						matches: match
					} );
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :

				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[ i ].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			skip = combinator.next,
			key = skip || dir,
			checkNonElements = base && key === "parentNode",
			doneName = done++;

		return combinator.first ?

			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
				return false;
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( ( elem = elem[ dir ] ) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( ( elem = elem[ dir ] ) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || ( elem[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] ||
								( outerCache[ elem.uniqueID ] = {} );

							if ( skip && skip === elem.nodeName.toLowerCase() ) {
								elem = elem[ dir ] || elem;
							} else if ( ( oldCache = uniqueCache[ key ] ) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return ( newCache[ 2 ] = oldCache[ 2 ] );
							} else {

								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ key ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[ i ]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[ 0 ];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[ i ], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( ( elem = unmatched[ i ] ) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction( function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts(
					selector || "*",
					context.nodeType ? [ context ] : context,
					[]
				),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?

					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( ( elem = temp[ i ] ) ) {
						matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {

						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( ( elem = matcherOut[ i ] ) ) {

								// Restore matcherIn since elem is not yet a final match
								temp.push( ( matcherIn[ i ] = elem ) );
							}
						}
						postFinder( null, ( matcherOut = [] ), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) &&
							( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

							seed[ temp ] = !( results[ temp ] = elem );
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		} );
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[ 0 ].type ],
			implicitRelative = leadingRelative || Expr.relative[ " " ],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					( checkContext = context ).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );

				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
				matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
			} else {
				matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {

					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[ j ].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(

						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens
							.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,

					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
					len = elems.length;

				if ( outermost ) {

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					outermostContext = context == document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;

						// Support: IE 11+, Edge 17 - 18+
						// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
						// two documents; shallow comparisons work.
						// eslint-disable-next-line eqeqeq
						if ( !context && elem.ownerDocument != document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( ( matcher = elementMatchers[ j++ ] ) ) {
							if ( matcher( elem, context || document, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {

						// They will have gone through all possible matchers
						if ( ( elem = !matcher && elem ) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( ( matcher = setMatchers[ j++ ] ) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {

						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
									setMatched[ i ] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {

			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[ i ] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache(
				selector,
				matcherFromGroupMatchers( elementMatchers, setMatchers )
			);

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( ( selector = compiled.selector || selector ) );

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[ 0 ] = match[ 0 ].slice( 0 );
			if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

				context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
					.replace( runescape, funescape ), context ) || [] )[ 0 ];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[ i ];

				// Abort if we hit a combinator
				if ( Expr.relative[ ( type = token.type ) ] ) {
					break;
				}
				if ( ( find = Expr.find[ type ] ) ) {

					// Search, expanding context for leading sibling combinators
					if ( ( seed = find(
						token.matches[ 0 ].replace( runescape, funescape ),
						rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
							context
					) ) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert( function( el ) {

		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
	} );

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert( function( el ) {
		el.innerHTML = "<a href='#'></a>";
		return el.firstChild.getAttribute( "href" ) === "#";
	} ) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		} );
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert( function( el ) {
		el.innerHTML = "<input/>";
		el.firstChild.setAttribute( "value", "" );
		return el.firstChild.getAttribute( "value" ) === "";
	} ) ) {
		addHandle( "value", function( elem, _name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		} );
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert( function( el ) {
		return el.getAttribute( "disabled" ) == null;
	} ) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
					( val = elem.getAttributeNode( name ) ) && val.specified ?
						val.value :
						null;
			}
		} );
	}

	return Sizzle;

	} )( window );



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;

	// Deprecated
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;




	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};


	var siblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;



	function nodeName( elem, name ) {

		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

	}
	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
		}

		// Single element
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
		}

		// Arraylike of elements (jQuery, arguments, Array)
		if ( typeof qualifier !== "string" ) {
			return jQuery.grep( elements, function( elem ) {
				return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
			} );
		}

		// Filtered directly for both simple and complex selectors
		return jQuery.filter( qualifier, elements, not );
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		if ( elems.length === 1 && elem.nodeType === 1 ) {
			return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
		}

		return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
	};

	jQuery.fn.extend( {
		find: function( selector ) {
			var i, ret,
				len = this.length,
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}

			ret = this.pushStack( [] );

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {

								// Properties of context are called as methods if possible
								if ( isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );

						if ( elem ) {

							// Inject the element directly into the jQuery object
							this[ 0 ] = elem;
							this.length = 1;
						}
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this[ 0 ] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :

					// Execute immediately if ready is not present
					selector( jQuery );
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery( selectors );

			// Positional selectors never match, since there's no _selection_ context
			if ( !rneedsContext.test( selectors ) ) {
				for ( ; i < l; i++ ) {
					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

						// Always skip document fragments
						if ( cur.nodeType < 11 && ( targets ?
							targets.index( cur ) > -1 :

							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 &&
								jQuery.find.matchesSelector( cur, selectors ) ) ) {

							matched.push( cur );
							break;
						}
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );

	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, _i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, _i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, _i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			if ( elem.contentDocument != null &&

				// Support: IE 11+
				// <object> elements with no `data` attribute has an object
				// `contentDocument` with a `null` prototype.
				getProto( elem.contentDocument ) ) {

				return elem.contentDocument;
			}

			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
			// Treat the template element as a regular one in browsers that
			// don't support it.
			if ( nodeName( elem, "template" ) ) {
				elem = elem.content || elem;
			}

			return jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {

				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	} );
	var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function() {

				// Enforce single-firing
				locked = locked || options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {

						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if ( locked ) {

					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];

					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {

						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}

						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && toType( arg ) !== "string" ) {

									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );

						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );

							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory && !firing ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	function Identity( v ) {
		return v;
	}
	function Thrower( ex ) {
		throw ex;
	}

	function adoptValue( value, resolve, reject, noValue ) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if ( value && isFunction( ( method = value.promise ) ) ) {
				method.call( value ).done( resolve ).fail( reject );

			// Other thenables
			} else if ( value && isFunction( ( method = value.then ) ) ) {
				method.call( value, resolve, reject );

			// Other non-thenables
			} else {

				// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
				// * false: [ value ].slice( 0 ) => resolve( value )
				// * true: [ value ].slice( 1 ) => resolve()
				resolve.apply( undefined, [ value ].slice( noValue ) );
			}

		// For Promises/A+, convert exceptions into rejections
		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
		// Deferred#then to conditionally suppress rejection.
		} catch ( value ) {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.apply( undefined, [ value ] );
		}
	}

	jQuery.extend( {

		Deferred: function( func ) {
			var tuples = [

					// action, add listener, callbacks,
					// ... .then handlers, argument index, [final state]
					[ "notify", "progress", jQuery.Callbacks( "memory" ),
						jQuery.Callbacks( "memory" ), 2 ],
					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					"catch": function( fn ) {
						return promise.then( null, fn );
					},

					// Keep pipe for back-compat
					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;

						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( _i, tuple ) {

								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
					then: function( onFulfilled, onRejected, onProgress ) {
						var maxDepth = 0;
						function resolve( depth, deferred, handler, special ) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function() {
										var returned, then;

										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if ( depth < maxDepth ) {
											return;
										}

										returned = handler.apply( that, args );

										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError( "Thenable self-resolution" );
										}

										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&

											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;

										// Handle a returned thenable
										if ( isFunction( then ) ) {

											// Special processors (notify) just wait for resolution
											if ( special ) {
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special )
												);

											// Normal processors (resolve) also hook into progress
											} else {

												// ...and disregard older resolution values
												maxDepth++;

												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special ),
													resolve( maxDepth, deferred, Identity,
														deferred.notifyWith )
												);
											}

										// Handle all other returned values
										} else {

											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Identity ) {
												that = undefined;
												args = [ returned ];
											}

											// Process the value(s)
											// Default process is resolve
											( special || deferred.resolveWith )( that, args );
										}
									},

									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function() {
											try {
												mightThrow();
											} catch ( e ) {

												if ( jQuery.Deferred.exceptionHook ) {
													jQuery.Deferred.exceptionHook( e,
														process.stackTrace );
												}

												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if ( depth + 1 >= maxDepth ) {

													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if ( handler !== Thrower ) {
														that = undefined;
														args = [ e ];
													}

													deferred.rejectWith( that, args );
												}
											}
										};

								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if ( depth ) {
									process();
								} else {

									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if ( jQuery.Deferred.getStackHook ) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout( process );
								}
							};
						}

						return jQuery.Deferred( function( newDefer ) {

							// progress_handlers.add( ... )
							tuples[ 0 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onProgress ) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);

							// fulfilled_handlers.add( ... )
							tuples[ 1 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onFulfilled ) ?
										onFulfilled :
										Identity
								)
							);

							// rejected_handlers.add( ... )
							tuples[ 2 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onRejected ) ?
										onRejected :
										Thrower
								)
							);
						} ).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 5 ];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[ tuple[ 1 ] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add(
						function() {

							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},

						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[ 3 - i ][ 2 ].disable,

						// rejected_handlers.disable
						// fulfilled_handlers.disable
						tuples[ 3 - i ][ 3 ].disable,

						// progress_callbacks.lock
						tuples[ 0 ][ 2 ].lock,

						// progress_handlers.lock
						tuples[ 0 ][ 3 ].lock
					);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add( tuple[ 3 ].fire );

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( singleValue ) {
			var

				// count of uncompleted subordinates
				remaining = arguments.length,

				// count of unprocessed arguments
				i = remaining,

				// subordinate fulfillment data
				resolveContexts = Array( i ),
				resolveValues = slice.call( arguments ),

				// the primary Deferred
				primary = jQuery.Deferred(),

				// subordinate callback factory
				updateFunc = function( i ) {
					return function( value ) {
						resolveContexts[ i ] = this;
						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( !( --remaining ) ) {
							primary.resolveWith( resolveContexts, resolveValues );
						}
					};
				};

			// Single- and empty arguments are adopted like Promise.resolve
			if ( remaining <= 1 ) {
				adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
					!remaining );

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if ( primary.state() === "pending" ||
					isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

					return primary.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while ( i-- ) {
				adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
			}

			return primary.promise();
		}
	} );


	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function( error, stack ) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
			window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
		}
	};




	jQuery.readyException = function( error ) {
		window.setTimeout( function() {
			throw error;
		} );
	};




	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function( fn ) {

		readyList
			.then( fn )

			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch( function( error ) {
				jQuery.readyException( error );
			} );

		return this;
	};

	jQuery.extend( {

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
		}
	} );

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if ( document.readyState === "complete" ||
		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout( jQuery.ready );

	} else {

		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", completed );

		// A fallback to window.onload, that will always work
		window.addEventListener( "load", completed );
	}




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( toType( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {

				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, _key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
							value :
							value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}

		if ( chainable ) {
			return elems;
		}

		// Gets
		if ( bulk ) {
			return fn.call( elems );
		}

		return len ? fn( elems[ 0 ], key ) : emptyGet;
	};


	// Matches dashed string for camelizing
	var rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g;

	// Used by camelCase as callback to replace()
	function fcamelCase( _all, letter ) {
		return letter.toUpperCase();
	}

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 15
	// Microsoft forgot to hump their vendor prefix (#9572)
	function camelCase( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	}
	var acceptData = function( owner ) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function( owner ) {

			// Check if the owner object already has a cache
			var value = owner[ this.expando ];

			// If not, create one
			if ( !value ) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;

					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}

			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if ( typeof data === "string" ) {
				cache[ camelCase( data ) ] = value;

			// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ camelCase( prop ) ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :

				// Always use camelCase key (gh-2257)
				owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
		},
		access: function( owner, key, value ) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {

				return this.get( owner, key );
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];

			if ( cache === undefined ) {
				return;
			}

			if ( key !== undefined ) {

				// Support array or space separated string of keys
				if ( Array.isArray( key ) ) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( camelCase );
				} else {
					key = camelCase( key );

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnothtmlwhite ) || [] );
				}

				i = key.length;

				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}

			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function getData( data ) {
		if ( data === "true" ) {
			return true;
		}

		if ( data === "false" ) {
			return false;
		}

		if ( data === "null" ) {
			return null;
		}

		// Only convert to a number if it doesn't change the string
		if ( data === +data + "" ) {
			return +data;
		}

		if ( rbrace.test( data ) ) {
			return JSON.parse( data );
		}

		return data;
	}

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = getData( data );
				} catch ( e ) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );

	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );

					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}

			return access( this, function( value ) {
				var data;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each( function() {

					// We always store the camelCased key
					dataUser.set( this, key, value );
				} );
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );


	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || Array.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );

	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}

			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var documentElement = document.documentElement;



		var isAttached = function( elem ) {
				return jQuery.contains( elem.ownerDocument, elem );
			},
			composed = { composed: true };

		// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
		// Check attachment across shadow DOM boundaries when possible (gh-3504)
		// Support: iOS 10.0-10.2 only
		// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
		// leading to errors. We need to check for `getRootNode`.
		if ( documentElement.getRootNode ) {
			isAttached = function( elem ) {
				return jQuery.contains( elem.ownerDocument, elem ) ||
					elem.getRootNode( composed ) === elem.ownerDocument;
			};
		}
	var isHiddenWithinTree = function( elem, el ) {

			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;

			// Inline style trumps all
			return elem.style.display === "none" ||
				elem.style.display === "" &&

				// Otherwise, check computed style
				// Support: Firefox <=43 - 45
				// Disconnected elements can have computed display: none, so first confirm that elem is
				// in the document.
				isAttached( elem ) &&

				jQuery.css( elem, "display" ) === "none";
		};



	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted, scale,
			maxIterations = 20,
			currentValue = tween ?
				function() {
					return tween.cur();
				} :
				function() {
					return jQuery.css( elem, prop, "" );
				},
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = elem.nodeType &&
				( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );

		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

			// Support: Firefox <=54
			// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
			initial = initial / 2;

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			while ( maxIterations-- ) {

				// Evaluate and update our best guess (doubling guesses that zero out).
				// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
				jQuery.style( elem, prop, initialInUnit + unit );
				if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
					maxIterations = 0;
				}
				initialInUnit = initialInUnit / scale;

			}

			initialInUnit = initialInUnit * 2;
			jQuery.style( elem, prop, initialInUnit + unit );

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
		}

		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}


	var defaultDisplayMap = {};

	function getDefaultDisplay( elem ) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[ nodeName ];

		if ( display ) {
			return display;
		}

		temp = doc.body.appendChild( doc.createElement( nodeName ) );
		display = jQuery.css( temp, "display" );

		temp.parentNode.removeChild( temp );

		if ( display === "none" ) {
			display = "block";
		}
		defaultDisplayMap[ nodeName ] = display;

		return display;
	}

	function showHide( elements, show ) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;

		// Determine new display value for elements that need to change
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			display = elem.style.display;
			if ( show ) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if ( display === "none" ) {
					values[ index ] = dataPriv.get( elem, "display" ) || null;
					if ( !values[ index ] ) {
						elem.style.display = "";
					}
				}
				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
					values[ index ] = getDefaultDisplay( elem );
				}
			} else {
				if ( display !== "none" ) {
					values[ index ] = "none";

					// Remember what we're overwriting
					dataPriv.set( elem, "display", display );
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for ( index = 0; index < length; index++ ) {
			if ( values[ index ] != null ) {
				elements[ index ].style.display = values[ index ];
			}
		}

		return elements;
	}

	jQuery.fn.extend( {
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each( function() {
				if ( isHiddenWithinTree( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	var rcheckableType = ( /^(?:checkbox|radio)$/i );

	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

	var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

		// Support: IE <=9 only
		// IE <=9 replaces <option> tags with their contents when inserted outside of
		// the select element.
		div.innerHTML = "<option></option>";
		support.option = !!div.lastChild;
	} )();


	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// Support: IE <=9 only
	if ( !support.option ) {
		wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
	}


	function getAll( context, tag ) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;

		if ( typeof context.getElementsByTagName !== "undefined" ) {
			ret = context.getElementsByTagName( tag || "*" );

		} else if ( typeof context.querySelectorAll !== "undefined" ) {
			ret = context.querySelectorAll( tag || "*" );

		} else {
			ret = [];
		}

		if ( tag === undefined || tag && nodeName( context, tag ) ) {
			return jQuery.merge( [ context ], ret );
		}

		return ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, attached, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( toType( elem ) === "object" ) {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {

			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}

			attached = isAttached( elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( attached ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	}


	var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE <=9 - 11+
	// focus() and blur() are asynchronous, except when they are no-op.
	// So expect focus to be synchronous when the element is already active,
	// and blur to be synchronous when the element is not already active.
	// (focus and blur are always synchronous in other supported browsers,
	// this just defines when we can count on it).
	function expectSync( elem, type ) {
		return ( elem === safeActiveElement() ) === ( type === "focus" );
	}

	// Support: IE <=9 only
	// Accessing document.activeElement can throw unexpectedly
	// https://bugs.jquery.com/ticket/13393
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {

			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}

		if ( data == null && fn == null ) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {

				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );

			// Only attach events to objects that accept data
			if ( !acceptData( elem ) ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if ( selector ) {
				jQuery.find.matchesSelector( documentElement, selector );
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = Object.create( null );
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},

		dispatch: function( nativeEvent ) {

			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array( arguments.length ),

				// Make a writable jQuery.Event from the native event object
				event = jQuery.event.fix( nativeEvent ),

				handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;

			for ( i = 1; i < arguments.length; i++ ) {
				args[ i ] = arguments[ i ];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {

					// If the event is namespaced, then each handler is only invoked if it is
					// specially universal or its namespaces are a superset of the event's.
					if ( !event.rnamespace || handleObj.namespace === false ||
						event.rnamespace.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, handleObj, sel, matchedHandlers, matchedSelectors,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			if ( delegateCount &&

				// Support: IE <=9
				// Black-hole SVG <use> instance trees (trac-13180)
				cur.nodeType &&

				// Support: Firefox <=42
				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
				// Support: IE 11 only
				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
				!( event.type === "click" && event.button >= 1 ) ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
						matchedHandlers = [];
						matchedSelectors = {};
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matchedSelectors[ sel ] === undefined ) {
								matchedSelectors[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matchedSelectors[ sel ] ) {
								matchedHandlers.push( handleObj );
							}
						}
						if ( matchedHandlers.length ) {
							handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			cur = this;
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
			}

			return handlerQueue;
		},

		addProp: function( name, hook ) {
			Object.defineProperty( jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: isFunction( hook ) ?
					function() {
						if ( this.originalEvent ) {
							return hook( this.originalEvent );
						}
					} :
					function() {
						if ( this.originalEvent ) {
							return this.originalEvent[ name ];
						}
					},

				set: function( value ) {
					Object.defineProperty( this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					} );
				}
			} );
		},

		fix: function( originalEvent ) {
			return originalEvent[ jQuery.expando ] ?
				originalEvent :
				new jQuery.Event( originalEvent );
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			click: {

				// Utilize native event to ensure correct state for checkable inputs
				setup: function( data ) {

					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;

					// Claim the first handler
					if ( rcheckableType.test( el.type ) &&
						el.click && nodeName( el, "input" ) ) {

						// dataPriv.set( el, "click", ... )
						leverageNative( el, "click", returnTrue );
					}

					// Return false to allow normal processing in the caller
					return false;
				},
				trigger: function( data ) {

					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;

					// Force setup before triggering a click
					if ( rcheckableType.test( el.type ) &&
						el.click && nodeName( el, "input" ) ) {

						leverageNative( el, "click" );
					}

					// Return non-false to allow normal event-path propagation
					return true;
				},

				// For cross-browser consistency, suppress native .click() on links
				// Also prevent it if we're currently inside a leveraged native-event stack
				_default: function( event ) {
					var target = event.target;
					return rcheckableType.test( target.type ) &&
						target.click && nodeName( target, "input" ) &&
						dataPriv.get( target, "click" ) ||
						nodeName( target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	// Ensure the presence of an event listener that handles manually-triggered
	// synthetic events by interrupting progress until reinvoked in response to
	// *native* events that it fires directly, ensuring that state changes have
	// already occurred before other listeners are invoked.
	function leverageNative( el, type, expectSync ) {

		// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
		if ( !expectSync ) {
			if ( dataPriv.get( el, type ) === undefined ) {
				jQuery.event.add( el, type, returnTrue );
			}
			return;
		}

		// Register the controller as a special universal handler for all event namespaces
		dataPriv.set( el, type, false );
		jQuery.event.add( el, type, {
			namespace: false,
			handler: function( event ) {
				var notAsync, result,
					saved = dataPriv.get( this, type );

				if ( ( event.isTrigger & 1 ) && this[ type ] ) {

					// Interrupt processing of the outer synthetic .trigger()ed event
					// Saved data should be false in such cases, but might be a leftover capture object
					// from an async native handler (gh-4350)
					if ( !saved.length ) {

						// Store arguments for use when handling the inner native event
						// There will always be at least one argument (an event object), so this array
						// will not be confused with a leftover capture object.
						saved = slice.call( arguments );
						dataPriv.set( this, type, saved );

						// Trigger the native event and capture its result
						// Support: IE <=9 - 11+
						// focus() and blur() are asynchronous
						notAsync = expectSync( this, type );
						this[ type ]();
						result = dataPriv.get( this, type );
						if ( saved !== result || notAsync ) {
							dataPriv.set( this, type, false );
						} else {
							result = {};
						}
						if ( saved !== result ) {

							// Cancel the outer synthetic event
							event.stopImmediatePropagation();
							event.preventDefault();

							// Support: Chrome 86+
							// In Chrome, if an element having a focusout handler is blurred by
							// clicking outside of it, it invokes the handler synchronously. If
							// that handler calls `.remove()` on the element, the data is cleared,
							// leaving `result` undefined. We need to guard against this.
							return result && result.value;
						}

					// If this is an inner synthetic event for an event with a bubbling surrogate
					// (focus or blur), assume that the surrogate already propagated from triggering the
					// native event and prevent that from happening again here.
					// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
					// bubbling surrogate propagates *after* the non-bubbling base), but that seems
					// less bad than duplication.
					} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
						event.stopPropagation();
					}

				// If this is a native event triggered above, everything is now in order
				// Fire an inner synthetic event with the original arguments
				} else if ( saved.length ) {

					// ...and capture the result
					dataPriv.set( this, type, {
						value: jQuery.event.trigger(

							// Support: IE <=9 - 11+
							// Extend with the prototype to reset the above stopImmediatePropagation()
							jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
							saved.slice( 1 ),
							this
						)
					} );

					// Abort handling of the native event
					event.stopImmediatePropagation();
				}
			}
		} );
	}

	jQuery.removeEvent = function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};

	jQuery.Event = function( src, props ) {

		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: Android <=2.3 only
					src.returnValue === false ?
				returnTrue :
				returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = ( src.target && src.target.nodeType === 3 ) ?
				src.target.parentNode :
				src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || Date.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each( {
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		code: true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,
		which: true
	}, jQuery.event.addProp );

	jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
		jQuery.event.special[ type ] = {

			// Utilize native event if possible so blur/focus sequence is correct
			setup: function() {

				// Claim the first handler
				// dataPriv.set( this, "focus", ... )
				// dataPriv.set( this, "blur", ... )
				leverageNative( this, type, expectSync );

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function() {

				// Force setup before trigger
				leverageNative( this, type );

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// Suppress native focus or blur as it's already being fired
			// in leverageNative.
			_default: function() {
				return true;
			},

			delegateType: delegateType
		};
	} );

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );

	jQuery.fn.extend( {

		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {

				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );


	var

		// Support: IE <=10 - 11, Edge 12 - 13 only
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Prefer a tbody over its parent table for containing new rows
	function manipulationTarget( elem, content ) {
		if ( nodeName( elem, "table" ) &&
			nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

			return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
			elem.type = elem.type.slice( 5 );
		} else {
			elem.removeAttribute( "type" );
		}

		return elem;
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.get( src );
			events = pdataOld.events;

			if ( events ) {
				dataPriv.remove( dest, "handle events" );

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			dataUser.set( dest, udataCur );
		}
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip( collection, args, callback, ignored ) {

		// Flatten any nested arrays
		args = flat( args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			valueIsFunction = isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( valueIsFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( valueIsFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}

		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( collection[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {

							if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl && !node.noModule ) {
									jQuery._evalUrl( node.src, {
										nonce: node.nonce || node.getAttribute( "nonce" )
									}, doc );
								}
							} else {
								DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;

		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}

			if ( node.parentNode ) {
				if ( keepData && isAttached( node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}

		return elem;
	}

	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html;
		},

		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = isAttached( elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );

	jQuery.fn.extend( {
		detach: function( selector ) {
			return remove( this, selector, true );
		},

		remove: function( selector ) {
			return remove( this, selector );
		},

		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},

		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},

		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},

		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},

		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = jQuery.htmlPrefilter( value );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;

				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}

			// Force callback invocation
			}, ignored );
		}
	} );

	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	} );
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var getStyles = function( elem ) {

			// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if ( !view || !view.opener ) {
				view = window;
			}

			return view.getComputedStyle( elem );
		};

	var swap = function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};


	var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



	( function() {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if ( !div ) {
				return;
			}

			container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
				"margin-top:1px;padding:0;border:0";
			div.style.cssText =
				"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
				"margin:auto;border:1px;padding:1px;" +
				"width:60%;top:1%";
			documentElement.appendChild( container ).appendChild( div );

			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

			// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
			// Some styles come back with percentage values, even though they shouldn't
			div.style.right = "60%";
			pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

			// Support: IE 9 - 11 only
			// Detect misreporting of content dimensions for box-sizing:border-box elements
			boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

			// Support: IE 9 only
			// Detect overflow:scroll screwiness (gh-3699)
			// Support: Chrome <=64
			// Don't get tricked when zoom affects offsetWidth (gh-4029)
			div.style.position = "absolute";
			scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

			documentElement.removeChild( container );

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		function roundPixelMeasures( measure ) {
			return Math.round( parseFloat( measure ) );
		}

		var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
			reliableTrDimensionsVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		jQuery.extend( support, {
			boxSizingReliable: function() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelBoxStyles: function() {
				computeStyleTests();
				return pixelBoxStylesVal;
			},
			pixelPosition: function() {
				computeStyleTests();
				return pixelPositionVal;
			},
			reliableMarginLeft: function() {
				computeStyleTests();
				return reliableMarginLeftVal;
			},
			scrollboxSize: function() {
				computeStyleTests();
				return scrollboxSizeVal;
			},

			// Support: IE 9 - 11+, Edge 15 - 18+
			// IE/Edge misreport `getComputedStyle` of table rows with width/height
			// set in CSS while `offset*` properties report correct values.
			// Behavior in IE 9 is more subtle than in newer versions & it passes
			// some versions of this test; make sure not to make it pass there!
			//
			// Support: Firefox 70+
			// Only Firefox includes border widths
			// in computed dimensions. (gh-4529)
			reliableTrDimensions: function() {
				var table, tr, trChild, trStyle;
				if ( reliableTrDimensionsVal == null ) {
					table = document.createElement( "table" );
					tr = document.createElement( "tr" );
					trChild = document.createElement( "div" );

					table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
					tr.style.cssText = "border:1px solid";

					// Support: Chrome 86+
					// Height set through cssText does not get applied.
					// Computed height then comes back as 0.
					tr.style.height = "1px";
					trChild.style.height = "9px";

					// Support: Android 8 Chrome 86+
					// In our bodyBackground.html iframe,
					// display for all div elements is set to "inline",
					// which causes a problem only in Android 8 Chrome 86.
					// Ensuring the div is display: block
					// gets around this issue.
					trChild.style.display = "block";

					documentElement
						.appendChild( table )
						.appendChild( tr )
						.appendChild( trChild );

					trStyle = window.getComputedStyle( tr );
					reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
						parseInt( trStyle.borderTopWidth, 10 ) +
						parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

					documentElement.removeChild( table );
				}
				return reliableTrDimensionsVal;
			}
		} );
	} )();


	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,

			// Support: Firefox 51+
			// Retrieving style before computed somehow
			// fixes an issue with getting wrong values
			// on detached elements
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is needed for:
		//   .css('filter') (IE 9 only, #12537)
		//   .css('--customProperty) (#3144)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( ret === "" && !isAttached( elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}


	var cssPrefixes = [ "Webkit", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style,
		vendorProps = {};

	// Return a vendor-prefixed property or undefined
	function vendorPropName( name ) {

		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}

	// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
	function finalPropName( name ) {
		var final = jQuery.cssProps[ name ] || vendorProps[ name ];

		if ( final ) {
			return final;
		}
		if ( name in emptyStyle ) {
			return name;
		}
		return vendorProps[ name ] = vendorPropName( name ) || name;
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rcustomProp = /^--/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		};

	function setPositiveNumber( _elem, value, subtract ) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}

	function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
		var i = dimension === "width" ? 1 : 0,
			extra = 0,
			delta = 0;

		// Adjustment may not be necessary
		if ( box === ( isBorderBox ? "border" : "content" ) ) {
			return 0;
		}

		for ( ; i < 4; i += 2 ) {

			// Both box models exclude margin
			if ( box === "margin" ) {
				delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
			}

			// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
			if ( !isBorderBox ) {

				// Add padding
				delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// For "border" or "margin", add border
				if ( box !== "padding" ) {
					delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

				// But still keep track of it otherwise
				} else {
					extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}

			// If we get here with a border-box (content + padding + border), we're seeking "content" or
			// "padding" or "margin"
			} else {

				// For "content", subtract padding
				if ( box === "content" ) {
					delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// For "content" or "padding", subtract border
				if ( box !== "margin" ) {
					delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		// Account for positive content-box scroll gutter when requested by providing computedVal
		if ( !isBorderBox && computedVal >= 0 ) {

			// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
			// Assuming integer scroll gutter, subtract the rest and round down
			delta += Math.max( 0, Math.ceil(
				elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
				computedVal -
				delta -
				extra -
				0.5

			// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
			// Use an explicit zero to avoid NaN (gh-3964)
			) ) || 0;
		}

		return delta;
	}

	function getWidthOrHeight( elem, dimension, extra ) {

		// Start with computed style
		var styles = getStyles( elem ),

			// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
			// Fake content-box until we know it's needed to know the true value.
			boxSizingNeeded = !support.boxSizingReliable() || extra,
			isBorderBox = boxSizingNeeded &&
				jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
			valueIsBorderBox = isBorderBox,

			val = curCSS( elem, dimension, styles ),
			offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

		// Support: Firefox <=54
		// Return a confounding non-pixel value or feign ignorance, as appropriate.
		if ( rnumnonpx.test( val ) ) {
			if ( !extra ) {
				return val;
			}
			val = "auto";
		}


		// Support: IE 9 - 11 only
		// Use offsetWidth/offsetHeight for when box sizing is unreliable.
		// In those cases, the computed value can be trusted to be border-box.
		if ( ( !support.boxSizingReliable() && isBorderBox ||

			// Support: IE 10 - 11+, Edge 15 - 18+
			// IE/Edge misreport `getComputedStyle` of table rows with width/height
			// set in CSS while `offset*` properties report correct values.
			// Interestingly, in some cases IE 9 doesn't suffer from this issue.
			!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

			// Fall back to offsetWidth/offsetHeight when value is "auto"
			// This happens for inline elements with no explicit setting (gh-3571)
			val === "auto" ||

			// Support: Android <=4.1 - 4.3 only
			// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
			!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

			// Make sure the element is visible & connected
			elem.getClientRects().length ) {

			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

			// Where available, offsetWidth/offsetHeight approximate border box dimensions.
			// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
			// retrieved value as a content box dimension.
			valueIsBorderBox = offsetProp in elem;
			if ( valueIsBorderBox ) {
				val = elem[ offsetProp ];
			}
		}

		// Normalize "" and auto
		val = parseFloat( val ) || 0;

		// Adjust for the element's box model
		return ( val +
			boxModelAdjustment(
				elem,
				dimension,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles,

				// Provide the current computed size to request scroll gutter calculation (gh-3589)
				val
			)
		) + "px";
	}

	jQuery.extend( {

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"gridArea": true,
			"gridColumn": true,
			"gridColumnEnd": true,
			"gridColumnStart": true,
			"gridRow": true,
			"gridRowEnd": true,
			"gridRowStart": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = camelCase( name ),
				isCustomProp = rcustomProp.test( name ),
				style = elem.style;

			// Make sure that we're working with the right name. We don't
			// want to query the value if it is a CSS custom property
			// since they are user-defined.
			if ( !isCustomProp ) {
				name = finalPropName( origName );
			}

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
				// "px" to a few hardcoded values.
				if ( type === "number" && !isCustomProp ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}

				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

					if ( isCustomProp ) {
						style.setProperty( name, value );
					} else {
						style[ name ] = value;
					}
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = camelCase( name ),
				isCustomProp = rcustomProp.test( name );

			// Make sure that we're working with the right name. We don't
			// want to modify the value if it is a CSS custom property
			// since they are user-defined.
			if ( !isCustomProp ) {
				name = finalPropName( origName );
			}

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}

			return val;
		}
	} );

	jQuery.each( [ "height", "width" ], function( _i, dimension ) {
		jQuery.cssHooks[ dimension ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
				}
			},

			set: function( elem, value, extra ) {
				var matches,
					styles = getStyles( elem ),

					// Only read styles.position if the test has a chance to fail
					// to avoid forcing a reflow.
					scrollboxSizeBuggy = !support.scrollboxSize() &&
						styles.position === "absolute",

					// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
					boxSizingNeeded = scrollboxSizeBuggy || extra,
					isBorderBox = boxSizingNeeded &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					subtract = extra ?
						boxModelAdjustment(
							elem,
							dimension,
							extra,
							isBorderBox,
							styles
						) :
						0;

				// Account for unreliable border-box dimensions by comparing offset* to computed and
				// faking a content-box to get border and padding (gh-3699)
				if ( isBorderBox && scrollboxSizeBuggy ) {
					subtract -= Math.ceil(
						elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
						parseFloat( styles[ dimension ] ) -
						boxModelAdjustment( elem, dimension, "border", false, styles ) -
						0.5
					);
				}

				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {

					elem.style[ dimension ] = value;
					value = jQuery.css( elem, dimension );
				}

				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );

	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
				) + "px";
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( prefix !== "margin" ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );

	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( Array.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		}
	} );


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
						tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, inProgress,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	function schedule() {
		if ( inProgress ) {
			if ( document.hidden === false && window.requestAnimationFrame ) {
				window.requestAnimationFrame( schedule );
			} else {
				window.setTimeout( schedule, jQuery.fx.interval );
			}

			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = Date.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );

		// Queue-skipping animations hijack the fx hooks
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always( function() {

				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}

		// Detect show/hide animations
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.test( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;

					// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject( props );
		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if ( isBox && elem.nodeType === 1 ) {

			// Support: IE <=9 - 11, Edge 12 - 15
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY and Edge just mirrors
			// the overflowX value there.
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if ( restoreDisplay == null ) {
				restoreDisplay = dataPriv.get( elem, "display" );
			}
			display = jQuery.css( elem, "display" );
			if ( display === "none" ) {
				if ( restoreDisplay ) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide( [ elem ], true );
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css( elem, "display" );
					showHide( [ elem ] );
				}
			}

			// Animate inline elements as inline-block
			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
				if ( jQuery.css( elem, "float" ) === "none" ) {

					// Restore the original display value at the end of pure show/hide animations
					if ( !propTween ) {
						anim.done( function() {
							style.display = restoreDisplay;
						} );
						if ( restoreDisplay == null ) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}

		// Implement show/hide animations
		propTween = false;
		for ( prop in orig ) {

			// General show/hide setup for this element animation
			if ( !propTween ) {
				if ( dataShow ) {
					if ( "hidden" in dataShow ) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
				}

				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if ( toggle ) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if ( hidden ) {
					showHide( [ elem ], true );
				}

				/* eslint-disable no-loop-func */

				anim.done( function() {

					/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if ( !hidden ) {
						showHide( [ elem ] );
					}
					dataPriv.remove( elem, "fxshow" );
					for ( prop in orig ) {
						jQuery.style( elem, prop, orig[ prop ] );
					}
				} );
			}

			// Per-property setup
			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = propTween.start;
				if ( hidden ) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( Array.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {

				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

					// Support: Android 2.3 only
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ] );

				// If there's more to do, yield
				if ( percent < 1 && length ) {
					return remaining;
				}

				// If this was an empty animation, synthesize a final progress notification
				if ( !length ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
				}

				// Resolve the animation and report its conclusion
				deferred.resolveWith( elem, [ animation ] );
				return false;
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						result.stop.bind( result );
				}
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		// Attach callbacks from options
		animation
			.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);

		return animation;
	}

	jQuery.Animation = jQuery.extend( Animation, {

		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},

		tweener: function( props, callback ) {
			if ( isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnothtmlwhite );
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},

		prefilters: [ defaultPrefilter ],

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !isFunction( easing ) && easing
		};

		// Go to the end state if fx are off
		if ( jQuery.fx.off ) {
			opt.duration = 0;

		} else {
			if ( typeof opt.duration !== "number" ) {
				if ( opt.duration in jQuery.fx.speeds ) {
					opt.duration = jQuery.fx.speeds[ opt.duration ];

				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};

			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue ) {
				this.queue( type || "fx", [] );
			}

			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {

						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );

	jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );

	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = Date.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];

			// Run the timer and safely remove it when done (allowing for external removal)
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		jQuery.fx.start();
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( inProgress ) {
			return;
		}

		inProgress = true;
		schedule();
	};

	jQuery.fx.stop = function() {
		inProgress = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};


	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );

	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}

			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}

				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				elem.setAttribute( name, value + "" );
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function( elem, value ) {
			var name,
				i = 0,

				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match( rnothtmlwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					elem.removeAttribute( name );
				}
			}
		}
	} );

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};

	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle,
				lowercaseName = name.toLowerCase();

			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ lowercaseName ];
				attrHandle[ lowercaseName ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					lowercaseName :
					null;
				attrHandle[ lowercaseName ] = handle;
			}
			return ret;
		};
	} );




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );

	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				return ( elem[ name ] = value );
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			return elem[ name ];
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );

					if ( tabindex ) {
						return parseInt( tabindex, 10 );
					}

					if (
						rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) &&
						elem.href
					) {
						return 0;
					}

					return -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );




		// Strip and collapse whitespace according to HTML spec
		// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
		function stripAndCollapse( value ) {
			var tokens = value.match( rnothtmlwhite ) || [];
			return tokens.join( " " );
		}


	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}

	function classesToArray( value ) {
		if ( Array.isArray( value ) ) {
			return value;
		}
		if ( typeof value === "string" ) {
			return value.match( rnothtmlwhite ) || [];
		}
		return [];
	}

	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			classes = classesToArray( value );

			if ( classes.length ) {
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}

			classes = classesToArray( value );

			if ( classes.length ) {
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {

							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value,
				isValidValue = type === "string" || Array.isArray( value );

			if ( typeof stateVal === "boolean" && isValidValue ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}

			return this.each( function() {
				var className, i, self, classNames;

				if ( isValidValue ) {

					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = classesToArray( value );

					while ( ( className = classNames[ i++ ] ) ) {

						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {

						// Store className if set
						dataPriv.set( this, "__className__", className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
								"" :
								dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},

		hasClass: function( selector ) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
				}
			}

			return false;
		}
	} );




	var rreturn = /\r/g;

	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, valueIsFunction,
				elem = this[ 0 ];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					// Handle most common string cases
					if ( typeof ret === "string" ) {
						return ret.replace( rreturn, "" );
					}

					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}

				return;
			}

			valueIsFunction = isFunction( value );

			return this.each( function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( valueIsFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( Array.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );

	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {

					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :

						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option, i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;

					if ( index < 0 ) {
						i = max;

					} else {
						i = one ? index : 0;
					}

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&

								// Don't return options that are disabled or in a disabled optgroup
								!option.disabled &&
								( !option.parentNode.disabled ||
									!nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];

						/* eslint-disable no-cond-assign */

						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );

	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( Array.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );




	// Return jQuery for attributes-only inclusion


	support.focusin = "onfocusin" in window;


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		stopPropagationCallback = function( e ) {
			e.stopPropagation();
		};

	jQuery.extend( jQuery.event, {

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

			cur = lastElement = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "." ) > -1 ) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
				lastElement = cur;
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;

						if ( event.isPropagationStopped() ) {
							lastElement.addEventListener( type, stopPropagationCallback );
						}

						elem[ type ]();

						if ( event.isPropagationStopped() ) {
							lastElement.removeEventListener( type, stopPropagationCallback );
						}

						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);

			jQuery.event.trigger( e, null, elem );
		}

	} );

	jQuery.fn.extend( {

		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );


	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};

			jQuery.event.special[ fix ] = {
				setup: function() {

					// Handle: regular nodes (via `this.ownerDocument`), window
					// (via `this.document`) & document (via `this`).
					var doc = this.ownerDocument || this.document || this,
						attaches = dataPriv.access( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this.document || this,
						attaches = dataPriv.access( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );

					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;

	var nonce = { guid: Date.now() };

	var rquery = ( /\?/ );



	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, parserErrorElem;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {}

		parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
		if ( !xml || parserErrorElem ) {
			jQuery.error( "Invalid XML: " + (
				parserErrorElem ?
					jQuery.map( parserErrorElem.childNodes, function( el ) {
						return el.textContent;
					} ).join( "\n" ) :
					data
			) );
		}
		return xml;
	};


	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( Array.isArray( obj ) ) {

			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {

					// Treat each array item as a scalar.
					add( prefix, v );

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );

		} else if ( !traditional && toType( obj ) === "object" ) {

			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {

			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, valueOrFunction ) {

				// If value is a function, invoke it and use its return value
				var value = isFunction( valueOrFunction ) ?
					valueOrFunction() :
					valueOrFunction;

				s[ s.length ] = encodeURIComponent( key ) + "=" +
					encodeURIComponent( value == null ? "" : value );
			};

		if ( a == null ) {
			return "";
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" );
	};

	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} ).filter( function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} ).map( function( _i, elem ) {
				var val = jQuery( this ).val();

				if ( val == null ) {
					return null;
				}

				if ( Array.isArray( val ) ) {
					return jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} );
				}

				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );


	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );

	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

			if ( isFunction( func ) ) {

				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {

			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {

									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend( {

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// Request state (becomes false upon send and true upon completion)
				completed,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// uncached part of the url
				uncached,

				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( completed ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
										( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
											.concat( match[ 2 ] );
								}
							}
							match = responseHeaders[ key.toLowerCase() + " " ];
						}
						return match == null ? null : match.join( ", " );
					},

					// Raw string
					getAllResponseHeaders: function() {
						return completed ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( completed == null ) {
							name = requestHeadersNames[ name.toLowerCase() ] =
								requestHeadersNames[ name.toLowerCase() ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( completed == null ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( completed ) {

								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							} else {

								// Lazy-add the new callbacks in a way that preserves old ones
								for ( code in map ) {
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR );

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" )
				.replace( rprotocol, location.protocol + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );

				// Support: IE <=8 - 11, Edge 12 - 15
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( completed ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace( rhash, "" );

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// Remember the hash so we can put it back
				uncached = s.url.slice( cacheURL.length );

				// If data is available and should be processed, append data to url
				if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add or update anti-cache param if needed
				if ( s.cache === false ) {
					cacheURL = cacheURL.replace( rantiCache, "$1" );
					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
						uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

			// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if ( s.data && s.processData &&
				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
				s.data = s.data.replace( r20, "+" );
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add( s.complete );
			jqXHR.done( s.success );
			jqXHR.fail( s.error );

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( completed ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					completed = false;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Rethrow post-completion exceptions
					if ( completed ) {
						throw e;
					}

					// Propagate others as results
					done( -1, e );
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Ignore repeat invocations
				if ( completed ) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Use a noop converter for missing script but not if jsonp
				if ( !isSuccess &&
					jQuery.inArray( "script", s.dataTypes ) > -1 &&
					jQuery.inArray( "json", s.dataTypes ) < 0 ) {
					s.converters[ "text script" ] = function() {};
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );

	jQuery.each( [ "get", "post" ], function( _i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {

			// Shift arguments if data argument was omitted
			if ( isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );

	jQuery.ajaxPrefilter( function( s ) {
		var i;
		for ( i in s.headers ) {
			if ( i.toLowerCase() === "content-type" ) {
				s.contentType = s.headers[ i ] || "";
			}
		}
	} );


	jQuery._evalUrl = function( url, options, doc ) {
		return jQuery.ajax( {
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,

			// Only evaluate the response if it is successful (gh-4126)
			// dataFilter is not invoked for failure responses, so using it instead
			// of the default converter is kludgy but it works.
			converters: {
				"text script": function() {}
			},
			dataFilter: function( response ) {
				jQuery.globalEval( response, options, doc );
			}
		} );
	};


	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;

			if ( this[ 0 ] ) {
				if ( isFunction( html ) ) {
					html = html.call( this[ 0 ] );
				}

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map( function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				} ).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}

			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			} );
		},

		wrap: function( html ) {
			var htmlIsFunction = isFunction( html );

			return this.each( function( i ) {
				jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
			} );
		},

		unwrap: function( selector ) {
			this.parent( selector ).not( "body" ).each( function() {
				jQuery( this ).replaceWith( this.childNodes );
			} );
			return this;
		}
	} );


	jQuery.expr.pseudos.hidden = function( elem ) {
		return !jQuery.expr.pseudos.visible( elem );
	};
	jQuery.expr.pseudos.visible = function( elem ) {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
	};




	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};

	var xhrSuccessStatus = {

			// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE <=9 only
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.ontimeout =
										xhr.onreadystatechange = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(

											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,

										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {

							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}

					// Create the abort callback
					callback = callback( "abort" );

					try {

						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter( function( s ) {
		if ( s.crossDomain ) {
			s.contents.script = false;
		}
	} );

	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {

		// This transport only deals with cross domain or forced-by-attrs requests
		if ( s.crossDomain || s.scriptAttrs ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" )
						.attr( s.scriptAttrs || {} )
						.prop( { charset: s.scriptCharset, src: s.url } )
						.on( "load error", callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						} );

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// Force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always( function() {

				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );

				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}

				// Save back as free
				if ( s[ callbackName ] ) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			} );

			// Delegate to script
			return "script";
		}
	} );




	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();


	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( typeof data !== "string" ) {
			return [];
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if ( !context ) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if ( support.createHTMLDocument ) {
				context = document.implementation.createHTMLDocument( "" );

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement( "base" );
				base.href = document.location.href;
				context.head.appendChild( base );
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec( data );
		scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}

		parsed = buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = stripAndCollapse( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};




	jQuery.expr.pseudos.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};




	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( isFunction( options ) ) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend( {

		// offset() relates an element's border box to the document origin
		offset: function( options ) {

			// Preserve chaining for setter
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}

			var rect, win,
				elem = this[ 0 ];

			if ( !elem ) {
				return;
			}

			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if ( !elem.getClientRects().length ) {
				return { top: 0, left: 0 };
			}

			// Get document-relative position by adding viewport scroll to viewport-relative gBCR
			rect = elem.getBoundingClientRect();
			win = elem.ownerDocument.defaultView;
			return {
				top: rect.top + win.pageYOffset,
				left: rect.left + win.pageXOffset
			};
		},

		// position() relates an element's margin box to its offset parent's padding box
		// This corresponds to the behavior of CSS absolute positioning
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset, doc,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// position:fixed elements are offset from the viewport, which itself always has zero offset
			if ( jQuery.css( elem, "position" ) === "fixed" ) {

				// Assume position:fixed implies availability of getBoundingClientRect
				offset = elem.getBoundingClientRect();

			} else {
				offset = this.offset();

				// Account for the *real* offset parent, which can be the document or its root element
				// when a statically positioned element is identified
				doc = elem.ownerDocument;
				offsetParent = elem.offsetParent || doc.documentElement;
				while ( offsetParent &&
					( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
					jQuery.css( offsetParent, "position" ) === "static" ) {

					offsetParent = offsetParent.parentNode;
				}
				if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

					// Incorporate borders into its offset, since they are outside its content origin
					parentOffset = jQuery( offsetParent ).offset();
					parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
					parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
				}
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;

				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			} );
		}
	} );

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {

				// Coalesce documents and windows
				var win;
				if ( isWindow( elem ) ) {
					win = elem;
				} else if ( elem.nodeType === 9 ) {
					win = elem.defaultView;
				}

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( _i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( {
			padding: "inner" + name,
			content: type,
			"": "outer" + name
		}, function( defaultExtra, funcName ) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( isWindow( elem ) ) {

						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf( "outer" ) === 0 ?
							elem[ "inner" + name ] :
							elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable );
			};
		} );
	} );


	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( _i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );




	jQuery.fn.extend( {

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		},

		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );

	jQuery.each(
		( "blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
		function( _i, name ) {

			// Handle event binding
			jQuery.fn[ name ] = function( data, fn ) {
				return arguments.length > 0 ?
					this.on( name, null, data, fn ) :
					this.trigger( name );
			};
		}
	);




	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

	// Bind a function to a context, optionally partially applying any
	// arguments.
	// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
	// However, it is not slated for removal any time soon
	jQuery.proxy = function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	};

	jQuery.holdReady = function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	};
	jQuery.isArray = Array.isArray;
	jQuery.parseJSON = JSON.parse;
	jQuery.nodeName = nodeName;
	jQuery.isFunction = isFunction;
	jQuery.isWindow = isWindow;
	jQuery.camelCase = camelCase;
	jQuery.type = toType;

	jQuery.now = Date.now;

	jQuery.isNumeric = function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	};

	jQuery.trim = function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	};




	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( typeof noGlobal === "undefined" ) {
		window.jQuery = window.$ = jQuery;
	}




	return jQuery;
	} );
	});

	console.log('============= CLOUD_GAME_SDK ====================');
	console.log(888888, AAC_MODULE);
	// ============================ SDK Init ======================================
	var Module = AAC_MODULE.Module;
	Module.onRuntimeInitialized = function () {
	    console.log("Wasm 加载成功!");
	    SDK_CONFIG.isFinish = true;
	};
	var CLOUD_GAME_SDK = {
	    version: '1.0.0',
	    // 配置信息
	    sdkInit: function (options) {
	        SDK_CONFIG.myVideo = document.getElementById(options.videoNode);
	        SDK_CONFIG.myContainer = document.getElementById(options.containerNode);
	        console.log('==== SDK Init ========', options);
	        var html = document.querySelector("html");
	        if (html) {
	            var clientWidth = html.getBoundingClientRect().width;
	            html.style.fontSize = clientWidth / 23.4375 + "px";
	        }
	        var clientheight = window.screen.height;
	        var clientwidth = window.screen.width;
	        SDK_CONFIG.myVideo.setAttribute('width', clientheight);
	        SDK_CONFIG.myVideo.setAttribute('height', clientwidth);
	        // ========================== ★★★★★ VIP Start =========================================
	        var deviceType = judgeDeviceType();
	        console.log('deviceType: ', deviceType);
	        // deviceType.type: 0 - 安卓， 1 - IOS， 2 - 其他
	        if (deviceType.type === 1) {
	            // ios软解码
	            SDK_CONFIG.webglPlayer = new WebGLPlayer(SDK_CONFIG.myVideo, {
	                preserveDrawingBuffer: false
	            });
	        }
	        else {
	            // mse 解码
	            SDK_CONFIG.jmuxer = new JMuxer(SDK_CONFIG.JMuxerOptions);
	        }
	        // ========================== ★★★★★ VIP Ended =========================================
	        SDK_CONFIG.aacPlayer = new PCMPlayer({
	            encoding: '16bitInt',
	            channels: 2,
	            sampleRate: 44100,
	            flushingTime: 22,
	            debug: false
	        });
	    },
	    // 切换清晰度
	    switchSharpness: function (data) {
	        // 防出错
	        if (data >= 6 || data < 1) {
	            data = 3;
	        }
	        var buffer = makeSharpness(data);
	        SDK_CONFIG.ws && SDK_CONFIG.ws.send(buffer);
	    },
	    // 账号透传
	    setSdkToken: function (uid, token) {
	        var buffer = ExexuteSetAccountTransparent(uid, token);
	        SDK_CONFIG.controlWs.send(buffer);
	    },
	    // 调起支付页面
	    switchPay: function () { },
	    // 关闭推流
	    closeWs: function () {
	        SDK_CONFIG.ws.close();
	        SDK_CONFIG.disconnect = true;
	        SDK_CONFIG.ws.onclose = undefined;
	        SDK_CONFIG.ws = null;
	        SDK_CONFIG.controlWs = null;
	        clearInterval(SDK_CONFIG.outsetInterval);
	        clearInterval(SDK_CONFIG.pingTimer);
	        SDK_CONFIG.jmuxer.destroy();
	        SDK_CONFIG.jmuxer = null;
	        SDK_CONFIG.webglPlayer = null;
	        SDK_CONFIG.aacPlayer = null;
	        SDK_CONFIG.myVideo.pause();
	        console.log("关闭推流", SDK_CONFIG.ws.readyState);
	        // 云游戏推流关闭
	        bounceFun(NSUInteger.GameEventConnectBeClose);
	    },
	    // 开始试玩
	    playWs: function () {
	        // ========================== ★★★★★ VIP Start =========================================
	        var deviceType = judgeDeviceType();
	        if (deviceType.type === 1) {
	            // ios软解码
	            CLOUD_GAME_SDK.doConnectBySoft();
	        }
	        else {
	            // mse 解码
	            // 连接
	            CLOUD_GAME_SDK.doConnectByMSE();
	        }
	        // ========================== ★★★★★ VIP Ended =========================================
	    },
	    // 自定义设置卡信息
	    setCardInfo: function (options) {
	        SDK_CONFIG.socketURL = options.socketURL;
	        SDK_CONFIG.socketExtranetURL = options.socketExtranetURL;
	        SDK_CONFIG.token = options.token;
	        SDK_CONFIG.sn = options.sn;
	    },
	    // 开启倒计时
	    outTime: function () {
	        // 更新未进行操作的当前时间
	        SDK_CONFIG.newTime = new Date().getTime();
	        // console.log('打印最后一次操作的时间', newTime - oldTime, outTime)
	        // 判断是否超时不操作
	        if (SDK_CONFIG.newTime - SDK_CONFIG.oldTime > SDK_CONFIG.outTime) {
	            console.log("时间到，退出登录");
	            CLOUD_GAME_SDK.closeWs();
	        }
	    },
	    // 获取token 'appKey', 'id'
	    getSdkToken: function (appKey, id, baseUrl, delayTime) {
	        var httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : SDK_CONFIG.apiURL;
	        jquery.ajax({
	            url: httpsUrl + SDK_CONFIG.getSdkTokenURL,
	            data: JSON.stringify({ appKey: appKey, id: id }),
	            type: 'post',
	            dataType: 'json',
	            contentType: 'application/json;charset=UTF-8',
	            success: function (res) {
	                console.log('获取sdktoken', res);
	                if (res.code === 200) {
	                    CLOUD_GAME_SDK.lineup(res.data, id, baseUrl, delayTime);
	                }
	                else {
	                    bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError);
	                }
	            },
	            error: function (res) {
	                bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError404);
	            }
	        });
	    },
	    // 排队拿卡
	    lineup: function (token, id, baseUrl, delayTime) {
	        var httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : SDK_CONFIG.apiURL;
	        // 状态打点
	        bounceFun(NSUInteger.GameEventInterfaceGetGameLineupMsg);
	        var dataType = {
	            token: token,
	            id: id,
	            'deviceIdentify': '82be044ad7f8839ffb6ba8a2e8da9b98',
	            'starPhoneNumber': 15250186738,
	            'useType': 0,
	        };
	        jquery.ajax({
	            url: httpsUrl + SDK_CONFIG.lineUpURL,
	            data: dataType,
	            type: 'get',
	            dataType: 'json',
	            success: function (res) {
	                console.log('获取拿卡信息', res);
	                if (res.code === 200) {
	                    var resData = res.data;
	                    if (resData.remainingTime) {
	                        extraData.remainingTimeData = resData;
	                        Object.assign({}, CARD_INFO, {
	                            appId: "",
	                            cardId: -1,
	                            cardToken: "",
	                            extranetIp: "",
	                            extranetPort: -1,
	                            id: -1,
	                            internetHttp: "",
	                            internetHttps: "",
	                            intranetIp: "",
	                            noRestart: "",
	                            resourceId: -1,
	                            sn: "",
	                            socketExtranetPort: -1,
	                            userCardId: "",
	                            userTime: 0,
	                            version: "",
	                        });
	                        // delayTime不存在或者为0时，默认5秒轮询
	                        // delayTime < 0 时，默认不轮询
	                        // delayTime > 0 时，以 delayTime 为间隔进行轮询
	                        if (!SDK_CONFIG.queueGetCard && (!delayTime || delayTime > 0)) {
	                            SDK_CONFIG.queueGetCard = setInterval(function () {
	                                CLOUD_GAME_SDK.lineup(token, id, baseUrl, delayTime);
	                            }, delayTime || SDK_CONFIG.lineupTime);
	                        }
	                    }
	                    else {
	                        extraData.remainingTimeData = undefined;
	                        clearInterval(SDK_CONFIG.queueGetCard);
	                        SDK_CONFIG.queueGetCard = null;
	                        // 拿到安卓卡
	                        bounceFun(NSUInteger.GameEventGetCardOkMsg);
	                        SDK_CONFIG.socketURL = 'ws://' + resData.extranetIp + ':' + resData.extranetPort;
	                        SDK_CONFIG.socketExtranetURL = 'ws://' + resData.extranetIp + ':' + resData.socketExtranetPort + "?token=".concat(resData.cardToken, "&type=business");
	                        SDK_CONFIG.sn = resData.sn;
	                        SDK_CONFIG.token = resData.cardToken;
	                        for (var key in resData) {
	                            CARD_INFO[key] = resData[key];
	                        }
	                    }
	                }
	                else {
	                    // 排队接口返回错误
	                    bounceFun(NSUInteger.GameEventInterfaceGetGameLineupError);
	                }
	            },
	            error: function (err) {
	                // 排队接口接口失败
	                bounceFun(NSUInteger.GameEventInterfaceGetGameLineupError404);
	            }
	        });
	    },
	    otherInit: function () {
	        // //限制鼠标右键
	        // var lastTouchEnd = 0;
	        // document.documentElement.addEventListener('touchend', function(event) {
	        // 	var now = Date.now();
	        // 	if (now - lastTouchEnd <= 300) {
	        // 		event.preventDefault();
	        // 	}
	        // 	lastTouchEnd = now;
	        // }, false);
	    },
	    visibilityCallBack: function () {
	        if (document.visibilityState == 'visible') {
	            SDK_CONFIG.isEntered = true;
	        }
	        else {
	            SDK_CONFIG.isEntered = false;
	        }
	    },
	    doConnectBySoft: function () {
	        SOFT_SDK_CONFIG.decodeWoker = new Worker('./dep/soft_decoder.js');
	        SOFT_SDK_CONFIG.decodeWoker.addEventListener('message', function (event) {
	            var objData = event.data || {};
	            switch (objData.cmd) {
	                case 0:
	                    console.log(objData.data);
	                    break;
	                case 1:
	                    if (SDK_CONFIG.videoWidth != objData.width || SDK_CONFIG.videoHeight != objData.height) {
	                        // alert("分辨率变为: " + objData.width + " X "  + objData.height);
	                        SDK_CONFIG.videoWidth = objData.width;
	                        SDK_CONFIG.videoHeight = objData.height;
	                    }
	                    SDK_CONFIG.webglPlayer.renderFrame(objData.data, SDK_CONFIG.videoWidth, SDK_CONFIG.videoHeight, SDK_CONFIG.videoWidth * SDK_CONFIG.videoHeight, (SDK_CONFIG.videoWidth / 2) * (SDK_CONFIG.videoHeight / 2));
	                    break;
	                case 5:
	                    var buffer = RequestIFrame(SDK_CONFIG.sn);
	                    SOFT_SDK_CONFIG.webSocketWorker.postMessage(buffer);
	            }
	        });
	        console.log(58888, SOFT_SDK_CONFIG.decodeWoker, '===============');
	    },
	    doConnectByMSE: function () {
	        if (SDK_CONFIG.jmuxer != undefined)
	            SDK_CONFIG.jmuxer.destroy();
	        SDK_CONFIG.jmuxer = new JMuxer(SDK_CONFIG.JMuxerOptions);
	        SDK_CONFIG.isWaitSps = true;
	        SDK_CONFIG.myVideo.play();
	        // 鼠标点击重置停留的时间
	        SDK_CONFIG.oldTime = new Date().getTime();
	        if (undefined != SDK_CONFIG.ws) {
	            console.log('websocket已经有连接了');
	            return;
	        }
	        console.log('执行doconnect', SDK_CONFIG.ws);
	        SDK_CONFIG.ws = new WebSocket(SDK_CONFIG.socketURL);
	        SDK_CONFIG.controlWs = new WebSocket(SDK_CONFIG.socketExtranetURL);
	        SDK_CONFIG.ws.binaryType = 'arraybuffer';
	        SDK_CONFIG.controlWs.binaryType = 'arraybuffer';
	        SDK_CONFIG.curTime = new Date().getTime();
	        var lastRequestTime = 0;
	        SDK_CONFIG.pingTimer = setInterval(function () {
	            // 加一个发送：处理 video 标签播放机制
	            var interval = new Date().getTime() - lastRequestTime;
	            if (interval >= 60 * 1000) {
	                lastRequestTime = new Date().getTime();
	                SDK_CONFIG.ws.send(RequestIFrame(SDK_CONFIG.sn));
	                console.log("60S 主动请求I帧");
	            }
	            if (SDK_CONFIG.ws.readyState === 1) {
	                SDK_CONFIG.ws.send('ping');
	            }
	        }, 2000);
	        // 音频流关闭时进行重连操作
	        SDK_CONFIG.ws.onclose = function (e) {
	            console.log('打印关闭信息', e);
	            if (e.currentTarget == SDK_CONFIG.ws) {
	                console.log('同一个ws, 发生断网, 应该重连');
	                CLOUD_GAME_SDK.doConnectByMSE();
	            }
	            else {
	                console.log('ws 已经发生改变, 已经被new 过了，不必处理');
	            }
	        };
	        // 指令流====================================
	        SDK_CONFIG.controlWs.addEventListener('open', function (event) {
	            if (Number(CARD_INFO.noRestart) !== 1) {
	                var buffer = ExexuteSetPhoneSize('1920', '1080');
	                var bufferSendBitRate = ExexuteSendBitRate('1');
	                var inputMethodBuffer = JSON.stringify({
	                    "type": "InputMethod",
	                    "data": {
	                        "type": 2 // 1即玩云键盘 2试玩讯飞键盘
	                    }
	                });
	                SDK_CONFIG.controlWs.send(inputMethodBuffer);
	                SDK_CONFIG.controlWs.send(bufferSendBitRate);
	                SDK_CONFIG.controlWs.send(buffer);
	                console.log("控制端口已经打开");
	                // 信令通道链接成功
	                bounceFun(NSUInteger.GameEventWebSocketOkMsg);
	            }
	        });
	        SDK_CONFIG.controlWs.addEventListener('message', function (event) {
	            var controlData = JSON.parse(event.data);
	            extraData.aiquData = controlData;
	            if (extraData.aiquData.event === 'aiqu_game_invoke_pay') {
	                console.log(588, '支付被点击了');
	                // 云游戏支付透传
	                bounceFun(NSUInteger.GameEventWebSocketPay);
	            }
	        });
	        // 音频流====================================
	        SDK_CONFIG.ws.addEventListener('open', function (event) {
	            var verifyBuffer = VerifyCode(SDK_CONFIG.sn, SDK_CONFIG.token);
	            console.log("鉴权报文:" + PrintArry(verifyBuffer));
	            SDK_CONFIG.ws.send(verifyBuffer);
	            /* 定时器  判断每5秒是否长时间未进行页面操作 */
	            SDK_CONFIG.outsetInterval = setInterval(SDK_CONFIG.outTime, 5000);
	            // 安卓卡链接成功
	            bounceFun(NSUInteger.GameEventCardConnectOkMsg);
	        });
	        SDK_CONFIG.ws.addEventListener('error', function (event) {
	            console.log("连接失败");
	            // 云游戏重连失败
	            bounceFun(NSUInteger.GameEventReConnectFailMsg);
	        });
	        SDK_CONFIG.ws.addEventListener('message', function (event) {
	            // JAVA服务器转发	  
	            var data = CLOUD_GAME_SDK.ParseProto(event.data);
	            var input = new Uint8Array(event.data);
	            // 喂音频
	            if (data.audio != null) {
	                if (input[0] == 0xff) {
	                    if (!SDK_CONFIG.lastTime) {
	                        SDK_CONFIG.lastTime = new Date().getTime();
	                    }
	                    new Date().getTime() - SDK_CONFIG.lastTime;
	                    SDK_CONFIG.lastTime = new Date().getTime();
	                    SDK_CONFIG.aacQueue.push(input);
	                    if (SDK_CONFIG.aacQueue.length > 1) {
	                        document.visibilityState == 'visible' && CLOUD_GAME_SDK.decodeAAC(SDK_CONFIG.aacQueue.shift());
	                    }
	                }
	            }
	            if (data.frameType != undefined && data.frameType != 1 && data.frameType != 6) {
	                if (data.frameType == 7) {
	                    var info = spsParser(data.video);
	                    // 视频分辨率与当前的不一致时
	                    if (info && info.width != SDK_CONFIG.myVideo.videoWidth && info.height != SDK_CONFIG.myVideo.videoHeight) {
	                        if (SDK_CONFIG.myVideo.videoWidth > 0) {
	                            if (SDK_CONFIG.jmuxer != undefined)
	                                SDK_CONFIG.jmuxer.destroy();
	                            SDK_CONFIG.jmuxer = new JMuxer(SDK_CONFIG.JMuxerOptions);
	                        }
	                    }
	                }
	                // let cost = new Date().getTime() - curTime;
	            }
	            // console.log("data.frameType", data.frameType)
	            // 喂视频
	            if (data.video != null) {
	                if (data.frameType == 0x07 || data.frameType == 0x08 || data.frameType == 0x05) {
	                    console.log('等待I帧成功');
	                    SDK_CONFIG.isEntered = true;
	                }
	                if (SDK_CONFIG.isEntered) {
	                    SDK_CONFIG.jmuxer.feed(data);
	                }
	            }
	        });
	        // 推流后的默认配置
	        CLOUD_GAME_SDK.connectAfterInit();
	    },
	    // 推流后的默认配置
	    connectAfterInit: function () {
	        // SDK_CONFIG.flag = setInterval(function() {
	        // 	if (SDK_CONFIG.ws != undefined) {
	        // 		SDK_CONFIG.ws.send("ping");
	        // 	}
	        // }, 2000);
	        SDK_CONFIG.myVideo.onplay = function () {
	            SDK_CONFIG.myVideo.controls = false;
	        };
	        SDK_CONFIG.myVideo.oncontextmenu = function (event) {
	            var buffer = ExexuteKeyDown(4);
	            SDK_CONFIG.ws.send(buffer);
	        };
	        SDK_CONFIG.myVideo.addEventListener('resize', function (e) {
	            // document.querySelector('[data-content="resolution"]').textContent = [
	            // 	e.target.videoWidth,
	            // 	e.target.videoHeight
	            // ].join('x');
	        });
	        document.addEventListener("visibilitychange", CLOUD_GAME_SDK.visibilityCallBack);
	        SDK_CONFIG.myVideo.addEventListener('pause', function () {
	            //console.log("视频播放暂停");
	            SDK_CONFIG.isFeed = false;
	        });
	        document.onkeydown = function (event) {
	            // console.log('===========我打开键盘了', event.keyCode)
	            var isMac = navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0;
	            var keyCode = -1;
	            if ((event.ctrlKey || (isMac && event.composed)) &&
	                event.keyCode == 67) {
	                // console.log('Ctrl + C')
	                keyCode = 278;
	            }
	            else if ((event.ctrlKey || (isMac && event.composed)) &&
	                event.keyCode == 86) {
	                // console.log('Ctrl + V')
	                // keyCode = 279
	                return;
	            }
	            else if ((event.ctrlKey || (isMac && event.composed)) &&
	                event.keyCode == 88) {
	                // console.log('Ctrl + X')
	                keyCode = 277;
	            }
	            else if (event.shiftKey && event.keyCode == 56) {
	                keyCode = 17; //*
	            }
	            else if (event.shiftKey && event.keyCode == 51) {
	                keyCode = 18; //#
	            }
	            else if (event.shiftKey && event.keyCode == 32) {
	                keyCode = 59; // shift + Space
	            }
	            else if (event.shiftKey && event.keyCode == 50) {
	                keyCode = 77; // @
	            }
	            else if (event.shiftKey && event.keyCode == 187) {
	                keyCode = 81; // +
	            }
	            else if (!event.ctrlKey ||
	                !event.shiftKey ||
	                !(isMac && event.composed)) {
	                keyCode = keycodeMode[event.keyCode];
	            }
	            if (keyCode !== -1) {
	                console.log('===========我打开键盘了', keyCode);
	                var buffer = ExexuteKeyDown(keyCode);
	                SDK_CONFIG.ws.send(buffer);
	                SDK_CONFIG.controlWs.send(buffer);
	            }
	        };
	        // SDK_CONFIG.myContainer.onkeydown = function(event) {
	        // 	// SDK_CONFIG.myVideo.controls = false;
	        // 	console.log('===========我打开键盘了')
	        // 	var buffer = ExexuteKeyDown(event.keyCode);
	        // 	SDK_CONFIG.ws.send(buffer);
	        // 	SDK_CONFIG.controlWs.send(buffer);
	        // }
	        SDK_CONFIG.myVideo.onkeydown = function (event) {
	            console.log('===========我打开键盘了');
	            ExexuteKeyDown(event.keyCode, SDK_CONFIG.sn);
	            // SDK_CONFIG.ws.send(buffer);
	            // SDK_CONFIG.controlWs.send(buffer);
	        };
	    },
	    touchClick: function (event, type) {
	        SDK_CONFIG.oldTime = new Date().getTime(); // 鼠标点击重置停留的时间
	        var canvasWidth = Number(window.innerWidth);
	        var canvasHeight = Number(window.innerHeight);
	        var onClickHandle = {
	            0: ExexuteMouseDown,
	            1: ExexuteMouseUp,
	            2: ExexuteMouseMove
	        };
	        console.log(event, type, '588');
	        var touches = event.changedTouches;
	        var ongoingTouches = [];
	        for (var i = 0; i < touches.length; i++) {
	            var idx = ongoingTouches.findIndex(function (ele) {
	                return ele.identifier === touches[i].identifier;
	            });
	            // 横屏游戏
	            if (SDK_CONFIG.isLandscape) {
	                // 根据游戏的分辨率 设置
	                var posX = (SDK_CONFIG.videoHeight * 1.0 * touches[i].clientY) / canvasHeight;
	                var posY = (SDK_CONFIG.videoWidth * 1.0 * (canvasWidth - touches[i].clientX)) / canvasWidth;
	                // // 重力感应
	                // if (this.SDK_CONFIG.isLandscape) {
	                //   // 根据游戏的分辨率 设置
	                //   posX = (touches[i].clientX * window.videoHeight * 1.0) / this.cw
	                //   posY = (touches[i].clientY * window.videoWidth * 1.0) / this.ch
	                // }
	                var buffer = onClickHandle[type](posX.toFixed(2), posY.toFixed(2), 'RK3923C1201900139', ongoingTouches, touches[i].identifier);
	                SDK_CONFIG.controlWs.send(buffer);
	            }
	            else {
	                // 竖屏游戏
	                var touches_1 = event.changedTouches;
	                // 根据游戏的分辨率 设置
	                var posX = (touches_1[i].clientX * SDK_CONFIG.videoWidth * 1.0) / canvasWidth;
	                var posY = (touches_1[i].clientY * SDK_CONFIG.videoHeight * 1.0) / canvasHeight;
	                // // 重力感应
	                // if (this.SDK_CONFIG.isLandscape) {
	                //   // 根据游戏的分辨率 设置
	                //   posX = (touches.clientX * window.videoHeight * 1.0) / this.canvasWidth;
	                //   posY = (touches.clientY * window.videoWidth * 1.0) / this.canvasHeight;
	                // }
	                var buffer = onClickHandle[type](posX.toFixed(2), posY.toFixed(2), 'RK3923C1201900139', ongoingTouches, touches_1[i].identifier);
	                SDK_CONFIG.controlWs.send(buffer);
	            }
	            if (idx < 0) {
	                ongoingTouches.push(touches[i]);
	            }
	        }
	    },
	    doSomeConfig: function () {
	        SDK_CONFIG.ws.send(ConfigChannel(SDK_CONFIG.sn, "chaohang"));
	        var checkBuffer = GetScreenState();
	        SDK_CONFIG.ws.send(checkBuffer);
	    },
	    convertPosDefaultLandspace: function (x, y) {
	        var posX, posY;
	        if (!SDK_CONFIG.isLandscape) ;
	        else {
	            posX = (x * SDK_CONFIG.videoWidth * 1.0) / SDK_CONFIG.myVideo.clientWidth;
	            posY = (y * SDK_CONFIG.videoHeight * 1.0) / SDK_CONFIG.myVideo.clientHeight;
	        }
	        return {
	            x: posX,
	            y: posY
	        };
	    },
	    convertPos: function (x, y) {
	        var posX, posY; //500, 800
	        // 如果是横屏
	        if (SDK_CONFIG.isLandscape) {
	            posX = (x / SDK_CONFIG.myVideo.clientWidth) * SDK_CONFIG.videoWidth * 1.0;
	            posY = (y / SDK_CONFIG.myVideo.clientHeight) * SDK_CONFIG.videoHeight * 1.0;
	        }
	        else {
	            posX = (1 - y / SDK_CONFIG.myVideo.clientHeight) * SDK_CONFIG.videoHeight * 1.0;
	            posY = (x / SDK_CONFIG.myVideo.clientWidth) * SDK_CONFIG.videoWidth * 1.0;
	        }
	        return {
	            x: posX,
	            y: posY
	        };
	    },
	    createNewDecoder: function () {
	        if (SDK_CONFIG.jmuxer != undefined)
	            SDK_CONFIG.jmuxer.destroy();
	        SDK_CONFIG.jmuxer = new JMuxer(SDK_CONFIG.JMuxerOptions);
	        SDK_CONFIG.myVideo.play();
	        SDK_CONFIG.isWaitSps = true;
	    },
	    ParseProto: function (data) {
	        var input = new Uint8Array(data), duration, video, frameType, audio;
	        if (input[0] == 0 && input[1] == 0 && input[2] == 0 && input[3] == 1) {
	            video = input;
	            duration = 16;
	            var nalType = input[4] & 0x1f; // nalType == 0x07|| nalType == 0x08 || nalType == 0x05
	            frameType = nalType;
	        }
	        else if (input[0] == 0xff) {
	            audio = input;
	        }
	        else if (input[0] == 0x68) {
	            // 多端登录处理, 数据从索引24开始取, input 是接收到的原始数据
	            if (input[23] == 0x0B) {
	                checkMultiLoginInfo(input);
	            }
	            if (input[23] == 0x5c) {
	                console.log("收到消息:" + PrintArry(input));
	                if (CheckVerifyCode(input)) {
	                    console.log("鉴权通过，配置通道");
	                    CLOUD_GAME_SDK.doSomeConfig();
	                }
	                else {
	                    console.log("鉴权失败:" + PrintArry(input));
	                    bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError);
	                }
	            }
	            // 横竖屏标识
	            if (input[23] == 0x05) {
	                // 0101 横竖屏相关
	                if (input[28] == 0x01 && input[29] == 0x01) {
	                    var state = CheckScreenDirection(input.slice(24, 24 + 8));
	                    if (state == 1) {
	                        console.log("安卓卡此时竖屏");
	                        // 竖屏处理
	                        SDK_CONFIG.isLandscape = false;
	                    }
	                    else {
	                        console.log("安卓卡此时横屏");
	                        // 横屏处理
	                        SDK_CONFIG.isLandscape = true;
	                    }
	                }
	            }
	        }
	        return {
	            audio: audio,
	            video: video,
	            duration: duration,
	            frameType: frameType
	        };
	    },
	    todo: function () {
	    },
	    decodeAAC: function (data) {
	        var retPtr = Module._malloc(4 * 5 * 1024); //接收的数据
	        var inputPtr = Module._malloc(4 * data.length); //输入数据
	        for (var i = 0; i < data.length; i++) {
	            Module.HEAPU8[(inputPtr) + i] = data[i]; //转换为堆数据
	        }
	        var pcmLen = Module._feedData(retPtr, inputPtr, data.length);
	        if (pcmLen >= 0) {
	            var pcmData = new Uint8Array(pcmLen);
	            for (var i = 0; i < pcmLen; i++) {
	                pcmData[i] = Module.HEAPU8[(retPtr) + i];
	            }
	            if (pcmData.length) {
	                SDK_CONFIG.aacPlayer.feed(pcmData);
	            }
	        }
	        else {
	            console.log("%d帧 aac 解码失败, %d", SDK_CONFIG.decodeCount, pcmLen);
	        }
	        SDK_CONFIG.decodeCount++;
	        Module._free(inputPtr);
	        Module._free(retPtr);
	    },
	    // todo
	};
	// Test
	// export const Sum = (a: number, b: number) => {
	//     return a + b
	// }

	exports.CARD_INFO = CARD_INFO;
	exports.CLOUD_GAME_SDK = CLOUD_GAME_SDK;
	exports.NSUInteger = NSUInteger;
	exports.SDK_CONFIG = SDK_CONFIG;
	exports.SOFT_SDK_CONFIG = SOFT_SDK_CONFIG;
	exports.bounceFun = bounceFun;
	exports.extraData = extraData;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
