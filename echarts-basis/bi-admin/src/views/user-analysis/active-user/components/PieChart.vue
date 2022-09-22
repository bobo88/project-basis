<template>
  <div :key="theKey" :class="className" :style="{height:height,width:width}" />
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
      theKey: 0,
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
      let optionsChart
      setTimeout(() => {
        let _legendArr = []
        let _datetimeArr = []
        let nameArr = []
        const allSingDataArr = []
        let _series = []
        for (const i in chartData) {
          if (Object.prototype.hasOwnProperty.call(chartData, i)) {
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
        const datasetSource = []
        datasetSource.push([].concat(['user'], nameArr))
        // 设置series ---------------
        _series = _legendArr.map(item => {
          const filterArr = allSingDataArr.filter(i => {
            return i.indexDim === item
          })
          const datasetSourceItemValArr = nameArr.map(i => {
            const filterOne = allSingDataArr.filter(j => {
              return j.indexDim === item && j.name === i
            })
            if (filterOne && filterOne.length > 0) {
              return filterOne[0].val
            }
            return 0
          })
          const datasetSourceItem = [].concat([item], datasetSourceItemValArr)
          datasetSource.push(datasetSourceItem)
          return {
            name: item,
            smooth: true,
            type: 'bar',
            barMaxWidth: 25,
            barMinWidth: 15,
            stack: '活跃用户构成',
            data: filterArr.map(i => {
              return {
                name: i.name,
                value: i.val
              }
            })
          }
        })
        optionsChart = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            showContent: false
          },
          legend: {
            icon: 'roundRect',
            textStyle: {
              color: this.$chalk.legendTextColor
              // backgroundColor: '#f00'
            },
            right: '0',
            top: '0',
            itemWidth: 15,
            itemHeight: 8,
            data: _legendArr.map(i => {
              return {
                name: i,
                textStyle: {
                  // backgroundColor: '#f60'
                }
              }
            })
          },
          dataset: {
            source: datasetSource
          },
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
            radius: ['2%', '30%'],
            itemStyle: {
              // borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 1
            },
            center: ['50%', '25%'],
            // emphasis: { focus: 'data' },
            // 饼图图形上的文本标签
            label: {
              formatter: function(params) {
                // console.log(56789, params)
                return params.name + ':' + params.data[1] + '，占比为：' + params.percent + '%'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            }
          })
        }

        this.chart.on('updateAxisPointer', (event) => {
          var xAxisInfo = event.axesInfo[0]
          if (xAxisInfo) {
            var dimension = xAxisInfo.value + 1
            this.chart.setOption({
              series: {
                id: 'pie',
                label: {
                  formatter: function(params) {
                    return params.data[0] + ':' + params.data[dimension] + '，占比为：' + params.percent + '%'
                  }
                },
                encode: {
                  value: dimension,
                  tooltip: dimension
                }
              }
            })
          }
        })

        this.chart.setOption(optionsChart, true)
      })
      // set
      optionsChart && this.chart.setOption(optionsChart, true)
    }
  }
}
</script>
