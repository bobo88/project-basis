<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import { getVV } from '@/api/dashboard'

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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      vvData: {},
      avgVvData: {},
      datetimeArr: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getVVData()
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
    // 获取 最近7天vv数 数据
    getVVData() {
      getVV().then(response => {
        const { data } = response
        // console.log('获取 最近7天vv数 数据 getVV: ', data)
        this.vvData = data.vv || []
        this.avgVvData = data.avgVv || []
        this.datetimeArr = data.vv.map(i => {
          return this.$filters.dateFormatMmDd(i.dt)
        }) || []
        console.log(this.datetimeArr)
        this.initChart()
      }).catch(error => {
        console.log(error)
      })
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el, 'chalk')
      const project = localStorage.getItem('project') || 'VAPP'

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
        legend: {
          top: '0',
          right: '0',
          icon: 'roundRect',
          itemWidth: 15,
          itemHeight: 8,
          // legendTextColor
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          data: ['新增用户']
        },
        grid: {
          top: 30,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.datetimeArr,
          boundaryGap: true,
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          // 设置轴线的属性
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.15)',
              width: 1 // 这里是为了突出显示加上的
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          min: project === 'VAPP_LITE' ? 0 : 0,
          axisTick: {
            show: false
          },
          // 关闭Y轴网格线
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              width: 1 // 这里是为了突出显示加上的
            }
          },
          // 设置轴线的属性
          axisLine: {
            show: false,
            lineStyle: {
              color: '#666666',
              width: 1 // 这里是为了突出显示加上的
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '12px'
            }
          }
        }, {
          type: 'value',
          scale: true,
          // max: 30,
          min: 0,
          axisTick: {
            show: false
          },
          // 关闭Y轴网格线
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              width: 1 // 这里是为了突出显示加上的
            }
          },
          // 设置轴线的属性
          axisLine: {
            show: false,
            lineStyle: {
              color: '#666666',
              width: 1 // 这里是为了突出显示加上的
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '12px'
            }
          }
        }],
        series: [{
          name: '新增用户',
          type: 'bar',
          barWidth: 15,
          data: this.vvData.map(i => i.val)
        }]
      })
    }
  }
}
</script>
