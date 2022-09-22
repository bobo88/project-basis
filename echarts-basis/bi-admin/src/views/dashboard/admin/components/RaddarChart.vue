<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import { getUserByVersionYesterday } from '@/api/dashboard'

const animationDuration = 3000

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
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      maxActiveUser: 0,
      maxNewUser: 0,
      versionList: [],
      versionActiveUser: [],
      versionNewUser: [],
      currentData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserByVersionYesterdayData()
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
    // 获取 昨日用户版本分布 数据
    getUserByVersionYesterdayData() {
      getUserByVersionYesterday().then(response => {
        const { data } = response
        // console.log('获取 昨日用户版本分布 数据getUserByVersionYesterday: ', data)
        // 活跃用户
        this.versionActiveUser = data.activeUser.map(i => {
          return i.val
        }) || []
        this.maxActiveUser = Math.max(...this.versionActiveUser)
        // 新增用户
        this.versionNewUser = data.newUser.map(i => {
          return i.val
        }) || []
        this.maxNewUser = Math.max(...this.versionNewUser)
        // 所有版本
        this.versionList = data.activeUser.map((i, index) => {
          // { name: '3.4.0', max: 20000, axisLabel: { show: true, color: 'rgba(255, 255, 255, 0.7)' }, color: 'rgba(255, 255, 255, 0.7)' },
          //   { name: '3.5.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
          //   { name: '3.6.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
          //   { name: '3.6.8', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
          //   { name: '3.7.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' },
          //   { name: '3.8.0', max: 20000, color: 'rgba(255, 255, 255, 0.7)' }
          if (index === 0) {
            this.$set(i, 'axisLabel', {
              show: true,
              align: 'left',
              margin: -2,
              color: 'rgba(255, 255, 255, 0.7)',
              formatter: function(value, index) {
                if (index % 2 === 0) {
                  return parseInt(value)
                }
                return ''
              }
            })
          }
          i.name = i.version
          i.max = this.chartData.key === 'active' ? this.maxActiveUser : this.maxNewUser
          i.color = 'rgba(255, 255, 255, 0.7)'
          return i
        })
        // 如果是活跃用户图表
        if (this.chartData.key === 'active') {
          this.currentData = [].concat(this.versionActiveUser)
        } else {
          this.currentData = [].concat(this.versionNewUser)
        }
        // console.log(588, this.currentData)
        // 渲染图表
        this.initChart(this.currentData)
      }).catch(error => {
        console.log(error)
      })
    },
    initChart(listData) {
      this.chart = this.$echarts.init(this.$el, 'chalk')
      const that = this

      this.chart.setOption({
        color: this.chartData.color,
        backgroundColor: 'transparent',
        tooltip: {
          backgroundColor: 'rgba(0, 6, 45, 0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.7)',
          // 是否将 tooltip 框限制在图表的区域内
          confine: true,
          // {b} - {c}
          formatter: function(item) {
            console.log(588, item)
            let rtn = ''
            rtn += item.name + '<br/>'
            if (item.value && item.value.length > 0) {
              for (let i = 0; i < item.value.length; i++) {
                rtn += item.marker + '<span style="color:#bbb;font-weight:bold;">' + that.versionList[i].name + '</span>: ' + that.$filters.numberFormat(item.value[i]) + '<br/>'
              }
            }
            return rtn
          }
          // // formatter: '{b} :<br/> {c}<br/> {a}'
          // formatter: function(item) {
          //   console.log(588, item.seriesType + '-' + item.seriesName + '-' + item.name + '-' + item.value)
          //   return item.seriesType + '-' + item.seriesName + '-' + item.name + '-' + item.value
          // }
          // trigger: 'axis',
          // axisPointer: { // 坐标轴指示器，坐标轴触发有效
          //   type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          // }
        },
        radar: {
          // axisTick: {
          //   show: true,
          //   length: 10
          // },
          // axisLabel: {
          //   show: true
          // },
          radius: '52%',
          center: ['50%', '50%'],
          splitNumber: 6,
          // name: {
          //   textStyle: {
          //     color: '#fff',
          //     backgroundColor: '#999',
          //     borderRadius: 3,
          //     padding: [3, 5]
          //   }
          // },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          splitArea: {
            areaStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: this.versionList
        },
        legend: {
          // legendTextColor
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          left: 'center',
          bottom: '5',
          itemWidth: 15,
          itemHeight: 8,
          data: [this.chartData.title]
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            color: this.chartData.shadowColor
          },
          data: [
            {
              value: listData,
              name: this.chartData.title
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
