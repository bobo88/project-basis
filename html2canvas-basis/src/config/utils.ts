export const sdk_utils = {}

// 是否为正整数
export const isPositiveInteger = (s) => {
    var re = /^[1-9]([0-9]+)?$/;
    return re.test(s)
}

// 图片格式是否OK
export const isImgType = (s) => {
    let types = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
    return types.includes(s)
}

// 判断 element 是否OK
export const isElement = (node) => {
    let element = document.getElementById(node)
    if (!element || typeof element !== 'object') {
        return false;
        // return Promise.reject('Invalid element provided as first argument');
    }
    const ownerDocument = element.ownerDocument;
    if (!ownerDocument) {
        return false;
        // throw new Error(`Element is not attached to a Document`);
    }
    const defaultView = ownerDocument.defaultView;
    if (!defaultView) {
        return false;
        // throw new Error(`Document is not attached to a Window`);
    }
    return true
}

// 验证： html2canvasInit 参数是否OK
export const html2canvasInitValidate = (options: any): boolean => {
    console.log('========== 验证 =============')
    if (!options.from || (options.from && !isElement(options.from))) {
		console.error('【from】值不符合要求! Tips: 必须是id元素。')
		return false;
	}
    // 传参 width 且不是 正整数
    if (options.width && !isPositiveInteger(options.width)) {
        console.error('【width】值不符合要求! Tips: 必须是正整数。')
		return false;
    }
    // 传参 height 且不是 正整数
    if (options.height && !isPositiveInteger(options.height)) {
        console.error('【height】值不符合要求! Tips: 必须是正整数。')
		return false;
    }

    // 如果是触发下载功能，需要验证 downloadOptions 参数是否OK
    if (options.download) {
        let { width, height, type } = options.downloadOptions;
         // 传参 width 且不是 正整数
        if (width && !isPositiveInteger(width)) {
            console.error('【downloadOptions - width】值不符合要求! Tips: 必须是正整数。')
            return false;
        }
        // 传参 height 且不是 正整数
        if (height && !isPositiveInteger(height)) {
            console.error('【downloadOptions - height】值不符合要求! Tips: 必须是正整数。')
            return false;
        }
        if (type && !isImgType(type)) {
            console.error('【downloadOptions - type】值不符合要求! Tips: 必须是 jpg/jpeg/png/gif/bmp 中任意一个。')
            return false;
        }
    } else {
        if (options.to && !isElement(options.to)) {
            console.error('【appendTo】值不符合要求! Tips: 必须是id元素。')
            return false;
        }
        
        if (options.cb && typeof options.cb !== 'function') {
            console.error('【cb】值不符合要求! Tips: 必须是回调函数。')
            return false;
        }
    }

    return true
}