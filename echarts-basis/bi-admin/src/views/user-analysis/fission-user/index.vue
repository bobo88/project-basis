<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">裂变用户分析
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
              <el-tab-pane label="用户分享率" name="0" />
              <el-tab-pane label="分享回流率" name="1" />
              <el-tab-pane label="K因子" name="2" />
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
        <line-chart :chart-data="lineChartData" />
      </div>
      <!-- <compare :data-condition="searchCondition" :data-search="dataSearch" @cb="cbSetCondition" @cbSearch="cbSearch" /> -->
    </div>

  </div>
</template>

<script>
import {
  fissionUserKFactor,
  fissionUserShareRefluxRate,
  fissionUserUserShareRate,
  excel_share_rate,
  excel_share_reflux_rate,
  excel_k_factor
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
          point: '用户分享率',
          cont: [
            '分享用户数占活跃用户数的比例'
          ]
        },
        {
          point: '分享回流率',
          cont: [
            '通过分享链接启动app的次数/分享次数'
          ]
        },
        {
          point: 'k因子',
          cont: [
            '平均每个用户通过分享带来的新用户数，计算公式 = 感染率(每个用户发出的邀请的数量) *转化率 (接收到邀请的人转化为新用户的转化率)'
          ]
        }
      ],
      loading: false,
      activeName: '0',
      indicatorKey: 1,
      lineChartData: {},
      tabEventArr: [
        'getFissionUserUserShareRateData',
        'getFissionUserShareRefluxRateData',
        'getFissionUserKFactorData'
      ],
      exportEventArr: [
        'excel_share_rate',
        'excel_share_reflux_rate',
        'excel_k_factor'
      ],
      // 不同tab的搜索条件权限
      authorityObj: {},
      authorityArr: [
        // 用户分享率
        {
          // 所有启动方式: firstStartupMode, 所有启动渠道: firstStartupChannel, 所有网络状态: netType, 所有流量类型: trafficSource
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          // 日：1  周：2  月：3
          sDate: ['D', '', '']
        },
        // 分享回流率
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // K因子
        {
          sOption: ['brand', '', '', 'netType', 'trafficSource', 'osVersion'],
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
        this.exportAjax(excel_share_rate)
      } else if (+this.activeName === 1) {
        this.exportAjax(excel_share_reflux_rate)
      } else if (+this.activeName === 2) {
        this.exportAjax(excel_k_factor)
      }
    },
    exportAjax(cbAjax) {
      const options = Object.assign({}, this.dataOptions, {
        project: localStorage.getItem('project')
      })
      this.exportStatus = true
      setTimeout(() => {
        this.exportStatus = false
      }, 2000)
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
    // 2.7.1. k因子
    getFissionUserKFactorData() {
      this.initAjax(fissionUserKFactor)
    },
    // 2.7.2. 分享回流率
    getFissionUserShareRefluxRateData() {
      this.initAjax(fissionUserShareRefluxRate)
    },
    // 2.7.3. 用户分享率
    getFissionUserUserShareRateData() {
      this.initAjax(fissionUserUserShareRate)
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

