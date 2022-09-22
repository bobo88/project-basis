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
        console.log(8888, event)
        var xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          this.chart.setOption({
            series: {
              id: 'pie'
              // label: {
              //   formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              // },
              // encode: {
              //   value: dimension,
              //   tooltip: dimension
              // }
            }
          })
        }
      })
      let _legendArr = []
      let _datetimeArr = []
      let nameArr = []
      const allSingDataArr = []
      // const paramsArr = []
      let _series = []
      for (const i in chartData) {
        if (Object.prototype.hasOwnProperty.call(chartData, i)) {
          // 得到一级维度：ALL/ TR / PS 等
          // paramsArr.push(i)
          chartData[i].map(item => {
            _legendArr.push(item.indexDim)
            _datetimeArr.push(item.ds)
            nameArr.push(item.dimension + '(' + item.ds + ')')
          })
          // 将所有数据扁平化处理，变为一维数组
          chartData[i].map(item => {
            allSingDataArr.push({
              name: item.dimension + '(' + item.ds + ')',
              indexDim: item.indexDim,
              val: item.indexValue
            })
          })
        }
      }
      _legendArr = [...new Set(_legendArr)]
      _datetimeArr = [...new Set(_datetimeArr)]
      nameArr = [...new Set(nameArr)]
      // console.log(_legendArr, _datetimeArr, nameArr, 123456)
      // 设置series ---------------
      _series = _legendArr.map(item => {
        const filterArr = allSingDataArr.filter(i => {
          return i.indexDim === item
        })
        return {
          name: item,
          smooth: true,
          type: 'bar',
          barWidth: 15,
          stack: '活跃用户构成',
          data: filterArr.map(i => {
            return [i.name, i.val]
          })
        }
      })
      console.log(588, allSingDataArr, _series)

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
          itemHeight: 8,
          data: _legendArr
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
          data: nameArr,
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
        series: [].concat(_series, {
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: ['50%', '25%'],
          emphasis: { focus: 'data' }
          // // {@2012}
          // label: {
          //   formatter: '{b}:  ({d}%)'
          // },
          // encode: {
          //   itemName: '召回用户',
          //   value: 'ALL(2021-01-24)',
          //   tooltip: 'ALL(2021-01-24)'
          // }
        })
      })
    }
  }
}
</script>
