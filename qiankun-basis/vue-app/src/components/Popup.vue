<template>
    <div class="pop-up" id="pop-up-box">
        <div class="pop-up-cont">
            <h3 class="pop-up-tit">我是自定义弹窗</h3>
            <p class="pop-up-desc">一些奇奇怪怪的描述</p>
        </div>
    </div>
</template>

<script setup>
// let mainBox = document.getElementById('base-app');
//   let appBox = document.getElementById('app');
//   let popUpBox = document.createElement('div');
//   // <style>
//   //   .pop-up {
//   //     width: 100%;
//   //     height: 100%;
//   //     position: fixed;
//   //     top: 0;
//   //     left: 0;
//   //     z-index: 99;
//   //     color: #fff;
//   //     text-align: center;
//   //     background: rgba(0, 0, 0, 0.85);
//   //   }
//   //   .pop-up-cont {
//   //     position: absolute;
//   //     width: 200px;
//   //     height: 200px;
//   //     margin: auto;
//   //     top: 0;
//   //     left: 0;
//   //     right: 0;
//   //     bottom: 0;
//   //     border: 1px solid #fff;
//   //     border-radius: 10px;
//   //   }
//   //   .pop-up-tit {
//   //     color: #f00;
//   //   }
//   //   .pop-up-desc {
//   //     color: grey;
//   //   }
//   // </style>
//   let htmlCont = `
//     <div class="pop-up" id="pop-up-box">
//       <div class="pop-up-cont">
//         <h3 class="pop-up-tit">我是自定义弹窗</h3>
//         <p class="pop-up-desc">一些奇奇怪怪的描述</p>
//       </div>
//     </div>
//   `;
//   popUpBox.setAttribute('class', 'vueapp-space');
//   popUpBox.innerHTML = htmlCont;
//   // appBox.appendChild(popUpBox);

//   if (mainBox) {
//     mainBox.appendChild(popUpBox);
//   }
</script>

<style lang="scss">
.pop-up {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, 0.85);
    .pop-up-cont {
        position: absolute;
        width: 200px;
        height: 200px;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #fff;
        border-radius: 10px;
    }
    .pop-up-tit {
        color: #f00;
    }
    .pop-up-desc {
        color: grey;
    }
}
</style>
