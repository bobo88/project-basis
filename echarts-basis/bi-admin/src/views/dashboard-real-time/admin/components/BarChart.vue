<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import { getUserByChannelYesterday } from '@/api/dashboard'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      activeUserData: {},
      newUserData: {},
      channelArr: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserByChannelYesterdayData()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 获取 昨日用户渠道分布 数据
    getUserByChannelYesterdayData() {
      getUserByChannelYesterday().then(response => {
        const { data } = response
        // console.log('获取 昨日用户渠道分布 数据getUserByChannelYesterday: ', data)
        this.activeUserData = data.activeUser.slice(0, 8) || []
        this.newUserData = data.newUser.slice(0, 8) || []
        this.channelArr = data.activeUser.map(i => i.channel).slice(0, 8) || []
        // console.log(this.channelArr)
        this.initChart()
      }).catch(error => {
        console.log(error)
      })
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el, 'chalk')

      this.chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 6, 45, 0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.7)',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: 0,
          right: 30,
          bottom: '8%',
          containLabel: true
        },
        legend: {
          top: '0',
          right: '0',
          icon: 'roundRect',
          itemWidth: 15,
          itemHeight: 8,
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          data: ['热门事件']
        },
        xAxis: {
          type: 'value',
          splitNumber: 4,
          boundaryGap: [0, 0.01],
          // 设置轴线的属性
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
              width: 1 // 这里是为了突出显示加上的
            }
          },
          // Y轴网格线
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.15)',
              width: 1 // 这里是为了突出显示加上的
            }
          }
        },
        yAxis: {
          type: 'category',
          data: this.channelArr,
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '12px'
            }
          },
          // 设置轴线的属性
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.15)',
              width: 1 // 这里是为了突出显示加上的
            }
          }
        },
        series: [
          {
            name: '热门事件',
            type: 'bar',
            barGap: 0,
            barMaxWidth: 12,
            data: this.activeUserData.map(i => i.val)
          }
        ]
      })
    }
  }
}
</script>
