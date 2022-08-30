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
