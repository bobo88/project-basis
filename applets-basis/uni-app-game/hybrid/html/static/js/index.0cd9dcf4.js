(self["webpackChunkvue3_multi_page"]=self["webpackChunkvue3_multi_page"]||[]).push([[826],{4192:function(e,t,n){"use strict";n.d(t,{wP:function(){return r}});var s=n(6265),a=n.n(s);let o=window.location.origin;function i(e,t){return a().get(e,t)}a().defaults.baseURL=o,a().defaults.timeout=5e4,a().defaults.withCredentials=!0,a().interceptors.request.use((e=>{if(localStorage&&localStorage.getItem("token")){const t=localStorage.getItem("token");t&&(e.headers.Authorization=t)}return e}),(e=>(console.log(e),Promise.error(e)))),a().interceptors.response.use((e=>200!==e.status?Promise.reject(e):"993"!==e.data.code?Promise.resolve(e):(console.log("登录过期"),void(window.location.href="/#/login"))));const r=e=>i("/api/photos/"+e.num,!1)},5102:function(){(function(e,t){var n=t.documentElement,s=e.devicePixelRatio||1;function a(){t.body?t.body.style.fontSize=12*s+"px":t.addEventListener("DOMContentLoaded",a)}function o(){var e=n.clientWidth/10;n.style.fontSize=e+"px"}if(a(),o(),e.addEventListener("resize",o),e.addEventListener("pageshow",(function(e){e.persisted&&o()})),s>=2){var i=t.createElement("body"),r=t.createElement("div");r.style.border=".5px solid transparent",i.appendChild(r),n.appendChild(i),1===r.offsetHeight&&n.classList.add("hairlines"),n.removeChild(i)}})(window,document)},2993:function(e,t,n){"use strict";var s=n(9242),a=n(3396),o=n(4870),i=n(7139);const r=e=>((0,a.dD)("data-v-9654a77c"),e=e(),(0,a.Cn)(),e),l={class:"hello"},c={class:"inline-block pr30"},u=r((()=>(0,a._)("span",null,"我是测试 Sass 是否OK的(生效就是蓝色字体)",-1)));var d=(0,a.aZ)({name:"TestCom",setup(e){const t=(0,o.iH)("我是测试的msg而已, 我有右padding");return(e,n)=>((0,a.wg)(),(0,a.iD)("div",l,[(0,a._)("p",null,[(0,a._)("em",c,(0,i.zw)(t.value),1),u])]))}}),p=n(89);const m=(0,p.Z)(d,[["__scopeId","data-v-9654a77c"]]);var v=m,f=n(2807),g=n(4192);const h={class:"tst-axios"},w=(0,a.Uk)("验证 Axios 请求"),_={class:"pt20"},b={class:"text-purple"};var x=(0,a.aZ)({name:"TestAxios",setup(e){const t=(0,o.iH)(!1);let n=(0,o.qj)({});const s=()=>{if(t.value)return f.z8.error("别慌，你点击太快了."),!1;t.value=!0,(0,g.wP)({num:Math.ceil(100*Math.random())}).then((e=>{Object.assign(n,e.data),t.value=!1}))};return(e,r)=>{const l=(0,a.up)("el-button"),c=(0,a.up)("el-image"),u=(0,a.Q2)("loading");return(0,a.wg)(),(0,a.iD)("div",h,[(0,a.Wm)(l,{type:"primary",onClick:s},{default:(0,a.w5)((()=>[w])),_:1}),(0,a.wy)(((0,a.wg)(),(0,a.iD)("div",_,[(0,a.Wm)(c,{class:"mb10",style:{width:"200px",height:"200px"},src:(0,o.SU)(n).url},null,8,["src"]),(0,a._)("p",b,(0,i.zw)((0,o.SU)(n).title),1)])),[[u,t.value]])])}}});const y=(0,p.Z)(x,[["__scopeId","data-v-2e07ea2e"]]);var C=y;const S=(0,a._)("h1",{class:"mb30"},"我是Index目录下的项目",-1),k=(0,a._)("p",{class:"test-grey mb10"},"我是验证全局样式是否生效的（生效了就是灰色）",-1),z=(0,a._)("h4",{class:"text-purple mb10"},"测试scss样式计算是否OK",-1),O=(0,a._)("p",{class:"test-rem text-primary mb10"},"验证 rem 适配 (如果宽度满屏则表示OK)",-1);var D=(0,a.aZ)({name:"App",setup(e){return(e,t)=>((0,a.wg)(),(0,a.iD)("div",null,[S,(0,a.Wm)((0,o.SU)(v),{class:"mb20"}),k,z,O,(0,a.Wm)((0,o.SU)(C))]))}});const E=D;var L=E,P=(n(5102),n(5346));n(3669);const U=(0,s.ri)(L);U.use(P.Z),U.mount("#app")}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[998],(function(){return t(2993)}));e.O()}]);