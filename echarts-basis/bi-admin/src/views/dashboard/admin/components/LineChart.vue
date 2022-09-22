<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import { getUsersIn7day } from '@/api/dashboard'

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
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      activeUserData: {},
      newUserData: {},
      datetimeArr: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUsersIn7dayData()
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
    // 获取 最近7日用户 数据
    getUsersIn7dayData() {
      getUsersIn7day().then(response => {
        const { data } = response
        // console.log('获取 最近7日用户 数据 getUsersIn7day: ', data)
        this.activeUserData = data.activeUser || []
        this.newUserData = data.newUser || []
        this.datetimeArr = data.activeUser.map(i => {
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
      // console.log(11111, this.chart)
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      const project = localStorage.getItem('project') || 'VAPP'
      this.chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 6, 45, 0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.7)',
          // axisPointer: {
          //   type: 'cross'
          // },
          padding: [5, 10]
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
          data: ['活跃用户', '新增用户']
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        xAxis: [
          {
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
              align: 'center',
              textStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: project === 'VAPP_LITE' ? 0 : 0,
            // 关闭Y轴网格线
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.1)',
                width: 1 // 这里是为了突出显示加上的
              }
            },
            axisTick: {
              show: false
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
          },
          {
            type: 'value',
            scale: true,
            // max: 2000000,
            min: project === 'VAPP_LITE' ? 0 : 0,
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
          }
        ],
        series: [{
          name: '活跃用户',
          smooth: true,
          type: 'line',
          data: this.activeUserData.map(i => i.val)
        },
        {
          name: '新增用户',
          smooth: true,
          yAxisIndex: 1,
          type: 'line',
          data: this.newUserData.map(i => i.val)
        }]
      })
    }
  }
}
</script>
