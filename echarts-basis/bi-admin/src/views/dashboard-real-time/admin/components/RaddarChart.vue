<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'

const animationDuration = 3000

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
      default: '270px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
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
    initChart() {
      this.chart = this.$echarts.init(this.$el, 'chalk')

      this.chart.setOption({
        color: this.chartData.color,
        backgroundColor: 'transparent',
        tooltip: {
          // trigger: 'axis',
          // axisPointer: { // 坐标轴指示器，坐标轴触发有效
          //   type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          // }
        },
        radar: {
          // axisTick: {
          //   show: true
          // },
          // axisLabel: {
          //   show: true
          // },
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 5,
          // name: {
          //   textStyle: {
          //     color: '#fff',
          //     backgroundColor: '#999',
          //     borderRadius: 3,
          //     padding: [3, 5]
          //   }
          // },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          splitArea: {
            areaStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '3.4.0', max: 10000, color: 'rgba(255, 255, 255, 0.7)' },
            { name: '3.5.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
            { name: '3.6.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
            { name: '3.6.8', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
            { name: '3.7.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
            { name: '3.8.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' }
          ]
        },
        legend: {
          // legendTextColor
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          left: 'center',
          bottom: '10',
          data: [this.chartData.title]
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            color: this.chartData.shadowColor
          },
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: this.chartData.title
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
