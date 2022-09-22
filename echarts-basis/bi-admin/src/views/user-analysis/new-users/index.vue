<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">新增用户分析
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content" style="width:500px">
                <div v-for="(item, index) in pointData" :key="index" class="f14 mb20 tip-box">
                  <span v-if="currentProject !== 'VS_App' || !item.VS_AppIsHide">
                    <div class="point fb">{{ item.point }}: </div>
                    <p v-for="(i, k) in item.cont" :key="k" class="cont">{{ i }}</p>
                  </span>
                </div>
              </div>
              <i class="iconfont icon-wenhao" />
            </el-tooltip>
          </p>
        </el-col>
      </el-row>

      <!-- <p style="color:#fff" class="mb20">{{ dataSearch }}</p>
      <p style="color:#fff" class="mb20">{{ dataOptions }}</p> -->
      <!-- <p style="color:#fff" class="mb20">{{ lineChartData }}</p> -->
      <!-- <p style="color:#fff" class="mb20">{{ authorityObj }}</p> -->

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
              <el-tab-pane label="新增用户" name="0" />
              <el-tab-pane v-if="currentProject !== 'VS_App'" label="新增注册用户" name="1" />
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
  newUserNewRegisteredUser,
  newUserNewUserInfo,
  excel_new_user,
  excel_registered_user
} from '@/api/user'
import LineChart from './components/LineChart'

import CommonSearch from '@/layout/mixin/commonSearch'
export default {
  name: 'NewUsers',
  components: {
    LineChart
  },
  mixins: [CommonSearch],
  data() {
    return {
      currentProject: '',
      pointData: [
        {
          point: '新增用户',
          cont: [
            '如果一个用户首次启动Vapp，那这个用户定义为新增用户；卸载再安装的设备，不会被算作一次新增；升级用户不会算作一次新增。'
          ]
        },
        {
          point: '新增注册用户',
          VS_AppIsHide: true,
          cont: [
            '首次注册vapp账号的用户'
          ]
        }
      ],
      loading: false,
      activeName: '0',
      indicatorKey: 1,
      lineChartData: {},
      tabEventArr: ['getNewUserNewUserInfoData', 'getNewUserNewRegisteredUserData'],
      exportEventArr: [
        'excel_new_user',
        'excel_registered_user'
      ],
      // 不同tab的搜索条件权限
      authorityObj: {},
      authorityArr: [
        {
          // 所有启动方式: firstStartupMode, 所有启动渠道: firstStartupChannel, 所有网络状态: netType, 所有流量类型: trafficSource
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          // 日：1  周：2  月：3
          sDate: ['D', 'W', 'M']
        },
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'trafficSource', 'osVersion'],
          sDate: ['D', 'W', 'M']
        }
      ]
    }
  },
  mounted() {
    this.currentProject = localStorage.getItem('project') || 'VAPP'
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
        this.exportAjax(excel_new_user)
      } else {
        this.exportAjax(excel_registered_user)
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
      // console.log(this.exportEventArr[+this.activeName])
      // console.log(this.dataActive, 123456)
    },
    cbSetCondition(options) {
      console.log(options)
    },
    // 2.3.1. 新增注册用户
    getNewUserNewRegisteredUserData() {
      this.initAjax(newUserNewRegisteredUser)
    },
    // 2.3.2. 新增用户
    getNewUserNewUserInfoData() {
      this.initAjax(newUserNewUserInfo)
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
