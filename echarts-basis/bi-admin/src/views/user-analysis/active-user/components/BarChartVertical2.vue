<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import { getVideoProduct } from '@/api/dashboard'

const animationDuration = 6000

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
    }
  },
  data() {
    return {
      chart: null,
      crawlData: [],
      duetData: [],
      mvData: [],
      normalData: [],
      datetimeArr: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getVideoProductData()
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
    // 获取 视频生产数据 数据
    getVideoProductData() {
      getVideoProduct().then(response => {
        const { data } = response
        // console.log('获取 视频生产数据 数据 getVideoProduct: ', data)
        this.crawlData = data.crawl || []
        this.duetData = data.duet || []
        this.mvData = data.mv || []
        this.normalData = data.normal || []
        this.datetimeArr = data.normal.map(i => {
          return this.$filters.dateFormatMmDd(i.dt)
        }) || []
        console.log(this.datetimeArr)
        this.initChart()
      }).catch(error => {
        console.log(error)
      })
    },
    initChart() {
      const that = this
      this.chart = this.$echarts.init(this.$el, 'chalk')

      this.chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 6, 45, 0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.7)',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(item) {
            // console.log(item, 123456)
            let rtn = ''
            if (item && item.length > 0) {
              let tTotal = 0
              for (let i = 0; i < item.length; i++) {
                i === 0 ? rtn += item[i].name + '<br/>' : ''
                rtn += item[i].marker + item[i].seriesName + ': ' + that.$filters.numberFormat(item[i].value[1]) + '<br/>'
                tTotal += that.$filters.numberFormat(item[i].value[1]) ? parseInt(item[i].value[1]) : 0
              }
              rtn += '<i style="margin-right: 5px; display:inline-block; width:10px; height:10px; border-radius:50%; background:#fff;"></i>' + 'Total: ' + that.$filters.numberFormat(tTotal)
            }
            return rtn
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
          data: ['MV', 'Duet', 'Normal', 'Crawl']
        },
        grid: {
          top: 30,
          left: '2%',
          right: '2%',
          bottom: 10,
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
        }],
        series: [{
          name: 'MV',
          type: 'bar',
          barWidth: 15,
          stack: 'vistors',
          data: this.mvData.map(i => {
            return [that.$filters.dateFormatMmDd(i.dt), i.val]
          }),
          animationDuration
        }, {
          name: 'Duet',
          type: 'bar',
          barWidth: 15,
          stack: 'vistors',
          data: this.duetData.map(i => {
            return [that.$filters.dateFormatMmDd(i.dt), i.val]
          }),
          animationDuration
        }, {
          name: 'Normal',
          type: 'bar',
          barWidth: 15,
          stack: 'vistors',
          data: this.normalData.map(i => {
            return [that.$filters.dateFormatMmDd(i.dt), i.val]
          }),
          animationDuration
        }, {
          name: 'Crawl',
          type: 'bar',
          barWidth: 15,
          stack: 'vistors',
          data: this.crawlData.map(i => {
            return [that.$filters.dateFormatMmDd(i.dt), i.val]
          }),
          animationDuration
        }]
      })
    }
  }
}
</script>
