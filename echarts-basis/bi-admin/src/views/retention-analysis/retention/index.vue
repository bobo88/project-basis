<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">留存分析
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content" style="width:500px">
                <div v-for="(item, index) in pointData" :key="index" class="f14 mb20 tip-box">
                  <div class="point fb">{{ item.point }}: </div>
                  <p v-for="(i, k) in item.cont" :key="k" class="cont">{{ i }}</p>
                </div>
              </div>
              <i class="iconfont icon-wenhao" />
            </el-tooltip>
          </p>
        </el-col>
      </el-row>

      <!-- <p style="color:#fff" class="mb20">{{ dataSearch }}</p>
      <p style="color:#fff" class="mb20">{{ dataOptions }}</p>
      <p style="color:#fff" class="mb20">{{ dataTableRange }}</p> -->

      <div class="pr">
        <!-- 搜索栏组件 -->
        <search-old :data-condition="searchCondition" :data-search="dataSearch" :data-auth="authorityObj.sOption" :data-remaintype="1" @cbSearch="cbSearch" />
        <!-- 导出数据 -->
        <span class="oprate-tit pb inline-block pr10" @click="exportData">
          <i v-if="!exportStatus" class="el-icon-download" />
          <i v-else class="el-icon-loading" />
          导出数据
        </span>
      </div>

      <div class="clearfix pr tab-box">
        <el-row :gutter="10" class="mb10">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-tabs v-model="activeName" type="card" size="mini" @tab-click="handleClick">
              <el-tab-pane label="新增用户" name="0" />
              <el-tab-pane label="活跃用户" name="1" />
              <el-tab-pane label="老用户" name="2" />
            </el-tabs>
          </el-col>
        </el-row>

        <div class="group-box pb" style="top:10px;right:0;">
          <!-- // dateType: 日期类型（日使用D，周使用w，月使用M） -->
          <span class="group-item" :class="{'current': dataSearch.dateType === 'D', 'disabled': !authorityObj.sDate.includes('D')}" @click="changeGroup('D')">日</span>
          <span class="group-item" :class="{'current': dataSearch.dateType === 'W', 'disabled': !authorityObj.sDate.includes('W')}" @click="changeGroup('W')">周</span>
          <span class="group-item" :class="{'current': dataSearch.dateType === 'M', 'disabled': !authorityObj.sDate.includes('M')}" @click="changeGroup('M')">月</span>
        </div>
      </div>

      <el-select v-model="remainShowType" size="mini" class="dark mr10 w120 mb20" placeholder="百分比" @change="changeRemainShowType">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <!-- TableChart -->
      <table-chart v-loading="loadingOne" :data-table="dataTable" :data-range="dataAllRange" :data-type="remainShowType" :data-group="dataSearch.dateType" />

      <compare-old :data-condition="searchCondition" :data-search="dataSearch" :data-remaintype="1" @cb="cbSetCondition" @cbSearch="cbSearch" />
      <!-- 折线图 -->
      <line-chart v-loading="loadingTwo" :data-range="dataTableRange" :data-type="remainShowType" :data-group="dataSearch.dateType" />
    </div>

  </div>
</template>

<script>
import {
  remainUserActiveUserRemain,
  remainUserNewUserRemain,
  remainUserOldUserRemain,
  remainUserRemainCompare,
  excel_new_remain,
  excel_active_remain,
  excel_old_remain
} from '@/api/user'
import LineChart from './components/LineChart'
import TableChart from './components/TableChart'

import commonSearchOld from '@/layout/mixin/commonSearchOld'
export default {
  name: 'ActiveUser',
  components: {
    LineChart,
    TableChart
  },
  mixins: [commonSearchOld],
  data() {
    return {
      pointData: [
        {
          point: '留存率',
          cont: [
            '某段时间内的新增用户（活跃用户），经过一段时间后，又继续使用应用的被认作是留存用户；',
            '这部分用户占当时新增用户（活跃用户）的比例即是留存率。',
            '例如，5月份新增用户200，这200人在6月份启动过应用的有100人，7月份启动过应用的有80人，8月份启动过应用的有50人；',
            '则5月新增用户一个月后的留存率是50%，两个月后的留存率是40%，三个月后的留存率是25%。',
            '主动留存率指的是用户留存当天首次启动是通过点击icon等主动行为启动应用的用户占新增当天的比例；',
            '被动留存率指的是用户留存当天首次启动是通过点击通知栏等被动启动应用的用户占新增当天的比例。'
          ]
        }
      ],
      loadingOne: false,
      loadingTwo: false,
      activeName: '0',
      indicatorKey: 1,
      lineChartData: [],
      dataAllRange: {},
      dataTableRange: {},
      dataTable: [],
      remainShowType: 'per',
      // 留存用户数展示比例或用户数类型(比率用per，用户数cnt)
      options: [
        {
          value: 'per',
          label: '百分比'
        },
        {
          value: 'cnt',
          label: '用户数'
        }
      ],
      tabEventArr: [
        'getRemainUserNewUserRemainData',
        'getRemainUserActiveUserRemainData',
        'getRemainUserOldUserRemainData',
        'getRemainUserRemainCompareData'
      ],
      exportEventArr: [
        'excel_new_remain',
        'excel_active_remain',
        'excel_old_remain'
      ],
      // 留存流量类型,remain_compare接口和导出数据接口使用，用于页
      // 面点击类型时使用（如新增用户=remain_new_user，活跃用户=re
      // main_active_user，老用户=remain_old_user）
      remainUserTypeArr: [
        'remain_new_user',
        'remain_active_user',
        'remain_old_user'
      ],
      // 不同tab的搜索条件权限
      authorityObj: {},
      authorityArr: [
        // 新增用户
        {
          // 所有启动方式: firstStartupMode, 所有启动渠道: firstStartupChannel, 所有网络状态: netType, 所有流量类型: trafficSource
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          // 日：1  周：2  月：3
          sDate: ['D', 'W', 'M']
        },
        // 活跃用户
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          sDate: ['D', 'W', 'M']
        },
        // 老用户
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          sDate: ['D', 'W', 'M']
        }
      ]
    }
  },
  mounted() {
    // xx
  },
  methods: {
    init(options) {
      this.loadingTwo = true
      // 点击维度对比按钮，则只请求维度对比接口
      if (options && options.isGroup) {
        this.getRemainUserRemainCompareData()
        return false
      }
      this.loadingOne = true
      // ****** 用户留存
      this[this.tabEventArr[+this.activeName]]()
      // 2.6.4. 留存用户维度对比平均值
      this.getRemainUserRemainCompareData()
    },
    initAjax(cbAjax) {
      const options = Object.assign({}, this.dataOptions, {
        remainUserType: this.remainUserTypeArr[+this.activeName],
        // 留存用户数展示比例或用户数类型(比率用per，用户数cnt)
        remainType: this.dataOptions.remainType === '总留存' ? 'ALL' : this.dataOptions.remainType,
        remainShowType: this.remainShowType,
        project: localStorage.getItem('project')
      })
      if (this.dataOptions.dimCompare) {
        if (this.dataOptions.dimCompare === 'isBackfill') {
          options[this.dataOptions.dimCompare] = +this.dataSearch[this.dataOptions.dimCompare]
        } else {
          options[this.dataOptions.dimCompare] = this.dataSearch[this.dataOptions.dimCompare] || 'ALL'
        }
      }
      // 删除属性 dimCompare
      delete options.dimCompare
      cbAjax(options).then(response => {
        const { data } = response
        this.dataAllRange = (data.summary && data.summary[0]) || null
        this.dataTable = data.detail.map(i => {
          i.rlist = i.rlist.map((j, index) => {
            if (j) {
              return this.remainShowType === 'per' ? (j * 100).toFixed(2) + '%' : j
            } else if (j === null) {
              return null
            } else {
              return '0.00' + '%'
            }
          })
          return i
        })
        this.loadingOne = false
      }).catch(error => {
        // this.loadingOne = false
        console.log(error)
      })
    },
    exportData() {
      if (+this.activeName === 0) {
        this.exportAjax(excel_new_remain)
      } else if (+this.activeName === 1) {
        this.exportAjax(excel_active_remain)    
      } else if (+this.activeName === 2) {
        this.exportAjax(excel_old_remain)
      }
    },
    exportAjax(cbAjax) {
      this.exportStatus = true
      setTimeout(() => {
        this.exportStatus = false
      }, 2000)
      const options = Object.assign({}, this.dataOptions, {
        remainUserType: this.remainUserTypeArr[+this.activeName],
        // 留存用户数展示比例或用户数类型(比率用per，用户数cnt)
        remainType: this.dataOptions.remainType === '总留存' ? 'ALL' : this.dataOptions.remainType,
        remainShowType: this.remainShowType,
        project: localStorage.getItem('project')
      })
      cbAjax(options).then(response => {
        const { data } = response
        console.log(data, 588)
      }).catch(error => {
        console.log(error)
      })
    },
    cbSetCondition(options) {
      console.log(options)
    },
    changeRemainShowType() {
      this.init()
    },
    // 2.6.4. 留存用户维度对比平均值
    getRemainUserRemainCompareData() {
      // 平均值不要多维度
      const options = Object.assign({}, this.dataOptions, {
        remainUserType: this.remainUserTypeArr[+this.activeName],
        remainType: this.dataOptions.remainType === '总留存' ? 'ALL' : this.dataOptions.remainType,
        remainShowType: this.remainShowType,
        project: localStorage.getItem('project')
      })
      // console.log(options, 123456)
      remainUserRemainCompare(options).then(response => {
        const { data } = response
        this.dataTableRange = data
        this.loadingTwo = false
        if (Object.keys(data).length === 0) {
          this.$message.warning('当前条件下，没有数据！')
        }
      }).catch(error => {
        // this.loadingTwo = false
        console.log(error)
      })
    },
    // 2.6.2. 新增用户留存
    getRemainUserNewUserRemainData() {
      this.initAjax(remainUserNewUserRemain)
    },
    // 2.6.1. 活跃用户留存
    getRemainUserActiveUserRemainData() {
      this.initAjax(remainUserActiveUserRemain)
    },
    // 2.6.3. 老用户留存
    getRemainUserOldUserRemainData() {
      this.initAjax(remainUserOldUserRemain)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 10px 20px;
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
  .chart-tit {
    height: 30px;
    line-height: 30px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }
  .oprate-tit {
    top: -60px;
    right: 0;
    height: 30px;
    line-height: 30px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: bold;
    vertical-align: top;
    cursor: pointer;
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
  .chart-wrapper {
    background: rgba(32, 107, 255, 0.1);
    padding: 15px;
    border: 1px solid rgba(32, 107, 255, 1);
    border-radius: 8px;
    overflow: hidden;
  }
  .key-indicator {
    margin-bottom: 60px;
    padding: 0;
    color: #fff;
    .dividi {
      padding: 8px 8px 8px 15px;
      background: rgba(32, 107, 255, 0.1);
      border: 1px solid rgba(32, 107, 255, 0.1);
      border-radius: 8px;
      &.current {
        background: rgba(32, 107, 255, 0.4);
        border: 1px solid #206BFF;
        box-sizing: border-box;
      }
      &:hover {
        cursor: pointer;
      }
      p {
        font-weight: bold;
      }
      .tit {
        height: 20px;
        line-height: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
      }
      .num {
        padding: 5px 0;
        height: 40px;
        line-height: 30px;
        color: #fff;
        font-size: 24px;
      }
      .trend {
        line-height: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
      }
    }
  }
  .icon-arrow {
    font-size: 18px;
    font-weight: bold;
    vertical-align: top;
    &.el-icon-top {
      color: rgba(11, 219, 221, 1);
    }
    &.el-icon-bottom {
      color: rgba(250, 108, 171, 1);
    }
  }
  .dividi-theme {
    padding: 0 8px 2px 15px;
    border-left: 2px solid #206BFF;
    p {
      font-weight: bold;
    }
    .num {
      padding: 5px 0;
      height: 40px;
      line-height: 30px;
      color: #fff;
      font-size: 24px;
    }
    .trend {
      line-height: 20px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
    }
  }
}
</style>
