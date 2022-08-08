# SDK - html2canvas
*Tips: <font color="#FF6600">基于 html2canvas / canvas2image / base64，可将HTML元素内容生成canvas图片（base64）。</font>*

### 一、项目主要功能：
+ 一键生成图片：
+ 元素盒子自定义：
+ 展示方式：生成的图片插入指定的div中 / 弹窗展示 ......
+ 增加水印功能
+ todo

### 二、第三方依赖：
+ html2canvas： 官网 -- https://html2canvas.hertzen.com/
+ xxx

### 三、使用步骤：
```js
    // 第一步： 引入js
    // src='./html2canvas_sdk.js'

    // 第二步：找到暴露的 html2canvas_sdk 
    var html2canvas_sdk = window.html2canvas_sdk;

    // 第三步：使用 html2canvasInit 方法
    html2canvas_sdk.html2canvasInit({
        from: 'flexGird', // 设置 canvas 绘图的 box（必须是id元素） 区域
        to: 'canvas-box', // 设置 canvas/image 要插入的 box（必须是id元素）位置
        width: 600, // 设置 canvas 的 宽
        height: 400, // 设置 canvas 的高
        x: -100, // 设置 canvas 的 x 偏移量
        y: -100, // 设置 canvas 的 y 偏移量
        backgroundColor: '#069', // 设置 canvas 的背景色
        toImage: true, // 将 canvas 转为 image
        toImageOptions: {
            download: false, // 是否直接下载 image
            width: 500, // 设置 image 的宽
            height: 300, // 设置 image 的高
            type: 'xxxx', // 设置 image 的格式： jpg/png/gif/bmp等。
            fileName: 'Test-ABC' // 设置 image 的名称
        },
        cb: function(canvas) {
            // 自定义回调函数，将 canvas 插入页面中的自定义位置
        }
    });

    // 备注：
    // 1. 【options.cb】 配置时，to 无效 ----- 自定义回调函数 优先级高于 默认回调函数
    // 2. 【options.toImage】配置时，cb 无效 ----- 一键下载截图
```

