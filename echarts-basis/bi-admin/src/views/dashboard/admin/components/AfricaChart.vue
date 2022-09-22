<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import { getUserByCountry } from '@/api/dashboard'

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
      default: '370px'
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
      chart: null,
      userCountryData: []
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
      this.getUserByCountryData()
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
    // 获取 用户按国家分布 数据
    getUserByCountryData() {
      getUserByCountry().then(response => {
        const { data } = response
        // console.log('获取 用户按国家分布 数据getUserByCountry:', data)
        if (data && data.length > 0) {
          this.userCountryData = data.map((i, index) => {
            if (i.countryEnName === 'Tanzania') {
              this.$set(i, 'name', 'United Republic of Tanzania')
            } else if (i.countryEnName === 'Republic of the Congo') {
              this.$set(i, 'name', 'Republic of Congo')
            } else if (i.countryEnName === 'Congo') {
              this.$set(i, 'name', 'Democratic Republic of the Congo')
            } else if (i.countryEnName === 'Sint Maarten') {
              this.$set(i, 'name', 'Somaliland')
            } else {
              this.$set(i, 'name', i.countryEnName)
            }
            // this.$set(i, 'hc-a2', i.country)
            if (index < 10) {
              const opacity = 1 - index * 0.09
              this.$set(i, 'itemStyle', { areaColor: `rgba(15, 96, 255, ${opacity})` })
            }
            return i
          })
          this.$emit('cb', this.userCountryData)
          // console.log('changeName', this.userCountryData)
        }
        this.initChart()
      }).catch(error => {
        console.log(error)
      })
    },
    initChart() {
      // AfricaData
      // this.$echarts.registerMap('Africa', AfricaData);
      this.chart = this.$echarts.init(this.$el)
      // console.log(11111, this.chart)
      // this.setOptions(this.chartData)
      this.setOptions({})
    },
    setOptions({ expectedData, actualData } = {}) {
      const that = this
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
            if (item.data && item.data.countryCode) {
              return item.data.countryCnName + '<br/>用户数：' + that.$filters.numberFormat(item.data.user) + '<br/>占比：' + ((item.data.percent * 100).toFixed(2) + '%')
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
              areaColor: 'rgba(32, 107, 255, 0.1)' // 地图区域的背景颜色
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
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          mapType: 'africa',
          data: this.userCountryData
        }]
      })
    }
  }
}
</script>
