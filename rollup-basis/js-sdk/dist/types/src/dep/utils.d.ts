export declare let GameEventToOutSide: number;
export declare const bounceFun: (value: any) => void;
/**
 *  当前手机设备
 * @returns {{isAndroid: boolean, isIOS: boolean}}
 *  0 : android
 *  1 : ios
 *  2 : 未知设备
 */
export declare const judgeDeviceType: () => {
    type: number;
};
/**
 * 判断 当前浏览器内核
 * @returns {number}
 */
export declare const isAlipayOrWechat: () => 1 | 0 | 2;
export declare const Tools: {
    a: string;
    b: string;
    d: string;
};
