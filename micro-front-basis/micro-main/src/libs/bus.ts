import mitt from 'mitt';

// 初始化一个 mitt 实例
const emitter = mitt();

// 定义一个空对象用来承载我们的自定义方法
const bus: any = {};

// 把你要用到的方法添加到 bus 对象上
bus.$on = emitter.on;
bus.$off = emitter.off;
bus.$emit = emitter.emit;

// 最终是暴露自己定义的 bus
export default bus;
