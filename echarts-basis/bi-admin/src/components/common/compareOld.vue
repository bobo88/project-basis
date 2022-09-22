<template>
  <div class="compare-comp clearfix">
    <span class="compare-tit">维度对比：</span>
    <el-select v-model="dataSearch.dimCompare" size="mini" class="dark mr10 w120" placeholder="请选择">
      <el-option
        v-for="item in dimCompareList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
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
          label: '渠道'
        },
        {
          value: 'clientVersionCode',
          label: '版本'
        },
        {
          value: 'country',
          label: '国家'
        },
        {
          value: 'platform',
          label: '平台'
        },
        {
          value: 'remainType',
          label: '留存类型'
        },
        {
          value: 'brand',
          label: '品牌'
        },
        {
          value: 'firstStartupMode',
          label: '启动方式'
        },
        {
          value: 'netType',
          label: '网络状态'
        },
        {
          value: 'firstStartupChannel',
          label: '启动渠道'
        },
        {
          value: 'trafficSource',
          label: '流量类型'
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
    // xx
  },
  methods: {
    search() {
      if (!this.dataSearch.dimCompare) {
        this.$message.error('请先选择一个对比维度类型')
        return false
      }
      console.log(this.dataSearch, 588)
      this.$emit('cbSearch', {
        isGroup: true
      })
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
