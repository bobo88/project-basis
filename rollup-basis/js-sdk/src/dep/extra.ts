// 额外配置
export const NSUInteger = {
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
}

export const extraData: ExtraDataType = {
    remainingTimeData: {},
    payData: {},

	// 爱趣相关
	aiquData: '',
	accountLoginStatus: '',
	accountPayStatus: '',
}
