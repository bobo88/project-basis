<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'
import { getVvRange } from '@/api/dashboard'

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
      default: '250px'
    }
  },
  data() {
    return {
      chart: null,
      vvRangeData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getVvRangeData()
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
    // 获取 最近7天vv分布 数据
    getVvRangeData() {
      getVvRange().then(response => {
        const { data } = response
        // console.log('获取 最近7天vv分布 数据 getVvRange: ', data)
        if (data && data.length > 0) {
          this.vvRangeData = data.map(i => {
            i.name = i.range
            i.value = (i.val).toFixed(4)
            return i
          })
        }
        this.initChart()
      }).catch(error => {
        console.log(error)
      })
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el, 'chalk')

      this.chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 6, 45, 0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.7)',
          formatter: '{a} <br/>{b} : {d}%'
          // formatter: function(params, ticket, callback) {
          //   console.log(123, params)
          // }
        },
        legend: {
          // legendTextColor
          textStyle: {
            color: this.$chalk.legendTextColor
          },
          left: 'center',
          // right: 'auto',
          // align: 'center',
          bottom: '20',
          itemWidth: 15,
          itemHeight: 8,
          data: ['1vv', '2vv', '[3,5)vv', '[5,20)vv', '[20,50)vv', '50+vv']
        },
        series: [
          {
            name: '',
            type: 'pie',
            // roseType: 'radius',
            radius: [15, 85],
            center: ['50%', '38%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#030E3E',
              borderWidth: 1
            },
            // 饼图图形上的文本标签
            label: {
              normal: {
                show: true,
                // 标签的位置
                position: 'inner',
                textStyle: {
                  fontWeight: 300,
                  // 文字的字体大小
                  fontSize: 12
                },
                formatter: '{d}%'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.vvRangeData,
            // data: [
            //   { value: 320, name: '1VV' },
            //   { value: 240, name: '2VV' },
            //   { value: 149, name: '3VV' },
            //   { value: 100, name: '4VV' },
            //   { value: 59, name: '5VV' }
            // ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
