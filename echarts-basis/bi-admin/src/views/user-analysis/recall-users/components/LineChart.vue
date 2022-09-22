<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    chartData: {
      type: Object,
      required: true
    },
    dataTab: {
      type: String,
      required: true
    },
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
      default: '500px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      datetimeArr: []
    }
  },
  watch: {
    chartData() {
      if (Object.keys(this.chartData).length > 0) {
        this.setOptions(this.chartData)
      } else {
        this.setOptions({})
      }
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
      // console.log(11111, this.chart)
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      const project = localStorage.getItem('project') || 'VAPP'
      const _legendArr = []
      let _datetimeArr = []
      const _series = []
      const that = this
      for (const i in chartData) {
        if (Object.prototype.hasOwnProperty.call(chartData, i)) {
          _legendArr.push(i)
          _series.push({
            name: i,
            smooth: true,
            type: 'line',
            data: chartData[i].map(item => {
              _datetimeArr.push(item.ds)
              return [item.ds, item.indexValue]
            })
          })
        }
      }
      // console.log(12, _datetimeArr)
      _datetimeArr = [...new Set(_datetimeArr)]
      // console.log(34, _datetimeArr)
      // 渲染图表
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
          padding: [5, 10],
          formatter: function(item) {
            let rtn = ''
            for (let i = 0; i < item.length; i++) {
              if (i === 0) {
                rtn = item[i].name + '<br/>'
              }
              rtn += item[i].marker + item[i].seriesName + ': ' + ((that.dataTab === '1' || that.dataTab === '4') ? (item[i].data[1] * 100).toFixed(2) + '%<br/>' : item[i].data[1] + '<br/>')
            }
            return rtn
          }
          // dataTab
        },
        legend: {
          type: 'scroll', // 分页类型
          top: '0',
          right: '0',
          icon: 'roundRect',
          itemWidth: 15,
          itemHeight: 8,
          // legendTextColor
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          data: _legendArr
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: _datetimeArr,
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
        series: _series
      }, true)
      // 学习学习
    }
  }
}
</script>
