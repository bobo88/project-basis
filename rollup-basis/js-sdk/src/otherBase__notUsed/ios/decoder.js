var isFinish = false;
var h264Queue = [];
var decodeCount = 1;

var maxWidth = 1080;
var maxHeight = 1920;
var globalYuvPtr = undefined;
var golbalYuvData;//全局，只分配一次
var renderCount = 0;
var curFrameWidth = undefined;
var curFrameHeight = undefined;

let fpsCount = 0;
let isFeed = true;
let decodeSuccessCount = 0;
let lastTime = new Date().getTime();
let lastRequestTime = 0;
let decodeCostSum = 0;


// self.Module = {};
console.log("运行decoder.js 2222", self);
self.importScripts("ffmpeghelper.js");
self.importScripts("spsParser.js");

function doSomeInit() {
	var allocSize = maxWidth * maxHeight *3/2;
	golbalYuvData = new Uint8Array(allocSize);
	console.log("调用初始化");
}

self.Module.onRuntimeInitialized= function() {
		isFinish = true;
		doSomeInit();
		console.log("************* 打开编码器");

		var ret = Module._openDecoder();
	
		if (!ret) {
			console.log("打开编码器成功");
		}
	}

self.addEventListener('message', function(e) {
	var msg = e.data;
	if(msg.type == "rawData")
	{
		var buffer = e.data.data;
		if(buffer[0] == 0xff)//音频解码
		{
			if(isFinish)
			{
				//decodeAAC(buffer);
			}
		}
		else
		{
			fpsCount++;
			let interval = new Date().getTime() - lastTime;

			if(interval >= 1000) {
				lastTime = new Date().getTime();
				printWorkerLog("网络 fps:" + fpsCount);
				fpsCount = 0;
			}
			var type = buffer[4]&0x1f;
			if(type == 7)
			{				
				let info = spsParser(buffer);
				if(curFrameWidth != undefined && curFrameHeight != undefined) 
				{
					if(info.width != curFrameWidth || info.height != curFrameHeight)//分辨率发生改变，切换		
					{
						switchNewStream();				
					}
				}
				curFrameWidth  = info.width;
				curFrameHeight = info.height;		
				h264Queue.push(buffer);
			}
			else
			{
				h264Queue.push(buffer);				
			}
			
		}
	}

	if(msg.type == "close")//释放解码器
	{
		closeDecoder()
	}
	if(msg.type == "switchSharpness")//分辨率切换实现
	{
		
	}

}, false);

function doRequestIFrame() 
{
	var objData = {
		cmd: 5,
	};
	self.postMessage(objData);
	lastRequestTime = new Date().getTime();
}

//将worker 信息通过控制台输出
function printWorkerLog(text) {
	var objData = {
		cmd: 0,
		data:text
	};
	self.postMessage(objData);
}


function decodeVideo() {
	let arryData;
	if (h264Queue.length > 0 && isFinish) 
	{				
		if (h264Queue.length >= 25 && isFinish) 
		{			
			isFeed = false;
			printWorkerLog("解不过来" + h264Queue.length);
			while(h264Queue.length > 0)
			{
				h264Queue.shift();
			}
			doRequestIFrame();
			printWorkerLog("重新请求I帧");
		}else {
			arryData = h264Queue.shift();
			let nal_type = arryData[4] & 0x1f;

			if( nal_type == 5 || nal_type == 7 || nal_type == 8) {
				if(!isFeed)
					isFeed = true;
			}
		}
	
		if(isFeed)
		{
			let startTime = new Date().getTime();
			decodeH264(arryData);
			let cost = new Date().getTime() - startTime;
			decodeCostSum += cost;
			decodeSuccessCount++;
			
			//计算100次解码平均耗时
			if(decodeSuccessCount == 100) {
				let avg = decodeCostSum / decodeSuccessCount;
				let avgFps = 1000/avg;
				printWorkerLog("解码平均耗时:" + avg + "ms，解码fps:" + avgFps );
				decodeCostSum = 0;
				decodeSuccessCount = 0;
			}
		}
	} 
}
var timeFlag = setInterval(decodeVideo, 1);
//实现C 端到js yuv数据赋值, 并分配给opengl 渲染
/*yuvData, 存放yuv数据的数组
* inputYuvPtr C++ 
*/
function dispatchYuvData(yuvData, inputYuvPtr, videoWidth, videoHeight, copyLen, inputPtr){
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

function decodeH264(data) {
	var frameWidth = 0;
	var frameHeight = 0;
	var inputPtr = Module._malloc(data.length); //输入数据

	for (let i = 0; i < data.length; i++) {
		Module.HEAPU8[(inputPtr) + i] = data[i]; //转换为堆数据
	}
	var time = new Date().getTime();
	var allocSize = maxWidth * maxHeight *3/2;
	if(globalYuvPtr == undefined)
	{
	   globalYuvPtr = Module._malloc(allocSize);
	}
	var ret = Module._feedData(inputPtr, data.length, globalYuvPtr);
	if (ret >= 0)//解码成功才考虑渲染
	{		
		frameWidth  = Module._getVideoWidth();//拿到解码器宽、高
		frameHeight = Module._getVideoHeight();		
		// console.log("+++++++++++++宽:" + frameWidth + "高:" + frameHeight);
		var curCost = new Date().getTime() - time;
		var copyLen = frameWidth*frameHeight*3/2;//只拷贝必须的长度
		//console.log("解码成功: %d, %d" + frameWidth, frameHeight);
		if(renderCount > 1)//第一帧因为画面时全绿色的不渲染
		{		
			// console.log(6888, golbalYuvData.length, globalYuvPtr, frameWidth, frameHeight, copyLen)
		   dispatchYuvData(golbalYuvData, globalYuvPtr, frameWidth, frameHeight, copyLen, inputPtr);	
		}else
		{
		   renderCount++;
		}		
	}
	else {
		// console.log("+++++++++++++解码失败:" +  ret, data);
		Module._free(inputPtr);
	}
	// console.log('=========== FREE被执行了 ================')
}

function switchNewStream() {
	closeDecoder();		
	var ret = Module._openDecoder();//再次开启解码器	
	var timeFlag = setInterval(decodeVideo, 1);
	console.log("切换解码器成功");
}
function closeDecoder() {
	console.log('释放解码器')
	clearInterval(timeFlag);//关闭原有定时器
	Module._closeDecoder();
	renderCount = 0;
	if(globalYuvPtr != undefined)
	{
		Module._free(globalYuvPtr);
		globalYuvPtr = undefined;
	}
	console.log("此时buffer长度: %d", h264Queue.length);
	while(h264Queue.lengh > 0)
	{
		h264Queue.shift();
	}
}

(function(){
	if(self.Module == undefined) {
		console.log("初始化失败");
		
	}else {
		console.log("初始化OK");
	}
})()
