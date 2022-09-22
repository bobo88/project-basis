<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">召回用户分析
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
      <p style="color:#fff" class="mb20">{{ dataOptions }}</p> -->

      <div class="pr">
        <!-- 搜索栏组件 -->
        <search :data-condition="searchCondition" :data-search="dataSearch" :data-auth="authorityObj.sOption" @cbSearch="cbSearch" />
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
              <el-tab-pane label="召回用户数" name="0" />
              <el-tab-pane label="push召回率" name="1" />
              <el-tab-pane label="流失用户数" name="2" />
              <el-tab-pane label="沉默用户数" name="3" />
              <el-tab-pane label="卸载率" name="4" />
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

      <!-- 折线图 -->
      <div v-loading="loading" element-loading-background="#00062D">
        <!-- 当 push召回率/卸载率 时，需要将图表转为百分比 -->
        <line-chart :chart-data="lineChartData" :data-tab="activeName" />
      </div>
      <!-- <compare :data-condition="searchCondition" :data-search="dataSearch" @cb="cbSetCondition" @cbSearch="cbSearch" /> -->
    </div>

  </div>
</template>

<script>
import {
  recallUserLostUser,
  recallUserPushRecallRate,
  recallUserRecallUserInfo,
  recallUserSilenceUser,
  recallUserUninstallRate,
  excel_lose_user,
  excel_push_racall,
  excel_recall_user,
  excel_silence_user,
  excel_uninstall_rate
} from '@/api/user'
import LineChart from './components/LineChart'

import CommonSearch from '@/layout/mixin/commonSearch'
export default {
  name: 'RecallUsers',
  components: {
    LineChart
  },
  mixins: [CommonSearch],
  data() {
    return {
      pointData: [
        {
          point: '召回用户',
          cont: [
            '也叫回流用户，T日开启 ∩ T-30~T-1日未开启（新增日期<T-30）'
          ]
        },
        {
          point: 'push召回率',
          cont: [
            '当天首次通过push启动app的召回用户数/召回用户数'
          ]
        },
        {
          point: '流失用户数',
          cont: [
            '连续90天以上没有活跃的用户数datediff（最近一次活跃日期，today）>90;',
            '计算公式：截止当天的累计新增用户数-(T-89-T)期间的活跃用户数'
          ]
        },
        {
          point: '沉默用户数',
          cont: [
            '连续30天以上，90天以内没有活跃的用户数（最近一次活跃日期，today）>30 and <=90',
            '计算公式：（T-89-T)期间的活跃用户数-（T-29-T）期间的活跃用户数'
          ]
        },
        {
          point: '卸载率',
          cont: [
            '卸载app的用户数/活跃用户数，数据源自firebase'
          ]
        }
      ],
      loading: false,
      activeName: '0',
      indicatorKey: 1,
      lineChartData: {},
      tabEventArr: [
        'getRecallUserRecallUserInfoData',
        'getRecallUserPushRecallRateData',
        'getRecallUserLostUserData',
        'getRecallUserSilenceUserData',
        'getRecallUserUninstallRateData'
      ],
      exportEventArr: [
        'excel_recall_user',
        'excel_push_racall',
        'excel_lose_user',
        'excel_silence_user',
        'excel_uninstall_rate'
      ],
      // 不同tab的搜索条件权限
      authorityObj: {},
      authorityArr: [
        // 召回用户数
        {
          // 所有启动方式: firstStartupMode, 所有启动渠道: firstStartupChannel, 所有网络状态: netType, 所有流量类型: trafficSource
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          // 日：1  周：2  月：3
          sDate: ['D', '', '']
        },
        // push召回率
        {
          sOption: ['brand', '', '', '', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // 流失用户数
        {
          sOption: ['brand', '', '', '', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // 沉默用户数
        {
          sOption: ['brand', '', '', '', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // 卸载率
        {
          sOption: ['brand', '', '', '', '', ''],
          sDate: ['D', '', '']
        }
      ]
    }
  },
  mounted() {
    // xx
  },
  methods: {
    init() {
      this.lineChartData = {}
      this.loading = true
      // ****** 新增用户
      this[this.tabEventArr[+this.activeName]]()
    },
    initAjax(cbAjax) {
      const options = Object.assign({}, this.dataOptions, {
        project: localStorage.getItem('project')
      })
      cbAjax(options).then(response => {
        const { data } = response
        this.lineChartData = data
        this.loading = false
        if (Object.keys(data).length === 0) {
          this.$message.warning('当前条件下，没有数据！')
        }
      }).catch(error => {
        // this.loading = false
        console.log(error)
      })
    },
    exportData() {
      if (+this.activeName === 0) {
        this.exportAjax(excel_recall_user)
      } else if (+this.activeName === 1) {
        this.exportAjax(excel_push_racall)
      } else if (+this.activeName === 2) {
        this.exportAjax(excel_lose_user)
      } else if (+this.activeName === 3) {
        this.exportAjax(excel_silence_user)
      } else if (+this.activeName === 4) {
        this.exportAjax(excel_uninstall_rate)
      }
    },
    exportAjax(cbAjax) {
      this.exportStatus = true
      setTimeout(() => {
        this.exportStatus = false
      }, 2000)
      const options = Object.assign({}, this.dataOptions, {
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
    // 2.1.1. 流失用户数
    getRecallUserLostUserData() {
      this.initAjax(recallUserLostUser)
    },
    // 2.1.2. push召回率
    getRecallUserPushRecallRateData() {
      this.initAjax(recallUserPushRecallRate)
    },
    // 2.1.3. 召回用户数
    getRecallUserRecallUserInfoData() {
      this.initAjax(recallUserRecallUserInfo)
    },
    // 2.1.4. 沉默用户数
    getRecallUserSilenceUserData() {
      this.initAjax(recallUserSilenceUser)
    },
    // 2.1.5. 卸载率
    getRecallUserUninstallRateData() {
      this.initAjax(recallUserUninstallRate)
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
