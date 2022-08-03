
<template>
  <div class="box">
      <canvas
        id="playerVideo"
        :width="(isLandscape ? cw : canvasHeight) + 'px'"
        :height="(isLandscape ? ch : canvasWidth) + 'px'"
        class="videoRotate"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
      ></canvas>
  </div>
</template>

<script>
import webSocketJs from '../workerJs/websocket.worker.js'

export default {
  watch: {
    qualityData(val) {
      var buffer = makeSharpnessStr(Number(val))
      this.webSocketWorker.postMessage(buffer)
    }
  },
  mounted() {

    document.addEventListener('visibilitychange', this.canvasPlay)
    this.$nextTick(() => {
      this.canvas = document.getElementById('playerVideo')
      this.canvas.oncontextmenu = () => {
        var buffer = ExexuteKeyDown(4)
        this.webSocketWorker.postMessage(buffer)
      }

      this.webglPlayer = new WebGLPlayer(this.myVideo, {
        preserveDrawingBuffer: false
      })
      this.player = new PCMPlayer({
        encoding: '16bitInt',
        channels: 2,
        sampleRate: 44100,
        flushingTime: 22,
        debug: false
      })
    })
  },
  methods: {
    // 切换画质 ----------------- Start ------------
    onQuality(idx, pixel) {
      var buffer = makeSharpnessStr(Number(idx))
      this.webSocketWorker.postMessage(buffer)
      this.setQualityData(optionQuality[pixel])

      this.setQualityShow(false)
    },
    // 切换画质 ----------------- Ended ------------

    // 音频解码
    decodeAAC(data) {
      var retPtr = this.Module._malloc(4 * 5 * 1024) //接收的数据
      var inputPtr = this.Module._malloc(4 * data.length) //输入数据

      for (let i = 0; i < data.length; i++) {
        this.Module.HEAPU8[inputPtr + i] = data[i] //转换为堆数据
      }
      var pcmLen = this.Module._feedData(retPtr, inputPtr, data.length)
      if (pcmLen >= 0) {
        //console.log("%d帧 aac 解码成功, %d", this.decodeCount, pcmLen);
        var pcmData = new Uint8Array(pcmLen)
        for (let i = 0; i < pcmLen; i++) {
          pcmData[i] = this.Module.HEAPU8[retPtr + i]
        }
        this.player.feed(pcmData)
      } else {
        // console.log('%d帧 aac 解码失败, %d', this.decodeCount, pcmLen)
      }
      this.decodeCount++
      this.Module._free(inputPtr)
      this.Module._free(retPtr)
    },
    // 倒计时 退出
    timeChange() {
      this.$store.dispatch('settTrialEndShow', true);
      this.$store.dispatch('setQualityShow', false)
      this.showPopover = false
      this.$store.dispatch('setFalseBall', false)
      document.removeEventListener('visibilitychange', this.canvasPlay)
      let closeSocket = ExexuteCloseServer(this.sn) // 销毁监听
      if (this.webSocketWorker) {
        clearInterval(this.timer)
        // this.webSocketWorker.send(closeSocket);
        this.webSocketWorker.postMessage(closeSocket)
        this.webSocketWorker.terminate()
        // this.webSocketWorker.close();
        this.webSocketWorker = null
      }
      if (this.sendCommandWorker) this.sendCommandWorker.send('close')
      this.$store.dispatch('setWebsocketNumber', false)
      this.$store.dispatch('setWebsocketView', false)
      this.Module = null
      this.player = null
      this.myVideo.pause()
    },

    // 初始化  worker
    init() {
      // 音视频流初始化
      this.websocketInit()
      // 指令流初始化
      this.commandWorkeInit()

      // 键盘？
      this.keydownFun()
      // 其他初始化
      this.otherInit()
    },
    // 音视频流初始化
    websocketInit() {
      const { sn, cardToken, extranetIp, extranetPort } = this.pushFlow
      this.decodeWoker = new Worker('decoder.js')
      this.webSocketWorker = new webSocketJs() // Right
      this.webSocketWorker.postMessage({
        extranetIp,
        extranetPort,
        sn,
        cardToken
      })

      this.webSocketWorker.onopen = (event) => {
        console.log(
          '===========自定义 OPEN ===========',
          this.webSocketWorker,
          event
        )
      }

      this.decodeWoker.addEventListener('message', (event) => {
        // console.log('===========自定义 message ===========', this.webSocketWorker,event)
        var objData = event.data || {}
        switch (objData.cmd) {
          case 0:
            console.log(objData.data)
            break
          case 1:
            // var time = new Date().getTime();
            if (this.w != objData.width || this.h != objData.height) {
              // alert("分辨率变为: " + objData.width + " X "  + objData.height);
              this.w = objData.width
              this.h = objData.height
            }
            this.webglPlayer.renderFrame(
              objData.data,
              this.w,
              this.h,
              this.w * this.h,
              (this.w / 2) * (this.h / 2)
            )
            break
          case 5:
            var buffer = RequestIFrame(this.sn)
            this.webSocketWorker.postMessage(buffer)
        }
      })
      this.webSocketWorker.onmessage = (event) => {
        if (event.data === 'close') {
          console.log('触发CLose。。。', this.webSocketWorker)
          this.webSocketWorker.postMessage('restart')
        }
        if (
          typeof event.data === 'object' &&
          (event.data.setResolving === 0 || event.data.setResolving === 1)
        ) {
          // 设置横竖屏
          // console.log('设置横竖屏: ', event.data.setResolving)
          this.$store.dispatch('setResolving', event.data.setResolving)
        }
        // 断开流
        if (typeof event.data === 'object' && event.data.readyState === 3) {
          console.log('断流断流断流33: ', event.data.readyState)
          this.returnBack()
        }

        var cmd = {
          type: 'rawData',
          data: event.data
        }
        if (document.visibilityState == 'visible' && this.isEntered) {
          // console.log('发送首帧 --- SEND')
          this.webSocketWorker.postMessage(RequestIFrame(sn))
          this.isEntered = false
        }
        var input = new Uint8Array(event.data)
        if (input[0] == 0xff) {
          // 音频
          document.visibilityState == 'visible' && this.decodeAAC(input)
        }
        if (input[0] == 0 && input[1] == 0 && input[2] == 0 && input[3] == 1) {
               let nalType = input[4] & 0x1f
          if (nalType == 0x07 || nalType == 0x08 || nalType == 0x05) {
            if (!this.isEntered) {
              this.isEntered = true
            }
          }
         if (document.visibilityState == 'visible' && this.isEntered) {
       
            this.decodeWoker.postMessage(cmd)
          }
        }
      }
    },
    // 指令流初始化
    commandWorkeInit() {
      // 处理 websocket 发送指令
      const { extranetIp, socketExtranetPort, noRestart, cardToken } =
        this.pushFlow
      var controlsocketURL = `ws://${extranetIp}:${socketExtranetPort}?token=${cardToken}&type=business`
      // var controlsocketURL = `ws://14.18.190.138:42138?token=szV+YHZCT8dAiZTno+zub07JLJNUUC0vIKK2HWaE0RKnJ/53KBZKj63rb9aoWvVnkkySxFHdgoBqO4i8VkEJJw==&type=business`
      this.sendCommandWorker = new WebSocket(controlsocketURL)
      this.sendCommandWorker.binaryType = 'arraybuffer'
      // 指令流====================================
      this.sendCommandWorker.addEventListener('open', (event) => {
        if (noRestart !== 1) {
          var buffer = ExexuteSetPhoneSize('1920', '1080')
          // var bufferSendBitRate = ExexuteSendBitRate('1');
          var inputMethodBuffer = JSON.stringify({
            type: 'InputMethod',
            data: {
              type: 2 // 1即玩云键盘 2试玩讯飞键盘
            }
          })
          this.sendCommandWorker.send(inputMethodBuffer)
          this.sendCommandWorker.send(buffer)
          console.log('控制端口已经打开', event)
        }
      })
      this.sendCommandWorker.addEventListener('message', (event) => {
        const pa = JSON.parse(event.data)
        if (pa.type === 'keyboardFeedbackBean') {
          this.paType = 'keyboardFeedbackBean'
          this.inputVal = pa.data.text
          // console.log('我唤起键盘透传了HH')
        } else {
          this.paType = 'xxxx'
          // console.log('xxxxxxxxxxxxxxxxxx')
        }
        // console.log('【指令流】: ', event.data)
      })
    },
    // 7、添加游戏ICON到桌面
    otherInit() {},
    keydownFun() {
      const socket = this.webSocketWorker
      const sendCommandWorker = this.sendCommandWorker
      // eslint-disable-next-line
      const { sn } = this.pushFlow
      const vm = this

      document.onkeydown = function (event) {
        console.log('===========我打开键盘了', event.keyCode)
        let isMac = navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0

        let keyCode = ''
        if (
          (event.ctrlKey || (isMac && event.composed)) &&
          event.keyCode == 67
        ) {
          // console.log('Ctrl + C')
          keyCode = 278
        } else if (
          (event.ctrlKey || (isMac && event.composed)) &&
          event.keyCode == 86
        ) {
          // console.log('Ctrl + V')
          // keyCode = 279
          return
        } else if (
          (event.ctrlKey || (isMac && event.composed)) &&
          event.keyCode == 88
        ) {
          // console.log('Ctrl + X')
          keyCode = 277
        } else if (event.shiftKey && event.keyCode == 56) {
          keyCode = 17 //*
        } else if (event.shiftKey && event.keyCode == 51) {
          keyCode = 18 //#
        } else if (event.shiftKey && event.keyCode == 32) {
          keyCode = 59 // shift + Space
        } else if (event.shiftKey && event.keyCode == 50) {
          keyCode = 77 // @
        } else if (event.shiftKey && event.keyCode == 187) {
          keyCode = 81 // +
        } else if (
          !event.ctrlKey ||
          !event.shiftKey ||
          !(isMac && event.composed)
        ) {
          keyCode = keycodeMode[event.keyCode]
        }
        if (keyCode) {
          console.log(keyCode, 888888888, vm.inputVal, 6666)
          var buffer = ExexuteKeyDown(keyCode, sn)
          socket.postMessage(buffer)
          sendCommandWorker.postMessage(buffer)
        }
      }
    },

    doSomeConfig() {
      const { sn } = this.pushFlow
      console.log('sn==========', sn)
      this.webSocketWorker.send(ConfigChannel(sn, 'chaohang'))
      var checkBuffer = GetScreenState(sn)
      this.webSocketWorker.send(checkBuffer)
            this.webSocketWorker.postMessage(makeSharpnessStr(Number(3)))
    },
    // 执行一次函数
    cg(event) {
      if (event.data == 'cg' && this.getNumber) {
        this.isAudioPlay = true
        this.$store.dispatch('setWebsocketView', true)
        this.showPopover = true
        this.cg = () => {}
      }
    },
    //  canvas
    canvasPlay() {
      console.log('canvasPlay==========')
      if (document.visibilityState == 'visible') {
        console.log('发送首帧 --- SEND')
        this.webSocketWorker.postMessage(RequestIFrame(this.sn))
      } else {
        this.isEntered = false
      }
    },
    // 按下事件
    touchstart(event) {
      event.preventDefault()
      this.touchClick(event, 0, 'touchstart')
    },
    // 移动事件
    touchmove(event) {
      event.preventDefault()
      this.touchClick(event, 2, 'touchmove')
    },
    // 抬起事件
    touchend(event) {
      event.preventDefault()
      this.touchClick(event, 1, 'touchend')
    },
    touchClick(event, type, status) {
      const onClickHandle = {
        0: ExexuteMouseDown,
        1: ExexuteMouseUp,
        2: ExexuteMouseMove
      }
      // websocket 响应横竖屏   0:横屏 1:竖屏
      let touches = event.changedTouches
      var ongoingTouches = []
      for (var i = 0; i < touches.length; i++) {
        if (status === 'touchstart') {
          var idx = ongoingTouches.findIndex(function (ele) {
            return ele.identifier === touches[i].identifier
          })
          if (idx < 0) {
            ongoingTouches.push(touches[i])
          }
          // console.log('ongoingTouches', ongoingTouches)
        }

        if (this.resolving == 0) {
          // 根据游戏的分辨率 设置
          let posX =
            (this.sysWidth * 1.0 * touches[i].clientY) / this.canvasHeight
          let posY =
            (this.sysHeight * 1.0 * (this.canvasWidth - touches[i].clientX)) /
            this.canvasWidth
          // 重力感应
          if (this.isLandscape) {
            // 根据游戏的分辨率 设置
            posX = (touches[i].clientX * this.sysWidth * 1.0) / this.cw
            posY = (touches[i].clientY * this.sysHeight * 1.0) / this.ch
          }
          let buffer = onClickHandle[type](
            posX.toFixed(2),
            posY.toFixed(2),
            'RK3923C1201900139',
            ongoingTouches,
            touches[i].identifier
          )
          this.sendCommandWorker.send(buffer)
        } else {
          let touches = event.changedTouches
          // 根据游戏的分辨率 设置
          let posX =
            (touches[i].clientX * this.sysHeight * 1.0) / this.canvasWidth
          let posY =
            (touches[i].clientY * this.sysWidth * 1.0) / this.canvasHeight
          let buffer = onClickHandle[type](
            posX.toFixed(2),
            posY.toFixed(2),
            'RK3923C1201900139',
            ongoingTouches,
            touches[i].identifier
          )
          this.sendCommandWorker.send(buffer)

          console.log(
            '点击touches: ',
            touches[i].clientX,
            touches[i].clientY,
            '-- 音视频w&h: ',
            this.sysWidth,
            this.sysHeight,
            '-- canvas W&H: ',
            this.canvasWidth,
            this.canvasHeight
          )
        }

        if (status === 'touchend') {
          ongoingTouches.forEach(function (item, index) {
            if (item.identifier === touches[i].identifier) {
              ongoingTouches.splice(index, 1)
            }
          })
        }
      }
      // 点击其他区域，关闭【画质切换弹窗】
      this.isShowed = false
      this.isShowBall = true
      this.payTcShow = false
    },
    // 断链
    destroyedWebsocket() {
      console.log('销毁销毁')
      let closeSocket = ExexuteCloseServer(this.sn) // 销毁监听
      if (this.webSocketWorker) {
        this.webSocketWorker.postMessage(closeSocket)
        this.webSocketWorker.terminate()
      }
      if (this.decodeWoker) this.decodeWoker.postMessage({ start: 'close' })
    }
  },
  beforeDestroy() {
    console.log('销毁2222')
    this.$store.dispatch('setQualityData', '1243000') // 重置 清晰度 分辨率
    this.$store.dispatch('setQualityShow', false) // 重置 清晰度弹框
    this.$store.dispatch('settTrialEndShow', false) // 重置 试玩结束弹框

    this.$store.dispatch('setPushFlow', null)
    this.setEnvironment(false)
    document.removeEventListener('visibilitychange', this.canvasPlay)
    let closeSocket = ExexuteCloseServer(this.sn) // 销毁监听
    if (this.webSocketWorker) {
      this.webSocketWorker.postMessage(closeSocket)
      this.webSocketWorker.terminate()
      clearInterval(this.timer)
      // this.webSocketWorker.close();
      this.webSocketWorker = null
    }
    if (this.sendCommandWorker) this.sendCommandWorker.send('close')
    this.$store.dispatch('setWebsocketNumber', false)
    this.$store.dispatch('setWebsocketView', false)
    this.Module = null
    this.player = null
    if (
      document.getElementsByClassName('van-dialog') &&
      document.getElementsByClassName('van-dialog')[0] &&
      document
        .getElementsByClassName('van-dialog')[0]
        .classList.value.indexOf('van-screen') !== -1
    ) {
      document
        .getElementsByClassName('van-dialog')[0]
        .classList.remove('van-screen')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
