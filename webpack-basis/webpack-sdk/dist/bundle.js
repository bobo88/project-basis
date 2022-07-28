/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 238:
/***/ (() => {

 const keycodeMode = {
  48: 7, // 键盘->安卓: 0
  49: 8, // 键盘->安卓: 1
  50: 9, // 键盘->安卓: 2
  51: 10, // 键盘->安卓: 3
  52: 11, // 键盘->安卓: 4
  53: 12, // 键盘->安卓: 5
  54: 13, // 键盘->安卓: 6
  55: 14, // 键盘->安卓: 7
  56: 15, // 键盘->安卓: 8
  57: 16, // 键盘->安卓: 9
  96: 7, // 键盘->安卓: 0
  97: 8, // 键盘->安卓: 1
  98: 9, // 键盘->安卓: 2
  99: 10, // 键盘->安卓: 3
  100: 11, // 键盘->安卓: 4
  101: 12, // 键盘->安卓: 5
  102: 13, // 键盘->安卓: 6
  103: 14, // 键盘->安卓: 7
  104: 15, // 键盘->安卓: 8
  105: 16, // 键盘->安卓: 9
  65: 29, // 键盘->安卓: a
  66: 30, // 键盘->安卓: b
  67: 31, // 键盘->安卓: c
  68: 32, // 键盘->安卓: d
  69: 33, // 键盘->安卓: e
  70: 34, // 键盘->安卓: f
  71: 35, // 键盘->安卓: g
  72: 36, // 键盘->安卓: h
  73: 37, // 键盘->安卓: i
  74: 38, // 键盘->安卓: j
  75: 39, // 键盘->安卓: k
  76: 40, // 键盘->安卓: l
  77: 41, // 键盘->安卓: m
  78: 42, // 键盘->安卓: n
  79: 43, // 键盘->安卓: o
  80: 44, // 键盘->安卓: p
  81: 45, // 键盘->安卓: q
  82: 46, // 键盘->安卓: r
  83: 47, // 键盘->安卓: s
  84: 48, // 键盘->安卓: t
  85: 49, // 键盘->安卓: u
  86: 50, // 键盘->安卓: v
  87: 51, // 键盘->安卓: w
  88: 52, // 键盘->安卓: x
  89: 53, // 键盘->安卓: y
  90: 54, // 键盘->安卓: z
  13: 66, // 键盘->安卓: 回车
  27: 111, // 键盘->安卓: esc
  38: 19, // 键盘->安卓: 导航向上
  40: 20, // 键盘->安卓: 导航向下
  37: 21, // 键盘->安卓: 导航向左
  39: 22, // 键盘->安卓: 导航向右
  36: 122, // 键盘->安卓: Move Home 光标移动到开始
  35: 123, // 键盘->安卓: Move End 光标移动到末尾
  8: 67, // 键盘->安卓: 退格
  46: 112, // 键盘->安卓: 删除
  45: 124, // 键盘->安卓: 插入
  9: 61, // 键盘->安卓: tab
  144: 143, // 键盘->安卓: 小键盘锁 Num Lock
  20: 115, // 键盘->安卓: 大写锁定键
  19: 121, // 键盘->安卓: break/pause
  145: 116, // 键盘->安卓: 滚动锁定键 scroll lock
  33: 92, // 键盘->安卓: 向上翻页
  34: 93, // 键盘->安卓: 向下翻页
  188: 55, // 键盘->安卓: ,
  190: 56, // 键盘->安卓: .
  110: 56, // 键盘->安卓: .
  32: 62, // 键盘->安卓: 空格
  192: 68, // 键盘->安卓: `/~
  189: 69, // 键盘->安卓:  -
  187: 70, // 键盘->安卓:  =
  219: 71, // 键盘->安卓:  [
  221: 72, // 键盘->安卓:  ]
  220: 73, // 键盘->安卓:  \
  186: 74, // 键盘->安卓:  ;
  222: 75, // 键盘->安卓:  '
  191: 76, // 键盘->安卓:  /
  107: 81, // 键盘->安卓:  +
}


/***/ }),

/***/ 992:
/***/ (() => {

window.ws = undefined;
window.socket = []; //websocket对象数组
window.controlWs = undefined;
window.videoWidth = 1080;
window.videoHeight = 1920;
window.jmuxer;
window.isVisuable = true;
window.isFeed = true;
window.isDrag = false;
window.isFinish = false;
window.hasSwitch = false;
window.isWaitSps = false;


window.winHeight = window.screen.height - window.innerHeight;
window.vowidth = window.screen.width;
window.topwinHeightDraw = window.screen.height - window.innerHeight + 30; // 计算title top 头部
window.numse = window.screen.height;

// 计算title top 头部 连接断开，是否准备重连？
if (numse <= 70) {
	window.voheight = window.screen.height - winHeight - 34 - 20
} else {
	window.voheight = window.screen.height - topwinHeightDraw - 20
}

window.curTime = new Date().getTime();
window.requestTime = new Date().getTime(); //记录离开时间
window.myVideo = document.getElementById("player");
window.myContainer = document.getElementById("container");
window.h264Buffer = [];
window.isPay = false // 支付状态

window.oldTime = new Date().getTime();
window.newTime = new Date().getTime();
window.outTime = 10 * 60 * 1000; //设置超时时间： 10分钟
window.outsetInterval; //  // 倒计时十分钟
window.flag = '' // ping保持keeplive心跳
window.disconnect = false // 是否主动断开推流
window.clickPlay = 0

window.aiquData = '' //  代理返回值
//  return信息
window.aiquObj = {
	accountLoginStatus: '',
	accountPayStatus: ''
}

// 默认值声明
window.DEF_OBJ = {
	// 是否横屏
	isLandscape: false,
	// 清晰度
	sharpnessLevel: 2,
	socketURL: 'ws://14.18.190.138:41132',
	socketExtranetURL: 'ws://14.18.190.138:42132',
	// socketURL: 'ws://14.18.190.138:50161',
	// socketExtranetURL: 'ws://14.18.190.138:51161',
	sn: 'RK3923C1201900139',
	// token: 'mc/eDLc0WtK18xQky0nc/gXIMkaVWvNIhZrmMXqEkvhAljpyobEPnd/i0fxtUAMzxwRMsxogovAuUG+DkBya4g==',
	token: 'qwgvyPOxj0JMzCGKr41rkjwwKk8OrB5MiFDWVNp/jMiaKELA/bP2/HrJuq9zMx+QbycuU8RQANbFIfA5eqMaOQ==',
	JMuxerOptions: {
		node: 'playerVideo',
		flushingTime: 33,
		fps: 30,
		mode: 'video',
		debug: false
	},
	payURL: 'https://api-alipay.q1.com/app/wappay/api.php?gameid=2109&body=%e4%b8%ba%e9%80%9a%e8%a1%8c%e8%af%81%e8%b4%a6%e5%8f%b7bccs0321%e5%85%85%e5%85%a56.00%e5%85%83&out_trade_no=4109164800034510001&subject=%e6%b8%b8%e6%88%8f%e5%85%85%e5%80%bc-bc***21&total_amount=6.00&sign=f4475660b8ee8fe2ba1cb7dbe7eafd30',
};
window.NSUInteger = {
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
// 全局等待对象（包含remainingTime & schedule)
window.remainingTimeData = null;

// 全局等待对象（包含支付金额amount & orderId)
window.PayData = {

};

// 需要暴露出去的状态值
window.GameEventToOutSide = -1;
// 防抖函数 start -------------------------
function bounce(delay, cb) {
	var timer
	return function(value) {
		clearTimeout(timer)
		timer = setTimeout(function() {
			cb(value)
		}, delay)
	}
}

function fn(value) {
	console.log('### GameEventToOutSide 被设置为：  ', value)
	GameEventToOutSide = value
}
var bounceFun = bounce(300, fn);
// 防抖函数 end -------------------------

Module = {};
Module.onRuntimeInitialized = function() {
	console.log("Wasm 加载成功!")
	isFinish = true;
}
// Test: 切换清晰度
function switchSharpness(data) {
	console.log('切换码率')
	//防出错
	if (data >= 6 || data < 1) {
		data = 3;
	}

	var buffer = makeSharpness(data);
	ws.send(buffer);
	// createNewDecoder();
}


// Test: 账号透传
function setSdkToken(uid, token) {
	var buffer = ExexuteSetAccountTransparent(uid, token);
	controlWs.send(buffer);
}

// Test: 调起支付页面
function switchPay(uid, token) {
	$('#inlineFrameExample').attr('src', DEF_OBJ.payURL)
	$('#ifDiv').show()
}
// Test: 关闭推流
function closeWs() {
	ws.close()
	disconnect = true
	ws.onclose = undefined
	ws = null;
	controlWs = null;
	// clearInterval(flag)
	window.clearInterval(outsetInterval)
	$('#dialogPlay').show()
	jmuxer.destroy();
	console.log("关闭推流", ws.readyState);
	// 云游戏推流关闭
	bounceFun(NSUInteger.GameEventConnectBeClose);
}
// Test: 开始试玩
function playWs() {
	if (jmuxer != undefined)
		jmuxer.destroy();
	jmuxer = new JMuxer(DEF_OBJ.JMuxerOptions);
	isWaitSps = true;
	myVideo.play()
	$('#dialogPlay').hide()
	// clickPlay = clickPlay + 1
	// socket.push(clickPlay)
	oldTime = new Date().getTime(); // 鼠标点击重置停留的时间
	doConnect()
}

function setCardInfo (options) {
	window.DEF_OBJ.socketURL = options.socketURL;
	window.DEF_OBJ.socketExtranetURL = options.socketExtranetURL;
	window.DEF_OBJ.token = options.token;
}

// Test: 开启倒计时
function OutTime() {
	newTime = new Date().getTime(); //更新未进行操作的当前时间
	console.log('打印最后一次操作的时间', newTime - oldTime, outTime)
	if (newTime - oldTime > outTime) { //判断是否超时不操作
		console.log("时间到，退出登录");
		closeWs()
	}
}

//  获取token 'appKey', 'id'
function getSdkToken(appKey, id, baseUrl) {
	// lineup('2c020d589a53bc2f30c3ef4ae3188272')
	console.log("打印", baseUrl, typeof baseUrl != 'undefined' && baseUrl)
	const data = {
		"appKey": appKey,
		"id": id
	}
	const httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : 'http://14.18.190.140:9090'
	$.ajax({
		url: httpsUrl + "/api/blade-game/sdk/auth/token",
		data: JSON.stringify(data),
		type: 'post',
		dataType: 'json',
    	contentType:'application/json;charset=UTF-8',
		success: function(res) {
			console.log('获取sdktoken', res)
			if (res.code === 200) {
				lineup(res.data, id, baseUrl)
			} else {
				bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError);
			}
		},
		error: function(res) {
			bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError404);
		}
	})
	// return '42006c1bef7b2d66d4df4223319db8ca'

}
// 排队拿卡
function lineup(data, id, baseUrl) {
	const dataType = {
		'token': data,
		'deviceIdentify': '82be044ad7f8839ffb6ba8a2e8da9b98',
		'id': id,
		'starPhoneNumber': 15250186738,
		'useType': 0,
	}
	var data = {}
	const httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : 'http://14.18.190.140:9090'
	// 排队拿卡
	bounceFun(NSUInteger.GameEventInterfaceGetGameLineupMsg);
	$.ajax({
		url: httpsUrl + "/api/blade-game/sdk/lineup",
		data: dataType,
		type: 'get',
		dataType: 'json',
		success: function(res) {
			if (res.code === 200) {
				var resData = res.data;
				if (resData.remainingTime) {
					// 要等待 todo
					remainingTimeData = resData;
					// return resData
				} else {
					// resData.remainingTime === undefined
					// 拿到安卓卡
					bounceFun(NSUInteger.GameEventGetCardOkMsg);
					data = res.data
					DEF_OBJ.socketURL = 'ws://' + data.extranetIp + ':' + data.extranetPort
					DEF_OBJ.socketExtranetURL = 'ws://' + data.extranetIp + ':' + data.socketExtranetPort
					DEF_OBJ.sn = data.sn
					DEF_OBJ.token = data.cardToken
				}
			} else {
				// 排队接口返回错误
				bounceFun(NSUInteger.GameEventInterfaceGetGameLineupError);
			}
		},
		error: function(err) {
			// 排队接口接口失败
			bounceFun(NSUInteger.GameEventInterfaceGetGameLineupError404);
		}
	})
	// ===================================================================
}


function decodeAAC(data) {
	var retPtr = Module._malloc(4 * 5 * 1024); //接收的数据
	var inputPtr = Module._malloc(4 * data.length); //输入数据

	for (i = 0; i < data.length; i++) {
		Module.HEAPU8[(inputPtr) + i] = data[i]; //转换为堆数据
	}

	var pcmLen = Module._feedData(retPtr, inputPtr, data.length);

	if (pcmLen >= 0) {
		//console.log("%d帧 aac 解码成功, %d", decodeCount, pcmLen);
		var pcmData = new Uint8Array(pcmLen);
		for (i = 0; i < pcmLen; i++) {
			pcmData[i] = Module.HEAPU8[(retPtr) + i]
		}

		//pcmPlayer.feed(pcmData);
	} else {
		console.log("%d帧 aac 解码失败, %d", decodeCount, pcmLen);
	}

	decodeCount++;
	Module._free(inputPtr);
	Module._free(retPtr);
}

//限制鼠标右键
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function(event) {
	var now = Date.now();
	if (now - lastTouchEnd <= 300) {
		event.preventDefault();
	}
	lastTouchEnd = now;
}, false);



function visibilityCallBack() {
	if (document.visibilityState == "visible") {
		console.log("页面可见，请求I 帧继续播放");
		var buffer = RequestIFrame();
		ws.send(buffer);
		requestTime = new Date().getTime();
		isVisuable = true;
	} else {
		isVisuable = false;
		isFeed = false;
		myVideo.pause();
	}
}

function doSomeConfig() {
	ws.send(ConfigChannel(DEF_OBJ.sn, "chaohang"));
	var checkBuffer = GetScreenState();
	ws.send(checkBuffer);
}

function createNewDecoder() {
	if (jmuxer != undefined)
		jmuxer.destroy();
	jmuxer = new JMuxer(DEF_OBJ.JMuxerOptions);
	myVideo.play();
	isWaitSps = true;
}

function ParseProto(data) {
	var input = new Uint8Array(data),
		duration,
		video,
		frameType,
		audio;
	if (input[0] == 0 && input[1] == 0 && input[2] == 0 && input[3] == 1) {
		video = input;
		duration = 16;
		var nalType = input[4] & 0x1f; //nalType == 0x07|| nalType == 0x08 || nalType == 0x05
		frameType = nalType;
	} else if (input[0] == 0xff) {
		audio = input;
	} else if (input[0] == 0x68) {
		if (input[23] == 0x0B) //多端登录处理, 数据从索引24开始取, input 是接收到的原始数据
		{
			var jsonobj = checkMultiLoginInfo(input);
		}
		if (input[23] == 0x5c) {
			console.log("收到消息:" + PrintArry(input));
			if (CheckVerifyCode(input)) {
				console.log("鉴权通过，配置通道");
				doSomeConfig();
			} else {
				console.log("鉴权失败:" + PrintArry(input));
				bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError);
				//ws.close();
			}
			/*var obj = {msg:1, type: "test"}
			checkBuffer = makeMultiLogin(sn, obj);
			console.log("多端登录检测:" + PrintArry(checkBuffer));
			ws.send(checkBuffer);
			
			var obj = {msg:1, type: "test"}
			checkBuffer = makeStatistics(sn, obj);
			console.log("统计信息:" + PrintArry(checkBuffer));
			ws.send(checkBuffer);*/
		}

		if (input[23] == 0x05) //横竖屏标识
		{
			if (input[28] == 0x01 && input[29] == 0x01) //0101 横竖屏相关
			{
				var state = CheckScreenDirection(input.slice(24, 24 + 8));

				if (state == 1) {
					console.log("安卓卡此时竖屏");
					//竖屏处理
					DEF_OBJ.isLandscape = false;
				} else {
					console.log("安卓卡此时横屏");
					DEF_OBJ.isLandscape = true;
					//横屏处理
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
}

function doConnect() {
	if (undefined != ws) {
		alert("websocket已经有连接了");
		return;
	}
	console.log("执行doconnect", socket);
	ws = new WebSocket(DEF_OBJ.socketURL);
	controlWs = new WebSocket(DEF_OBJ.socketExtranetURL);
	ws.binaryType = 'arraybuffer';
	controlWs.binaryType = 'arraybuffer';
	curTime = new Date().getTime();

	// 音频流关闭时进行重连操作
	ws.onclose = function(e) {
		console.log('打印关闭信息', e)
		if (e.currentTarget == ws) {
			console.log("同一个ws，发生断网，应该重连");
			doConnect();
			$('#dialogPlay').hide()
		} else {
			console.log("ws 已经发生改变，已经被new 过了，不必处理");
		}
	}

	// 指令流====================================
	controlWs.addEventListener('open', function(event) {
		var buffer = ExexuteSetPhoneSize('1920', '1080');
		var bufferSendBitRate = ExexuteSendBitRate('1');
		var inputMethodBuffer = JSON.stringify({
			"type": "InputMethod",
			"data": {
				"type": 2 // 1即玩云键盘 2试玩讯飞键盘
			}
		});
		controlWs.send(inputMethodBuffer)
		controlWs.send(bufferSendBitRate);
		controlWs.send(buffer);
		console.log("控制端口已经打开");
		// 信令通道链接成功
		bounceFun(NSUInteger.GameEventWebSocketOkMsg);
	});
	controlWs.addEventListener('message', function(event) {
		const controlData = JSON.parse(event.data)
		PayData = controlData
		if (aiquData.event === 'aiqu_game_invoke_pay') {
			console.log(588, '支付被点击了')
			// 云游戏支付透传
			bounceFun(NSUInteger.GameEventWebSocketPay);
		}
		$('#consoleText').text(JSON.stringify(aiquData))
	});

	// 音频流====================================
	ws.addEventListener('open', function(event) {
		var verifyBuffer = VerifyCode(DEF_OBJ.sn, DEF_OBJ.token);
		console.log("鉴权报文:" + PrintArry(verifyBuffer));
		ws.send(verifyBuffer);
		// // disconnect = false
		/* 定时器  判断每5秒是否长时间未进行页面操作 */

		outsetInterval = setInterval(OutTime, 5000);
		// 安卓卡链接成功
		bounceFun(NSUInteger.GameEventCardConnectOkMsg);
	});
	ws.addEventListener('error', function(event) {
		console.log("连接失败");
		// 云游戏重连失败
		bounceFun(NSUInteger.GameEventReConnectFailMsg);
	});
	ws.addEventListener('message', function(event) {
		// $('#ifDiv').hide()
		// console.log("【音频流】-- 检测到宽 %d, 高 %d, 控件宽 %d, %d", myVideo.videoWidth, myVideo.videoHeight);
		var data = ParseProto(event.data); // JAVA服务器转发	  
		// console.log(666, data.frameType)
		// 喂音频
		if (data.audio != null) {
			//decodeAAC(data.audio);
		}

		if (data.frameType != undefined && data.frameType != 1 && data.frameType != 6) {
			if (data.frameType == 7) {
				let info = spsParser(data.video);
				// 视频分辨率与当前的不一致时
				if (info.width != myVideo.videoWidth && info.height != myVideo.videoHeight) {
					if (myVideo.videoWidth > 0) {
						//createNewDecoder();
						if (jmuxer != undefined)
							jmuxer.destroy();
						jmuxer = new JMuxer(DEF_OBJ.JMuxerOptions);
					}
				}
			}
			// console.log("帧类型 %d", data.frameType);
			let cost = new Date().getTime() - curTime;
			// console.log("ws 打开耗时:%d ms", cost);
		}
		console.log("data.frameType", data.frameType)
		// 喂视频
		if (data.video != null) {
			if (data.frameType == 0x05 && isVisuable) {
				isFeed = true;
			}
			if (data.frameType == 7 || data.frameType == 8) {
				isFeed = true;
				isWaitSps = false;
			}
			if (isFeed) {
				if (!isWaitSps) {
					console.log('-------------8888888888------------')
					jmuxer.feed(data);
				}
			} else {
				console.log("不喂视频:" + data.frameType);
			}
		}
	});

	// switchSharpness(3)
	// disconnect = false

	// 推流后的默认配置
	connectAfterInit();
}

function touchClick (event, type, isLandscape) {
	window.oldTime = new Date().getTime(); // 鼠标点击重置停留的时间
	var canvasWidth = String(window.innerWidth);
	var canvasHeight = String(window.innerHeight);
	const onClickHandle = {
		0: window.ExexuteMouseDown,
		1: window.ExexuteMouseUp,
		2: window.ExexuteMouseMove
	}
	console.log(event, type, '588')

	let touches = event.changedTouches
	var ongoingTouches = []
		
	for (var i = 0; i < touches.length; i++) {
		var idx = ongoingTouches.findIndex(function (ele) {
		return ele.identifier === touches[i].identifier
		})
		// 横屏游戏
		if (window.DEF_OBJ.isLandscape) {
			// 根据游戏的分辨率 设置
			let posX = (window.videoHeight * 1.0 * touches[i].clientY) / canvasHeight
			let posY = (window.videoWidth * 1.0 * (canvasWidth - touches[i].clientX)) / canvasWidth
			// // 重力感应
			// if (this.isLandscape) {
			//   // 根据游戏的分辨率 设置
			//   posX = (touches[i].clientX * window.videoHeight * 1.0) / this.cw
			//   posY = (touches[i].clientY * window.videoWidth * 1.0) / this.ch
			// }
			let buffer = onClickHandle[type](
				posX.toFixed(2),
				posY.toFixed(2),
				'RK3923C1201900139',
				ongoingTouches,
				touches[i].identifier
			)
			window.controlWs.send(buffer)
		} else {
		// 竖屏游戏
		let touches = event.changedTouches
		// 根据游戏的分辨率 设置
		let posX = (touches[i].clientX * window.videoWidth * 1.0) / canvasWidth
		let posY = (touches[i].clientY * window.videoHeight * 1.0) / canvasHeight
		// // 重力感应
		// if (this.isLandscape) {
		//   // 根据游戏的分辨率 设置
		//   posX = (touches.clientX * window.videoHeight * 1.0) / this.canvasWidth;
		//   posY = (touches.clientY * window.videoWidth * 1.0) / this.canvasHeight;
		// }
		let buffer = onClickHandle[type](
			posX.toFixed(2),
			posY.toFixed(2),
			'RK3923C1201900139',
			ongoingTouches,
			touches[i].identifier
		)
		window.controlWs.send(buffer)
		}
		if (idx < 0) {
		ongoingTouches.push(touches[i])
		}
	}
}

function connectAfterInit() {
	flag = setInterval(function() {
		if (ws != undefined) {
			ws.send("ping");
		}
	}, 2000);
	
	myVideo.onplay = function() {
		myVideo.controls = false;
	}
	
	myVideo.oncontextmenu = function(event) {
		var buffer = ExexuteKeyDown(4);
		ws.send(buffer);
		// event.returnValue = false;
	}
	
	myVideo.error = function(event) {
		console.log("报错:" + error);
	}
	
	function convertPos(x, y) {
		// console.log("横坐标",x)
		// console.log("纵坐标",y)
		var posX, posY; //500, 800
	
		if (DEF_OBJ.isLandscape) // 如果是横屏
		{
			posX = (x / myVideo.clientWidth) * videoWidth * 1.0
			posY = (y / myVideo.clientHeight) * videoHeight * 1.0
		} else {
			posX = (1 - y / myVideo.clientHeight) * videoHeight * 1.0
			posY = (x / myVideo.clientWidth) * videoWidth * 1.0
		}
		return {
			x: posX,
			y: posY
		};
	}
	
	window.myVideo.addEventListener('resize', (e) => {
		document.querySelector('[data-content="resolution"]').textContent = [
			e.target.videoWidth,
			e.target.videoHeight
		].join('x');
	});

	document.addEventListener("visibilitychange", visibilityCallBack);

	myVideo.addEventListener('pause', function() {
		//console.log("视频播放暂停");
		isFeed = false;
	});
	
	function convertPosDefaultLandspace() {
		if (!DEF_OBJ.isLandscape) {
			// xx
		} else {
			posX = (x * videoWidth * 1.0) / myVideo.clientWidth;
			posY = (y * videoHeight * 1.0) / myVideo.clientHeight;
		}
		return {
			x: posX,
			y: posY
		};
	}
	
	document.onkeydown = function(event) {
		console.log('===========我打开键盘了', event.keyCode)
		// var buffer = ExexuteKeyDown(event.keyCode);
		// ws.send(buffer);
		// controlWs.send(buffer);
		let isMac =
			navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0
	
		let keyCode = ''
		if (
			(event.ctrlKey || (isMac && event.composed)) &&
			event.keyCode == 67
		) {
			// console.log('Ctrl + C')
			keyCode = 278
		} else if (
			(event.ctrlKey || (isMac && event.composed)) &&
			event.keyCode == 86
		) {
			// console.log('Ctrl + V')
			// keyCode = 279
			return
		} else if (
			(event.ctrlKey || (isMac && event.composed)) &&
			event.keyCode == 88
		) {
			// console.log('Ctrl + X')
			keyCode = 277
		} else if (event.shiftKey && event.keyCode == 56) {
			keyCode = 17 //*
		} else if (event.shiftKey && event.keyCode == 51) {
			keyCode = 18 //#
		} else if (event.shiftKey && event.keyCode == 32) {
			keyCode = 59 // shift + Space
		} else if (event.shiftKey && event.keyCode == 50) {
			keyCode = 77 // @
		} else if (event.shiftKey && event.keyCode == 187) {
			keyCode = 81 // +
		} else if (
			!event.ctrlKey ||
			!event.shiftKey ||
			!(isMac && event.composed)
		) {
			keyCode = keycodeMode[event.keyCode]
		}
		if (keyCode) {
			var buffer = ExexuteKeyDown(keyCode)
			ws.send(buffer);
			controlWs.send(buffer);
		}
	};
	myContainer.onkeydown = function(event) {
		// myVideo.controls = false;
		console.log('===========我打开键盘了')
		var buffer = ExexuteKeyDown(event.keyCode);
		ws.send(buffer);
		controlWs.send(buffer);
	}
	myVideo.onkeydown = function(event) {
		// myVideo.controls = false;
		console.log('===========我打开键盘了')
		var buffer = ExexuteKeyDown(event.keyCode);
		ws.send(buffer);
		controlWs.send(buffer);
	}
}

function SdkInit (options) {
	window.myVideo = document.getElementById(options.videoNode);
	window.myContainer = document.getElementById(options.containerNode)

	console.log('==== SDK Init ========')
	var html = document.querySelector("html");
	var clientWidth = html.getBoundingClientRect().width;
	html.style.fontSize = clientWidth / 23.4375 + "px";
	
	const clientheight = window.screen.height;
	const clientwidth = window.screen.width;
	$('#' + options.videoNode).attr('width', clientheight);
	$('#' + options.videoNode).attr('height', clientwidth);
	window.jmuxer = new JMuxer(DEF_OBJ.JMuxerOptions);
}


/***/ }),

/***/ 207:
/***/ (function(module) {

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

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
            profileCompat,
            levelIdc,
            numRefFramesInPicOrderCntCycle,
            picWidthInMbsMinus1,
            picHeightInMapUnitsMinus1,
            frameMbsOnlyFlag,
            scalingListCount;
        decoder.readUByte();
        profileIdc = decoder.readUByte(); // profile_idc

        profileCompat = decoder.readBits(5); // constraint_set[0-4]_flag, u(5)

        decoder.skipBits(3); // reserved_zero_3bits u(3),

        levelIdc = decoder.readUByte(); // level_idc u(8)

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
            var unitsInTick = decoder.readUInt();
            var timeScale = decoder.readUInt();
            var fixedFrameRate = decoder.readBoolean();
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
        console.log(11111158, this.track, config.width, config.height)
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
                log("put segment (".concat(_type, "): ").concat(_track.seq, " dts: ").concat(_track.dts, " gop: ").concat(_track.mp4track.samples.length, " second: ").concat(duration));

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

})));


/***/ }),

/***/ 183:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){ true&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k="".trim,l={},m="1.11.0",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(n.isPlainObject(c)||(b=n.isArray(c)))?(b?(b=!1,f=a&&n.isArray(a)?a:[]):f=a&&n.isPlainObject(a)?a:{},g[d]=n.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray||function(a){return"array"===n.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return a-parseFloat(a)>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(l.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&n.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:k&&!k.call("\ufeff\xa0")?function(a){return null==a?"":k.call(a)}:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),n.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||n.guid++,e):void 0},now:function(){return+new Date},support:l}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s="sizzle"+-new Date,t=a.document,u=0,v=0,w=eb(),x=eb(),y=eb(),z=function(a,b){return a===b&&(j=!0),0},A="undefined",B=1<<31,C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=D.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",M=L.replace("w","w#"),N="\\["+K+"*("+L+")"+K+"*(?:([*^$|!~]?=)"+K+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+M+")|)|)"+K+"*\\]",O=":("+L+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+N.replace(3,8)+")*)|.*)\\)|)",P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(O),U=new RegExp("^"+M+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L.replace("w","w*")+")"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=/'|\\/g,ab=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),bb=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{G.apply(D=H.call(t.childNodes),t.childNodes),D[t.childNodes.length].nodeType}catch(cb){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function db(a,b,d,e){var f,g,h,i,j,m,p,q,u,v;if((b?b.ownerDocument||b:t)!==l&&k(b),b=b||l,d=d||[],!a||"string"!=typeof a)return d;if(1!==(i=b.nodeType)&&9!==i)return[];if(n&&!e){if(f=Z.exec(a))if(h=f[1]){if(9===i){if(g=b.getElementById(h),!g||!g.parentNode)return d;if(g.id===h)return d.push(g),d}else if(b.ownerDocument&&(g=b.ownerDocument.getElementById(h))&&r(b,g)&&g.id===h)return d.push(g),d}else{if(f[2])return G.apply(d,b.getElementsByTagName(a)),d;if((h=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(h)),d}if(c.qsa&&(!o||!o.test(a))){if(q=p=s,u=b,v=9===i&&a,1===i&&"object"!==b.nodeName.toLowerCase()){m=ob(a),(p=b.getAttribute("id"))?q=p.replace(_,"\\$&"):b.setAttribute("id",q),q="[id='"+q+"'] ",j=m.length;while(j--)m[j]=q+pb(m[j]);u=$.test(a)&&mb(b.parentNode)||b,v=m.join(",")}if(v)try{return G.apply(d,u.querySelectorAll(v)),d}catch(w){}finally{p||b.removeAttribute("id")}}}return xb(a.replace(P,"$1"),b,d,e)}function eb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function fb(a){return a[s]=!0,a}function gb(a){var b=l.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function hb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function ib(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||B)-(~a.sourceIndex||B);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function jb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function kb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function lb(a){return fb(function(b){return b=+b,fb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function mb(a){return a&&typeof a.getElementsByTagName!==A&&a}c=db.support={},f=db.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},k=db.setDocument=function(a){var b,e=a?a.ownerDocument||a:t,g=e.defaultView;return e!==l&&9===e.nodeType&&e.documentElement?(l=e,m=e.documentElement,n=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){k()},!1):g.attachEvent&&g.attachEvent("onunload",function(){k()})),c.attributes=gb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=gb(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(e.getElementsByClassName)&&gb(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=gb(function(a){return m.appendChild(a).id=s,!e.getElementsByName||!e.getElementsByName(s).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==A&&n){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){var c=typeof a.getAttributeNode!==A&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==A?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==A&&n?b.getElementsByClassName(a):void 0},p=[],o=[],(c.qsa=Y.test(e.querySelectorAll))&&(gb(function(a){a.innerHTML="<select t=''><option selected=''></option></select>",a.querySelectorAll("[t^='']").length&&o.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||o.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll(":checked").length||o.push(":checked")}),gb(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&o.push("name"+K+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||o.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),o.push(",.*:")})),(c.matchesSelector=Y.test(q=m.webkitMatchesSelector||m.mozMatchesSelector||m.oMatchesSelector||m.msMatchesSelector))&&gb(function(a){c.disconnectedMatch=q.call(a,"div"),q.call(a,"[s!='']:x"),p.push("!=",O)}),o=o.length&&new RegExp(o.join("|")),p=p.length&&new RegExp(p.join("|")),b=Y.test(m.compareDocumentPosition),r=b||Y.test(m.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},z=b?function(a,b){if(a===b)return j=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===t&&r(t,a)?-1:b===e||b.ownerDocument===t&&r(t,b)?1:i?I.call(i,a)-I.call(i,b):0:4&d?-1:1)}:function(a,b){if(a===b)return j=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],k=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:i?I.call(i,a)-I.call(i,b):0;if(f===g)return ib(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)k.unshift(c);while(h[d]===k[d])d++;return d?ib(h[d],k[d]):h[d]===t?-1:k[d]===t?1:0},e):l},db.matches=function(a,b){return db(a,null,null,b)},db.matchesSelector=function(a,b){if((a.ownerDocument||a)!==l&&k(a),b=b.replace(S,"='$1']"),!(!c.matchesSelector||!n||p&&p.test(b)||o&&o.test(b)))try{var d=q.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return db(b,l,null,[a]).length>0},db.contains=function(a,b){return(a.ownerDocument||a)!==l&&k(a),r(a,b)},db.attr=function(a,b){(a.ownerDocument||a)!==l&&k(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!n):void 0;return void 0!==f?f:c.attributes||!n?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},db.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},db.uniqueSort=function(a){var b,d=[],e=0,f=0;if(j=!c.detectDuplicates,i=!c.sortStable&&a.slice(0),a.sort(z),j){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return i=null,a},e=db.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=db.selectors={cacheLength:50,createPseudo:fb,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ab,bb),a[3]=(a[4]||a[5]||"").replace(ab,bb),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||db.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&db.error(a[0]),a},PSEUDO:function(a){var b,c=!a[5]&&a[2];return V.CHILD.test(a[0])?null:(a[3]&&void 0!==a[4]?a[2]=a[4]:c&&T.test(c)&&(b=ob(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ab,bb).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=w[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&w(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==A&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=db.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),t=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&t){k=q[s]||(q[s]={}),j=k[a]||[],n=j[0]===u&&j[1],m=j[0]===u&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[u,n,m];break}}else if(t&&(j=(b[s]||(b[s]={}))[a])&&j[0]===u)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(t&&((l[s]||(l[s]={}))[a]=[u,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||db.error("unsupported pseudo: "+a);return e[s]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?fb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:fb(function(a){var b=[],c=[],d=g(a.replace(P,"$1"));return d[s]?fb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:fb(function(a){return function(b){return db(a,b).length>0}}),contains:fb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:fb(function(a){return U.test(a||"")||db.error("unsupported lang: "+a),a=a.replace(ab,bb).toLowerCase(),function(b){var c;do if(c=n?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===m},focus:function(a){return a===l.activeElement&&(!l.hasFocus||l.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:lb(function(){return[0]}),last:lb(function(a,b){return[b-1]}),eq:lb(function(a,b,c){return[0>c?c+b:c]}),even:lb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:lb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:lb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:lb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=jb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=kb(b);function nb(){}nb.prototype=d.filters=d.pseudos,d.setFilters=new nb;function ob(a,b){var c,e,f,g,h,i,j,k=x[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=Q.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?db.error(a):x(a,i).slice(0)}function pb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function qb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=v++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[u,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[s]||(b[s]={}),(h=i[d])&&h[0]===u&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function rb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function sb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function tb(a,b,c,d,e,f){return d&&!d[s]&&(d=tb(d)),e&&!e[s]&&(e=tb(e,f)),fb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||wb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:sb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=sb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=sb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ub(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],i=g||d.relative[" "],j=g?1:0,k=qb(function(a){return a===b},i,!0),l=qb(function(a){return I.call(b,a)>-1},i,!0),m=[function(a,c,d){return!g&&(d||c!==h)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>j;j++)if(c=d.relative[a[j].type])m=[qb(rb(m),c)];else{if(c=d.filter[a[j].type].apply(null,a[j].matches),c[s]){for(e=++j;f>e;e++)if(d.relative[a[e].type])break;return tb(j>1&&rb(m),j>1&&pb(a.slice(0,j-1).concat({value:" "===a[j-2].type?"*":""})).replace(P,"$1"),c,e>j&&ub(a.slice(j,e)),f>e&&ub(a=a.slice(e)),f>e&&pb(a))}m.push(c)}return rb(m)}function vb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,i,j,k){var m,n,o,p=0,q="0",r=f&&[],s=[],t=h,v=f||e&&d.find.TAG("*",k),w=u+=null==t?1:Math.random()||.1,x=v.length;for(k&&(h=g!==l&&g);q!==x&&null!=(m=v[q]);q++){if(e&&m){n=0;while(o=a[n++])if(o(m,g,i)){j.push(m);break}k&&(u=w)}c&&((m=!o&&m)&&p--,f&&r.push(m))}if(p+=q,c&&q!==p){n=0;while(o=b[n++])o(r,s,g,i);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=E.call(j));s=sb(s)}G.apply(j,s),k&&!f&&s.length>0&&p+b.length>1&&db.uniqueSort(j)}return k&&(u=w,h=t),r};return c?fb(f):f}g=db.compile=function(a,b){var c,d=[],e=[],f=y[a+" "];if(!f){b||(b=ob(a)),c=b.length;while(c--)f=ub(b[c]),f[s]?d.push(f):e.push(f);f=y(a,vb(e,d))}return f};function wb(a,b,c){for(var d=0,e=b.length;e>d;d++)db(a,b[d],c);return c}function xb(a,b,e,f){var h,i,j,k,l,m=ob(a);if(!f&&1===m.length){if(i=m[0]=m[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&c.getById&&9===b.nodeType&&n&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(ab,bb),b)||[])[0],!b)return e;a=a.slice(i.shift().value.length)}h=V.needsContext.test(a)?0:i.length;while(h--){if(j=i[h],d.relative[k=j.type])break;if((l=d.find[k])&&(f=l(j.matches[0].replace(ab,bb),$.test(i[0].type)&&mb(b.parentNode)||b))){if(i.splice(h,1),a=f.length&&pb(i),!a)return G.apply(e,f),e;break}}}return g(a,m)(f,b,!n,e,$.test(a)&&mb(b.parentNode)||b),e}return c.sortStable=s.split("").sort(z).join("")===s,c.detectDuplicates=!!j,k(),c.sortDetached=gb(function(a){return 1&a.compareDocumentPosition(l.createElement("div"))}),gb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||hb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&gb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||hb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),gb(function(a){return null==a.getAttribute("disabled")})||hb(J,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),db}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return n.inArray(a,b)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;e>b;b++)if(n.contains(d[b],this))return!0}));for(b=0;e>b;b++)n.find(a,d[b],c);return c=this.pushStack(e>1?n.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=a.document,A=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,B=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:A.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:z,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=z.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return y.find(a);this.length=1,this[0]=d}return this.context=z,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};B.prototype=n.fn,y=n(z);var C=/^(?:parents|prev(?:Until|All))/,D={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!n(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b,c=n(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(n.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?n.inArray(this[0],n(a)):n.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function E(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return E(a,"nextSibling")},prev:function(a){return E(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return n.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(D[a]||(e=n.unique(e)),C.test(a)&&(e=e.reverse())),this.pushStack(e)}});var F=/\S+/g,G={};function H(a){var b=G[a]={};return n.each(a.match(F)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?G[a]||H(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&n.each(arguments,function(a,c){var d;while((d=n.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){if(a===!0?!--n.readyWait:!n.isReady){if(!z.body)return setTimeout(n.ready);n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(z,[n]),n.fn.trigger&&n(z).trigger("ready").off("ready"))}}});function J(){z.addEventListener?(z.removeEventListener("DOMContentLoaded",K,!1),a.removeEventListener("load",K,!1)):(z.detachEvent("onreadystatechange",K),a.detachEvent("onload",K))}function K(){(z.addEventListener||"load"===event.type||"complete"===z.readyState)&&(J(),n.ready())}n.ready.promise=function(b){if(!I)if(I=n.Deferred(),"complete"===z.readyState)setTimeout(n.ready);else if(z.addEventListener)z.addEventListener("DOMContentLoaded",K,!1),a.addEventListener("load",K,!1);else{z.attachEvent("onreadystatechange",K),a.attachEvent("onload",K);var c=!1;try{c=null==a.frameElement&&z.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!n.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}J(),n.ready()}}()}return I.promise(b)};var L="undefined",M;for(M in n(l))break;l.ownLast="0"!==M,l.inlineBlockNeedsLayout=!1,n(function(){var a,b,c=z.getElementsByTagName("body")[0];c&&(a=z.createElement("div"),a.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",b=z.createElement("div"),c.appendChild(a).appendChild(b),typeof b.style.zoom!==L&&(b.style.cssText="border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1",(l.inlineBlockNeedsLayout=3===b.offsetWidth)&&(c.style.zoom=1)),c.removeChild(a),a=b=null)}),function(){var a=z.createElement("div");if(null==l.deleteExpando){l.deleteExpando=!0;try{delete a.test}catch(b){l.deleteExpando=!1}}a=null}(),n.acceptData=function(a){var b=n.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(O,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}n.data(a,b,c)}else c=void 0}return c}function Q(a){var b;for(b in a)if(("data"!==b||!n.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function R(a,b,d,e){if(n.acceptData(a)){var f,g,h=n.expando,i=a.nodeType,j=i?n.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||n.guid++:h),j[k]||(j[k]=i?{}:{toJSON:n.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=n.extend(j[k],b):j[k].data=n.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[n.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[n.camelCase(b)])):f=g,f
}}function S(a,b,c){if(n.acceptData(a)){var d,e,f=a.nodeType,g=f?n.cache:a,h=f?a[n.expando]:n.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){n.isArray(b)?b=b.concat(n.map(b,n.camelCase)):b in d?b=[b]:(b=n.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!Q(d):!n.isEmptyObject(d))return}(c||(delete g[h].data,Q(g[h])))&&(f?n.cleanData([a],!0):l.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}n.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?n.cache[a[n.expando]]:a[n.expando],!!a&&!Q(a)},data:function(a,b,c){return R(a,b,c)},removeData:function(a,b){return S(a,b)},_data:function(a,b,c){return R(a,b,c,!0)},_removeData:function(a,b){return S(a,b,!0)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=n.data(f),1===f.nodeType&&!n._data(f,"parsedAttrs"))){c=g.length;while(c--)d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d]));n._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){n.data(this,a)}):arguments.length>1?this.each(function(){n.data(this,a,b)}):f?P(f,a,n.data(f,a)):void 0},removeData:function(a){return this.each(function(){n.removeData(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=n._data(a,b),c&&(!d||n.isArray(c)?d=n._data(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return n._data(a,c)||n._data(a,c,{empty:n.Callbacks("once memory").add(function(){n._removeData(a,b+"queue"),n._removeData(a,c)})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=n._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var T=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},W=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},X=/^(?:checkbox|radio)$/i;!function(){var a=z.createDocumentFragment(),b=z.createElement("div"),c=z.createElement("input");if(b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a>",l.leadingWhitespace=3===b.firstChild.nodeType,l.tbody=!b.getElementsByTagName("tbody").length,l.htmlSerialize=!!b.getElementsByTagName("link").length,l.html5Clone="<:nav></:nav>"!==z.createElement("nav").cloneNode(!0).outerHTML,c.type="checkbox",c.checked=!0,a.appendChild(c),l.appendChecked=c.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,a.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,l.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){l.noCloneEvent=!1}),b.cloneNode(!0).click()),null==l.deleteExpando){l.deleteExpando=!0;try{delete b.test}catch(d){l.deleteExpando=!1}}a=b=c=null}(),function(){var b,c,d=z.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(l[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),l[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var Y=/^(?:input|select|textarea)$/i,Z=/^key/,$=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,ab=/^([^.]*)(?:\.(.+)|)$/;function bb(){return!0}function cb(){return!1}function db(){try{return z.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=n.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof n===L||a&&n.event.triggered===a.type?void 0:n.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(F)||[""],h=b.length;while(h--)f=ab.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=n.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=n.event.special[o]||{},l=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},i),(m=g[o])||(m=g[o]=[],m.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,l):m.push(l),n.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n.hasData(a)&&n._data(a);if(r&&(k=r.events)){b=(b||"").match(F)||[""],j=b.length;while(j--)if(h=ab.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=m.length;while(f--)g=m[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(k)&&(delete r.handle,n._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,m,o=[d||z],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||z,3!==d.nodeType&&8!==d.nodeType&&!_.test(p+n.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[n.expando]?b:new n.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),k=n.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!n.isWindow(d)){for(i=k.delegateType||p,_.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||z)&&o.push(l.defaultView||l.parentWindow||a)}m=0;while((h=o[m++])&&!b.isPropagationStopped())b.type=m>1?i:k.bindType||p,f=(n._data(h,"events")||{})[b.type]&&n._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&n.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&n.acceptData(d)&&g&&d[p]&&!n.isWindow(d)){l=d[g],l&&(d[g]=null),n.event.triggered=p;try{d[p]()}catch(r){}n.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(n._data(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((n.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?n(c,this).index(i)>=0:n.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=$.test(e)?this.mouseHooks:Z.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||z),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||z,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==db()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===db()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return n.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=z.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===L&&(a[d]=null),a.detachEvent(d,c))},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&(a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault())?bb:cb):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:cb,isPropagationStopped:cb,isImmediatePropagationStopped:cb,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=bb,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=bb,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.submitBubbles||(n.event.special.submit={setup:function(){return n.nodeName(this,"form")?!1:void n.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=n.nodeName(b,"input")||n.nodeName(b,"button")?b.form:void 0;c&&!n._data(c,"submitBubbles")&&(n.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),n._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&n.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return n.nodeName(this,"form")?!1:void n.event.remove(this,"._submit")}}),l.changeBubbles||(n.event.special.change={setup:function(){return Y.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(n.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),n.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),n.event.simulate("change",this,a,!0)})),!1):void n.event.add(this,"beforeactivate._change",function(a){var b=a.target;Y.test(b.nodeName)&&!n._data(b,"changeBubbles")&&(n.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||n.event.simulate("change",this.parentNode,a,!0)}),n._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return n.event.remove(this,"._change"),!Y.test(this.nodeName)}}),l.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=n._data(d,b);e||d.addEventListener(a,c,!0),n._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=n._data(d,b)-1;e?n._data(d,b,e):(d.removeEventListener(a,c,!0),n._removeData(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=cb;else if(!d)return this;return 1===e&&(g=d,d=function(a){return n().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=cb),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});function eb(a){var b=fb.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var fb="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gb=/ jQuery\d+="(?:null|\d+)"/g,hb=new RegExp("<(?:"+fb+")[\\s/>]","i"),ib=/^\s+/,jb=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,kb=/<([\w:]+)/,lb=/<tbody/i,mb=/<|&#?\w+;/,nb=/<(?:script|style|link)/i,ob=/checked\s*(?:[^=]|=\s*.checked.)/i,pb=/^$|\/(?:java|ecma)script/i,qb=/^true\/(.*)/,rb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,sb={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:l.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},tb=eb(z),ub=tb.appendChild(z.createElement("div"));sb.optgroup=sb.option,sb.tbody=sb.tfoot=sb.colgroup=sb.caption=sb.thead,sb.th=sb.td;function vb(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==L?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==L?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||n.nodeName(d,b)?f.push(d):n.merge(f,vb(d,b));return void 0===b||b&&n.nodeName(a,b)?n.merge([a],f):f}function wb(a){X.test(a.type)&&(a.defaultChecked=a.checked)}function xb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function yb(a){return a.type=(null!==n.find.attr(a,"type"))+"/"+a.type,a}function zb(a){var b=qb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ab(a,b){for(var c,d=0;null!=(c=a[d]);d++)n._data(c,"globalEval",!b||n._data(b[d],"globalEval"))}function Bb(a,b){if(1===b.nodeType&&n.hasData(a)){var c,d,e,f=n._data(a),g=n._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)n.event.add(b,c,h[c][d])}g.data&&(g.data=n.extend({},g.data))}}function Cb(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!l.noCloneEvent&&b[n.expando]){e=n._data(b);for(d in e.events)n.removeEvent(b,d,e.handle);b.removeAttribute(n.expando)}"script"===c&&b.text!==a.text?(yb(b).text=a.text,zb(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),l.html5Clone&&a.innerHTML&&!n.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&X.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}n.extend({clone:function(a,b,c){var d,e,f,g,h,i=n.contains(a.ownerDocument,a);if(l.html5Clone||n.isXMLDoc(a)||!hb.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(ub.innerHTML=a.outerHTML,ub.removeChild(f=ub.firstChild)),!(l.noCloneEvent&&l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(d=vb(f),h=vb(a),g=0;null!=(e=h[g]);++g)d[g]&&Cb(e,d[g]);if(b)if(c)for(h=h||vb(a),d=d||vb(f),g=0;null!=(e=h[g]);g++)Bb(e,d[g]);else Bb(a,f);return d=vb(f,"script"),d.length>0&&Ab(d,!i&&vb(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k,m=a.length,o=eb(b),p=[],q=0;m>q;q++)if(f=a[q],f||0===f)if("object"===n.type(f))n.merge(p,f.nodeType?[f]:f);else if(mb.test(f)){h=h||o.appendChild(b.createElement("div")),i=(kb.exec(f)||["",""])[1].toLowerCase(),k=sb[i]||sb._default,h.innerHTML=k[1]+f.replace(jb,"<$1></$2>")+k[2],e=k[0];while(e--)h=h.lastChild;if(!l.leadingWhitespace&&ib.test(f)&&p.push(b.createTextNode(ib.exec(f)[0])),!l.tbody){f="table"!==i||lb.test(f)?"<table>"!==k[1]||lb.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)n.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}n.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),l.appendChecked||n.grep(vb(p,"input"),wb),q=0;while(f=p[q++])if((!d||-1===n.inArray(f,d))&&(g=n.contains(f.ownerDocument,f),h=vb(o.appendChild(f),"script"),g&&Ab(h),c)){e=0;while(f=h[e++])pb.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=n.expando,j=n.cache,k=l.deleteExpando,m=n.event.special;null!=(d=a[h]);h++)if((b||n.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)m[e]?n.event.remove(d,e):n.removeEvent(d,e,g.handle);j[f]&&(delete j[f],k?delete d[i]:typeof d.removeAttribute!==L?d.removeAttribute(i):d[i]=null,c.push(f))}}}),n.fn.extend({text:function(a){return W(this,function(a){return void 0===a?n.text(this):this.empty().append((this[0]&&this[0].ownerDocument||z).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(vb(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&Ab(vb(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&n.cleanData(vb(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&n.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return W(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(gb,""):void 0;if(!("string"!=typeof a||nb.test(a)||!l.htmlSerialize&&hb.test(a)||!l.leadingWhitespace&&ib.test(a)||sb[(kb.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(jb,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(vb(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(vb(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,k=this.length,m=this,o=k-1,p=a[0],q=n.isFunction(p);if(q||k>1&&"string"==typeof p&&!l.checkClone&&ob.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(k&&(i=n.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=n.map(vb(i,"script"),yb),f=g.length;k>j;j++)d=i,j!==o&&(d=n.clone(d,!0,!0),f&&n.merge(g,vb(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,n.map(g,zb),j=0;f>j;j++)d=g[j],pb.test(d.type||"")&&!n._data(d,"globalEval")&&n.contains(h,d)&&(d.src?n._evalUrl&&n._evalUrl(d.src):n.globalEval((d.text||d.textContent||d.innerHTML||"").replace(rb,"")));i=c=null}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=0,e=[],g=n(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),n(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Db,Eb={};function Fb(b,c){var d=n(c.createElement(b)).appendTo(c.body),e=a.getDefaultComputedStyle?a.getDefaultComputedStyle(d[0]).display:n.css(d[0],"display");return d.detach(),e}function Gb(a){var b=z,c=Eb[a];return c||(c=Fb(a,b),"none"!==c&&c||(Db=(Db||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Db[0].contentWindow||Db[0].contentDocument).document,b.write(),b.close(),c=Fb(a,b),Db.detach()),Eb[a]=c),c}!function(){var a,b,c=z.createElement("div"),d="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";c.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=c.getElementsByTagName("a")[0],a.style.cssText="float:left;opacity:.5",l.opacity=/^0.5/.test(a.style.opacity),l.cssFloat=!!a.style.cssFloat,c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===c.style.backgroundClip,a=c=null,l.shrinkWrapBlocks=function(){var a,c,e,f;if(null==b){if(a=z.getElementsByTagName("body")[0],!a)return;f="border:0;width:0;height:0;position:absolute;top:0;left:-9999px",c=z.createElement("div"),e=z.createElement("div"),a.appendChild(c).appendChild(e),b=!1,typeof e.style.zoom!==L&&(e.style.cssText=d+";width:1px;padding:1px;zoom:1",e.innerHTML="<div></div>",e.firstChild.style.width="5px",b=3!==e.offsetWidth),a.removeChild(c),a=c=e=null}return b}}();var Hb=/^margin/,Ib=new RegExp("^("+T+")(?!px)[a-z%]+$","i"),Jb,Kb,Lb=/^(top|right|bottom|left)$/;a.getComputedStyle?(Jb=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),Ib.test(g)&&Hb.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):z.documentElement.currentStyle&&(Jb=function(a){return a.currentStyle},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Ib.test(g)&&!Lb.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Mb(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h=z.createElement("div"),i="border:0;width:0;height:0;position:absolute;top:0;left:-9999px",j="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";h.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",b=h.getElementsByTagName("a")[0],b.style.cssText="float:left;opacity:.5",l.opacity=/^0.5/.test(b.style.opacity),l.cssFloat=!!b.style.cssFloat,h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,b=h=null,n.extend(l,{reliableHiddenOffsets:function(){if(null!=c)return c;var a,b,d,e=z.createElement("div"),f=z.getElementsByTagName("body")[0];if(f)return e.setAttribute("className","t"),e.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=z.createElement("div"),a.style.cssText=i,f.appendChild(a).appendChild(e),e.innerHTML="<table><tr><td></td><td>t</td></tr></table>",b=e.getElementsByTagName("td"),b[0].style.cssText="padding:0;margin:0;border:0;display:none",d=0===b[0].offsetHeight,b[0].style.display="",b[1].style.display="none",c=d&&0===b[0].offsetHeight,f.removeChild(a),e=f=null,c},boxSizing:function(){return null==d&&k(),d},boxSizingReliable:function(){return null==e&&k(),e},pixelPosition:function(){return null==f&&k(),f},reliableMarginRight:function(){var b,c,d,e;if(null==g&&a.getComputedStyle){if(b=z.getElementsByTagName("body")[0],!b)return;c=z.createElement("div"),d=z.createElement("div"),c.style.cssText=i,b.appendChild(c).appendChild(d),e=d.appendChild(z.createElement("div")),e.style.cssText=d.style.cssText=j,e.style.marginRight=e.style.width="0",d.style.width="1px",g=!parseFloat((a.getComputedStyle(e,null)||{}).marginRight),b.removeChild(c)}return g}});function k(){var b,c,h=z.getElementsByTagName("body")[0];h&&(b=z.createElement("div"),c=z.createElement("div"),b.style.cssText=i,h.appendChild(b).appendChild(c),c.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%",n.swap(h,null!=h.style.zoom?{zoom:1}:{},function(){d=4===c.offsetWidth}),e=!0,f=!1,g=!0,a.getComputedStyle&&(f="1%"!==(a.getComputedStyle(c,null)||{}).top,e="4px"===(a.getComputedStyle(c,null)||{width:"4px"}).width),h.removeChild(b),c=h=null)}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Nb=/alpha\([^)]*\)/i,Ob=/opacity\s*=\s*([^)]*)/,Pb=/^(none|table(?!-c[ea]).+)/,Qb=new RegExp("^("+T+")(.*)$","i"),Rb=new RegExp("^([+-])=("+T+")","i"),Sb={position:"absolute",visibility:"hidden",display:"block"},Tb={letterSpacing:0,fontWeight:400},Ub=["Webkit","O","Moz","ms"];function Vb(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Ub.length;while(e--)if(b=Ub[e]+c,b in a)return b;return d}function Wb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=n._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=n._data(d,"olddisplay",Gb(d.nodeName)))):f[g]||(e=V(d),(c&&"none"!==c||!e)&&n._data(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Xb(a,b,c){var d=Qb.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Yb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Zb(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Jb(a),g=l.boxSizing()&&"border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Kb(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ib.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Yb(a,b,c||(g?"border":"content"),d,f)+"px"}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Kb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":l.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;if(b=n.cssProps[h]||(n.cssProps[h]=Vb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Rb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]="",i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Vb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Kb(a,b,d)),"normal"===f&&b in Tb&&(f=Tb[b]),""===c||c?(e=parseFloat(f),c===!0||n.isNumeric(e)?e||0:f):f}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?0===a.offsetWidth&&Pb.test(n.css(a,"display"))?n.swap(a,Sb,function(){return Zb(a,b,d)}):Zb(a,b,d):void 0},set:function(a,c,d){var e=d&&Jb(a);return Xb(a,c,d?Yb(a,b,d,l.boxSizing()&&"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),l.opacity||(n.cssHooks.opacity={get:function(a,b){return Ob.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=n.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===n.trim(f.replace(Nb,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Nb.test(f)?f.replace(Nb,e):f+" "+e)}}),n.cssHooks.marginRight=Mb(l.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},Kb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Hb.test(a)||(n.cssHooks[a+b].set=Xb)}),n.fn.extend({css:function(a,b){return W(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Jb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)
},a,b,arguments.length>1)},show:function(){return Wb(this,!0)},hide:function(){return Wb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function $b(a,b,c,d,e){return new $b.prototype.init(a,b,c,d,e)}n.Tween=$b,$b.prototype={constructor:$b,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=$b.propHooks[this.prop];return a&&a.get?a.get(this):$b.propHooks._default.get(this)},run:function(a){var b,c=$b.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):$b.propHooks._default.set(this),this}},$b.prototype.init.prototype=$b.prototype,$b.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},$b.propHooks.scrollTop=$b.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=$b.prototype.init,n.fx.step={};var _b,ac,bc=/^(?:toggle|show|hide)$/,cc=new RegExp("^(?:([+-])=|)("+T+")([a-z%]*)$","i"),dc=/queueHooks$/,ec=[jc],fc={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=cc.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&cc.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function gc(){return setTimeout(function(){_b=void 0}),_b=n.now()}function hc(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=U[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function ic(a,b,c){for(var d,e=(fc[b]||[]).concat(fc["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function jc(a,b,c){var d,e,f,g,h,i,j,k,m=this,o={},p=a.style,q=a.nodeType&&V(a),r=n._data(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,m.always(function(){m.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=n.css(a,"display"),k=Gb(a.nodeName),"none"===j&&(j=k),"inline"===j&&"none"===n.css(a,"float")&&(l.inlineBlockNeedsLayout&&"inline"!==k?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",l.shrinkWrapBlocks()||m.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],bc.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||n.style(a,d)}if(!n.isEmptyObject(o)){r?"hidden"in r&&(q=r.hidden):r=n._data(a,"fxshow",{}),f&&(r.hidden=!q),q?n(a).show():m.done(function(){n(a).hide()}),m.done(function(){var b;n._removeData(a,"fxshow");for(b in o)n.style(a,b,o[b])});for(d in o)g=ic(q?r[d]:0,d,m),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function kc(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function lc(a,b,c){var d,e,f=0,g=ec.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=_b||gc(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:_b||gc(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(kc(k,j.opts.specialEasing);g>f;f++)if(d=ec[f].call(j,a,k,j.opts))return d;return n.map(k,ic,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(lc,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],fc[c]=fc[c]||[],fc[c].unshift(b)},prefilter:function(a,b){b?ec.unshift(a):ec.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=lc(this,n.extend({},a),f);(e||n._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=n._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&dc.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=n._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(hc(b,!0),a,d,e)}}),n.each({slideDown:hc("show"),slideUp:hc("hide"),slideToggle:hc("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=n.timers,c=0;for(_b=n.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||n.fx.stop(),_b=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){ac||(ac=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(ac),ac=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e=z.createElement("div");e.setAttribute("className","t"),e.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=e.getElementsByTagName("a")[0],c=z.createElement("select"),d=c.appendChild(z.createElement("option")),b=e.getElementsByTagName("input")[0],a.style.cssText="top:1px",l.getSetAttribute="t"!==e.className,l.style=/top/.test(a.getAttribute("style")),l.hrefNormalized="/a"===a.getAttribute("href"),l.checkOn=!!b.value,l.optSelected=d.selected,l.enctype=!!z.createElement("form").enctype,c.disabled=!0,l.optDisabled=!d.disabled,b=z.createElement("input"),b.setAttribute("value",""),l.input=""===b.getAttribute("value"),b.value="t",b.setAttribute("type","radio"),l.radioValue="t"===b.value,a=b=c=d=e=null}();var mc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(mc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.text(a)}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(l.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)if(d=e[g],n.inArray(n.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var nc,oc,pc=n.expr.attrHandle,qc=/^(?:checked|selected)$/i,rc=l.getSetAttribute,sc=l.input;n.fn.extend({attr:function(a,b){return W(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===L?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?oc:nc)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(F);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)?sc&&rc||!qc.test(c)?a[d]=!1:a[n.camelCase("default-"+c)]=a[d]=!1:n.attr(a,c,""),a.removeAttribute(rc?c:d)},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),oc={set:function(a,b,c){return b===!1?n.removeAttr(a,c):sc&&rc||!qc.test(c)?a.setAttribute(!rc&&n.propFix[c]||c,c):a[n.camelCase("default-"+c)]=a[c]=!0,c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=pc[b]||n.find.attr;pc[b]=sc&&rc||!qc.test(b)?function(a,b,d){var e,f;return d||(f=pc[b],pc[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,pc[b]=f),e}:function(a,b,c){return c?void 0:a[n.camelCase("default-"+b)]?b.toLowerCase():null}}),sc&&rc||(n.attrHooks.value={set:function(a,b,c){return n.nodeName(a,"input")?void(a.defaultValue=b):nc&&nc.set(a,b,c)}}),rc||(nc={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},pc.id=pc.name=pc.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},n.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:nc.set},n.attrHooks.contenteditable={set:function(a,b,c){nc.set(a,""===b?!1:b,c)}},n.each(["width","height"],function(a,b){n.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),l.style||(n.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var tc=/^(?:input|select|textarea|button|object)$/i,uc=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return W(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return a=n.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):tc.test(a.nodeName)||uc.test(a.nodeName)&&a.href?0:-1}}}}),l.hrefNormalized||n.each(["href","src"],function(a,b){n.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this}),l.enctype||(n.propFix.enctype="encoding");var vc=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(vc," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(vc," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(F)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===L||"boolean"===c)&&(this.className&&n._data(this,"__className__",this.className),this.className=this.className||a===!1?"":n._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(vc," ").indexOf(b)>=0)return!0;return!1}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var wc=n.now(),xc=/\?/,yc=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;n.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=n.trim(b+"");return e&&!n.trim(e.replace(yc,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():n.error("Invalid JSON: "+b)},n.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var zc,Ac,Bc=/#.*$/,Cc=/([?&])_=[^&]*/,Dc=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Ec=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Fc=/^(?:GET|HEAD)$/,Gc=/^\/\//,Hc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Ic={},Jc={},Kc="*/".concat("*");try{Ac=location.href}catch(Lc){Ac=z.createElement("a"),Ac.href="",Ac=Ac.href}zc=Hc.exec(Ac.toLowerCase())||[];function Mc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(F)||[];if(n.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nc(a,b,c,d){var e={},f=a===Jc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Oc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&n.extend(!0,a,c),a}function Pc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Qc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ac,type:"GET",isLocal:Ec.test(zc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Oc(Oc(a,n.ajaxSettings),b):Oc(n.ajaxSettings,a)},ajaxPrefilter:Mc(Ic),ajaxTransport:Mc(Jc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Dc.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||Ac)+"").replace(Bc,"").replace(Gc,zc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(F)||[""],null==k.crossDomain&&(c=Hc.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===zc[1]&&c[2]===zc[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(zc[3]||("http:"===zc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),Nc(Ic,k,b,v),2===t)return v;h=k.global,h&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Fc.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(xc.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Cc.test(e)?e.replace(Cc,"$1_="+wc++):e+(xc.test(e)?"&":"?")+"_="+wc++)),k.ifModified&&(n.lastModified[e]&&v.setRequestHeader("If-Modified-Since",n.lastModified[e]),n.etag[e]&&v.setRequestHeader("If-None-Match",n.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Kc+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Nc(Jc,k,b,v)){v.readyState=1,h&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Pc(k,v,c)),u=Qc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(n.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){if(n.isFunction(a))return this.each(function(b){n(this).wrapAll(a.call(this,b))});if(this[0]){var b=n(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!l.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||n.css(a,"display"))},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var Rc=/%20/g,Sc=/\[\]$/,Tc=/\r?\n/g,Uc=/^(?:submit|button|image|reset|file)$/i,Vc=/^(?:input|select|textarea|keygen)/i;function Wc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Sc.test(a)?d(a,e):Wc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Wc(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Wc(c,a[c],b,e);return d.join("&").replace(Rc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Vc.test(this.nodeName)&&!Uc.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Tc,"\r\n")}}):{name:b.name,value:c.replace(Tc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&$c()||_c()}:$c;var Xc=0,Yc={},Zc=n.ajaxSettings.xhr();a.ActiveXObject&&n(a).on("unload",function(){for(var a in Yc)Yc[a](void 0,!0)}),l.cors=!!Zc&&"withCredentials"in Zc,Zc=l.ajax=!!Zc,Zc&&n.ajaxTransport(function(a){if(!a.crossDomain||l.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Xc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Yc[g],b=void 0,f.onreadystatechange=n.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Yc[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function $c(){try{return new a.XMLHttpRequest}catch(b){}}function _c(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=z.head||n("head")[0]||z.documentElement;return{send:function(d,e){b=z.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var ad=[],bd=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=ad.pop()||n.expando+"_"+wc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(bd.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&bd.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(bd,"$1"+e):b.jsonp!==!1&&(b.url+=(xc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,ad.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||z;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var cd=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&cd)return cd.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=a.slice(h,a.length),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&n.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var dd=a.document.documentElement;function ed(a){return n.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&n.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,n.contains(b,e)?(typeof e.getBoundingClientRect!==L&&(d=e.getBoundingClientRect()),c=ed(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===n.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(c=a.offset()),c.top+=n.css(a[0],"borderTopWidth",!0),c.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-n.css(d,"marginTop",!0),left:b.left-c.left-n.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||dd;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||dd})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);n.fn[a]=function(d){return W(this,function(a,d,e){var f=ed(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?n(f).scrollLeft():e,c?e:n(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Mb(l.pixelPosition,function(a,c){return c?(c=Kb(a,b),Ib.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return W(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack, true&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));var fd=a.jQuery,gd=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=gd),b&&a.jQuery===n&&(a.jQuery=fd),n},typeof b===L&&(a.jQuery=a.$=n),n});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// UNUSED EXPORTS: tstFun

;// CONCATENATED MODULE: ./src/depend/tst.ts
const xx = '22222';
const tstFun = () => {
    console.log('Test Fun');
};
console.log(3333);

// EXTERNAL MODULE: ./src/depend/config.js
var config = __webpack_require__(238);
// EXTERNAL MODULE: ./src/depend/jmuxer.js
var jmuxer = __webpack_require__(207);
// EXTERNAL MODULE: ./src/depend/jquery-1.11.0.min.js
var jquery_1_11_0_min = __webpack_require__(183);
// EXTERNAL MODULE: ./src/depend/init.js
var init = __webpack_require__(992);
;// CONCATENATED MODULE: ./src/index.ts

// const aac = require('./depend/aac')
// import './depend/aac'






console.log(1111);
console.log(xx);


})();

/******/ })()
;