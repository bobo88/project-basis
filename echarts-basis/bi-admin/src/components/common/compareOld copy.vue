<template>
  <div class="compare-comp clearfix">
    <span class="compare-tit">维度对比：</span>
    <el-select v-model="dataSearch.dimCompare" size="mini" class="dark mr10 w120" placeholder="请选择" @change="changeDimensional">
      <el-option
        v-for="item in dimCompareList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!-- {{comparison}} -->
    <!-- dataLimit: 活跃用户构成时，最多只能选3个 -->
    <!-- <el-select
      v-model="comparison"
      v-loading="loading"
      filterable
      :multiple-limit="dataLimit ? 3 : 0"
      :disabled="!dataSearch.dimCompare"
      multiple
      collapse-tags
      size="mini"
      class="dark mr10 w200"
      placeholder="请选择"
      @change="changeComparison"
    >
      <template v-if="dataSearch.dimCompare !== 'isBackfill'">
        <el-option
          v-for="item in comparisonList"
          :key="item.key"
          :label="item.value"
          :value="item.value"
        />
      </template>
      <template v-else>
        <el-option
          v-for="item in comparisonList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </template>
    </el-select> -->

    <el-button type="primary" size="mini" class="w100" @click="search">查询</el-button>
  </div>
</template>

<script>
import {
  commonConfigBrand,
  commonConfigFristStartupChannel,
  commonConfigFirstStartupMode,
  commonConfigNetType,
  commonConfigTrafficSource
} from '@/api/dashboard'
export default {
  name: 'Compare',
  props: {
    dataCondition: {
      type: Object,
      required: true
    },
    dataSearch: {
      type: Object,
      required: true
    },
    dataLimit: {
      type: Boolean
    },
    dataRemaintype: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      value1: '',
      // dimCompare: '',
      dimCompareList: [
        {
          value: 'channel',
          label: '所有渠道'
        },
        {
          value: 'clientVersionCode',
          label: '所有版本'
        },
        {
          value: 'country',
          label: '所有国家'
        },
        {
          value: 'platform',
          label: '所有平台'
        },
        {
          value: 'remainType',
          label: '所有留存类型'
        },
        {
          value: 'brand',
          label: '所有品牌'
        },
        {
          value: 'firstStartupMode',
          label: '所有启动方式'
        },
        {
          value: 'netType',
          label: '所有网络状态'
        },
        {
          value: 'firstStartupChannel',
          label: '所有启动渠道'
        },
        {
          value: 'trafficSource',
          label: '所有流量类型'
        },
        {
          value: 'isBackfill',
          label: '是否回填'
        }
      ],
      // -------------------------------------
      comparison: '',
      comparisonList: []
      // -------------------------------------
    }
  },
  mounted() {
    // if (this.dataRemaintype === 1) {
    //   this.dimCompareList = [].concat(this.dimCompareList, [{
    //     value: 'remainType',
    //     label: '所有留存类型'
    //   }])
    // }
  },
  methods: {
    search() {
      this.$emit('cbSearch')
    },
    // 清除所有维度对比的值
    clearMultipleData() {
      // 将所有属性中含有 Multiple 的值置空
      for (const i in this.dataSearch) {
        if (i.indexOf('Multiple') > 0) {
          this.dataSearch[i] = ''
        }
      }
    },
    // 更改维度
    // dimCompare: 维度对比框使用，对应选择维度，共有（渠道=channel，版本=clientVersionCode，国家=country，
    // 平台=platform,是否回填=isBackfill，品牌=brand，
    // 留存类型=remainType，启动方式=firstStartupMode，启动渠道=firstStartupChannel，
    // 网络状态=netType，流量来源=trafficSource）
    // dimCompare: '',
    changeDimensional() {
      // 改变维度，将已选的具体维度置空
      this.comparison = []
      this.clearMultipleData()
      const dimCompareVal = this.dataSearch.dimCompare
      if (dimCompareVal === 'channel') {
        this.comparisonList = [{
          key: 'ALL',
          value: 'ALL'
        }].concat(this.dataCondition.channelList)
      } else if (dimCompareVal === 'clientVersionCode') {
        this.comparisonList = [{
          key: 'ALL',
          value: 'ALL'
        }].concat(this.dataCondition.clientVersionCodeList)
      } else if (dimCompareVal === 'country') {
        this.comparisonList = [{
          key: 'ALL',
          value: 'ALL'
        }, {
          key: '非印度',
          value: '非印度'
        }].concat(this.dataCondition.countryList)
      } else if (dimCompareVal === 'platform') {
        this.comparisonList = [{
          key: 'ALL',
          value: 'ALL'
        }].concat(this.dataCondition.platformList)
      } else if (dimCompareVal === 'remainType') {
        this.comparisonList = [].concat(this.dataCondition.remainTypeList)
      } else if (dimCompareVal === 'isBackfill') {
        this.comparisonList = [].concat(this.dataCondition.isBackfillList)
      } else if (dimCompareVal === 'brand') {
        if (this.dataCondition.brandList && this.dataCondition.brandList.length > 0) {
          this.comparisonList = [{
            key: 'ALL',
            value: 'ALL'
          }].concat(this.dataCondition.brandList)
        } else {
          this.getBrandListData()
        }
      } else if (dimCompareVal === 'firstStartupMode') {
        if (this.dataCondition.firstStartupModeList && this.dataCondition.firstStartupModeList.length > 0) {
          this.comparisonList = [{
            key: 'ALL',
            value: 'ALL'
          }].concat(this.dataCondition.firstStartupModeList)
        } else {
          this.getFirstStartupModeListData()
        }
      } else if (dimCompareVal === 'firstStartupChannel') {
        if (this.dataCondition.firstStartupChannelList && this.dataCondition.firstStartupChannelList.length > 0) {
          this.comparisonList = [{
            key: 'ALL',
            value: 'ALL'
          }].concat(this.dataCondition.firstStartupChannelList)
        } else {
          this.getFirstStartupChannelListData()
        }
      } else if (dimCompareVal === 'netType') {
        if (this.dataCondition.netTypeList && this.dataCondition.netTypeList.length > 0) {
          this.comparisonList = [{
            key: 'ALL',
            value: 'ALL'
          }].concat(this.dataCondition.netTypeList)
        } else {
          this.getNetTypeListData()
        }
      } else if (dimCompareVal === 'trafficSource') {
        if (this.dataCondition.trafficSourceList && this.dataCondition.trafficSourceList.length > 0) {
          this.comparisonList = [{
            key: 'ALL',
            value: 'ALL'
          }].concat(this.dataCondition.trafficSourceList)
        } else {
          this.getTrafficSourceListData()
        }
      }
    },
    // 选择具体的维度对比值
    changeComparison() {
      const dimCompareVal = this.dataSearch.dimCompare
      const comparisonStr = this.comparison.join(',')
      // console.log(123, this.comparison, dimCompareVal, dimCompareVal + 'Multiple')
      // 简写模式
      this.dataSearch[dimCompareVal + 'Multiple'] = comparisonStr
      // 非简写模式：判断
      // if (dimCompareVal === 'channel') {
      //   this.dataSearch.channelMultiple = comparisonStr
      // } else if (dimCompareVal === 'clientVersionCode') {
      //   this.dataSearch.clientVersionCodeMultiple = comparisonStr
      // } else if (dimCompareVal === 'country') {
      //   this.dataSearch.countryMultiple = comparisonStr
      // } else if (dimCompareVal === 'platform') {
      //   this.dataSearch.platformMultiple = comparisonStr
      // } else if (dimCompareVal === 'isBackfill') {
      //   this.dataSearch.isBackfillMultiple = comparisonStr
      // } else if (dimCompareVal === 'brand') {
      //   this.dataSearch.brandMultiple = comparisonStr
      // } else if (dimCompareVal === 'firstStartupMode') {
      //   this.dataSearch.firstStartupModeMultiple = comparisonStr
      // } else if (dimCompareVal === 'firstStartupChannel') {
      //   this.dataSearch.firstStartupChannelMultiple = comparisonStr
      // } else if (dimCompareVal === 'netType') {
      //   this.dataSearch.netTypeMultiple = comparisonStr
      // } else if (dimCompareVal === 'trafficSource') {
      //   this.dataSearch.trafficSourceMultiple = comparisonStr
      // }
    },
    // 高级查询
    getBrandListData() {
      commonConfigBrand().then(response => {
        const { data } = response
        console.log('获取 brandList: ', data)
        this.dataCondition.brandList = data
        this.comparisonList = [].concat(this.dataCondition.brandList)
      }).catch(error => {
        console.log(error)
      })
    },
    getFirstStartupChannelListData(startMode) {
      const options = {
        startMode: startMode || 'ALL'
      }
      commonConfigFristStartupChannel(options).then(response => {
        const { data } = response
        console.log('获取 firstStartupChannelList: ', data)
        this.dataCondition.firstStartupChannelList = data
        this.comparisonList = [].concat(this.dataCondition.firstStartupChannelList)
      }).catch(error => {
        console.log(error)
      })
    },
    getFirstStartupModeListData() {
      commonConfigFirstStartupMode().then(response => {
        const { data } = response
        console.log('获取 firstStartupModeList: ', data)
        this.dataCondition.firstStartupModeList = data
        this.comparisonList = [].concat(this.dataCondition.firstStartupModeList)
      }).catch(error => {
        console.log(error)
      })
    },
    getNetTypeListData() {
      commonConfigNetType().then(response => {
        const { data } = response
        console.log('获取 netTypeList: ', data)
        this.dataCondition.netTypeList = data
        this.comparisonList = [].concat(this.dataCondition.netTypeList)
      }).catch(error => {
        console.log(error)
      })
    },
    getTrafficSourceListData() {
      commonConfigTrafficSource().then(response => {
        const { data } = response
        console.log('获取 trafficSourceList: ', data)
        this.dataCondition.trafficSourceList = data
        this.comparisonList = [].concat(this.dataCondition.trafficSourceList)
      }).catch(error => {
        console.log(error)
      })
    }
    // x
  }
}
</script>

<style lang="scss" scoped>
  .compare-comp {
    padding: 20px 0;
    color: #fff;
    .compare-tit {
      font-size: 16px;
      font-weight: bold;
      color: #FFFFFF;
    }
    .oprate-tit {
      height: 30px;
      line-height: 30px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      font-weight: bold;
      vertical-align: top;
      i {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        vertical-align: top;
      }
    }
  }
</style>
