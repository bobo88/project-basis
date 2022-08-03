console.log('============= CLOUD_GAME_SDK ====================')

import { SDK_CONFIG, CARD_INFO, SOFT_SDK_CONFIG } from './dep/config'

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
	ExexuteCloseServer,
    PrintArry,
	checkMultiLoginInfo,
	fpsSet,
} from './dep/helper'

import { AAC_MODULE } from './dep/aac'
console.log(888888, AAC_MODULE)

// 工具类
import { GameEventToOutSide, bounceFun, judgeDeviceType } from './dep/utils'

// 额外配置：特定游戏的
import { NSUInteger, extraData } from './dep/extra'

// 第三方依赖
import { JMuxer } from './dep/jmuxer'
import { WebGLPlayer } from './dep/webgl.js'
import { PCMPlayer } from './dep/pcm-player'
import $ from 'jquery'

// import SoftDecoderWorker from 'web-worker: ./dep/soft_decoder.worker';

// console.log('AAC.ts Module：', Module)
// console.log('第三方依赖【JMuxer】引入进来了： ', JMuxer)
// console.log(ceil, spsParser, ue, se, u)


export {
	// 导出：SDK配置集合（相关变量）
	SDK_CONFIG,
	CARD_INFO,
	SOFT_SDK_CONFIG,
	// 导出： 额外配置（特定游戏的）
	NSUInteger,
	extraData,
	// 导出： 工具类
	GameEventToOutSide,
	bounceFun,
	judgeDeviceType,
}

// ============================ SDK Init ======================================
const { Module } = AAC_MODULE
Module.onRuntimeInitialized = function() {
	console.log("Wasm 加载成功!")
	SDK_CONFIG.isFinish = true;
}

export const CLOUD_GAME_SDK: CloudGameSdk = {
    version: '1.0.0',
    // 配置信息
    sdkInit: (options) => {
		SDK_CONFIG.containerNode = options.containerNode;
		SDK_CONFIG.videoNode = options.videoNode;
		SDK_CONFIG.myVideo = document.getElementById(options.videoNode);
		SDK_CONFIG.myContainer = document.getElementById(options.containerNode)

		console.log('==== SDK Init ========', options)
		var html = document.querySelector("html");
		if (html) {
			var clientWidth = html.getBoundingClientRect().width;
			html.style.fontSize = clientWidth / 23.4375 + "px";
		}
		
		const clientheight = window.screen.height;
		const clientwidth = window.screen.width;
		SDK_CONFIG.myVideo.setAttribute('width', clientheight);
		SDK_CONFIG.myVideo.setAttribute('height', clientwidth);
		
		// ========================== ★★★★★ VIP Start =========================================
		const deviceType = judgeDeviceType();
		console.log('deviceType: ', deviceType)
		// deviceType.type: 0 - 安卓， 1 - IOS， 2 - 其他
		if (deviceType.type === 1) {
			// ios软解码
			SDK_CONFIG.webglPlayer = new WebGLPlayer(SDK_CONFIG.myVideo, {
				preserveDrawingBuffer: false
			});
		} else {
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
		})

    },
	// 切换清晰度
	switchSharpness: (data) => {
		// 防出错
		if (data >= 6 || data < 1) {
			data = 3;
		}
		var buffer = makeSharpness(data);
		// ========================== ★★★★★ VIP Start =========================================
		const deviceType = judgeDeviceType();
		if (deviceType.type === 1) {
			// ios软解码
			SOFT_SDK_CONFIG.webSocketWorker.postMessage(buffer);
		} else {
			// mse 解码
			SDK_CONFIG.ws && SDK_CONFIG.ws.send(buffer);
		}
		// ========================== ★★★★★ VIP Ended =========================================
	},
	// 账号透传
	setSdkToken: (uid, token) => {
		var buffer = ExexuteSetAccountTransparent(uid, token);
		SDK_CONFIG.controlWs.send(buffer);
	},
	// 调起支付页面
	switchPay: () => {},
	// 关闭推流
	closeWs: () => {
		console.log('=============== 关闭推流 =====================')
		SDK_CONFIG.controlWs = null;
		clearInterval(SDK_CONFIG.outsetInterval);
		clearInterval(SDK_CONFIG.pingTimer);
		
		// ========================== ★★★★★ VIP Start =========================================
		const deviceType = judgeDeviceType();
		if (deviceType.type === 1) {
			// ios软解码
			let closeSocket = ExexuteCloseServer(SDK_CONFIG.sn) // 销毁监听
			if (SOFT_SDK_CONFIG.webSocketWorker) {
				console.log(111111)
				SOFT_SDK_CONFIG.webSocketWorker.postMessage(closeSocket)
				SOFT_SDK_CONFIG.webSocketWorker.terminate()
			}
			if (SOFT_SDK_CONFIG.decodeWoker) {
				console.log(2222222)
				SOFT_SDK_CONFIG.decodeWoker.postMessage({ start: 'close' })
			}
			SDK_CONFIG.webglPlayer = null;
		} else {
			// mse 解码
			if (SDK_CONFIG.ws) {
				SDK_CONFIG.ws.close()
				SDK_CONFIG.ws.onclose = undefined
				SDK_CONFIG.ws = null;
			}
			SDK_CONFIG.disconnect = true
			SDK_CONFIG.jmuxer && SDK_CONFIG.jmuxer.destroy();
			SDK_CONFIG.jmuxer = null;
			SDK_CONFIG.myVideo && SDK_CONFIG.myVideo.pause();
			console.log("关闭推流", SDK_CONFIG.ws && SDK_CONFIG.ws.readyState);
		}
		// ========================== ★★★★★ VIP Ended =========================================

		SDK_CONFIG.aacPlayer = null;
		SDK_CONFIG.landscapeIsSeted = false;
		// 云游戏推流关闭
		bounceFun(NSUInteger.GameEventConnectBeClose);
	},
	// 开始试玩
	playWs: () => {
		// ========================== ★★★★★ VIP Start =========================================
		const deviceType = judgeDeviceType();
		if (deviceType.type === 1) {
			// ios软解码
			CLOUD_GAME_SDK.doConnectBySoft();
		} else {
			// mse 解码
			// 连接
			CLOUD_GAME_SDK.doConnectByMSE();
		}
		// ========================== ★★★★★ VIP Ended =========================================
	},
	// 自定义设置卡信息
	setCardInfo: (options) => {
		SDK_CONFIG.socketURL = options.socketURL;
		SDK_CONFIG.socketExtranetURL = options.socketExtranetURL;
		SDK_CONFIG.token = options.token;
		SDK_CONFIG.sn = options.sn;
	},
	// 开启倒计时
	outTime: () => {
		// 更新未进行操作的当前时间
		SDK_CONFIG.newTime = new Date().getTime();
		// console.log('打印最后一次操作的时间', newTime - oldTime, outTime)
		// 判断是否超时不操作
		if (SDK_CONFIG.newTime - SDK_CONFIG.oldTime > SDK_CONFIG.outTime) {
			console.log("时间到，退出登录");
			CLOUD_GAME_SDK.closeWs()
		}
	},
	// 获取token 'appKey', 'id'
	getSdkToken: (appKey, id, baseUrl, delayTime) => {
		const httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : SDK_CONFIG.apiURL;
		$.ajax({
			url: httpsUrl + SDK_CONFIG.getSdkTokenURL,
			data: JSON.stringify({appKey, id}),
			type: 'post',
			dataType: 'json',
			contentType:'application/json;charset=UTF-8',
			success: function(res) {
				console.log('获取sdktoken', res)
				if (res.code === 200) {
					CLOUD_GAME_SDK.lineup(res.data, id, baseUrl, delayTime)
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
	lineup: (token, id, baseUrl, delayTime) => {
		const httpsUrl = typeof baseUrl != 'undefined' && baseUrl ? baseUrl : SDK_CONFIG.apiURL;
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
			url: httpsUrl + SDK_CONFIG.lineUpURL,
			data: dataType,
			type: 'get',
			dataType: 'json',
			success: function(res) {
				console.log('获取拿卡信息', res)
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
							SDK_CONFIG.queueGetCard = setInterval(() => {
								CLOUD_GAME_SDK.lineup(token, id, baseUrl, delayTime)
							}, delayTime || SDK_CONFIG.lineupTime);
						}
					} else {
						extraData.remainingTimeData = undefined;
						clearInterval(SDK_CONFIG.queueGetCard);
						SDK_CONFIG.queueGetCard = null;
						// 拿到安卓卡
						bounceFun(NSUInteger.GameEventGetCardOkMsg);
						SDK_CONFIG.socketURL = 'ws://' + resData.extranetIp + ':' + resData.extranetPort
						SDK_CONFIG.socketExtranetURL = 'ws://' + resData.extranetIp + ':' + resData.socketExtranetPort + `?token=${resData.cardToken}&type=business`
						SDK_CONFIG.sn = resData.sn
						SDK_CONFIG.token = resData.cardToken

						for (let key in resData) {
							CARD_INFO[key] = resData[key]
						}
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
		if (document.visibilityState == 'visible') {
			SDK_CONFIG.isEntered = true
		} else {
			SDK_CONFIG.isEntered = false
		}
	},
	// 软解码 -- 连接
	doConnectBySoft: () => {
		// SOFT_SDK_CONFIG.decodeWoker = new SoftDecoderWorker();
		SOFT_SDK_CONFIG.decodeWoker = new Worker('./sdk/minjs/decoder.worker.js');
		SOFT_SDK_CONFIG.decodeWoker.addEventListener('message', (event) => {
			var objData = event.data || {}
			switch (objData.cmd) {
			  case 0:
				console.log(objData.data)
				break
			  case 1:
				if (SOFT_SDK_CONFIG.w != objData.width || SOFT_SDK_CONFIG.h != objData.height) {
				  // alert("分辨率变为: " + objData.width + " X "  + objData.height);
				  SOFT_SDK_CONFIG.w = objData.width
				  SOFT_SDK_CONFIG.h = objData.height
				  console.log('===========宽高不一致：', SOFT_SDK_CONFIG.w, SOFT_SDK_CONFIG.h)
				}
				SDK_CONFIG.webglPlayer && SDK_CONFIG.webglPlayer.renderFrame(
				  objData.data,
				  SOFT_SDK_CONFIG.w,
				  SOFT_SDK_CONFIG.h,
				  SOFT_SDK_CONFIG.w * SOFT_SDK_CONFIG.h,
				  (SOFT_SDK_CONFIG.w / 2) * (SOFT_SDK_CONFIG.h / 2)
				)
				break
			  case 5:
				var buffer = RequestIFrame(SDK_CONFIG.sn)
				SOFT_SDK_CONFIG.webSocketWorker.postMessage(buffer)
			}
		})

		SOFT_SDK_CONFIG.webSocketWorker = new Worker('./sdk/minjs/websocket.worker.js') // Right
		SOFT_SDK_CONFIG.webSocketWorker.postMessage({
			socketURL: SDK_CONFIG.socketURL,
			socketExtranetURL: SDK_CONFIG.socketExtranetURL,
			sn: SDK_CONFIG.sn,
			token: SDK_CONFIG.token,
		});
		SOFT_SDK_CONFIG.webSocketWorker.onopen = (event) => {
			console.log(
			  '===========自定义 OPEN ===========',
			  SOFT_SDK_CONFIG.webSocketWorker,
			  event
			)
		};
		SOFT_SDK_CONFIG.webSocketWorker.onmessage = (event) => {
			if (event.data === 'close') {
				console.log('触发CLose。。。', SOFT_SDK_CONFIG.webSocketWorker)
				SOFT_SDK_CONFIG.webSocketWorker.postMessage('restart')
			}
			if ( typeof event.data === 'object' && (event.data.setResolving === 0 || event.data.setResolving === 1) ) {
				// 设置横竖屏
				SDK_CONFIG.isLandscape = !event.data.setResolving;
				console.log('设置横竖屏: ', event.data.setResolving, SDK_CONFIG.isLandscape)
				SDK_CONFIG.landscapeIsSeted = true;
				// 设置推流音视频的宽高大小
				CLOUD_GAME_SDK.setVideoSize();
			}
			// 断开流
			if (typeof event.data === 'object' && event.data.readyState === 3) {
			  	console.log('断流断流断流33: ', event.data.readyState)
				//   this.returnBack()
			}
	
			var cmd = {
			  type: 'rawData',
			  data: event.data
			}
			if (document.visibilityState == 'visible' && SDK_CONFIG.isEntered) {
				// console.log('发送首帧 --- SEND')
				SOFT_SDK_CONFIG.webSocketWorker.postMessage(RequestIFrame(SDK_CONFIG.sn))
				SDK_CONFIG.isEntered = false
			}
			var input = new Uint8Array(event.data)
			if (input[0] == 0xff) {
				// 音频
				document.visibilityState == 'visible' && CLOUD_GAME_SDK.decodeAAC(input)
			}
			if (input[0] == 0 && input[1] == 0 && input[2] == 0 && input[3] == 1) {
				let nalType = input[4] & 0x1f
				if (nalType == 0x07 || nalType == 0x08 || nalType == 0x05) {
					if (!SDK_CONFIG.isEntered) {
						SDK_CONFIG.isEntered = true
					}
				}
				if (document.visibilityState == 'visible' && SDK_CONFIG.isEntered) {
					SOFT_SDK_CONFIG.decodeWoker.postMessage(cmd)
				}
			}
		}

		// 推流后的默认配置
		CLOUD_GAME_SDK.commandWorkeInit();
		console.log(58888, SOFT_SDK_CONFIG.decodeWoker, '===============')
	},
	// 指令流初始化
	commandWorkeInit: () => {
		SDK_CONFIG.controlWs = new WebSocket(SDK_CONFIG.socketExtranetURL);
		SDK_CONFIG.controlWs.binaryType = 'arraybuffer';
		// 指令流====================================
		SDK_CONFIG.controlWs.addEventListener('open', function(event) {
			if (Number(CARD_INFO.noRestart) !== 1) {
				var buffer = ExexuteSetPhoneSize('1920', '1080');
				var bufferSendBitRate = ExexuteSendBitRate('1');
				var inputMethodBuffer = JSON.stringify({
					"type": "InputMethod",
					"data": {
						"type": 2 // 1即玩云键盘 2试玩讯飞键盘
					}
				});
				SDK_CONFIG.controlWs.send(inputMethodBuffer)
				SDK_CONFIG.controlWs.send(bufferSendBitRate);
				SDK_CONFIG.controlWs.send(buffer);
				console.log("控制端口已经打开");
				// 信令通道链接成功
				bounceFun(NSUInteger.GameEventWebSocketOkMsg);
			}
		});
		SDK_CONFIG.controlWs.addEventListener('message', function(event) {
			const controlData = JSON.parse(event.data)
			extraData.aiquData = controlData
			if (extraData.aiquData.event === 'aiqu_game_invoke_pay') {
				console.log(588, '支付被点击了')
				// 云游戏支付透传
				bounceFun(NSUInteger.GameEventWebSocketPay);
			}
		});

		// 推流后的默认配置
		CLOUD_GAME_SDK.connectAfterInit();
	},
	// MSE ---- 连接
	doConnectByMSE: () => {
		if (SDK_CONFIG.jmuxer != undefined) SDK_CONFIG.jmuxer.destroy();
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

		let lastRequestTime = 0;
		SDK_CONFIG.pingTimer = setInterval(() => {
			// 加一个发送：处理 video 标签播放机制
			let interval = new Date().getTime() - lastRequestTime;
			if (interval >= 60*1000) {
				lastRequestTime = new Date().getTime()
				SDK_CONFIG.ws.send(RequestIFrame(SDK_CONFIG.sn))
				console.log("60S 主动请求I帧");
			}

			if (SDK_CONFIG.ws.readyState === 1) {
				SDK_CONFIG.ws.send('ping')
			} else {
				// this.returnBack()
			}
		}, 2000)
	
		// 音频流关闭时进行重连操作
		SDK_CONFIG.ws.onclose = function(e) {
			console.log('打印关闭信息', e)
			if (e.currentTarget == SDK_CONFIG.ws) {
				console.log('同一个ws, 发生断网, 应该重连');
				CLOUD_GAME_SDK.doConnectByMSE();
			} else {
				console.log('ws 已经发生改变, 已经被new 过了，不必处理');
			}
		}
	
		// 指令流====================================
		SDK_CONFIG.controlWs.addEventListener('open', function(event) {
			if (Number(CARD_INFO.noRestart) !== 1) {
				var buffer = ExexuteSetPhoneSize('1920', '1080');
				var bufferSendBitRate = ExexuteSendBitRate('1');
				var inputMethodBuffer = JSON.stringify({
					"type": "InputMethod",
					"data": {
						"type": 2 // 1即玩云键盘 2试玩讯飞键盘
					}
				});
				SDK_CONFIG.controlWs.send(inputMethodBuffer)
				SDK_CONFIG.controlWs.send(bufferSendBitRate);
				SDK_CONFIG.controlWs.send(buffer);
				console.log("控制端口已经打开");
				// 信令通道链接成功
				bounceFun(NSUInteger.GameEventWebSocketOkMsg);
			}
		});
		SDK_CONFIG.controlWs.addEventListener('message', function(event) {
			const controlData = JSON.parse(event.data)
			extraData.aiquData = controlData
			if (extraData.aiquData.event === 'aiqu_game_invoke_pay') {
				console.log(588, '支付被点击了')
				// 云游戏支付透传
				bounceFun(NSUInteger.GameEventWebSocketPay);
			}
		});
	
		// 音频流====================================
		SDK_CONFIG.ws.addEventListener('open', function(event) {
			var verifyBuffer = VerifyCode(SDK_CONFIG.sn, SDK_CONFIG.token);
			console.log("鉴权报文:" + PrintArry(verifyBuffer));
			SDK_CONFIG.ws.send(verifyBuffer);
			/* 定时器  判断每5秒是否长时间未进行页面操作 */
			SDK_CONFIG.outsetInterval = setInterval(SDK_CONFIG.outTime, 5000);
			// 安卓卡链接成功
			bounceFun(NSUInteger.GameEventCardConnectOkMsg);
		});
		SDK_CONFIG.ws.addEventListener('error', function(event) {
			console.log("连接失败");
			// 云游戏重连失败
			bounceFun(NSUInteger.GameEventReConnectFailMsg);
		});
		SDK_CONFIG.ws.addEventListener('message', function(event) {
			// JAVA服务器转发	  
			var data = CLOUD_GAME_SDK.ParseProto(event.data); 
			var input = new Uint8Array(event.data);
			// 喂音频
			if (data.audio != null) {
				if (input[0] == 0xff) {
					if (!SDK_CONFIG.lastTime) {
						SDK_CONFIG.lastTime = new Date().getTime()
					}
					const cost = new Date().getTime() - SDK_CONFIG.lastTime
					SDK_CONFIG.lastTime = new Date().getTime()
					SDK_CONFIG.aacQueue.push(input)
					if (SDK_CONFIG.aacQueue.length > 1) {
						document.visibilityState == 'visible' && CLOUD_GAME_SDK.decodeAAC(SDK_CONFIG.aacQueue.shift())
					}
					if (cost < 22) {
						// SDK_CONFIG.sleep(22 - cost)
					}
				}
			}
			if (data.frameType != undefined && data.frameType != 1 && data.frameType != 6) {
				if (data.frameType == 7) {
					let info = spsParser(data.video);
					// 视频分辨率与当前的不一致时
					if (info && info.width != SDK_CONFIG.myVideo.videoWidth && info.height != SDK_CONFIG.myVideo.videoHeight) {
						if (SDK_CONFIG.myVideo.videoWidth > 0) {
							if (SDK_CONFIG.jmuxer != undefined) SDK_CONFIG.jmuxer.destroy();
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
					console.log('等待I帧成功')
					SDK_CONFIG.isEntered = true
				}
				if (SDK_CONFIG.isEntered) {
					SDK_CONFIG.jmuxer.feed(data)
				}
			}
		});
	
		// 推流后的默认配置
		CLOUD_GAME_SDK.connectAfterInit();
	},
	// common -- 推流后的默认配置
	connectAfterInit: () => {
		// SDK_CONFIG.flag = setInterval(function() {
		// 	if (SDK_CONFIG.ws != undefined) {
		// 		SDK_CONFIG.ws.send("ping");
		// 	}
		// }, 2000);
		
		SDK_CONFIG.myVideo.onplay = function() {
			SDK_CONFIG.myVideo.controls = false;
		}
		
		SDK_CONFIG.myVideo.oncontextmenu = function(event) {
			var buffer = ExexuteKeyDown(4);
			SDK_CONFIG.ws.send(buffer);
		}

		SDK_CONFIG.myVideo.addEventListener('resize', (e) => {
			// document.querySelector('[data-content="resolution"]').textContent = [
			// 	e.target.videoWidth,
			// 	e.target.videoHeight
			// ].join('x');
		});
	
		document.addEventListener("visibilitychange", CLOUD_GAME_SDK.visibilityCallBack);
	
		SDK_CONFIG.myVideo.addEventListener('pause', function() {
			//console.log("视频播放暂停");
			SDK_CONFIG.isFeed = false;
		});
		
		document.onkeydown = function(event) {
			// console.log('===========我打开键盘了', event.keyCode)
			let isMac = navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0
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
			if (keyCode !== -1) {
				console.log('===========我打开键盘了', keyCode)
				var buffer = ExexuteKeyDown(keyCode, SDK_CONFIG.sn)
				// ========================== ★★★★★ VIP Start =========================================
				const deviceType = judgeDeviceType();
				if (deviceType.type === 1) {
					// ios软解码
					SOFT_SDK_CONFIG.webSocketWorker.postMessage(buffer)
					SDK_CONFIG.controlWs.send(buffer)
				} else {
					// mse 解码
					SDK_CONFIG.ws.send(buffer);
					SDK_CONFIG.controlWs.send(buffer);
				}
				// ========================== ★★★★★ VIP Ended =========================================

			}
		};
		// SDK_CONFIG.myContainer.onkeydown = function(event) {
		// 	// SDK_CONFIG.myVideo.controls = false;
		// 	console.log('===========我打开键盘了')
		// 	var buffer = ExexuteKeyDown(event.keyCode);
		// 	SDK_CONFIG.ws.send(buffer);
		// 	SDK_CONFIG.controlWs.send(buffer);
		// }
		SDK_CONFIG.myVideo.onkeydown = function(event) {
			console.log('===========我打开键盘了')
			var buffer = ExexuteKeyDown(event.keyCode, SDK_CONFIG.sn);
			// SDK_CONFIG.ws.send(buffer);
			// SDK_CONFIG.controlWs.send(buffer);
		}
	},
	// 设置推流音视频的宽高大小
	setVideoSize: () => {
		console.log('Get Game Info-----------', SDK_CONFIG.isLandscape ? '横屏' : '竖屏')
		let playerVideo = document.getElementById(SDK_CONFIG.videoNode);
		let canvasWidth= String(document.body.offsetWidth || window.innerWidth)
    	let canvasHeight = String(document.body.offsetHeight || window.innerHeight)
		let cw = Number(canvasWidth);
		let ch = Number(canvasHeight);
		// ========================== ★★★★★ VIP Start =========================================
		const deviceType = judgeDeviceType();
		if (deviceType.type === 1) {
			// ios软解码，清晰度加倍
			cw = cw * 2;
			ch = ch * 2;
		}
		// ========================== ★★★★★ VIP Ended =========================================
		if (playerVideo) {
			playerVideo.setAttribute('width',  (SDK_CONFIG.isLandscape ? ch : cw) + 'px')
			playerVideo.setAttribute('height',  (SDK_CONFIG.isLandscape ? cw : ch) + 'px')
		}
	},
	touchClick: (event, type) => {
		SDK_CONFIG.oldTime = new Date().getTime(); // 鼠标点击重置停留的时间
		var canvasWidth = Number(window.innerWidth);
		var canvasHeight = Number(window.innerHeight);
		const onClickHandle = {
			0: ExexuteMouseDown,
			1: ExexuteMouseUp,
			2: ExexuteMouseMove
		}
		console.log(event, type, '588', SDK_CONFIG.isLandscape)
		let touches: any[] = event.changedTouches
		var ongoingTouches: any[] = []
		for (var i = 0; i < touches.length; i++) {
			var idx = ongoingTouches.findIndex(function (ele) {
			return ele.identifier === touches[i].identifier
			})
			// 如果 宽高与横竖屏 不一致，需要强制更换
			// 1. 竖屏游戏： 宽 大于 高。
			if (SDK_CONFIG.videoWidth > SDK_CONFIG.videoHeight && !SDK_CONFIG.isLandscape) {
				let temp = SDK_CONFIG.videoHeight;
				SDK_CONFIG.videoHeight = SDK_CONFIG.videoWidth;
				SDK_CONFIG.videoWidth = temp;
			}
			// 2. 横屏游戏： 高 大于 宽。
			if (SDK_CONFIG.videoWidth < SDK_CONFIG.videoHeight && SDK_CONFIG.isLandscape) {
				let temp = SDK_CONFIG.videoHeight;
				SDK_CONFIG.videoHeight = SDK_CONFIG.videoWidth;
				SDK_CONFIG.videoWidth = temp;
			}
			console.log(555555, SDK_CONFIG.videoWidth, SDK_CONFIG.videoHeight, canvasWidth, canvasHeight)
			// 横屏游戏
			if (SDK_CONFIG.isLandscape) {
				// 根据游戏的分辨率 设置
				let posX = (SDK_CONFIG.videoWidth * 1.0 * touches[i].clientY) / canvasHeight
				let posY = (SDK_CONFIG.videoHeight * 1.0 * (canvasWidth - touches[i].clientX)) / canvasWidth
				// // 重力感应
				// if (this.SDK_CONFIG.isLandscape) {
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
				SDK_CONFIG.controlWs.send(buffer)
			} else {
				// 竖屏游戏
				let touches = event.changedTouches
				// 根据游戏的分辨率 设置
				let posX = (touches[i].clientX * SDK_CONFIG.videoWidth * 1.0) / canvasWidth
				let posY = (touches[i].clientY * SDK_CONFIG.videoHeight * 1.0) / canvasHeight
				// // 重力感应
				// if (this.SDK_CONFIG.isLandscape) {
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
				SDK_CONFIG.controlWs.send(buffer)
			}
			if (idx < 0) {
				ongoingTouches.push(touches[i])
			}
		}
	},
	doSomeConfig: () => {
		SDK_CONFIG.ws.send(ConfigChannel(SDK_CONFIG.sn, "chaohang"));
		var checkBuffer = GetScreenState();
		SDK_CONFIG.ws.send(checkBuffer);
	},
	convertPosDefaultLandspace: (x, y) => {
		let posX, posY;
		if (!SDK_CONFIG.isLandscape) {
			// xx
		} else {
			posX = (x * SDK_CONFIG.videoWidth * 1.0) / SDK_CONFIG.myVideo.clientWidth;
			posY = (y * SDK_CONFIG.videoHeight * 1.0) / SDK_CONFIG.myVideo.clientHeight;
		}
		return {
			x: posX,
			y: posY
		};
	},
	convertPos: (x, y) => {
		var posX, posY; //500, 800
		// 如果是横屏
		if (SDK_CONFIG.isLandscape) {
			posX = (x / SDK_CONFIG.myVideo.clientWidth) * SDK_CONFIG.videoWidth * 1.0
			posY = (y / SDK_CONFIG.myVideo.clientHeight) * SDK_CONFIG.videoHeight * 1.0
		} else {
			posX = (1 - y / SDK_CONFIG.myVideo.clientHeight) * SDK_CONFIG.videoHeight * 1.0
			posY = (x / SDK_CONFIG.myVideo.clientWidth) * SDK_CONFIG.videoWidth * 1.0
		}
		return {
			x: posX,
			y: posY
		};
	},
	createNewDecoder: () => {
		if (SDK_CONFIG.jmuxer != undefined) SDK_CONFIG.jmuxer.destroy();
		SDK_CONFIG.jmuxer = new JMuxer(SDK_CONFIG.JMuxerOptions);
		SDK_CONFIG.myVideo.play();
		SDK_CONFIG.isWaitSps = true;
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
						SDK_CONFIG.isLandscape = false;
					} else {
						console.log("安卓卡此时横屏");
						// 横屏处理
						SDK_CONFIG.isLandscape = true;
					}
					SDK_CONFIG.landscapeIsSeted = true;
					// 设置推流音视频的宽高大小
					CLOUD_GAME_SDK.setVideoSize();
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
	todo: () => {

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
			if (pcmData.length) {
				SDK_CONFIG.aacPlayer.feed(pcmData)
			}
		} else {
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