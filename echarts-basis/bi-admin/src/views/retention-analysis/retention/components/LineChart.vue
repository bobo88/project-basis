<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
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
    dataGroup: {
      type: String,
      required: true
    },
    dataType: {
      type: String,
      required: true
    },
    dataRange: {
      type: Object,
      required: true
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
    dataRange() {
      if (Object.keys(this.dataRange).length > 0) {
        // console.log(6868, this.dataRange)
        this.initChart()
      } else {
        this.initChart()
      }
    }
  },
  mounted() {},
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
      this.setOptions()
    },
    setOptions() {
      const that = this
      const project = localStorage.getItem('project') || 'VAPP'
      // const originDateArr = [0, 1, 2, 3, 4, 5, 6, 7, 14, 30, 31, 40, 50]
      const originDateArr = [1, 2, 3, 4, 5, 6, 7, 14, 30, 31, 40, 50]
      // 左上角图例
      const legendArr = []
      // 横坐标
      const dateArr = originDateArr.map(i => {
        let t = '天'
        if (this.dataGroup === 'W') {
          t = '周'
        } else if (this.dataGroup === 'M') {
          t = '月'
        }
        return '第' + i + t
      })
      // 曲线
      const series = []
      if (Object.keys(this.dataRange).length === 0) {
        console.log(5888)
        series.push({
          // name: 'ALL',
          smooth: true,
          type: 'line',
          data: []
        })
      } else {
        for (const n in this.dataRange) {
          if (Object.prototype.hasOwnProperty.call(this.dataRange, n)) {
            const dataRangeArr = []
            // console.log(n, 666)
            // 增加图例个数
            legendArr.push(n)
            originDateArr.filter(i => {
              const val = this.dataRange[n][0]['avg' + i]
              // console.log(val)
              if (val !== null) {
                dataRangeArr.push(val)
              } else {
                return false
              }
            })
            series.push({
              name: n,
              smooth: true,
              type: 'line',
              data: dataRangeArr
            })
          }
        }
      }
      // console.log(788, series)
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
              rtn += item[i].marker + item[i].seriesName + ': ' + (that.dataType === 'per' ? (item[i].data * 100).toFixed(2) + '%<br/>' : item[i].data + '<br/>')
            }
            return rtn
          }
        },
        legend: {
          type: 'scroll', // 分页类型
          top: '0',
          right: 50,
          icon: 'roundRect',
          itemWidth: 15,
          itemHeight: 8,
          // legendTextColor
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          data: legendArr
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
            data: dateArr,
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
          }
        ],
        series: series
      }, true)
    }
  }
}
</script>
