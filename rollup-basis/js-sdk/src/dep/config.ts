// SDK配置集合：相关变量
export const SDK_CONFIG: ConfigType = {
	containerNode: '',
	videoNode: '',
	ws: null,
	socket: null,
	controlWs: null,
	jmuxer: null,
	webglPlayer: null,
	aacPlayer: null,
	myVideo: null,
	myContainer: null,
    // ping保持keeplive心跳
	flag: null,

	noRestart: false,
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
	landscapeIsSeted: false,
	isEntered: false,
    
	videoWidth: 1080,
	videoHeight: 1920,
    // todo...
	winHeight: null,

	lastTime: null,
	curTime: new Date().getTime(),
	requestTime: new Date().getTime(),
	oldTime: new Date().getTime(),
	newTime: new Date().getTime(),
    // 设置超时时间： 10分钟
	outTime: 600000,
	outsetInterval: null,
	pingTimer: null,
	// 排队拿卡
	queueGetCard: null,
	lineupTime: 5000,

	clickPlay: 0,
	decodeCount: 0,
	h264Buffer: [],
	aacQueue: [],
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

export const CARD_INFO = {
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
}

export const SOFT_SDK_CONFIG: ConfigType = {
	decodeWoker: null,
	webSocketWorker: null,
	golbalYuvData: null,

	isFinish: false,
	isFeed: true,

	h264Queue: [],

	decodeCount: 1,
	// videoWidth: 1080,
	// videoHeight: 1920,
	w: 1080, // 分辨率
	h: 1920,
	renderCount: 0,
	fpsCount: 0,
	decodeSuccessCount: 0,
	decodeCostSum: 0,
	
	lastTime: new Date().getTime(),
	lastRequestTime: 0,

	globalYuvPtr: undefined,
	curFrameWidth: undefined,
	curFrameHeight: undefined,
}