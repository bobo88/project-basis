<template>
  <div id="nav">
    我来自子应用
    <p class="common-blue">子应用 use common-blue 的标签</p>
    <p class="common-yellow">子应用 Modify common-yellow 的标签</p>

    <button v-if="mainBox" @click="showTc" style="margin-right:20px;">点击我显示弹窗（样式内置）</button>
    <button v-if="mainBox" @click="showTc2">点击我显示弹窗（添加前缀）</button>
  </div>
</template>

<script setup>
  const mainBox = document.getElementById('base-app');
  const showTc = () => {
    let popUpBox = document.createElement('div');
    let htmlCont = `
      <style>
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
        }
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
      </style>
    
      <div class="pop-up" id="pop-up-box">
        <div class="pop-up-cont">
          <h3 class="pop-up-tit">我是自定义弹窗</h3>
          <p class="pop-up-desc">一些奇奇怪怪的描述</p>
          <button onclick="hiddenPopup('pop-up-box')">关闭弹窗</button>
        </div>
      </div>
    `;
    popUpBox.innerHTML = htmlCont;
    mainBox.appendChild(popUpBox);
  }
  const showTc2 = () => {
    let popUpBox = document.createElement('div');
    let htmlCont = `
      <div class="pop-up" id="pop-up-box2">
        <div class="pop-up-cont">
          <h3 class="pop-up-tit">我是自定义弹窗</h3>
          <p class="pop-up-desc">一些奇奇怪怪的描述</p>
          <button onclick="hiddenPopup('pop-up-box2')">关闭弹窗</button>
        </div>
      </div>
    `;
    popUpBox.setAttribute('class', 'vueapp-space');
    popUpBox.innerHTML = htmlCont;
    mainBox.appendChild(popUpBox);
  }

</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
    border: 1px solid #333;
    border-radius: 10px;
  }
  
  .common-yellow {
    color: #f60;
    font-size: 16px;
  }
</style>
