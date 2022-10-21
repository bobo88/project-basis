(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{310:function(s,a,t){s.exports=t.p+"assets/img/tools_webpack.9033b3e8.png"},536:function(s,a,t){"use strict";t.r(a);var n=t(13),e=Object(n.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"webpack"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#webpack"}},[s._v("#")]),s._v(" Webpack")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("Webpack")]),s._v(" "),a("p",[s._v("webpack是一个模块打包器。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。")])]),s._v(" "),a("h3",{attrs:{id:"一、发展历史"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、发展历史"}},[s._v("#")]),s._v(" 一、发展历史")]),s._v(" "),a("p",[s._v("模块系统主要解决模块的定义、依赖和导出。")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("服务器端的Node.js遵循CommonJS规范，该规范的核心思想是允许模块通过require方法来同步加载所要依赖的其他模块，通过exports或者module.exports来导出需要暴露的接口。")])]),s._v(" "),a("li",[a("p",[s._v("AMD： Asynchronous Module Definition 规范其实只有一个主要接口define(id?,dependencies?,factory)，它要在声明模块的时候指定所有的依赖dependencies，并且还要当做形参传到factory中，对于依赖的模块 <提前执行，依赖前置>。")]),s._v(" "),a("ul",[a("li",[s._v("代表插件：requireJs")]),s._v(" "),a("li",[s._v("优点：适合在浏览器环境中异步加载模块，可以并行加载多个模块")]),s._v(" "),a("li",[s._v("缺点：提高了开发成本，代码的阅读和书写比较困难，模块定义方式的语义不顺畅；不符合通用的模块化思维方式，是一种妥协的实现")])])]),s._v(" "),a("li",[a("p",[s._v("CMD：Common Module Definition 规范和AMD很相似，尽量保持简单，并与CommonJs和Node.js的Modules规范保持了很大的兼容性。特点是： <依赖就近，延迟执行>。")]),s._v(" "),a("ul",[a("li",[s._v("代表插件：SeaJs")]),s._v(" "),a("li",[s._v("优点：依赖就近，延迟执行；可以很容易在Node.js中运行")]),s._v(" "),a("li",[s._v("缺点：依赖SPM打包，模块的加载逻辑偏重")])])]),s._v(" "),a("li",[a("p",[s._v("ES6：ECMAScript标准增加了JavaScript语言层面的模块体系定义，ES6模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJs和AMD模块，都只能在运行时确定这些东西。")]),s._v(" "),a("ul",[a("li",[s._v("优点：容易进行静态分析；面向未来的ECMAScript标准")])])])]),s._v(" "),a("h3",{attrs:{id:"二、webpack-安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二、webpack-安装"}},[s._v("#")]),s._v(" 二、webpack 安装")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 全局安装： npm install webpack -g。可以通过webpack -v 或者 webpack -h 来查看是否安装成功")]),s._v("\n$ npm i webpack "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("g\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 本地安装：(先npm init创建package.json文件）， npm install webpack --save-dev")]),s._v("\n$ npm i webpack "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),a("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n\n$ npm info webpack "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 查看webpack版本信息")]),s._v("\n\n$ npm install webpack@"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.12")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("x "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("--")]),s._v("save"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("dev "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 安装指定版本的webpack")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br")])]),a("h3",{attrs:{id:"三、webpack-配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三、webpack-配置"}},[s._v("#")]),s._v(" 三、webpack 配置")]),s._v(" "),a("p",[s._v("webpack.config.js配置项，是用来告诉webpack需要做什么。")]),s._v(" "),a("ul",[a("li",[s._v("entry：页面入口文件配置\n"),a("ul",[a("li",[s._v("让webpack用哪个文件作为项目的入口，支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出")])])]),s._v(" "),a("li",[s._v("output：入口文件输出配置\n"),a("ul",[a("li",[s._v("入口文件最终要生成什么名字的文件、存放到哪里")])])]),s._v(" "),a("li",[s._v("module：加载器配置\n"),a("ul",[a("li",[s._v("要用什么不同的模块来处理各种类型的文件")]),s._v(" "),a("li",[s._v("webpack本身只能处理原生的JavaScript模块，但是loader转换器可以将各种类型的资源转换成JavaScript模块。这样，任何资源都可以成为webpack可以处理的模块。")])])]),s._v(" "),a("li",[s._v("plugins：插件项\n"),a("ul",[a("li",[s._v("比如： html-webpack-plugin\n"),a("ul",[a("li",[s._v("为HTML文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题")]),s._v(" "),a("li",[s._v("可以生成创建HTML入口文件，比如单页面可以生成一个HTML文件入口，配置N个html-webpack-plugin可以生成N个页面入口")])])])])]),s._v(" "),a("li",[s._v("resolve：其他解决方案配置\n"),a("ul",[a("li",[s._v("root：绝对路径。查找module的话从这里开始查找。root：'E:/github/example/src'")]),s._v(" "),a("li",[s._v("extensions：自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名。extensions:['', '.js', '.json', 'scss']")]),s._v(" "),a("li",[s._v("alias： 模块定义别名，方便后续直接引用别名，无需多写长长的地址。 alias: {AppStore: 'js/stores/AppStores.js', ActionType: 'js/actions/ActionType.js'}")])])]),s._v(" "),a("li",[s._v("source-map\n"),a("ul",[a("li",[s._v("webpack.config.js配置： 「 devtool: 'eval-source-map', 」")]),s._v(" "),a("li",[s._v("作用：建立打包代码和源代码之间的映射关系，可以快速定位源代码出现问题的行数")])])]),s._v(" "),a("li",[s._v("其他配置")])]),s._v(" "),a("h3",{attrs:{id:"四、webpack-优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#四、webpack-优化"}},[s._v("#")]),s._v(" 四、webpack 优化")]),s._v(" "),a("p",[s._v("Webpack的优化主要从以下几个点出发：")]),s._v(" "),a("h4",{attrs:{id:"_1-优化开发体验"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-优化开发体验"}},[s._v("#")]),s._v(" 1. 优化开发体验")]),s._v(" "),a("ul",[a("li",[s._v("优化构建速度")]),s._v(" "),a("li",[s._v("优化使用体验，通过自动化手段，实现「自动刷新」和「模块热替换」")])]),s._v(" "),a("h4",{attrs:{id:"_2-优化输出质量"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-优化输出质量"}},[s._v("#")]),s._v(" 2. 优化输出质量")]),s._v(" "),a("ul",[a("li",[s._v("减少用户能感知到的加载时间，即首屏加载时间，比如区分环境、压缩、提取公共代码、按需加载、CDN、Tree Shaking")]),s._v(" "),a("li",[s._v("提升流畅度，比如prepack、scope hoisting")])]),s._v(" "),a("h4",{attrs:{id:"_3-具体优化思路"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-具体优化思路"}},[s._v("#")]),s._v(" 3. 具体优化思路")]),s._v(" "),a("ul",[a("li",[s._v("如何进行性能分析")]),s._v(" "),a("li",[s._v("文件结构优化")]),s._v(" "),a("li",[s._v("构建速度优化\n"),a("ul",[a("li",[s._v("减小文件搜索范围\n"),a("ul",[a("li",[s._v("优化 loader 配置")]),s._v(" "),a("li",[s._v("优化 resolve.modules 配置")]),s._v(" "),a("li",[s._v("优化 resolve.mainFields 配置")]),s._v(" "),a("li",[s._v("优化 resolve.alias 配置: 配置路径别名")]),s._v(" "),a("li",[s._v("优化 resolve.extensions 配置")]),s._v(" "),a("li",[s._v("优化 module.noParse 配置")])])]),s._v(" "),a("li",[s._v("多进程并行构建")]),s._v(" "),a("li",[s._v("多进程并行压缩")]),s._v(" "),a("li",[s._v("利用缓存提升二次构建速度")])])])]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 用 speed-measure-webpack-plugin 分析构建速度，它可以分析每个 loader 和 plugin 的耗时。")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" speedMeasureWebpackPlugin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'speed-measure-webpack-plugin'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" smp "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("speedMeasureWebpackPlugin")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 用 smp.wrap 去包裹 webpack 的配置对象")]),s._v("\nmodule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" smp"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("wrap")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//.....")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br")])]),a("ul",[a("li",[s._v("打包体积优化\n"),a("ul",[a("li",[s._v("webpack自带\n"),a("ul",[a("li",[s._v("Tree-Shaking")]),s._v(" "),a("li",[s._v("Scope-Hoisting")])])]),s._v(" "),a("li",[s._v("资源优化\n"),a("ul",[a("li",[s._v("压缩HTML")]),s._v(" "),a("li",[s._v("压缩CSS")]),s._v(" "),a("li",[s._v("压缩JS")]),s._v(" "),a("li",[s._v("处理图片和字体")])])])])])]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 用 webpack-bundle-analyzer 分析打包体积，在浏览器的 8888 端口下可以看到每个文件的体积信息以及各个 chunk 的包含关系，方便我们进行分析。")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// webpack-bundle-analyzer")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" BundleAnalyzerPlugin "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'webpack-bundle-analyzer'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nmodule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("plugins")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("BundleAnalyzerPlugin")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br")])]),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 压缩 css ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// mini-css-extract-plugin: 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// CssMinimizerWebpackPlugin: 不能与 speed-measure-webpack-plugin 混合使用，会报错。（暂未着手修复）")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// in module.rules")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 设置css不作为es模块，无需export sth")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n   "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("loader")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" MiniCssExtractPlugin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("loader"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n   "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("options")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("esModule")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 这个插件使用 cssnano 优化和压缩 CSS。")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// https://cssnano.co/")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br")])]),a("h3",{attrs:{id:"五、其他"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#五、其他"}},[s._v("#")]),s._v(" 五、其他")]),s._v(" "),a("p",[s._v("TODO...")]),s._v(" "),a("p",[s._v("整理的思维导图：\n"),a("img",{attrs:{src:t(310),alt:"An image"}})])])}),[],!1,null,null,null);a.default=e.exports}}]);