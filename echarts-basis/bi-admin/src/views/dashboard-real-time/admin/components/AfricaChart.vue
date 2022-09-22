<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
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
    autoResize: {
      type: Boolean,
      default: true
    }
    // chartData: {
    //   type: Object,
    //   required: true
    // }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
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
      // AfricaData
      // this.$echarts.registerMap('Africa', AfricaData);
      this.chart = this.$echarts.init(this.$el)
      // console.log(11111, this.chart)
      // this.setOptions(this.chartData)
      this.setOptions({})
    },
    setOptions({ expectedData, actualData } = {}) {
      // 地图设置： https://echarts.apache.org/zh/option.html#series-map.type
      this.chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 6, 45, 0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.7)',
          // (params: Object|Array, ticket: string, callback: (ticket: string, html: string)) => string
          formatter: function(item) {
            if (item.data && item.data.name) {
              return item.data.name + '<br/>用户数：' + item.data.value.t + '<br/>占比：' + item.data.value.t
            }
          }
        },
        series: [{
          name: 'africa',
          itemStyle: {
            // areaColor: '#f00', // 背景颜色
            normal: { // 未选中状态
              borderWidth: 1, // 边框大小
              borderColor: '#0BDBDD',
              areaColor: '#1e45a3' // 地图区域的背景颜色
              // label: {
              //   show: true//显示名称
              // }
            },
            emphasis: { // 也是选中样式
              borderWidth: 2,
              borderColor: '#08FCC0',
              areaColor: '#08FCC0',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              }
            }
          },
          type: 'map',
          mapType: 'africa',
          data: [
            {
              name: 'Nigeria',
              value: {
                t: 1212,
                n: 30
              },
              label: {
                show: false
                // backgroundColor: '#f00'
              }
            }
          ]
          // animationDuration: 2800,
          // animationEasing: 'cubicInOut'
        }]
      })
    }
  }
}
</script>
