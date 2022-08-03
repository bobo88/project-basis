import { SOFT_SDK_CONFIG } from './config'

import { FFMPEGHELPER_MODULE } from './soft-decoder/ffmpeghelper'
import { ceil, spsParser, ue, se, u } from './sps_parser'

const { Module } = FFMPEGHELPER_MODULE

export function doSomeInit() {
	var allocSize = SOFT_SDK_CONFIG.maxWidth * SOFT_SDK_CONFIG.maxHeight * 3 / 2;
	SOFT_SDK_CONFIG.golbalYuvData = new Uint8Array(allocSize);
	console.log("调用初始化");
}

self.Module.onRuntimeInitialized= function() {
	SOFT_SDK_CONFIG.isFinish = true;
	doSomeInit();
	console.log("************* 打开编码器");
	var ret = Module._openDecoder();
	if (!ret) {
		console.log("打开编码器成功");
	}
}

self.addEventListener('message', function(e) {
	var msg = e.data;
	if(msg.type == "rawData") {
		var buffer = e.data.data;
		// 音频解码
		if(buffer[0] == 0xff){
			if(SOFT_SDK_CONFIG.isFinish){
				//decodeAAC(buffer);
			}
		} else {
			SOFT_SDK_CONFIG.fpsCount++;
			let interval = new Date().getTime() - SOFT_SDK_CONFIG.lastTime;
			if(interval >= 1000) {
				SOFT_SDK_CONFIG.lastTime = new Date().getTime();
				printWorkerLog("网络 fps:" + SOFT_SDK_CONFIG.fpsCount);
				SOFT_SDK_CONFIG.fpsCount = 0;
			}
			var type = buffer[4]&0x1f;
			if(type == 7) {				
				let info = spsParser(buffer);
				if(SOFT_SDK_CONFIG.curFrameWidth != undefined && SOFT_SDK_CONFIG.curFrameHeight != undefined) {
					// 分辨率发生改变，切换		
					if(info.width != SOFT_SDK_CONFIG.curFrameWidth || info.height != SOFT_SDK_CONFIG.curFrameHeight) {
						switchNewStream();				
					}
				}
				SOFT_SDK_CONFIG.curFrameWidth  = info.width;
				SOFT_SDK_CONFIG.curFrameHeight = info.height;		
				SOFT_SDK_CONFIG.h264Queue.push(buffer);
			} else{
				SOFT_SDK_CONFIG.h264Queue.push(buffer);				
			}
		}
	}

	// 释放解码器
	if(msg.type == "close") {
		closeDecoder()
	}
	// 分辨率切换实现
	if(msg.type == "switchSharpness") {}
}, false);

export function doRequestIFrame() {
	var objData = {
		cmd: 5,
	};
	self.postMessage(objData);
	SOFT_SDK_CONFIG.lastRequestTime = new Date().getTime();
}

// 将worker 信息通过控制台输出
export function printWorkerLog(text) {
	var objData = {
		cmd: 0,
		data:text
	};
	self.postMessage(objData);
}

export function decodeVideo() {
	let arryData;
	if (SOFT_SDK_CONFIG.h264Queue.length > 0 && SOFT_SDK_CONFIG.isFinish) {				
		if (SOFT_SDK_CONFIG.h264Queue.length >= 25 && SOFT_SDK_CONFIG.isFinish) {			
			SOFT_SDK_CONFIG.isFeed = false;
			printWorkerLog("解不过来" + SOFT_SDK_CONFIG.h264Queue.length);
			while(SOFT_SDK_CONFIG.h264Queue.length > 0) {
				SOFT_SDK_CONFIG.h264Queue.shift();
			}
			doRequestIFrame();
			printWorkerLog("重新请求I帧");
		}else {
			arryData = SOFT_SDK_CONFIG.h264Queue.shift();
			let nal_type = arryData[4] & 0x1f;
			if( nal_type == 5 || nal_type == 7 || nal_type == 8) {
				if(!SOFT_SDK_CONFIG.isFeed) SOFT_SDK_CONFIG.isFeed = true;
			}
		}
	
		if (SOFT_SDK_CONFIG.isFeed) {
			let startTime = new Date().getTime();
			decodeH264(arryData);
			let cost = new Date().getTime() - startTime;
			SOFT_SDK_CONFIG.decodeCostSum += cost;
			SOFT_SDK_CONFIG.decodeSuccessCount++;
			
			//计算100次解码平均耗时
			if(SOFT_SDK_CONFIG.decodeSuccessCount == 100) {
				let avg = SOFT_SDK_CONFIG.decodeCostSum / SOFT_SDK_CONFIG.decodeSuccessCount;
				let avgFps = 1000/avg;
				printWorkerLog("解码平均耗时:" + avg + "ms，解码fps:" + avgFps );
				SOFT_SDK_CONFIG.decodeCostSum = 0;
				SOFT_SDK_CONFIG.decodeSuccessCount = 0;
			}
		}
	} 
}
var timeFlag = setInterval(decodeVideo, 1);
// 实现C 端到js yuv数据赋值, 并分配给opengl 渲染
/*
* yuvData, 存放yuv数据的数组
* inputYuvPtr C++ 
*/
export function dispatchYuvData(yuvData, inputYuvPtr, videoWidth, videoHeight, copyLen, inputPtr){
	for (let i = 0; i < copyLen; i++) {
		yuvData[i] = Module.HEAPU8[(inputYuvPtr) + i];
	}
	
	var curTime = new Date().getTime();
	var objData = {
		cmd: 1,
		data: yuvData,
		time: curTime,
		width:videoWidth,
		height:videoHeight
	};
	Module._free(inputPtr);
	self.postMessage(objData);
}

export function decodeH264(data) {
	var frameWidth = 0;
	var frameHeight = 0;
	var inputPtr = Module._malloc(data.length); //输入数据

	for (let i = 0; i < data.length; i++) {
		Module.HEAPU8[(inputPtr) + i] = data[i]; //转换为堆数据
	}
	var time = new Date().getTime();
	var allocSize = SOFT_SDK_CONFIG.maxWidth * SOFT_SDK_CONFIG.maxHeight *3/2;
	if(SOFT_SDK_CONFIG.globalYuvPtr == undefined) {
	   SOFT_SDK_CONFIG.globalYuvPtr = Module._malloc(allocSize);
	}
	var ret = Module._feedData(inputPtr, data.length, SOFT_SDK_CONFIG.globalYuvPtr);
	// 解码成功才考虑渲染
	if (ret >= 0) {
		frameWidth  = Module._getVideoWidth();//拿到解码器宽、高
		frameHeight = Module._getVideoHeight();		
		// console.log("+++++++++++++宽:" + frameWidth + "高:" + frameHeight);
		var curCost = new Date().getTime() - time;
		var copyLen = frameWidth*frameHeight*3/2;//只拷贝必须的长度
		//console.log("解码成功: %d, %d" + frameWidth, frameHeight);
		// 第一帧因为画面时全绿色的不渲染
		if(SOFT_SDK_CONFIG.renderCount > 1) {		
			// console.log(6888, golbalYuvData.length, globalYuvPtr, frameWidth, frameHeight, copyLen)
		   dispatchYuvData(SOFT_SDK_CONFIG.golbalYuvData, SOFT_SDK_CONFIG.globalYuvPtr, frameWidth, frameHeight, copyLen, inputPtr);	
		} else {
		   SOFT_SDK_CONFIG.renderCount++;
		}
	} else {
		// console.log("+++++++++++++解码失败:" +  ret, data);
		Module._free(inputPtr);
	}
	// console.log('=========== FREE被执行了 ================')
}

export function switchNewStream() {
	closeDecoder();		
	var ret = Module._openDecoder();//再次开启解码器	
	var timeFlag = setInterval(decodeVideo, 1);
	console.log("切换解码器成功");
}
export function closeDecoder() {
	console.log('释放解码器')
	clearInterval(timeFlag);//关闭原有定时器
	Module._closeDecoder();
	SOFT_SDK_CONFIG.renderCount = 0;
	if(SOFT_SDK_CONFIG.globalYuvPtr != undefined)
	{
		Module._free(SOFT_SDK_CONFIG.globalYuvPtr);
		SOFT_SDK_CONFIG.globalYuvPtr = undefined;
	}
	console.log("此时buffer长度: %d", SOFT_SDK_CONFIG.h264Queue.length);
	while(SOFT_SDK_CONFIG.h264Queue.lengh > 0)
	{
		SOFT_SDK_CONFIG.h264Queue.shift();
	}
}

(function(){
	if(self.Module == undefined) {
		console.log("初始化失败");
	}else {
		console.log("初始化OK");
	}
})()

// export const SOFT_SELF = softdecoder;
