//此文件实现将控制命令封装成协议，具体协议内容请看：
//链接：http://note.youdao.com/noteshare?id=dabda6c613adef7a416bd2625cd770a1

// bcc校验码计算
// arry: 要计算的数组
// 返回计算协议中校验位的校验码
export const calBcc = (arry) => {
	var bcc = 0;
	for (let i = 0; i < arry.length; i++) {
		bcc ^= arry[i];
	}
	return bcc;
}

// 数组打印，调试用
export const PrintArry = (data) => {
	var str = "";
	for (let i = 0; i < data.length; i++) {
		str = str + data[i].toString(16).padStart(2, '0');
	}
	str = str.toUpperCase();
	return str;
}

// sn:板卡sn号，stirng
// type：数据类型，数字
// jsonCmd: json命令
// 返回值：生成一个Uint8Array，通过websocket发送给板卡
export const makeFrame = (sn, dataType, jsonCmd) => {
	var index = 0;
	var dataLen = jsonCmd.length;
	var frameLen = dataLen + 26;
	var outPut = new Uint8Array(frameLen);
	outPut[index++] = 0x68;
	outPut[index++] = (dataLen & 0xff000000) >> 24;
	outPut[index++] = (dataLen & 0x00ff0000) >> 16;
	outPut[index++] = (dataLen & 0x0000ff00) >> 8;
	outPut[index++] = dataLen & 0x000000ff;
	outPut[index++] = 0; // 类型为client

	// sn号赋值，string转ascii
	for (let i = 0; i < sn.length; i++) {
		outPut[index++] = sn[i].charCodeAt();
	}
	outPut[index++] = dataType; //指定数据类型为json
	//json string转ascii
	for (let j = 0; j < jsonCmd.length; j++) {
		outPut[index++] = jsonCmd[j].charCodeAt();
	}

	var bccBuffer = outPut.slice(1, frameLen - 3 + 1); //忽略协议头和协议尾
	outPut[index++] = calBcc(bccBuffer);
	outPut[index++] = 0x16;
	// console.log("打印数组:%s", PrintArry(outPut));
	// return PrintArry(outPut);//C# 转发器专用
	return outPut;
}

// 账号透传
export const ExexuteSetAccountTransparent = (uid, token) => {
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
	}
	var json = JSON.stringify(jsonObj);
	// var sn = "RK3923C1201900139";
	// return makeFrame(sn, 0, json);
	return json
}

// 设置分辨率
export const ExexuteSetPhoneSize = (width, height) => {
	// var jsonObj = {"data":{"keyCode":code}, "event":"keyCode"};
	var jsonObj = {
		data: {
			width: width,
			height: height
		},
		type: 'setPhoneSize'
	}
	var json = JSON.stringify(jsonObj);
	// var sn = "RK3923C1201900139";
	// return makeFrame(sn, 0, json);
	return json
}

export const ExexuteSendBitRate = (data) => {
	// var jsonObj = {"data":{"keyCode":code}, "event":"keyCode"};
	var jsonObj = {
		data: {
			definition: data
		},
		type: '2'
	}
	var json = JSON.stringify(jsonObj);
	// var sn = "RK3923C1201900139";
	// return makeFrame(sn, 0, json);
	return json
}

//触发键盘事件, code表示键盘值
export const ExexuteKeyDown = (code) => {
	// var jsonObj = {"data":{"keyCode":code}, "event":"keyCode"};
	var jsonObj = {
		data: {
			keyCode: code
		},
		type: 'keyCode'
	}
	var json = JSON.stringify(jsonObj);
	// var sn = "RK3923C1201900139";
	// return makeFrame(sn, 0, json);
	return json

}
//触发鼠标按下事件，x：x坐标， y：y坐标

export const ExexuteMouseDown = (x, y) => {
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
	}
	var json = JSON.stringify(jsonObj);
	// var sn = "RK3923C1201900139";
	// return  makeFrame(sn, 0, json);
	console.log("打印点击json", json)
	return json
}
// 触发鼠标移动事件，x：x坐标， y：y坐标
export const ExexuteMouseMove = (x, y) => {
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
	}
	var json = JSON.stringify(jsonObj)
	return json
}
//触发鼠标抬起事件，x：x坐标， y：y坐标
export const ExexuteMouseUp = (x, y) => {
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
	}
	var json = JSON.stringify(jsonObj)
	return json
}

export const makeFrameExtend = (sn, dataType, body) => {
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
}

//根据报文识别屏幕方向, 0横屏，1竖屏
export const CheckScreenDirection = (data) => {
	if (data[0] == 0 && data[1] == 0 && data[2] == 0 && data[3] == 1) {
		if (data[4] == 1 && data[5] == 1) {
			if (data[6] == 1) {
				let screen = data[7];
				return screen;
			}
		}
	}
}

var emptyCount = 0;

export const GetEmptyFrame = () => {
	var emptyFrame = new Uint8Array([0xFF, 0xF1, 0x50, 0x80, 0x12, 0x5F, 0xFC, 0x21, 0x1A, 0xC8, 0x01, 0x27, 0xFC,
		0xC0, 0x00, 0x7E, 0x03, 0x10, 0x40, 0x63, 0x3D, 0x77, 0xE2, 0xB6, 0xE3, 0x6E, 0x00, 0x37, 0x56, 0x78,
		0xEB, 0x70, 0xAB, 0xC5, 0x58, 0x08, 0x59, 0x76, 0xF0, 0x47, 0x3D, 0x23, 0x6C, 0xA6, 0x2B, 0x59, 0x4E,
		0x9C, 0xE0, 0x23, 0x1C, 0x2D, 0x74, 0xCB, 0xE2, 0xFC, 0x77, 0x7D, 0x26, 0x13, 0xC3, 0x04, 0x40, 0x02,
		0x60, 0xF6, 0x03, 0x20, 0x80, 0xC7, 0x9A, 0x11, 0x0E, 0x9B, 0xDA, 0xA0, 0x84, 0x00, 0x2A, 0x95, 0x4A,
		0x1E, 0x74, 0xA5, 0x40, 0x2A, 0xCA, 0xA8, 0xCA, 0xF0, 0xF2, 0x1E, 0xA8, 0x77, 0x86, 0xA0, 0x62, 0x8C,
		0xB8, 0x5F, 0xA6, 0x67, 0xBF, 0x0D, 0x27, 0x8B, 0xF9, 0x58, 0xBD, 0xE3, 0x2D, 0x0C, 0xBF, 0x48, 0x3C,
		0xFD, 0x70, 0x78, 0x5E, 0xA9, 0x0B, 0x24, 0x9C, 0x13, 0x98, 0xA4, 0xA0, 0x6E, 0xCA, 0xAA, 0x7A, 0x88,
		0xA5, 0x0C, 0x2E, 0x83, 0x59, 0x02, 0x24, 0x01, 0x41, 0x03, 0x92, 0x10, 0x40, 0x07
	])
	return emptyFrame;
}

//查询屏幕方向
export const GetScreenState = () => {
	var sn = "RK3923C1201900139";
	var outPut = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x02]);
	return makeFrameExtend(sn, 5, outPut);
}

//生成鉴权报文
export const VerifyCode = (sn, code) => {
	var len = code.length + 1;
	// "utf-8"
	var codeBuffer = new TextEncoder("utf-8").encode(code); //获取字符串ascii码
	var buffer = new Uint8Array(len);
	buffer[0] = 0x04;
	for (let i = 0; i < codeBuffer.length; i++) {
		buffer[i + 1] = codeBuffer[i];
	}
	return makeFrameExtend(sn, 6, buffer);
}

//
export const CheckVerifyCode = (data) => {
	var dataLen = data.length - 26;
	var body = data.slice(24, 24 + dataLen);
	console.log("打印:" + PrintArry(body));
	if (body[3] == 0x03) {
		return true;
	}
	return false;
}

//通道配置
export const ConfigChannel = (sn, channelName) => {
	var chanelBuffer = new TextEncoder("utf-8").encode(channelName);
	var outPut = [];
	outPut.push(0x07);

	for (let i = 0; i < chanelBuffer.length; i++) {
		outPut.push(chanelBuffer[i]);
	}
	return makeFrameExtend(sn, 6, outPut);
}

export const OpenFileLog = (sn) => {
	var outPut = new Uint8Array([0x01]);
	return makeFrameExtend(sn, 7, outPut);
}

//多端登录json 汇报生成
export const makeMultiLogin = (sn, jsonData) => {
	var jsonObj = {
		type: 3,
		data: jsonData,
	};
	var jsonStr = JSON.stringify(jsonObj);
	var outPut = new TextEncoder("utf-8").encode(jsonStr);
	return makeFrameExtend(sn, 0x0D, outPut);
}

//统计登录信息
export const makeStatistics = (sn, jsonData) => {
	var jsonObj = {
		type: 4,
		data: jsonData,
	};

	var jsonStr = JSON.stringify(jsonObj);
	var outPut = new TextEncoder("utf-8").encode(jsonStr);
	return makeFrameExtend(sn, 0x0D, outPut);
}

//多端登录数据解析
export const checkMultiLoginInfo = (input) => {
	var dataLen = input.length - 26; //得到json 长度
	var jsonHex = input.slice(24, 24 + dataLen); //截取json hex二进制数据		
	var jsonStr = new TextDecoder("utf-8").decode(jsonHex);
	console.log("取得json 字符串:" + jsonStr);
	var jsonObj = JSON.parse(jsonStr);
	return jsonObj;
}

//切换清晰度
export const makeSharpness = (level) => {
	var sn = "RK3923C1201900139";
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
}

//I 帧请求报文生成
export const RequestIFrame = () => {
	var sn = "RK3923C1201900139";
	var outPut = new Uint8Array([0x20]);
	return makeFrameExtend(sn, 6, outPut);
}
