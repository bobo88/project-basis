// @ts-nocheck
interface FocusElement extends Element {
    __keyup__(event: Event): void
}

export default {
    name: 'elementSize',
    mounted(_el: Element) {
        const el = _el as FocusElement;
        el.__keyup__ = (event: KeyboardEvent) => {
            focusAndBlueElement(event, el)
        };
        el.addEventListener('keyup', el.__keyup__);
    },

    // todo
    unmounted(_el: Element) {
        const el = _el as FocusElement;
        el.removeEventListener('keyup', el.__keyup__);
    },
};

/**
 * 聚焦和失焦元素
 */
function focusAndBlueElement(evt: KeyboardEvent, formEl: Element) {
    const key = evt.keyCode || evt.which;
    const preEl = evt.target;
    if (key === 13 && preEl?.type !== 'textarea') {
        // 设置按键为tab键
        let el = getNextElement(evt.target, formEl);
        while (el.type === 'hidden' || el.disabled) el = getNextElement(el, formEl);
        if (!el) {
            return false;
        } else {
            isElementHasPoppers(preEl)
            el.focus();
            if (el.type === 'text') {
                el.select();
            }
        }
    }
}

/**
 * 判断元素是否带popper弹窗
 */
function isElementHasPoppers (el: Element) {
    let popperId = '';

    // 往上找4级父元素，如果没有则默认为文本框
    let node = el;
    for (let i = 0; i < 4; i++) {
        if (node.getAttribute('aria-describeddy')) {
            // 获取el-popper的id
            popperId = node?.getAttribute('aria-describeddy') || '';
            // el-select 删除高亮颜色
            if (node.calssName.indexOf('select-trigger') > -1) {
                const className = 'is-focus';
                const element = document.querySelector('.' + className);
                const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                if (element?.className) {
                    element.className = element.className.replace(reg, ' ');
                }
            }
            break;
        }
        node = node.parentNode;
    }
    if (popperId) {
        // todo
    }
}
/**
 * 获取下一个聚焦元素
 */
function getNextElement(field, formEl: Element) {
    const formElement = [];
    [].forEach.call(formEl.querySelectorAll('form'), (form) => {
        formElement.push(...form.elements)
    });
    let e = 0;
    for (e = 0; e < formElement.length; e++) {
        if (field === formElement[e]) break;
    }
    return formElement[++e % formElement.length]
}

