var videoPacketNum = 0;//
var hasPPS = false;
var curTime = new Date().getTime();
var frameCount = 0;

var socketURL = null;
var ws = null;
var sn = null;
var cardToken = null;

self.importScripts("helper.js");

self.addEventListener('message', function (e) {

	if (typeof e.data === 'object' && e.data.socketURL) {
		sn = e.data.sn;
		cardToken = e.data.token;
		// socketURL = `ws://14.18.190.138:16925`;
		socketURL = e.data.socketURL;
		// socketURL = `ws://14.18.190.138:41125`;
		ws = new WebSocket(socketURL)
		doConnect();
	}
	if (e.data === 'restart') {
		console.log('Do connect......')
		ws = null;
		ws = new WebSocket(socketURL)
		doConnect();
	}
	
	console.log('Test: ', ws.readyState === 1)
	// 添加状态判断，当为OPEN时，发送消息
	try {
		ws && ws.send(e.data);
	} catch (error) {
		console.log(error)
	}
}, false);

function doConnect() {
	ws.binaryType = 'arraybuffer';
	ws.addEventListener('open', function (event) {
		console.log("发送配置帧");
		doVerify();
		// self.postMessage(event);
	});
	self.addEventListener('open', function (e) {
		console.log('OPEN**************开打开开发开发施工方萨格')
		ws.send(e.data);
	}, false);
  
	if (ws) {
		setInterval(() => {
			ws.send('ping')
			self.postMessage({
				"readyState": ws.readyState
			});
			// console.log('Ping...',  ws.readyState)
			// if (ws.readyState === 1) {
			// 	ws.send('ping')
			// 	self.postMessage({
			// 		"readyState": ws.readyState
			// 	});
			// } else {
			// 	self.postMessage({
			// 		"readyState": ws.readyState
			// 	});
			// }
		}, 3000)
	}
	
	function doConcfigChannel() {
		ws.send(ConfigChannel(sn));
	}

	function doVerify() {
		var verifyBuffer = VerifyCode(sn, cardToken);
		ws.send(verifyBuffer);

		var checkBuffer = GetScreenState(sn);
		ws.send(checkBuffer);
	}

	ws.addEventListener('message', function (event) {
		// console.log('State状态值zzzzz: ', ws.readyState)
		// if (ws.readyState !== 1) {
		// 	self.postMessage({
		// 		"readyState": 3
		// 	});
		// }
		var input = new Uint8Array(event.data);
		if (new Date().getTime() - curTime > 2000) {
			ws.send("ping");
			curTime = new Date().getTime();
		}

		if (input[0] == 0 && input[1] == 0 && input[2] == 0 && input[3] == 1) {	
			var nalType = input[4] & 0x1f;
			frameCount++;
			if (nalType == 0x05 || nalType == 0x05 || nalType == 0x07) {
				//console.log("收到I 帧");
				self.postMessage(input);
				hasPPS = true;
				ws.send("ping");
			}

			if (!hasPPS)//请求I 帧
			{
				videoPacketNum++;
				if (videoPacketNum > 2 && !hasPPS) {
					console.log("packetnum 编号" + videoPacketNum);
					videoPacketNum = 0;
					ws.send(RequestIFrame(sn));
					hasPPS = true;
				}
			}
			else {
				self.postMessage(input);
			}
		}
		else if (input[0] == 0xff) {
			self.postMessage(input);
		}

		if (input[0] == 0x68) {
			if (input[23] == 0x5c) {
				if (CheckVerifyCode(input)) {
					console.log("鉴权通过，配置通道");
					doConcfigChannel();
					var buffer = makeSharpness(3);				
					ws.send(buffer);
					var bufferFps = fpsSet(20)
					ws.send(bufferFps);
				}
				else {
					console.log("鉴权失败:");
				}
			}
			//横竖屏标识
			if (input[23] == 0x05) {
				//0101 横竖屏相关
				if (input[28] == 0x01 && input[29] == 0x01) {
					var state = CheckScreenDirection(input.slice(24, 24 + 8));
					if (state == 1) {
						console.log("安卓卡此时竖屏");
						self.postMessage({
							"setResolving": 1
						});
					} else {
						console.log("安卓卡此时横屏 1111");
						self.postMessage({
							"setResolving": 0
						});
					}
				}
			}
		}
	});

	ws.addEventListener('close', function (event) {
		console.log('Msg Close....')
		self.postMessage('close');
	});

}

