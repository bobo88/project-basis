console.log('============= CLOUD_GAME_SDK ====================')

import { SDK_CONFIG } from './dep/config'

import { ceil, spsParser, ue, se, u } from './dep/sps_parser'
import { keycodeMode } from './dep/keycode'
import { 
    RequestIFrame,
    makeSharpness,
    ConfigChannel,
    VerifyCode,
    CheckVerifyCode,
    GetScreenState,
    CheckScreenDirection,
    ExexuteKeyDown,
    ExexuteMouseDown,
    ExexuteMouseMove,
    ExexuteMouseUp,
    ExexuteSetAccountTransparent,
    ExexuteSetPhoneSize,
    ExexuteSendBitRate,
    makeFrame,
    PrintArry,
	checkMultiLoginInfo,
} from './dep/helper'

import './dep/aac'

// 工具类
import { GameEventToOutSide, bounceFun } from './dep/utils'

// 额外配置：特定游戏的
import { NSUInteger, extraData } from './dep/extra'

// 第三方依赖
import JMuxer from 'jmuxer'
import $ from 'jquery'

// console.log('AAC.ts Module：', Module)
// console.log('第三方依赖【JMuxer】引入进来了： ', JMuxer)
// console.log(ceil, spsParser, ue, se, u)

export {
	// 导出：SDK配置集合（相关变量）
	SDK_CONFIG,
	// 导出： 额外配置（特定游戏的）
	NSUInteger, extraData,
	// 导出： 工具类
	GameEventToOutSide, bounceFun
}

// ============================ SDK Init ======================================
let {
	ws, 
	socket,
	controlWs, 
	jmuxer,
	myVideo,
	myContainer,
	flag,
	isVisuable,
	isFeed,
	isDrag,
	isFinish,
	hasSwitch,
	isWaitSps,
	disconnect,
	isPay,
	isLandscape,
	videoWidth,
	videoHeight,
	curTime,
	requestTime,
	oldTime,
	newTime,
	outTime,
	outsetInterval,
	clickPlay,
	decodeCount,
	h264Buffer,
	sharpnessLevel,
	JMuxerOptions,
	socketURL,
	socketExtranetURL,
	sn,
	token,
	payURL,
	apiURL,
	getSdkTokenURL,
	lineUpURL,
} = SDK_CONFIG;

var Module = typeof Module !== "undefined" ? Module: {};
Module.onRuntimeInitialized = function() {
	console.log("Wasm 加载成功!")
	isFinish = true;
}

export const CLOUD_GAME_SDK: CloudGameSdk = {
    version: '1.0.0',
    // 配置信息
    sdkInit: (options) => {
		myVideo = document.getElementById(options.videoNode);
		myContainer = document.getElementById(options.containerNode)

		console.log('==== SDK Init ========', options)
		var html = document.querySelector("html");
		if (html) {
			var clientWidth = html.getBoundingClientRect().width;
			html.style.fontSize = clientWidth / 23.4375 + "px";
		}
		
		const clientheight = window.screen.height;
		const clientwidth = window.screen.width;
		myVideo.setAttribute('width', clientheight);
		myVideo.setAttribute('height', clientwidth);
		jmuxer = new JMuxer(JMuxerOptions);
    },
	// 切换清晰度
	switchSharpness: (data) => {
		// 防出错
		if (data >= 6 || data < 1) {
			data = 3;
		}
		var buffer = makeSharpness(data);
		ws && ws.send(buffer);
	},
	// 账号透传
	setSdkToken: (uid, token) => {
		var buffer = ExexuteSetAccountTransparent(uid, token);
		controlWs.send(buffer);
	},
	// 调起支付页面
	switchPay: () => {},
	// 关闭推流
	closeWs: () => {
		ws.close()
		disconnect = true
		ws.onclose = undefined
		ws = null;
		controlWs = null;
		clearInterval(outsetInterval);
		jmuxer.destroy();
		console.log("关闭推流", ws.readyState);
		// 云游戏推流关闭
		bounceFun(NSUInteger.GameEventConnectBeClose);
	},
	// 开始试玩
	playWs: () => {
		if (jmuxer != undefined) jmuxer.destroy();
		jmuxer = new JMuxer(JMuxerOptions);
		isWaitSps = true;
		myVideo.play();

		// 鼠标点击重置停留的时间
		oldTime = new Date().getTime();
		// 连接
		CLOUD_GAME_SDK.doConnect()
	},
	// 自定义设置卡信息
	setCardInfo: (options) => {
		socketURL = options.socketURL;
		socketExtranetURL = options.socketExtranetURL;
		token = options.token;
	},
	// 开启倒计时
	outTime: () => {
		// 更新未进行操作的当前时间
		newTime = new Date().getTime();
		// console.log('打印最后一次操作的时间', newTime - oldTime, outTime)
		// 判断是否超时不操作
		if (newTime - oldTime > outTime) {
			console.log("时间到，退出登录");
			CLOUD_GAME_SDK.closeWs()
		}
	},
	// 获取token 'appKey', 'id'
	getSdkToken: (appKey, id, baseUrl) => {
		const httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : apiURL;
		$.ajax({
			url: httpsUrl + getSdkTokenURL,
			data: JSON.stringify({appKey, id}),
			type: 'post',
			dataType: 'json',
			contentType:'application/json;charset=UTF-8',
			success: function(res) {
				console.log('获取sdktoken', res)
				if (res.code === 200) {
					CLOUD_GAME_SDK.lineup(res.data, id, baseUrl)
				} else {
					bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError);
				}
			},
			error: function(res) {
				bounceFun(NSUInteger.GameEventInterfaceGetAuthModeError404);
			}
		})
	},
	// 排队拿卡
	lineup: (token, id, baseUrl) => {
		const httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : apiURL;
		// 状态打点
		bounceFun(NSUInteger.GameEventInterfaceGetGameLineupMsg);
		const dataType = {
			token,
			id,
			'deviceIdentify': '82be044ad7f8839ffb6ba8a2e8da9b98',
			'starPhoneNumber': 15250186738,
			'useType': 0,
		};
		$.ajax({
			url: httpsUrl + lineUpURL,
			data: dataType,
			type: 'get',
			dataType: 'json',
			success: function(res) {
				console.log('获取sdktoken', res)
				if (res.code === 200) {
					var resData = res.data;
					if (resData.remainingTime) {
						extraData.remainingTimeData = resData;
					} else {
						extraData.remainingTimeData = undefined;
						// 拿到安卓卡
						bounceFun(NSUInteger.GameEventGetCardOkMsg);
						let data = res.data
						socketURL = 'ws://' + data.extranetIp + ':' + data.extranetPort
						socketExtranetURL = 'ws://' + data.extranetIp + ':' + data.socketExtranetPort
						sn = data.sn
						token = data.cardToken
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
	},
	otherInit: () => {
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
	visibilityCallBack: () => {

	},
	doConnect: () => {
		if (undefined != ws) {
			console.log('websocket已经有连接了');
			return;
		}
		console.log('执行doconnect', socket);
		ws = new WebSocket(socketURL);
		controlWs = new WebSocket(socketExtranetURL);
		ws.binaryType = 'arraybuffer';
		controlWs.binaryType = 'arraybuffer';
		curTime = new Date().getTime();
	
		// 音频流关闭时进行重连操作
		ws.onclose = function(e) {
			console.log('打印关闭信息', e)
			if (e.currentTarget == ws) {
				console.log('同一个ws, 发生断网, 应该重连');
				CLOUD_GAME_SDK.doConnect();
			} else {
				console.log('ws 已经发生改变, 已经被new 过了，不必处理');
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
			extraData.payData = controlData
			if (extraData.aiquData.event === 'aiqu_game_invoke_pay') {
				console.log(588, '支付被点击了')
				// 云游戏支付透传
				bounceFun(NSUInteger.GameEventWebSocketPay);
			}
		});
	
		// 音频流====================================
		ws.addEventListener('open', function(event) {
			var verifyBuffer = VerifyCode(sn, token);
			console.log("鉴权报文:" + PrintArry(verifyBuffer));
			ws.send(verifyBuffer);
			/* 定时器  判断每5秒是否长时间未进行页面操作 */
			outsetInterval = setInterval(outTime, 5000);
			// 安卓卡链接成功
			bounceFun(NSUInteger.GameEventCardConnectOkMsg);
		});
		ws.addEventListener('error', function(event) {
			console.log("连接失败");
			// 云游戏重连失败
			bounceFun(NSUInteger.GameEventReConnectFailMsg);
		});
		ws.addEventListener('message', function(event) {
			// JAVA服务器转发	  
			var data = CLOUD_GAME_SDK.ParseProto(event.data); 
			// 喂音频
			if (data.audio != null) {
				//decodeAAC(data.audio);
			}
			if (data.frameType != undefined && data.frameType != 1 && data.frameType != 6) {
				if (data.frameType == 7) {
					let info = spsParser(data.video);
					// 视频分辨率与当前的不一致时
					if (info && info.width != myVideo.videoWidth && info.height != myVideo.videoHeight) {
						if (myVideo.videoWidth > 0) {
							if (jmuxer != undefined) jmuxer.destroy();
							jmuxer = new JMuxer(JMuxerOptions);
						}
					}
				}
				// let cost = new Date().getTime() - curTime;
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
	
		// 推流后的默认配置
		CLOUD_GAME_SDK.connectAfterInit();
	},
	// 推流后的默认配置
	connectAfterInit: () => {
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
		}

		myVideo.addEventListener('resize', (e) => {
			// document.querySelector('[data-content="resolution"]').textContent = [
			// 	e.target.videoWidth,
			// 	e.target.videoHeight
			// ].join('x');
		});
	
		document.addEventListener("visibilitychange", CLOUD_GAME_SDK.visibilityCallBack);
	
		myVideo.addEventListener('pause', function() {
			//console.log("视频播放暂停");
			isFeed = false;
		});
		
		document.onkeydown = function(event) {
			console.log('===========我打开键盘了', event.keyCode)
			// var buffer = ExexuteKeyDown(event.keyCode);
			// ws.send(buffer);
			// controlWs.send(buffer);
			let isMac =
				navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0
		
			let keyCode: number = -1
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
			console.log('===========我打开键盘了')
			var buffer = ExexuteKeyDown(event.keyCode);
			ws.send(buffer);
			controlWs.send(buffer);
		}
	},
	touchClick: (event, type) => {
		oldTime = new Date().getTime(); // 鼠标点击重置停留的时间
		var canvasWidth = Number(window.innerWidth);
		var canvasHeight = Number(window.innerHeight);
		const onClickHandle = {
			0: ExexuteMouseDown,
			1: ExexuteMouseUp,
			2: ExexuteMouseMove
		}
		console.log(event, type, '588')
		let touches: any[] = event.changedTouches
		var ongoingTouches: any[] = []
		for (var i = 0; i < touches.length; i++) {
			var idx = ongoingTouches.findIndex(function (ele) {
			return ele.identifier === touches[i].identifier
			})
			// 横屏游戏
			if (isLandscape) {
				// 根据游戏的分辨率 设置
				let posX = (videoHeight * 1.0 * touches[i].clientY) / canvasHeight
				let posY = (videoWidth * 1.0 * (canvasWidth - touches[i].clientX)) / canvasWidth
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
				controlWs.send(buffer)
			} else {
			// 竖屏游戏
			let touches = event.changedTouches
			// 根据游戏的分辨率 设置
			let posX = (touches[i].clientX * videoWidth * 1.0) / canvasWidth
			let posY = (touches[i].clientY * videoHeight * 1.0) / canvasHeight
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
			controlWs.send(buffer)
			}
			if (idx < 0) {
			ongoingTouches.push(touches[i])
			}
		}
	},
	doSomeConfig: () => {
		ws.send(ConfigChannel(sn, "chaohang"));
		var checkBuffer = GetScreenState();
		ws.send(checkBuffer);
	},
	convertPosDefaultLandspace: (x, y) => {
		let posX, posY;
		if (!isLandscape) {
			// xx
		} else {
			posX = (x * videoWidth * 1.0) / myVideo.clientWidth;
			posY = (y * videoHeight * 1.0) / myVideo.clientHeight;
		}
		return {
			x: posX,
			y: posY
		};
	},
	convertPos: (x, y) => {
		var posX, posY; //500, 800
		// 如果是横屏
		if (isLandscape) {
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
	},
	createNewDecoder: () => {
		if (jmuxer != undefined) jmuxer.destroy();
		jmuxer = new JMuxer(JMuxerOptions);
		myVideo.play();
		isWaitSps = true;
	},
	ParseProto: (data) => {
		var input = new Uint8Array(data),
			duration,
			video,
			frameType,
			audio;
		if (input[0] == 0 && input[1] == 0 && input[2] == 0 && input[3] == 1) {
			video = input;
			duration = 16;
			var nalType = input[4] & 0x1f; // nalType == 0x07|| nalType == 0x08 || nalType == 0x05
			frameType = nalType;
		} else if (input[0] == 0xff) {
			audio = input;
		} else if (input[0] == 0x68) {
			// 多端登录处理, 数据从索引24开始取, input 是接收到的原始数据
			if (input[23] == 0x0B) {
				var jsonobj = checkMultiLoginInfo(input);
			}
			if (input[23] == 0x5c) {
				console.log("收到消息:" + PrintArry(input));
				if (CheckVerifyCode(input)) {
					console.log("鉴权通过，配置通道");
					CLOUD_GAME_SDK.doSomeConfig();
				} else {
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
						isLandscape = false;
					} else {
						console.log("安卓卡此时横屏");
						isLandscape = true;
						// 横屏处理
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
	xxxx: () => {

	},
	decodeAAC: (data) => {
		var retPtr = Module._malloc(4 * 5 * 1024); //接收的数据
		var inputPtr = Module._malloc(4 * data.length); //输入数据
		for (let i = 0; i < data.length; i++) {
			Module.HEAPU8[(inputPtr) + i] = data[i]; //转换为堆数据
		}
		var pcmLen = Module._feedData(retPtr, inputPtr, data.length);
		if (pcmLen >= 0) {
			var pcmData = new Uint8Array(pcmLen);
			for (let i = 0; i < pcmLen; i++) {
				pcmData[i] = Module.HEAPU8[(retPtr) + i]
			}
		} else {
			console.log("%d帧 aac 解码失败, %d", decodeCount, pcmLen);
		}
		decodeCount++;
		Module._free(inputPtr);
		Module._free(retPtr);
	},

    // todo
};

// Test
// export const Sum = (a: number, b: number) => {
//     return a + b
// }