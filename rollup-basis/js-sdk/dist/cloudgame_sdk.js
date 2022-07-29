(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('stream')) :
	typeof define === 'function' && define.amd ? define(['exports', 'stream'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.cloudgame_sdk = {}, global.stream));
})(this, (function (exports, stream) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);

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
	var aiquObj = {
	    accountLoginStatus: '',
	    accountPayStatus: ''
	};
	var remainingTimeData = {};

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var jmuxer_min = createCommonjsModule(function (module, exports) {
	!function(e,t){module.exports=t(stream__default["default"]);}(commonjsGlobal,(function(e){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function i(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t);}function o(e){return o=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},o(e)}function u(e,t){return u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},u(e,t)}function c(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return c(e)}function l(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return !1}}();return function(){var n,r=o(e);if(t){var i=o(this).constructor;n=Reflect.construct(r,arguments,i);}else n=r.apply(this,arguments);return f(this,n)}}function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,i,a=[],s=!0,o=!1;try{for(n=n.call(e);!(s=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);s=!0);}catch(e){o=!0,i=e;}finally{try{s||null==n.return||n.return();}finally{if(o)throw i}}return a}(e,t)||d(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,t){if(e){if("string"==typeof e)return y(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return "Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?y(e,t):void 0}}function y(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function p(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=d(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,i=function(){};return {s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,o=!1;return {s:function(){n=n.call(e);},n:function(){var e=n.next();return s=e.done,e},e:function(e){o=!0,a=e;},f:function(){try{s||null==n.return||n.return();}finally{if(o)throw a}}}}var v,m;function k(e){if(v){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];v.apply(void 0,[e].concat(n));}}function g(e){if(m){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];m.apply(void 0,[e].concat(n));}}var b=function(){function e(t){n(this,e),this.payload=t,this.nri=(96&this.payload[0])>>5,this.ntype=31&this.payload[0],this.isvcl=1==this.ntype||5==this.ntype,this.stype="",this.isfmb=!1;}return i(e,[{key:"toString",value:function(){return "".concat(e.type(this),": NRI: ").concat(this.getNri())}},{key:"getNri",value:function(){return this.nri}},{key:"type",value:function(){return this.ntype}},{key:"isKeyframe",value:function(){return this.ntype===e.IDR}},{key:"getPayload",value:function(){return this.payload}},{key:"getPayloadSize",value:function(){return this.payload.byteLength}},{key:"getSize",value:function(){return 4+this.getPayloadSize()}},{key:"getData",value:function(){var e=new Uint8Array(this.getSize());return new DataView(e.buffer).setUint32(0,this.getSize()-4),e.set(this.getPayload(),4),e}}],[{key:"NDR",get:function(){return 1}},{key:"IDR",get:function(){return 5}},{key:"SEI",get:function(){return 6}},{key:"SPS",get:function(){return 7}},{key:"PPS",get:function(){return 8}},{key:"AUD",get:function(){return 9}},{key:"TYPES",get:function(){var t;return a(t={},e.IDR,"IDR"),a(t,e.SEI,"SEI"),a(t,e.SPS,"SPS"),a(t,e.PPS,"PPS"),a(t,e.NDR,"NDR"),a(t,e.AUD,"AUD"),t}},{key:"type",value:function(t){return t.ntype in e.TYPES?e.TYPES[t.ntype]:"UNKNOWN"}}]),e}();function S(e,t){var n=new Uint8Array((0|e.byteLength)+(0|t.byteLength));return n.set(e,0),n.set(t,0|e.byteLength),n}var w,x=function(){function e(t){n(this,e),this.data=t,this.index=0,this.bitLength=8*t.byteLength;}return i(e,[{key:"setData",value:function(e){this.data=e,this.index=0,this.bitLength=8*e.byteLength;}},{key:"bitsAvailable",get:function(){return this.bitLength-this.index}},{key:"skipBits",value:function(e){if(this.bitsAvailable<e)return !1;this.index+=e;}},{key:"readBits",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=this.getBits(e,this.index,t);return n}},{key:"getBits",value:function(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(this.bitsAvailable<e)return 0;var r=t%8,i=this.data[t/8|0]&255>>>r,a=8-r;if(a>=e)return n&&(this.index+=e),i>>a-e;n&&(this.index+=a);var s=e-a;return i<<s|this.getBits(s,t+a,n)}},{key:"skipLZ",value:function(){var e;for(e=0;e<this.bitLength-this.index;++e)if(0!==this.getBits(1,this.index+e,!1))return this.index+=e,e;return e}},{key:"skipUEG",value:function(){this.skipBits(1+this.skipLZ());}},{key:"skipEG",value:function(){this.skipBits(1+this.skipLZ());}},{key:"readUEG",value:function(){var e=this.skipLZ();return this.readBits(e+1)-1}},{key:"readEG",value:function(){var e=this.readUEG();return 1&e?1+e>>>1:-1*(e>>>1)}},{key:"readBoolean",value:function(){return 1===this.readBits(1)}},{key:"readUByte",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return this.readBits(8*e)}},{key:"readUShort",value:function(){return this.readBits(16)}},{key:"readUInt",value:function(){return this.readBits(32)}}]),e}(),A=function(){function e(t){n(this,e),this.remuxer=t,this.track=t.mp4track;}return i(e,[{key:"parseSPS",value:function(t){var n=e.readSPS(new Uint8Array(t));this.track.fps=n.fps,this.track.width=n.width,this.track.height=n.height,this.track.sps=[new Uint8Array(t)],this.track.codec="avc1.";for(var r=new DataView(t.buffer,t.byteOffset+1,4),i=0;i<3;++i){var a=r.getUint8(i).toString(16);a.length<2&&(a="0"+a),this.track.codec+=a;}}},{key:"parsePPS",value:function(e){this.track.pps=[new Uint8Array(e)];}},{key:"parseNAL",value:function(e){if(!e)return !1;var t=!1;switch(e.type()){case b.IDR:case b.NDR:t=!0;break;case b.PPS:this.track.pps||(this.parsePPS(e.getPayload()),!this.remuxer.readyToDecode&&this.track.pps&&this.track.sps&&(this.remuxer.readyToDecode=!0)),t=!0;break;case b.SPS:this.track.sps||(this.parseSPS(e.getPayload()),!this.remuxer.readyToDecode&&this.track.pps&&this.track.sps&&(this.remuxer.readyToDecode=!0)),t=!0;break;case b.AUD:k("AUD - ignoing");break;case b.SEI:k("SEI - ignoing");}return t}}],[{key:"extractNALu",value:function(e){for(var t,n,r=0,i=e.byteLength,a=0,s=[],o=0;r<i;)switch(t=e[r++],a){case 0:0===t&&(a=1);break;case 1:a=0===t?2:0;break;case 2:case 3:0===t?a=3:1===t&&r<i?(o!=r-a-1&&s.push(e.subarray(o,r-a-1)),o=r,a=0):a=0;}return o<i&&(n=e.subarray(o,i)),[s,n]}},{key:"skipScalingList",value:function(e,t){for(var n=8,r=8,i=0;i<t;i++)0!==r&&(r=(n+e.readEG()+256)%256),n=0===r?n:r;}},{key:"readSPS",value:function(t){var n,r,i,a,s,o,u=new x(t),c=0,f=0,l=0,h=0,d=1,y=0;u.readUByte();for(var p=[],v=t.byteLength,m=1;m<v;m++)m+2<v&&3===u.readBits(24,!1)?(p.push(u.readBits(8)),p.push(u.readBits(8)),m+=2,u.readBits(8)):p.push(u.readBits(8));if(u.setData(new Uint8Array(p)),n=u.readUByte(),u.readBits(5),u.skipBits(3),u.readUByte(),u.skipUEG(),100===n||110===n||122===n||244===n||44===n||83===n||86===n||118===n||128===n){var k=u.readUEG();if(3===k&&u.skipBits(1),u.skipUEG(),u.skipUEG(),u.skipBits(1),u.readBoolean()){o=3!==k?8:12;for(var g=0;g<o;++g)u.readBoolean()&&(g<6?e.skipScalingList(u,16):e.skipScalingList(u,64));}}u.skipUEG();var b=u.readUEG();if(0===b)u.readUEG();else if(1===b){u.skipBits(1),u.skipEG(),u.skipEG(),r=u.readUEG();for(var S=0;S<r;++S)u.skipEG();}if(u.skipUEG(),u.skipBits(1),i=u.readUEG(),a=u.readUEG(),0===(s=u.readBits(1))&&u.skipBits(1),u.skipBits(1),u.readBoolean()&&(c=u.readUEG(),f=u.readUEG(),l=u.readUEG(),h=u.readUEG()),u.readBoolean()){if(u.readBoolean()){var w;switch(u.readUByte()){case 1:w=[1,1];break;case 2:w=[12,11];break;case 3:w=[10,11];break;case 4:w=[16,11];break;case 5:w=[40,33];break;case 6:w=[24,11];break;case 7:w=[20,11];break;case 8:w=[32,11];break;case 9:w=[80,33];break;case 10:w=[18,11];break;case 11:w=[15,11];break;case 12:w=[64,33];break;case 13:w=[160,99];break;case 14:w=[4,3];break;case 15:w=[3,2];break;case 16:w=[2,1];break;case 255:w=[u.readUByte()<<8|u.readUByte(),u.readUByte()<<8|u.readUByte()];}w&&w[0]>0&&w[1]>0&&(d=w[0]/w[1]);}if(u.readBoolean()&&u.skipBits(1),u.readBoolean()&&(u.skipBits(4),u.readBoolean()&&u.skipBits(24)),u.readBoolean()&&(u.skipUEG(),u.skipUEG()),u.readBoolean()){var A=u.readUInt(),U=u.readUInt();u.readBoolean()&&(y=U/(2*A));}}return {fps:y>0?y:void 0,width:Math.ceil((16*(i+1)-2*c-2*f)*d),height:(2-s)*(a+1)*16-(s?2:4)*(l+h)}}},{key:"parseHeader",value:function(e){var t=new x(e.getPayload());t.readUByte(),e.isfmb=0===t.readUEG(),e.stype=t.readUEG();}}]),e}(),U=function(){function e(t){n(this,e),this.remuxer=t,this.track=t.mp4track;}return i(e,[{key:"setAACConfig",value:function(){var t,n,r,i=new Uint8Array(2),a=e.getAACHeaderData;a&&(t=1+((192&a[2])>>>6),n=(60&a[2])>>>2,r=(1&a[2])<<2,r|=(192&a[3])>>>6,i[0]=t<<3,i[0]|=(14&n)>>1,i[1]|=(1&n)<<7,i[1]|=r<<3,this.track.codec="mp4a.40."+t,this.track.channelCount=r,this.track.config=i,this.remuxer.readyToDecode=!0);}}],[{key:"samplingRateMap",get:function(){return [96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350]}},{key:"getAACHeaderData",get:function(){return w}},{key:"getHeaderLength",value:function(e){return 1&e[1]?7:9}},{key:"getFrameLength",value:function(e){return (3&e[3])<<11|e[4]<<3|(224&e[5])>>>5}},{key:"isAACPattern",value:function(e){return 255===e[0]&&240==(240&e[1])&&0==(6&e[1])}},{key:"extractAAC",value:function(t){var n,r,i=0,a=t.byteLength,s=[];if(!e.isAACPattern(t))return g("Invalid ADTS audio format"),s;for(n=e.getHeaderLength(t),w||(w=t.subarray(0,n));i<a;)r=e.getFrameLength(t),s.push(t.subarray(n,r)),t=t.slice(r),i+=r;return s}}]),e}(),B=function(){function e(t){n(this,e),this.listener={},this.type=""|t;}return i(e,[{key:"on",value:function(e,t){return this.listener[e]||(this.listener[e]=[]),this.listener[e].push(t),!0}},{key:"off",value:function(e,t){if(this.listener[e]){var n=this.listener[e].indexOf(t);return n>-1&&this.listener[e].splice(n,1),!0}return !1}},{key:"offAll",value:function(){this.listener={};}},{key:"dispatch",value:function(e,t){return !!this.listener[e]&&(this.listener[e].map((function(e){e.apply(null,[t]);})),!0)}}]),e}(),D=function(){function e(){n(this,e);}return i(e,null,[{key:"init",value:function(){var t;for(t in e.types={avc1:[],avcC:[],btrt:[],dinf:[],dref:[],esds:[],ftyp:[],hdlr:[],mdat:[],mdhd:[],mdia:[],mfhd:[],minf:[],moof:[],moov:[],mp4a:[],mvex:[],mvhd:[],sdtp:[],stbl:[],stco:[],stsc:[],stsd:[],stsz:[],stts:[],tfdt:[],tfhd:[],traf:[],trak:[],trun:[],trex:[],tkhd:[],vmhd:[],smhd:[]},e.types)e.types.hasOwnProperty(t)&&(e.types[t]=[t.charCodeAt(0),t.charCodeAt(1),t.charCodeAt(2),t.charCodeAt(3)]);var n=new Uint8Array([0,0,0,0,0,0,0,0,118,105,100,101,0,0,0,0,0,0,0,0,0,0,0,0,86,105,100,101,111,72,97,110,100,108,101,114,0]),r=new Uint8Array([0,0,0,0,0,0,0,0,115,111,117,110,0,0,0,0,0,0,0,0,0,0,0,0,83,111,117,110,100,72,97,110,100,108,101,114,0]);e.HDLR_TYPES={video:n,audio:r};var i=new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,12,117,114,108,32,0,0,0,1]),a=new Uint8Array([0,0,0,0,0,0,0,0]);e.STTS=e.STSC=e.STCO=a,e.STSZ=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0]),e.VMHD=new Uint8Array([0,0,0,1,0,0,0,0,0,0,0,0]),e.SMHD=new Uint8Array([0,0,0,0,0,0,0,0]),e.STSD=new Uint8Array([0,0,0,0,0,0,0,1]);var s=new Uint8Array([105,115,111,109]),o=new Uint8Array([97,118,99,49]),u=new Uint8Array([0,0,0,1]);e.FTYP=e.box(e.types.ftyp,s,u,s,o),e.DINF=e.box(e.types.dinf,e.box(e.types.dref,i));}},{key:"box",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];for(var i,a=8,s=n.length,o=s;s--;)a+=n[s].byteLength;for((i=new Uint8Array(a))[0]=a>>24&255,i[1]=a>>16&255,i[2]=a>>8&255,i[3]=255&a,i.set(e,4),s=0,a=8;s<o;++s)i.set(n[s],a),a+=n[s].byteLength;return i}},{key:"hdlr",value:function(t){return e.box(e.types.hdlr,e.HDLR_TYPES[t])}},{key:"mdat",value:function(t){return e.box(e.types.mdat,t)}},{key:"mdhd",value:function(t,n){return e.box(e.types.mdhd,new Uint8Array([0,0,0,0,0,0,0,2,0,0,0,3,t>>24&255,t>>16&255,t>>8&255,255&t,n>>24,n>>16&255,n>>8&255,255&n,85,196,0,0]))}},{key:"mdia",value:function(t){return e.box(e.types.mdia,e.mdhd(t.timescale,t.duration),e.hdlr(t.type),e.minf(t))}},{key:"mfhd",value:function(t){return e.box(e.types.mfhd,new Uint8Array([0,0,0,0,t>>24,t>>16&255,t>>8&255,255&t]))}},{key:"minf",value:function(t){return "audio"===t.type?e.box(e.types.minf,e.box(e.types.smhd,e.SMHD),e.DINF,e.stbl(t)):e.box(e.types.minf,e.box(e.types.vmhd,e.VMHD),e.DINF,e.stbl(t))}},{key:"moof",value:function(t,n,r){return e.box(e.types.moof,e.mfhd(t),e.traf(r,n))}},{key:"moov",value:function(t,n,r){for(var i=t.length,a=[];i--;)a[i]=e.trak(t[i]);return e.box.apply(null,[e.types.moov,e.mvhd(r,n)].concat(a).concat(e.mvex(t)))}},{key:"mvex",value:function(t){for(var n=t.length,r=[];n--;)r[n]=e.trex(t[n]);return e.box.apply(null,[e.types.mvex].concat(r))}},{key:"mvhd",value:function(t,n){var r=new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,2,t>>24&255,t>>16&255,t>>8&255,255&t,n>>24&255,n>>16&255,n>>8&255,255&n,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255]);return e.box(e.types.mvhd,r)}},{key:"sdtp",value:function(t){var n,r,i=t.samples||[],a=new Uint8Array(4+i.length);for(r=0;r<i.length;r++)n=i[r].flags,a[r+4]=n.dependsOn<<4|n.isDependedOn<<2|n.hasRedundancy;return e.box(e.types.sdtp,a)}},{key:"stbl",value:function(t){return e.box(e.types.stbl,e.stsd(t),e.box(e.types.stts,e.STTS),e.box(e.types.stsc,e.STSC),e.box(e.types.stsz,e.STSZ),e.box(e.types.stco,e.STCO))}},{key:"avc1",value:function(t){var n,r,i,a=[],s=[];for(n=0;n<t.sps.length;n++)i=(r=t.sps[n]).byteLength,a.push(i>>>8&255),a.push(255&i),a=a.concat(Array.prototype.slice.call(r));for(n=0;n<t.pps.length;n++)i=(r=t.pps[n]).byteLength,s.push(i>>>8&255),s.push(255&i),s=s.concat(Array.prototype.slice.call(r));var o=e.box(e.types.avcC,new Uint8Array([1,a[3],a[4],a[5],255,224|t.sps.length].concat(a).concat([t.pps.length]).concat(s))),u=t.width,c=t.height;return e.box(e.types.avc1,new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,u>>8&255,255&u,c>>8&255,255&c,0,72,0,0,0,72,0,0,0,0,0,0,0,1,18,98,105,110,101,108,112,114,111,46,114,117,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,17,17]),o,e.box(e.types.btrt,new Uint8Array([0,28,156,128,0,45,198,192,0,45,198,192])))}},{key:"esds",value:function(e){var t=e.config.byteLength,n=new Uint8Array(26+t+3);return n.set([0,0,0,0,3,23+t,0,1,0,4,15+t,64,21,0,0,0,0,0,0,0,0,0,0,0,5,t]),n.set(e.config,26),n.set([6,1,2],26+t),n}},{key:"mp4a",value:function(t){var n=t.audiosamplerate;return e.box(e.types.mp4a,new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,t.channelCount,0,16,0,0,0,0,n>>8&255,255&n,0,0]),e.box(e.types.esds,e.esds(t)))}},{key:"stsd",value:function(t){return "audio"===t.type?e.box(e.types.stsd,e.STSD,e.mp4a(t)):e.box(e.types.stsd,e.STSD,e.avc1(t))}},{key:"tkhd",value:function(t){var n=t.id,r=t.duration,i=t.width,a=t.height,s=t.volume;return e.box(e.types.tkhd,new Uint8Array([0,0,0,7,0,0,0,0,0,0,0,0,n>>24&255,n>>16&255,n>>8&255,255&n,0,0,0,0,r>>24,r>>16&255,r>>8&255,255&r,0,0,0,0,0,0,0,0,0,0,0,0,s>>0&255,s%1*10>>0&255,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,i>>8&255,255&i,0,0,a>>8&255,255&a,0,0]))}},{key:"traf",value:function(t,n){var r=e.sdtp(t),i=t.id;return e.box(e.types.traf,e.box(e.types.tfhd,new Uint8Array([0,0,0,0,i>>24,i>>16&255,i>>8&255,255&i])),e.box(e.types.tfdt,new Uint8Array([0,0,0,0,n>>24,n>>16&255,n>>8&255,255&n])),e.trun(t,r.length+16+16+8+16+8+8),r)}},{key:"trak",value:function(t){return t.duration=t.duration||4294967295,e.box(e.types.trak,e.tkhd(t),e.mdia(t))}},{key:"trex",value:function(t){var n=t.id;return e.box(e.types.trex,new Uint8Array([0,0,0,0,n>>24,n>>16&255,n>>8&255,255&n,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1]))}},{key:"trun",value:function(t,n){var r,i,a,s,o,u,c=t.samples||[],f=c.length,l=12+16*f,h=new Uint8Array(l);for(n+=8+l,h.set([0,0,15,1,f>>>24&255,f>>>16&255,f>>>8&255,255&f,n>>>24&255,n>>>16&255,n>>>8&255,255&n],0),r=0;r<f;r++)a=(i=c[r]).duration,s=i.size,o=i.flags,u=i.cts,h.set([a>>>24&255,a>>>16&255,a>>>8&255,255&a,s>>>24&255,s>>>16&255,s>>>8&255,255&s,o.isLeading<<2|o.dependsOn,o.isDependedOn<<6|o.hasRedundancy<<4|o.paddingValue<<1|o.isNonSync,61440&o.degradPrio,15&o.degradPrio,u>>>24&255,u>>>16&255,u>>>8&255,255&u],12+16*r);return e.box(e.types.trun,h)}},{key:"initSegment",value:function(t,n,r){e.types||e.init();var i,a=e.moov(t,n,r);return (i=new Uint8Array(e.FTYP.byteLength+a.byteLength)).set(e.FTYP),i.set(a,e.FTYP.byteLength),i}}]),e}(),C=1,E=function(){function e(){n(this,e);}return i(e,[{key:"flush",value:function(){this.mp4track.len=0,this.mp4track.samples=[];}},{key:"isReady",value:function(){return !(!this.readyToDecode||!this.samples.length)||null}}],[{key:"getTrackID",value:function(){return C++}}]),e}(),T=function(e){s(r,e);var t=l(r);function r(e){var i;return n(this,r),(i=t.call(this)).readyToDecode=!1,i.nextDts=0,i.dts=0,i.mp4track={id:E.getTrackID(),type:"audio",channelCount:0,len:0,fragmented:!0,timescale:e,duration:e,samples:[],config:"",codec:""},i.samples=[],i.aac=new U(c(i)),i}return i(r,[{key:"resetTrack",value:function(){this.readyToDecode=!1,this.mp4track.codec="",this.mp4track.channelCount="",this.mp4track.config="",this.mp4track.timescale=this.timescale,this.nextDts=0,this.dts=0;}},{key:"remux",value:function(e){if(e.length>0)for(var t=0;t<e.length;t++){var n=e[t],r=n.units,i=r.byteLength;this.samples.push({units:r,size:i,duration:n.duration}),this.mp4track.len+=i,this.readyToDecode||this.aac.setAACConfig();}}},{key:"getPayload",value:function(){if(!this.isReady())return null;var e,t,n=new Uint8Array(this.mp4track.len),r=0,i=this.mp4track.samples;for(this.dts=this.nextDts;this.samples.length;){var a=this.samples.shift();a.units,(t=a.duration)<=0?(k("remuxer: invalid sample duration at DTS: ".concat(this.nextDts," :").concat(t)),this.mp4track.len-=a.size):(this.nextDts+=t,e={size:a.size,duration:t,cts:0,flags:{isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0,dependsOn:1}},n.set(a.units,r),r+=a.size,i.push(e));}return i.length?new Uint8Array(n.buffer,0,this.mp4track.len):null}}]),r}(E),P=function(e){s(r,e);var t=l(r);function r(e){var i;return n(this,r),(i=t.call(this)).readyToDecode=!1,i.nextDts=0,i.dts=0,i.mp4track={id:E.getTrackID(),type:"video",len:0,fragmented:!0,sps:"",pps:"",fps:30,width:0,height:0,timescale:e,duration:e,samples:[]},i.samples=[],i.h264=new A(c(i)),i}return i(r,[{key:"resetTrack",value:function(){this.readyToDecode=!1,this.mp4track.sps="",this.mp4track.pps="",this.nextDts=0,this.dts=0;}},{key:"remux",value:function(e){var t,n=p(e);try{for(n.s();!(t=n.n()).done;){var r,i=t.value,a=[],s=0,o=p(i.units);try{for(o.s();!(r=o.n()).done;){var u=r.value;this.h264.parseNAL(u)&&(a.push(u),s+=u.getSize());}}catch(e){o.e(e);}finally{o.f();}a.length>0&&this.readyToDecode&&(this.mp4track.len+=s,this.samples.push({units:a,size:s,keyFrame:i.keyFrame,duration:i.duration}));}}catch(e){n.e(e);}finally{n.f();}}},{key:"getPayload",value:function(){if(!this.isReady())return null;var e,t,n=new Uint8Array(this.mp4track.len),r=0,i=this.mp4track.samples;for(this.dts=this.nextDts;this.samples.length;){var a=this.samples.shift(),s=a.units;if((t=a.duration)<=0)k("remuxer: invalid sample duration at DTS: ".concat(this.nextDts," :").concat(t)),this.mp4track.len-=a.size;else {this.nextDts+=t,e={size:a.size,duration:t,cts:0,flags:{isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0,isNonSync:a.keyFrame?0:1,dependsOn:a.keyFrame?2:1}};var o,u=p(s);try{for(u.s();!(o=u.n()).done;){var c=o.value;n.set(c.getData(),r),r+=c.getSize();}}catch(e){u.e(e);}finally{u.f();}i.push(e);}}return i.length?new Uint8Array(n.buffer,0,this.mp4track.len):null}}]),r}(E),L=function(e){s(r,e);var t=l(r);function r(e){var i;return n(this,r),(i=t.call(this,"remuxer")).initialized=!1,i.trackTypes=[],i.tracks={},i.seq=1,i.env=e,i.timescale=1e3,i.mediaDuration=0,i}return i(r,[{key:"addTrack",value:function(e){"video"!==e&&"both"!==e||(this.tracks.video=new P(this.timescale),this.trackTypes.push("video")),"audio"!==e&&"both"!==e||(this.tracks.audio=new T(this.timescale),this.trackTypes.push("audio"));}},{key:"reset",value:function(){var e,t=p(this.trackTypes);try{for(t.s();!(e=t.n()).done;){var n=e.value;this.tracks[n].resetTrack();}}catch(e){t.e(e);}finally{t.f();}this.initialized=!1;}},{key:"destroy",value:function(){this.tracks={},this.offAll();}},{key:"flush",value:function(){if(this.initialized){var e,t=p(this.trackTypes);try{for(t.s();!(e=t.n()).done;){var n=e.value,r=this.tracks[n],i=r.getPayload();if(i&&i.byteLength){var a={type:n,payload:S(D.moof(this.seq,r.dts,r.mp4track),D.mdat(i)),dts:r.dts};"video"===n&&(a.fps=r.mp4track.fps),this.dispatch("buffer",a);var s=(o=r.dts/this.timescale,u=void 0,c=void 0,f=void 0,l=void 0,l="",u=Math.floor(o),(c=parseInt(u/3600,10)%24)>0&&(l+=(c<10?"0"+c:c)+":"),l+=((f=parseInt(u/60,10)%60)<10?"0"+f:f)+":"+((u=u<0?0:u%60)<10?"0"+u:u));k("put segment (".concat(n,"): dts: ").concat(r.dts," frames: ").concat(r.mp4track.samples.length," second: ").concat(s)),r.flush(),this.seq++;}}}catch(e){t.e(e);}finally{t.f();}}else this.isReady()&&(this.dispatch("ready"),this.initSegment(),this.initialized=!0,this.flush());var o,u,c,f,l;}},{key:"initSegment",value:function(){var e,t=[],n=p(this.trackTypes);try{for(n.s();!(e=n.n()).done;){var r=e.value,i=this.tracks[r];if("browser"==this.env){var a={type:r,payload:D.initSegment([i.mp4track],this.mediaDuration,this.timescale)};this.dispatch("buffer",a);}else t.push(i.mp4track);}}catch(e){n.e(e);}finally{n.f();}if("node"==this.env){var s={type:"all",payload:D.initSegment(t,this.mediaDuration,this.timescale)};this.dispatch("buffer",s);}k("Initial segment generated.");}},{key:"isReady",value:function(){var e,t=p(this.trackTypes);try{for(t.s();!(e=t.n()).done;){var n=e.value;if(!this.tracks[n].readyToDecode||!this.tracks[n].samples.length)return !1}}catch(e){t.e(e);}finally{t.f();}return !0}},{key:"remux",value:function(e){var t,n=p(this.trackTypes);try{for(n.s();!(t=n.n()).done;){var r=t.value,i=e[r];"audio"===r&&this.tracks.video&&!this.tracks.video.readyToDecode||i.length>0&&this.tracks[r].remux(i);}}catch(e){n.e(e);}finally{n.f();}this.flush();}}]),r}(B),R=function(e){s(r,e);var t=l(r);function r(e,i){var a;return n(this,r),(a=t.call(this,"buffer")).type=i,a.queue=new Uint8Array,a.cleaning=!1,a.pendingCleaning=0,a.cleanOffset=30,a.cleanRanges=[],a.sourceBuffer=e,a.sourceBuffer.addEventListener("updateend",(function(){a.pendingCleaning>0&&(a.initCleanup(a.pendingCleaning),a.pendingCleaning=0),a.cleaning=!1,a.cleanRanges.length&&a.doCleanup();})),a.sourceBuffer.addEventListener("error",(function(){a.dispatch("error",{type:a.type,name:"buffer",error:"buffer error"});})),a}return i(r,[{key:"destroy",value:function(){this.queue=null,this.sourceBuffer=null,this.offAll();}},{key:"doCleanup",value:function(){if(this.cleanRanges.length){var e=this.cleanRanges.shift();k("".concat(this.type," remove range [").concat(e[0]," - ").concat(e[1],")")),this.cleaning=!0,this.sourceBuffer.remove(e[0],e[1]);}else this.cleaning=!1;}},{key:"initCleanup",value:function(e){try{if(this.sourceBuffer.updating)return void(this.pendingCleaning=e);if(this.sourceBuffer.buffered&&this.sourceBuffer.buffered.length&&!this.cleaning){for(var t=0;t<this.sourceBuffer.buffered.length;++t){var n=this.sourceBuffer.buffered.start(t),r=this.sourceBuffer.buffered.end(t);e-n>this.cleanOffset&&n<(r=e-this.cleanOffset)&&this.cleanRanges.push([n,r]);}this.doCleanup();}}catch(e){g("Error occured while cleaning ".concat(this.type," buffer - ").concat(e.name,": ").concat(e.message));}}},{key:"doAppend",value:function(){if(this.queue.length&&this.sourceBuffer&&!this.sourceBuffer.updating)try{this.sourceBuffer.appendBuffer(this.queue),this.queue=new Uint8Array;}catch(t){var e="unexpectedError";"QuotaExceededError"===t.name?(k("".concat(this.type," buffer quota full")),e="QuotaExceeded"):(g("Error occured while appending ".concat(this.type," buffer - ").concat(t.name,": ").concat(t.message)),e="InvalidStateError"),this.dispatch("error",{type:this.type,name:e,error:"buffer error"});}}},{key:"feed",value:function(e){this.queue=S(this.queue,e);}}]),r}(B);return function(r){s(o,r);var a=l(o);function o(e){var r;n(this,o),(r=a.call(this,"jmuxer")).isReset=!1;return r.options=Object.assign({},{node:"",mode:"both",flushingTime:500,maxDelay:500,clearBuffer:!0,fps:30,readFpsFromTrack:!1,debug:!1,onReady:function(){},onError:function(){}},e),r.env="object"===("undefined"==typeof process?"undefined":t(process))&&"undefined"==typeof window?"node":"browser",r.options.debug&&(v=console.log,m=console.error),r.options.fps||(r.options.fps=30),r.frameDuration=1e3/r.options.fps|0,r.remuxController=new L(r.env),r.remuxController.addTrack(r.options.mode),r.initData(),r.remuxController.on("buffer",r.onBuffer.bind(c(r))),"browser"==r.env&&(r.remuxController.on("ready",r.createBuffer.bind(c(r))),r.initBrowser()),r}return i(o,[{key:"initData",value:function(){this.lastCleaningTime=Date.now(),this.kfPosition=[],this.kfCounter=0,this.pendingUnits={},this.remainingData=new Uint8Array,this.startInterval();}},{key:"initBrowser",value:function(){"string"==typeof this.options.node&&""==this.options.node&&g("no video element were found to render, provide a valid video element"),this.node="string"==typeof this.options.node?document.getElementById(this.options.node):this.options.node,this.mseReady=!1,this.setupMSE();}},{key:"createStream",value:function(){var t=this.feed.bind(this),n=this.destroy.bind(this);return this.stream=new e.Duplex({writableObjectMode:!0,read:function(e){},write:function(e,n,r){t(e),r();},final:function(e){n(),e();}}),this.stream}},{key:"setupMSE",value:function(){if(window.MediaSource=window.MediaSource||window.WebKitMediaSource,!window.MediaSource)throw "Oops! Browser does not support media source extension.";this.isMSESupported=!!window.MediaSource,this.mediaSource=new MediaSource,this.url=URL.createObjectURL(this.mediaSource),this.node.src=this.url,this.mseEnded=!1,this.mediaSource.addEventListener("sourceopen",this.onMSEOpen.bind(this)),this.mediaSource.addEventListener("sourceclose",this.onMSEClose.bind(this)),this.mediaSource.addEventListener("webkitsourceopen",this.onMSEOpen.bind(this)),this.mediaSource.addEventListener("webkitsourceclose",this.onMSEClose.bind(this));}},{key:"endMSE",value:function(){if(!this.mseEnded)try{this.mseEnded=!0,this.mediaSource.endOfStream();}catch(e){g("mediasource is not available to end");}}},{key:"feed",value:function(e){var t,n,r,i=!1,a={video:[],audio:[]};if(e&&this.remuxController){if(r=e.duration?parseInt(e.duration):0,e.video){e.video=S(this.remainingData,e.video);var s=h(A.extractNALu(e.video),2);if(t=s[0],n=s[1],this.remainingData=n||new Uint8Array,!(t.length>0))return void g("Failed to extract any NAL units from video data:",n);a.video=this.getVideoFrames(t,r),i=!0;}if(e.audio){if(!((t=U.extractAAC(e.audio)).length>0))return void g("Failed to extract audio data from:",e.audio);a.audio=this.getAudioFrames(t,r),i=!0;}i?this.remuxController.remux(a):g("Input object must have video and/or audio property. Make sure it is a valid typed array");}}},{key:"getVideoFrames",value:function(e,t){var n,r=this,i=[],a=[],s=0,o=!1,u=!1;this.pendingUnits.units&&(i=this.pendingUnits.units,u=this.pendingUnits.vcl,o=this.pendingUnits.keyFrame,this.pendingUnits={});var c,f=p(e);try{for(f.s();!(c=f.n()).done;){var l=c.value,h=new b(l);h.type()!==b.IDR&&h.type()!==b.NDR||A.parseHeader(h),i.length&&u&&(h.isfmb||!h.isvcl)&&(a.push({units:i,keyFrame:o}),i=[],o=!1,u=!1),i.push(h),o=o||h.isKeyframe(),u=u||h.isvcl;}}catch(e){f.e(e);}finally{f.f();}if(i.length)if(t)if(u)a.push({units:i,keyFrame:o});else {var d=a.length-1;d>=0&&(a[d].units=a[d].units.concat(i));}else this.pendingUnits={units:i,keyFrame:o,vcl:u};return n=t?t/a.length|0:this.frameDuration,s=t?t-n*a.length:0,a.map((function(e){e.duration=n,s>0&&(e.duration++,s--),r.kfCounter++,e.keyFrame&&r.options.clearBuffer&&r.kfPosition.push(r.kfCounter*n/1e3);})),k("jmuxer: No. of frames of the last chunk: ".concat(a.length)),a}},{key:"getAudioFrames",value:function(e,t){var n,r,i=[],a=0,s=p(e);try{for(s.s();!(r=s.n()).done;){var o=r.value;i.push({units:o});}}catch(e){s.e(e);}finally{s.f();}return n=t?t/i.length|0:this.frameDuration,a=t?t-n*i.length:0,i.map((function(e){e.duration=n,a>0&&(e.duration++,a--);})),i}},{key:"destroy",value:function(){if(this.stopInterval(),this.stream&&(this.remuxController.flush(),this.stream.push(null),this.stream=null),this.remuxController&&(this.remuxController.destroy(),this.remuxController=null),this.bufferControllers){for(var e in this.bufferControllers)this.bufferControllers[e].destroy();this.bufferControllers=null,this.endMSE();}this.node=!1,this.mseReady=!1,this.videoStarted=!1,this.mediaSource=null;}},{key:"reset",value:function(){if(this.stopInterval(),this.isReset=!0,this.node.pause(),this.remuxController&&this.remuxController.reset(),this.bufferControllers){for(var e in this.bufferControllers)this.bufferControllers[e].destroy();this.bufferControllers=null,this.endMSE();}this.initData(),"browser"==this.env&&this.initBrowser(),k("JMuxer was reset");}},{key:"createBuffer",value:function(){if(this.mseReady&&this.remuxController&&this.remuxController.isReady()&&!this.bufferControllers)for(var e in this.bufferControllers={},this.remuxController.tracks){var t=this.remuxController.tracks[e];if(!o.isSupported("".concat(e,'/mp4; codecs="').concat(t.mp4track.codec,'"')))return g("Browser does not support codec"),!1;var n=this.mediaSource.addSourceBuffer("".concat(e,'/mp4; codecs="').concat(t.mp4track.codec,'"'));this.bufferControllers[e]=new R(n,e),this.bufferControllers[e].on("error",this.onBufferError.bind(this));}}},{key:"startInterval",value:function(){var e=this;this.interval=setInterval((function(){e.options.flushingTime?e.applyAndClearBuffer():e.bufferControllers&&e.cancelDelay();}),this.options.flushingTime||1e3);}},{key:"stopInterval",value:function(){this.interval&&clearInterval(this.interval);}},{key:"cancelDelay",value:function(){if(this.node.buffered&&this.node.buffered.length>0&&!this.node.seeking){var e=this.node.buffered.end(0);e-this.node.currentTime>this.options.maxDelay/1e3&&(console.log("delay"),this.node.currentTime=e-.001);}}},{key:"releaseBuffer",value:function(){for(var e in this.bufferControllers)this.bufferControllers[e].doAppend();}},{key:"applyAndClearBuffer",value:function(){this.bufferControllers&&(this.releaseBuffer(),this.clearBuffer());}},{key:"getSafeClearOffsetOfBuffer",value:function(e){for(var t,n="audio"===this.options.mode&&e||0,r=0;r<this.kfPosition.length&&!(this.kfPosition[r]>=e);r++)t=this.kfPosition[r];return t&&(this.kfPosition=this.kfPosition.filter((function(e){return e<t&&(n=e),e>=t}))),n}},{key:"clearBuffer",value:function(){if(this.options.clearBuffer&&Date.now()-this.lastCleaningTime>1e4){for(var e in this.bufferControllers){var t=this.getSafeClearOffsetOfBuffer(this.node.currentTime);this.bufferControllers[e].initCleanup(t);}this.lastCleaningTime=Date.now();}}},{key:"onBuffer",value:function(e){this.options.readFpsFromTrack&&void 0!==e.fps&&this.options.fps!=e.fps&&(this.options.fps=e.fps,this.frameDuration=Math.ceil(1e3/e.fps),k("JMuxer changed FPS to ".concat(e.fps," from track data"))),"browser"==this.env?this.bufferControllers&&this.bufferControllers[e.type]&&this.bufferControllers[e.type].feed(e.payload):this.stream&&this.stream.push(e.payload),0===this.options.flushingTime&&this.applyAndClearBuffer();}},{key:"onMSEOpen",value:function(){this.mseReady=!0,URL.revokeObjectURL(this.url),"function"==typeof this.options.onReady&&this.options.onReady.call(null,this.isReset);}},{key:"onMSEClose",value:function(){this.mseReady=!1,this.videoStarted=!1;}},{key:"onBufferError",value:function(e){if("QuotaExceeded"==e.name)return k("JMuxer cleaning ".concat(e.type," buffer due to QuotaExceeded error")),void this.bufferControllers[e.type].initCleanup(this.node.currentTime);"InvalidStateError"==e.name?(k("JMuxer is reseting due to InvalidStateError"),this.reset()):this.endMSE(),"function"==typeof this.options.onError&&this.options.onError.call(null,e);}}],[{key:"isSupported",value:function(e){return window.MediaSource&&window.MediaSource.isTypeSupported(e)}}]),o}(B)}));
	});

	console.log('============= CLOUD_GAME_SDK ====================');
	console.log('第三方依赖【JMuxer】引入进来了： ', jmuxer_min);
	// console.log(5888, new JMuxer({
	//     node: 'playerVideo',
	//     flushingTime: 33,
	//     fps: 30,
	//     mode: 'video',
	//     debug: false
	// }))
	var CLOUD_GAME_SDK = {
	    version: '1.0.0',
	    // 是否横屏
	    isLandscape: false,
	    // 清晰度
	    sharpnessLevel: 2,
	    socketURL: 'ws://14.18.190.138:41132',
	    socketExtranetURL: 'ws://14.18.190.138:42132',
	    sn: 'RK3923C1201900139',
	    token: 'qwgvyPOxj0JMzCGKr41rkjwwKk8OrB5MiFDWVNp/jMiaKELA/bP2/HrJuq9zMx+QbycuU8RQANbFIfA5eqMaOQ==',
	    JMuxerOptions: {
	        node: 'playerVideo',
	        flushingTime: 33,
	        fps: 30,
	        mode: 'video',
	        debug: false
	    },
	    payURL: '',
	    // 配置信息
	    sdkInit: function () {
	        console.log('Init xxxx');
	    },
	    // todo
	};
	console.log(ceil, spsParser, ue, se, u);
	// export const Sum = (a: number, b: number) => {
	//     return a + b
	// }

	exports.CLOUD_GAME_SDK = CLOUD_GAME_SDK;
	exports.NSUInteger = NSUInteger;
	exports.aiquObj = aiquObj;
	exports.bounceFun = bounceFun;
	exports.remainingTimeData = remainingTimeData;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
