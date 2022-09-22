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
    <el-select
      v-model="dataSearch.channel"
      filterable
      multiple
      collapse-tags
      size="mini"
      class="dark mr10 mb10 w200"
      placeholder="请选择渠道"
    >
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

    <el-popover
      v-model="popoverVisible"
      placement="bottom"
      title=""
      width="650"
      trigger="focus"
    >
      <el-input
        slot="reference"
        v-model="clientVersionCodeInput"
        clearable
        size="mini"
        class="dark like-select mr10 mb10 w150"
        placeholder="请选择版本"
        suffix-icon="el-icon-arrow-down"
      />
      <div class="popover-cont">
        <el-row class="mb50">
          <el-col :span="6">
            <div class="grid-content bg-purple" style="border-right:1px solid #e9e9e9;">
              <el-radio v-model="radioVersionType" label="1" class="mb20">所有版本</el-radio>
              <div v-if="dataCondition.clientVersionCodeList && dataCondition.clientVersionCodeList.length > 0" style="padding-left:30px; height: 350px; overflow: auto;">
                <el-checkbox v-model="checkAll" :disabled="radioVersionType === '2'" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;" />
                <el-checkbox-group v-model="checkedVersions" :disabled="radioVersionType === '2'" class="bo-checkbox" @change="handleCheckedVersionsChange">
                  <el-checkbox v-for="item in dataCondition.clientVersionCodeList" :key="item.value" style="display:block;height:30px;line-height:30px;" :label="item.value">
                    {{ item.value }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple-light">
              <el-radio v-model="radioVersionType" label="2" class="mb20 pl20">按版本号检索</el-radio>
              <div style="padding-left:50px;">
                <div class="mb20">
                  <el-input v-model.number="codePart1" :disabled="radioVersionType === '1'" size="mini" class="w40 small-padding" /> .
                  <el-input v-model.number="codePart2" :disabled="radioVersionType === '1'" size="mini" class="w40 small-padding" /> .
                  <el-input v-model.number="codePart3" :disabled="radioVersionType === '1'" size="mini" class="w40 small-padding" />
                  <span class="inline-block ml10 mr10">-</span>
                  <el-input v-model.number="codePart4" :disabled="radioVersionType === '1'" size="mini" class="w40 small-padding" /> .
                  <el-input v-model.number="codePart5" :disabled="radioVersionType === '1'" size="mini" class="w40 small-padding" /> .
                  <el-input v-model.number="codePart6" :disabled="radioVersionType === '1'" size="mini" class="w40 small-padding" />
                </div>
                <div v-loading="intervalLoading" class="bo-loading-white" style="max-height: 300px; overflow: auto;">
                  <p class="mb10">区间内筛选：</p>
                  <el-checkbox-group v-if="clientVersionCodeIntervalList && clientVersionCodeIntervalList.length > 0" v-model="checkedVersions2" :disabled="radioVersionType === '1'" class="bo-checkbox">
                    <el-checkbox v-for="item in clientVersionCodeIntervalList" :key="item.value" :label="item.value" class="inline-block w80" style="height:30px;line-height:30px;">
                      {{ item.value }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <p v-else class="mt20">
                    <span v-if="isEmpty">暂无数据</span>
                  </p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="tc">
          <el-button type="primary" size="mini" class="w120" @click="selectClientVersionOK">OK</el-button>
        </div>
      </div>
    </el-popover>

    <el-select
      v-model="dataSearch.country"
      filterable
      multiple
      collapse-tags
      size="mini"
      class="dark mr10 mb10 w150"
      placeholder="请选择国家"
    >
      <el-option
        key="ALL"
        label="ALL"
        value="ALL"
      />
      <!-- <el-option
        key="notIndia"
        label="非印度"
        value="非印度"
      /> -->
      <el-option
        v-for="item in dataCondition.countryList"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>

    <el-select
      v-if="currentProject !== 'VS_App'"
      v-model="dataSearch.platform"
      filterable
      multiple
      collapse-tags
      size="mini"
      class="dark mr10 mb10 w200"
      placeholder="请选择平台"
    >
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
    <el-select
      v-if="dataRemaintype === 1"
      v-model="dataSearch.remainType"
      filterable
      multiple
      collapse-tags
      size="mini"
      class="dark mr10 mb10 w150"
      placeholder="请选择留存类型"
    >
      <el-option
        v-for="item in dataCondition.remainTypeList"
        :key="item.key"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
    <el-select v-if="currentProject !== 'VS_App'" v-model="dataSearch.isBackfill" filterable size="mini" class="dark mr10 mb10 w150" placeholder="请选择">
      <!-- 回填前用0,回填后用1 -->
      <el-option
        v-for="item in dataCondition.isBackfillList"
        :key="item.key"
        :label="item.value"
        :value="item.key"
      />
    </el-select>
    <el-button type="primary" size="mini" plain class="mr30" @click="advancedSearch">高级筛选</el-button>

    <el-button type="primary" size="mini" class="w100 mr10" @click="search"><span v-if="!dataHide">合并</span>展示</el-button>
    <span v-if="!dataHide">
      <span class="inline-block mr10 gray-txt">或按</span>
      <el-select v-model="dataSearch.dimCompare" filterable size="mini" class="dark mr10 mb10 w120" placeholder="请选择">
        <el-option
          v-for="item in groupList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" size="mini" class="w100" plain @click="searchByGroup">分布展示</el-button>
    </span>

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
          <el-select
            v-model="brand"
            v-loading="dialogLoading1"
            :disabled="dataAuth && !dataAuth.includes('brand')"
            filterable
            multiple
            collapse-tags
            element-loading-background="rgba(255, 255, 255, 0.5) !important"
            size="mini"
            class="w150 mr40"
            placeholder="请选择品牌"
          >
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
            multiple
            collapse-tags
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
          <el-select
            v-model="netType"
            v-loading="dialogLoading3"
            :disabled="dataAuth && !dataAuth.includes('netType')"
            filterable
            multiple
            collapse-tags
            element-loading-background="rgba(255, 255, 255, 0.5) !important"
            size="mini"
            class="w150 mr40"
            placeholder="请选择网络状态"
          >
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
          <el-select
            v-model="firstStartupChannel"
            v-loading="dialogLoading4"
            :disabled="dataAuth && !dataAuth.includes('firstStartupChannel')"
            filterable
            multiple
            collapse-tags
            element-loading-background="rgba(255, 255, 255, 0.5) !important"
            size="mini"
            class="w150"
            placeholder="请选择启动渠道"
          >
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
            multiple
            collapse-tags
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
            multiple
            collapse-tags
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
        <el-button size="mini" class="w100 btn-item mr20" type="primary" @click="submitSearch">确定</el-button>
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
  commonConfigOsVersion,
  commonConfigVersion
} from '@/api/dashboard'
export default {
  name: 'Search',
  props: {
    dataCondition: {
      type: Object,
      required: true
    },
    dataHide: {
      type: Boolean,
      default: false
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
      currentProject: '',
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
      popoverVisible: false,
      radioVersionType: '1',
      codePart1: '',
      codePart2: '',
      codePart3: '',
      codePart4: '',
      codePart5: '',
      codePart6: '',
      checkAll: false,
      checkedVersions: [],
      isIndeterminate: true,
      intervalLoading: false,
      isEmpty: false,
      checkedVersions2: [],
      clientVersionCodeInput: '',
      // 区间内的版本号列表
      clientVersionCodeIntervalList: [],
      groupList: [
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
        // {
        //   value: 'remainType',
        //   label: '留存类型'
        // },
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
          value: 'osVersion',
          label: '系统版本'
        }
      ],
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
  computed: {
    finishEnterCodeVersion() {
      if (this.codePart1 === '' || this.codePart2 === '' || this.codePart3 === '' || this.codePart4 === '' || this.codePart5 === '' || this.codePart6 === '') {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    value1() {
      if (this.value1 && this.value1.length === 2) {
        this.dataSearch.dtFrom = this.value1[0]
        this.dataSearch.dtTo = this.value1[1]
      }
    },
    codePart1() {
      if (this.finishEnterCodeVersion) {
        this.getIntervalCodeVersionList()
      }
    },
    codePart2() {
      if (this.finishEnterCodeVersion) {
        this.getIntervalCodeVersionList()
      }
    },
    codePart3() {
      if (this.finishEnterCodeVersion) {
        this.getIntervalCodeVersionList()
      }
    },
    codePart4() {
      if (this.finishEnterCodeVersion) {
        this.getIntervalCodeVersionList()
      }
    },
    codePart5() {
      if (this.finishEnterCodeVersion) {
        this.getIntervalCodeVersionList()
      }
    },
    codePart6() {
      if (this.finishEnterCodeVersion) {
        this.getIntervalCodeVersionList()
      }
    }
  },
  mounted() {
    this.currentProject = localStorage.getItem('project') || 'VAPP'
    this.initDate()
  },
  methods: {
    selectClientVersionOK() {
      if (this.radioVersionType === '1' && this.checkedVersions && this.checkedVersions.length > 0) {
        this.clientVersionCodeInput = [...this.checkedVersions].join(',')
        this.dataSearch.clientVersionCode = [...this.checkedVersions]
      } else if (this.radioVersionType === '2' && this.checkedVersions2 && this.checkedVersions2.length > 0) {
        this.clientVersionCodeInput = [...this.checkedVersions2].join(',')
        this.dataSearch.clientVersionCode = [...this.checkedVersions2]
      }
      this.popoverVisible = false
    },
    getIntervalCodeVersionList() {
      const versionRangeStr = `${this.codePart1}.${this.codePart2}.${this.codePart3}-${this.codePart4}.${this.codePart5}.${this.codePart6}`
      this.intervalLoading = true
      commonConfigVersion({ versionRange: versionRangeStr }).then(response => {
        const { data } = response
        console.log('获取 commonConfigVersion: ', data)
        this.clientVersionCodeIntervalList = data
        this.checkedVersions2 = data.map(i => i.value)
        this.intervalLoading = false
        if (data && data.length > 0) {
          this.isEmpty = false
        } else {
          this.isEmpty = true
        }
      }).catch(error => {
        this.intervalLoading = false
        console.log(error)
      })
    },
    handleCheckAllChange(val) {
      this.checkedVersions = val ? this.dataCondition.clientVersionCodeList.map(i => i.value) : []
      this.isIndeterminate = false
    },
    handleCheckedVersionsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.dataCondition.clientVersionCodeList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataCondition.clientVersionCodeList.length
    },
    search() {
      this.dataSearch.dimCompare = ''
      this.$nextTick(() => {
        this.$emit('cbSearch')
      })
    },
    searchByGroup() {
      if (!this.dataSearch.dimCompare) {
        this.$message.error('请先选择一个对比维度类型')
        return false
      }
      console.log(this.dataSearch, 588)
      this.$emit('cbSearch', {
        isGroup: true
      })
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
      // this.$nextTick(() => {
      //   // 触发搜索事件
      //   this.search()
      // })
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
    padding-bottom: 20px;
    color: #fff;
    border-bottom: 1px dashed rgba(151, 151, 151, 1);
    .btn-item {
      margin-left: 0 !important;
    }
  }
  .gray-txt {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }
  .popover-cont {
    padding: 40px;
  }
</style>
