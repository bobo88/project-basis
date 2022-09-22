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
      default: '600px'
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
      this.initChart()
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
      const chartData = this.chartData
      this.chart = this.$echarts.init(this.$el, 'chalk')
      this.chart.on('updateAxisPointer', (event) => {
        var xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          this.chart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })
      const _legendArr = []
      let _datetimeArr = []
      const datasetSource = []
      const _series = []
      // const that = this
      for (const i in chartData) {
        if (Object.prototype.hasOwnProperty.call(chartData, i)) {
          _legendArr.push(i)
          // _series.push({
          //   name: i,
          //   smooth: true,
          //   type: 'bar',
          //   data: chartData[i].map(item => {
          //     _datetimeArr.push(item.ds)
          //     return [item.ds, item.indexValue]
          //   })
          // })
          // let tempObj = {}
          // chartData[i].map(item => {
          //   console.log('xxx:', tempObj[item.ds])
          //   if (!tempObj[item.ds]) {
          //     tempObj[item.ds] = 0
          //   }
          //   tempObj[item.ds] += parseInt(item.indexValue)
          //   _datetimeArr.push(item.ds)
          // })

          _series.push({
            name: i,
            smooth: true,
            type: 'bar',
            data: chartData[i].map(item => {
              return [item.ds, item.indexValue]
            })
          })

          // console.log('obj:', tempObj)
        }
      }
      _datetimeArr = [...new Set(_datetimeArr)]
      // datasetSource.push([
      //   'date time', _datetimeArr
      // ])
      // console.log(_series, 123456)
      this.chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        legend: {
          icon: 'roundRect',
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          right: '0',
          top: '0',
          itemWidth: 15,
          itemHeight: 8
        },
        // dataset: {
        //   source: [
        //     ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
        //     ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
        //     ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
        //     ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
        //     ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
        //   ]
        // },
        xAxis: {
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
        },
        yAxis: {
          gridIndex: 0,
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
        grid: { top: '55%' },
        series: _series
      })
    }
  }
}
</script>
