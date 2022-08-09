/**
 * 录单平台
 */
export const optDeviceOptions = [
    {
        value: '1',
        label: '网页录单',
    },
    {
        value: '3',
        label: '微信录单',
    },
];
/**
 * 单据来源
 */
export const sourceOptions = [
    {
        value: '0',
        label: '平台',
    },
    {
        value: '1',
        label: '南方电子口岸'
    }
];
export const sourceJson = sourceOptions.reduce((prev, item) => {
    prev[item.value] = item.label;
    return prev;
}, {});

/**
 * 预计过关管制站
 */
export const expectPassOptions = [
    { value: 'LMC', label: '落马洲' },
    // ......
]