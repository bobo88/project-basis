// SDK配置集合：相关变量
export const SDK_CONFIG: ConfigType = {
	ws: null,
	socket: null,
	controlWs: null,
	jmuxer: null,
	myVideo: null,
	myContainer: null,
    // ping保持keeplive心跳
	flag: null,

	isVisuable: true,
	isFeed: true,
	isDrag: false,
	isFinish: false,
	hasSwitch: false,
	isWaitSps: false,
	disconnect: false,
	isPay: false,
    // 是否横屏
	isLandscape: false,
    
	videoWidth: 1080,
	videoHeight: 1920,
    // todo...
	winHeight: null,

	curTime: new Date().getTime(),
	requestTime: new Date().getTime(),
	oldTime: new Date().getTime(),
	newTime: new Date().getTime(),
    // 设置超时时间： 10分钟
	outTime: 600000,
	outsetInterval: null,

	clickPlay: 0,
	decodeCount: 0,
	h264Buffer: [],
    // 清晰度
	sharpnessLevel: 2,

    JMuxerOptions: {
		node: 'playerVideo',
		flushingTime: 33,
		fps: 30,
		mode: 'video',
		debug: false
	},

    // 推流相关
    socketURL: '',
    socketExtranetURL: '',
    sn: '',
    token: '',
    payURL: '',

	// 接口相关
	apiURL: 'http://14.18.190.140:9090',
	getSdkTokenURL: '/api/blade-game/sdk/auth/token',
	lineUpURL: '/api/blade-game/sdk/lineup',
};