console.log('============= CLOUD_GAME_SDK ====================')

import { ceil, spsParser, ue, se, u } from './dep/spsParser'
import { keycodeMode } from './dep/config'
import { 
    RequestIFrame,
    makeSharpness,
    ConfigChannel,
    VerifyCode,
    CheckVerifyCode,
    GetScreenState,
    CheckScreenDirection,
    ExexuteKeyDown,
    ExexuteMouseDown,
    ExexuteMouseMove,
    ExexuteMouseUp,
    ExexuteSetAccountTransparent,
    ExexuteSetPhoneSize,
    ExexuteSendBitRate,
    makeFrame,
    PrintArry,
} from './dep/helper'

// import './dep/aac'

// 工具类
import { GameEventToOutSide, bounceFun } from './dep/utils'

// 额外配置：特定游戏的
import { NSUInteger, remainingTimeData, aiquObj } from './dep/extra'

// 第三方依赖
import JMuxer from 'jmuxer'

console.log('第三方依赖【JMuxer】引入进来了： ', JMuxer)
// console.log(5888, new JMuxer({
//     node: 'playerVideo',
//     flushingTime: 33,
//     fps: 30,
//     mode: 'video',
//     debug: false
// }))

export const CLOUD_GAME_SDK: CloudGameSdk = {
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
    sdkInit: () => {
        console.log('Init xxxx')
    },

    // todo
};

console.log(ceil, spsParser, ue, se, u)

export {
	// 导出： 额外配置（特定游戏的）
	NSUInteger, remainingTimeData, aiquObj,
	// 导出： 工具类
	GameEventToOutSide, bounceFun
}

// export const Sum = (a: number, b: number) => {
//     return a + b
// }