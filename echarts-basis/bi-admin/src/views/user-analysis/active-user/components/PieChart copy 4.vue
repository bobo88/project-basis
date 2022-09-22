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
        // console.log(8888, xAxisInfo)
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          console.log('*********:', dimension)
          this.chart.setOption({
            series: {
              id: 'pie',
              label: {
                // formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                formatter: function(params) {
                  // console.log(56789, params)
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
      const datasetSource = []
      datasetSource.push([].concat(['user'], nameArr))
      // 设置series ---------------
      _series = _legendArr.map(item => {
        /**
         * 0: {name: "PS(2021-01-24)", indexDim: "较活跃用户", val: 4}
            1: {name: "PS(2021-01-24)", indexDim: "新增用户", val: 2}
            2: {name: "PS(2021-01-24)", indexDim: "留存用户", val: 12}
            3: {name: "PS(2021-01-24)", indexDim: "忠实用户**************", val: 1}
            4: {name: "PS(2021-01-24)", indexDim: "召回用户", val: 1}
            5: {name: "PS(2021-01-25)", indexDim: "较活跃用户", val: 6}
            6: {name: "PS(2021-01-25)", indexDim: "新增用户", val: 7}
            7: {name: "PS(2021-01-25)", indexDim: "留存用户", val: 4}
            8: {name: "TR(2021-01-24)", indexDim: "新增用户", val: 142}
            9: {name: "TR(2021-01-24)", indexDim: "忠实用户**************", val: 113}
            10: {name: "TR(2021-01-24)", indexDim: "留存用户", val: 249}
            11: {name: "TR(2021-01-24)", indexDim: "召回用户", val: 36}
            12: {name: "TR(2021-01-24)", indexDim: "较活跃用户", val: 153}
            13: {name: "TR(2021-01-25)", indexDim: "召回用户", val: 35}
            14: {name: "TR(2021-01-25)", indexDim: "较活跃用户", val: 151}
            15: {name: "TR(2021-01-25)", indexDim: "留存用户", val: 219}
            16: {name: "TR(2021-01-25)", indexDim: "新增用户", val: 168}
            17: {name: "TR(2021-01-25)", indexDim: "忠实用户**************", val: 114}
         */
        /**
         * 0: (5) ["user", "PS(2021-01-24)", "PS(2021-01-25)", "TR(2021-01-24)", "TR(2021-01-25)"]
            1: (5) ["新增用户", 2, 7, 142, 168]
            2: (4) ["忠实用户", 1, 113, 114]
            3: (5) ["留存用户", 12, 4, 249, 219]
            4: (4) ["召回用户", 1, 36, 35]
            5: (5) ["较活跃用户", 4, 6, 153, 151]
         */
        // nameArr  "PS(2021-01-24)", "PS(2021-01-25)", "TR(2021-01-24)", "TR(2021-01-25)"]
        const filterArr = allSingDataArr.filter(i => {
          // ["user", "2021-01-24", "2021-01-25"]
          // _datetimeArr
          return i.indexDim === item
        })
        const datasetSourceItemValArr = nameArr.map(i => {
          // console.log(158, i)
          const filterOne = allSingDataArr.filter(j => {
            return j.indexDim === item && j.name === i
          })
          // console.log(199999, filterOne)
          if (filterOne && filterOne.length > 0) {
            return filterOne[0].val
          }
          return 0
        })
        const datasetSourceItem = [].concat([item], datasetSourceItemValArr)
        // console.log(168, datasetSourceItemValArr)
        datasetSource.push(datasetSourceItem)
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
      // console.log(588, allSingDataArr, _series, datasetSource)

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
          radius: '30%',
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
      })
    }
  }
}
</script>
