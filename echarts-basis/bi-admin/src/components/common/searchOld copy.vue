<template>
  <div class="search-comp mb30 clearfix">
    <el-date-picker
      v-model="value1"
      class="dark mr10 mb10"
      type="daterange"
      size="mini"
      style="width:230px;"
      range-separator="至"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
    />
    <el-select v-model="dataSearch.channel" filterable size="mini" class="dark mr10 mb10 w150" placeholder="请选择渠道">
      <el-option
        key="ALL"
        label="ALL"
        value="ALL"
      />
      <el-option
        v-for="item in dataCondition.channelList"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>

    <el-select v-model="dataSearch.clientVersionCode" filterable size="mini" class="dark mr10 mb10 w120" placeholder="请选择版本">
      <el-option
        key="ALL"
        label="ALL"
        value="ALL"
      />
      <el-option
        v-for="item in dataCondition.clientVersionCodeList"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>

    <el-select v-model="dataSearch.country" filterable size="mini" class="dark mr10 mb10 w120" placeholder="请选择国家">
      <el-option
        key="ALL"
        label="ALL"
        value="ALL"
      />
      <el-option
        key="notIndia"
        label="非印度"
        value="非印度"
      />
      <el-option
        v-for="item in dataCondition.countryList"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>

    <el-select v-model="dataSearch.platform" filterable size="mini" class="dark mr10 mb10 w120" placeholder="请选择平台">
      <el-option
        key="ALL"
        label="ALL"
        value="ALL"
      />
      <el-option
        v-for="item in dataCondition.platformList"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
    <el-select v-if="dataRemaintype === 1" v-model="dataSearch.remainType" filterable size="mini" class="dark mr10 mb10 w120" placeholder="总留存">
      <el-option
        v-for="item in dataCondition.remainTypeList"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>

    <el-select v-model="dataSearch.isBackfill" filterable size="mini" class="dark mr10 mb10 w120" placeholder="请选择">
      <!-- 回填前用0,回填后用1 -->
      <el-option
        v-for="item in dataCondition.isBackfillList"
        :key="item.key"
        :label="item.value"
        :value="item.key"
      />
    </el-select>
    <el-button type="primary" size="mini" plain @click="advancedSearch">高级筛选</el-button>
    <el-button type="primary" size="mini" class="w100" @click="search">查询</el-button>

    <el-dialog
      title="高级筛选"
      class="search-dialog"
      center
      :modal="false"
      :visible.sync="dialogVisible"
      width="520px"
      :before-close="handleClose"
    >
      <div class="search-dialog-cont">
        <div class="tc mb20">
          <el-select v-model="brand" v-loading="dialogLoading1" :disabled="dataAuth && !dataAuth.includes('brand')" filterable element-loading-background="rgba(255, 255, 255, 0.5) !important" size="mini" class="w150 mr40" placeholder="请选择品牌">
            <el-option
              key="ALL"
              label="ALL"
              value="ALL"
            />
            <el-option
              v-for="item in dataCondition.brandList"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="firstStartupMode"
            v-loading="dialogLoading2"
            :disabled="dataAuth && !dataAuth.includes('firstStartupMode')"
            filterable
            element-loading-background="rgba(255, 255, 255, 0.5) !important"
            size="mini"
            class="w150"
            placeholder="请选择启动方式"
            @change="changeFirstStartupMode"
          >
            <el-option
              key="ALL"
              label="ALL"
              value="ALL"
            />
            <el-option
              v-for="item in dataCondition.firstStartupModeList"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="tc mb20">
          <!-- <el-select v-model="dataSearch.value" size="mini" class="w150 " placeholder="请选择型号">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          <el-select v-model="netType" v-loading="dialogLoading3" :disabled="dataAuth && !dataAuth.includes('netType')" filterable element-loading-background="rgba(255, 255, 255, 0.5) !important" size="mini" class="w150 mr40" placeholder="请选择网络状态">
            <el-option
              key="ALL"
              label="ALL"
              value="ALL"
            />
            <el-option
              v-for="item in dataCondition.netTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="firstStartupChannel" v-loading="dialogLoading4" :disabled="dataAuth && !dataAuth.includes('firstStartupChannel')" filterable element-loading-background="rgba(255, 255, 255, 0.5) !important" size="mini" class="w150" placeholder="请选择启动渠道">
            <el-option
              key="ALL"
              label="ALL"
              value="ALL"
            />
            <el-option
              v-for="item in dataCondition.firstStartupChannelList"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="tc mb20">
          <el-select
            v-model="trafficSource"
            v-loading="dialogLoading5"
            :disabled="dataAuth && !dataAuth.includes('trafficSource')"
            filterable
            element-loading-background="rgba(255, 255, 255, 0.5) !important"
            size="mini"
            class="w150 mr40"
            placeholder="请选择流量类型"
          >
            <el-option
              key="ALL"
              label="ALL"
              value="ALL"
            />
            <el-option
              v-for="item in dataCondition.trafficSourceList"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
          <!-- 系统版本 -->
          <el-select
            v-model="osVersion"
            v-loading="dialogLoading6"
            :disabled="dataAuth && !dataAuth.includes('osVersion')"
            filterable
            element-loading-background="rgba(255, 255, 255, 0.5) !important"
            size="mini"
            class="w150"
            placeholder="请选择系统版本"
          >
            <el-option
              key="ALL"
              label="ALL"
              value="ALL"
            />
            <el-option
              v-for="item in dataCondition.osVersionList"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" class="w100 btn-item mr20" type="primary" @click="submitSearch">查询</el-button>
        <el-button size="mini" class="w100 btn-item mr20" type="primary" plain @click="resetSearch">重置</el-button>
        <el-button size="mini" class="w100 btn-item" type="primary" plain @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  commonConfigBrand,
  commonConfigFristStartupChannel,
  commonConfigFirstStartupMode,
  commonConfigNetType,
  commonConfigTrafficSource,
  commonConfigOsVersion
} from '@/api/dashboard'
export default {
  name: 'Search',
  props: {
    dataCondition: {
      type: Object,
      required: true
    },
    dataSearch: {
      type: Object,
      required: true
    },
    dataAuth: {
      type: Array,
      required: true
    },
    dataRemaintype: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近60天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近90天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近120天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 120)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近180天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dialogLoading1: false,
      dialogLoading2: false,
      dialogLoading3: false,
      dialogLoading4: false,
      dialogLoading5: false,
      dialogLoading6: false,
      dialogVisible: false,
      value1: [],
      dtFrom: '',
      dtTo: '',
      brand: '',
      firstStartupMode: '',
      netType: '',
      firstStartupChannel: '',
      trafficSource: '',
      osVersion: ''
    }
  },
  watch: {
    value1() {
      if (this.value1 && this.value1.length === 2) {
        this.dataSearch.dtFrom = this.value1[0]
        this.dataSearch.dtTo = this.value1[1]
      }
    }
  },
  mounted() {
    this.initDate()
  },
  methods: {
    search() {
      this.$emit('cbSearch')
    },
    initDate() {
      this.dataSearch.dtFrom = this.$filters.dateFormatYyyyMmDd(new Date(new Date().getTime() - 3600 * 1000 * 24 * 15))
      this.dataSearch.dtTo = this.$filters.dateFormatYyyyMmDd(new Date())
      this.value1 = [this.dataSearch.dtFrom, this.dataSearch.dtTo]
    },
    submitSearch() {
      this.dialogVisible = false
      this.dataSearch.brand = this.brand
      this.dataSearch.firstStartupMode = this.firstStartupMode
      this.dataSearch.netType = this.netType
      this.dataSearch.firstStartupChannel = this.firstStartupChannel
      this.dataSearch.trafficSource = this.trafficSource
      this.dataSearch.osVersion = this.osVersion
      this.$nextTick(() => {
        // 触发搜索事件
        this.search()
      })
    },
    resetSearch() {
      this.brand = ''
      this.firstStartupMode = ''
      this.netType = ''
      this.firstStartupChannel = ''
      this.trafficSource = ''
      this.osVersion = ''
    },
    // 高级查询
    advancedSearch() {
      this.dialogVisible = true
      if (this.dataCondition.brandList && this.dataCondition.brandList.length === 0) {
        this.dialogLoading1 = true
        this.getBrandListData()
      }
      if (this.dataCondition.firstStartupModeList && this.dataCondition.firstStartupModeList.length === 0) {
        this.dialogLoading2 = true
        this.getFirstStartupModeListData()
      }
      if (this.dataCondition.netTypeList && this.dataCondition.netTypeList.length === 0) {
        this.dialogLoading3 = true
        this.getNetTypeListData()
      }
      if (this.dataCondition.firstStartupChannelList && this.dataCondition.firstStartupChannelList.length === 0) {
        this.dialogLoading4 = true
        this.getFirstStartupChannelListData()
      }
      if (this.dataCondition.trafficSourceList && this.dataCondition.trafficSourceList.length === 0) {
        this.dialogLoading5 = true
        this.getTrafficSourceListData()
      }
      if (this.dataCondition.osVersionList && this.dataCondition.osVersionList.length === 0) {
        this.dialogLoading6 = true
        this.getOsVersionListData()
      }
    },
    // 高级查询
    getBrandListData() {
      commonConfigBrand().then(response => {
        const { data } = response
        console.log('获取 brandList: ', data)
        this.dataCondition.brandList = data
        this.dialogLoading1 = false
      }).catch(error => {
        this.dialogLoading1 = false
        console.log(error)
      })
    },
    // 改变 启动方式，联动请求 启动渠道 接口
    changeFirstStartupMode() {
      this.getFirstStartupChannelListData(this.firstStartupMode)
    },
    getFirstStartupChannelListData(startMode) {
      const options = {
        startMode: startMode || 'ALL'
      }
      commonConfigFristStartupChannel(options).then(response => {
        const { data } = response
        console.log('获取 firstStartupChannelList: ', data)
        this.dataCondition.firstStartupChannelList = data
        this.dialogLoading4 = false
      }).catch(error => {
        this.dialogLoading4 = false
        console.log(error)
      })
    },
    getFirstStartupModeListData() {
      commonConfigFirstStartupMode().then(response => {
        const { data } = response
        console.log('获取 firstStartupModeList: ', data)
        this.dataCondition.firstStartupModeList = data
        this.dialogLoading2 = false
      }).catch(error => {
        this.dialogLoading2 = false
        console.log(error)
      })
    },
    getNetTypeListData() {
      commonConfigNetType().then(response => {
        const { data } = response
        console.log('获取 netTypeList: ', data)
        this.dataCondition.netTypeList = data
        this.dialogLoading3 = false
      }).catch(error => {
        this.dialogLoading3 = false
        console.log(error)
      })
    },
    getTrafficSourceListData() {
      commonConfigTrafficSource().then(response => {
        const { data } = response
        console.log('获取 trafficSourceList: ', data)
        this.dataCondition.trafficSourceList = data
        this.dialogLoading5 = false
      }).catch(error => {
        this.dialogLoading5 = false
        console.log(error)
      })
    },
    getOsVersionListData() {
      commonConfigOsVersion().then(response => {
        const { data } = response
        console.log('获取 osVersionList: ', data)
        this.dataCondition.osVersionList = data
        this.dialogLoading6 = false
      }).catch(error => {
        this.dialogLoading6 = false
        console.log(error)
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-comp {
    padding-right: 120px;
    padding-bottom: 20px;
    color: #fff;
    border-bottom: 1px dashed rgba(151, 151, 151, 1);
    .btn-item {
      margin-left: 0 !important;
    }
  }
</style>
