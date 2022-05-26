var ws = undefined;
var controlWs = undefined;
var videoWidth = 1280;
var videoHeight = 720;
var jmuxer;
var isVisuable = true;
var isFeed = true;
var isDrag = false;
var isFinish = false;
var hasSwitch = false;
var isWaitSps = false;

var curTime = new Date().getTime();
var requestTime = new Date().getTime(); //记录离开时间
var myVideo = document.getElementById("player");
var myContainer = document.getElementById("container");
var h264Buffer = [];

// 默认值声明
var DEF_OBJ = {
    // 是否横屏
    isLandscape: false,
    // 清晰度
    sharpnessLevel: 2,
    socketURL: 'ws://14.18.190.138:50161',
    socketExtranetURL: 'ws://14.18.190.138:51161',
    sn: 'RK3923C1201900139',
    token: 'mc/eDLc0WtK18xQky0nc/gXIMkaVWvNIhZrmMXqEkvhAljpyobEPnd/i0fxtUAMzxwRMsxogovAuUG+DkBya4g==',
    JMuxerOptions: {
        node: 'player',
        flushingTime: 33,
        fps: 30,
        mode: 'video',
        debug: false
    },
    payURL: 'https://api-alipay.q1.com/app/wappay/api.php?gameid=2109&body=%e4%b8%ba%e9%80%9a%e8%a1%8c%e8%af%81%e8%b4%a6%e5%8f%b7bccs0321%e5%85%85%e5%85%a56.00%e5%85%83&out_trade_no=4109164800034510001&subject=%e6%b8%b8%e6%88%8f%e5%85%85%e5%80%bc-bc***21&total_amount=6.00&sign=f4475660b8ee8fe2ba1cb7dbe7eafd30',
}

Module = {};
Module.onRuntimeInitialized = function() {
    console.log("Wasm 加载成功!")
    isFinish = true;
}

document.addEventListener("visibilitychange", visibilityCallBack);

/*var pcmPlayer = new PCMPlayer({
    encoding: '16bitInt',
    channels: 2,
    sampleRate: 44100,
    flushingTime: 22,
    debug:false
});*/


myVideo.addEventListener('pause', function() {
    //console.log("视频播放暂停");
    isFeed = false;
});


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


function switchSharpness() {
    hasSwitch = true;
    var buffer = makeSharpness(DEF_OBJ.sharpnessLevel);
    console.log("切换到level:" + DEF_OBJ.sharpnessLevel);
    ws.send(buffer);
    isFeed = false;

    if (DEF_OBJ.sharpnessLevel < 4)
        DEF_OBJ.sharpnessLevel++;
    else
        DEF_OBJ.sharpnessLevel = 2;

    createNewDecoder();
    hasSwitch = false;
}

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

// Test: 调起支付页面
function switchPay () {
    $('#inlineFrameExample').attr('src', DEF_OBJ.payURL)
    $('#ifDiv').show()
}

window.onload = function() {
    jmuxer = new JMuxer(DEF_OBJ.JMuxerOptions);

    if (undefined != ws) {
        alert("websocket已经有连接了");
        return;
    }

    function doConnect() {
        console.log("执行doconnect");
        ws = new WebSocket(DEF_OBJ.socketURL);
        controlWs = new WebSocket(DEF_OBJ.socketExtranetURL);
        ws.binaryType = 'arraybuffer';
        controlWs.binaryType = 'arraybuffer';
        curTime = new Date().getTime();

        // 音频流关闭时进行重连操作
        ws.onclose = function(e) {
            console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
            console.log("时间: " + new Date() + e);
            // alert("websocket连接断开，准备重连");
            doConnect();
        }

        // 指令流====================================
        controlWs.addEventListener('open', function(event) {
            var buffer = ExexuteSetPhoneSize('1280', '720');
            var bufferSendBitRate = ExexuteSendBitRate('1');
            controlWs.send(bufferSendBitRate);
            controlWs.send(buffer);
            console.log("控制端口已经打开");
        });
        controlWs.addEventListener('message', function(event) {
            if (event.data.type === 'customGameEvent') {
                const pa = JSON.parse(event.data)
                if (pa.data.dataType === 'payInfo') {
                    $('#ifDiv').show()
                }
            }
            console.log('【指令流】: ', event.data)
        });

        // 音频流====================================
        ws.addEventListener('open', function(event) {
            var verifyBuffer = VerifyCode(DEF_OBJ.sn, DEF_OBJ.token);
            console.log("鉴权报文:" + PrintArry(verifyBuffer));
            ws.send(verifyBuffer);

        });
        ws.addEventListener('error', function(event) {
            console.log("连接失败");
        });
        ws.addEventListener('message', function(event) {
            // $('#ifDiv').hide()
            console.log("【音频流】-- 检测到宽 %d, 高 %d, 控件宽 %d, %d", myVideo.videoWidth, myVideo.videoHeight);
            var data = ParseProto(event.data);  // JAVA服务器转发	  
            console.log(666, data.frameType)
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
    }

    doConnect();

    var flag = setInterval(function() {
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


    document.querySelector('video').addEventListener('resize', (e) => {
        document.querySelector('[data-content="resolution"]').textContent = [
            e.target.videoWidth,
            e.target.videoHeight
        ].join('x');
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

    myVideo.onmousemove = function(event) {
        if (event.button == 0) {
            var posX = event.offsetX * videoWidth * 1.0 / myVideo.clientWidth;
            var posY = event.offsetY * videoHeight * 1.0 / myVideo.clientHeight;
            var buffer = ExexuteMouseMove(posX.toString(), posY.toString());
            ws.send(buffer);
        }
    }

    myVideo.onmousedown = function(event) {
        myVideo.play();
        // myVideo.controls = false;
        if (event.button == 0) {
            var remotePos = convertPos(event.offsetX, event.offsetY);
            var buffer = ExexuteMouseDown(remotePos.x.toString(), remotePos.y.toString());
            //ws.send(buffer);
            isDrag = true;
            // keyBuffer = ExexuteKeyDown(24);
            ws.send(buffer);
            // ws.send(keyBuffer);
            controlWs.send(buffer);
            // controlWs.send(keyBuffer);
        }
    }

    myVideo.onmouseup = function(event) {
        // console.log('===========我鼠标抬起了')
        isDrag = false;
        var remotePos = convertPos(event.offsetX, event.offsetY);
        var buffer = ExexuteMouseUp(remotePos.x.toString(), remotePos.y.toString());
        ws.send(buffer);
        controlWs.send(buffer);
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