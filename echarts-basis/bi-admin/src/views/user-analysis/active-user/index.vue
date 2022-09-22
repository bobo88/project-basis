<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">活跃用户分析
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content" style="width:600px">
                <div v-for="(item, index) in pointData" :key="index" class="f14 mb20 tip-box">
                  <span v-if="currentProject !== 'VS_App' || !item.VS_AppIsHide">
                    <div class="point fb">{{ item.point }}: </div>
                    <p v-for="(i, k) in item.cont" :key="k" class="cont">{{ i }}</p>
                    <div v-if="item.point === '活跃用户构成'" class="cont">
                      <el-table
                        :data="tableData"
                        border
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="a"
                          label="新增/活跃"
                          min-width="110"
                        />
                        <el-table-column
                          prop="b"
                          label="<=T-91"
                          min-width="60"
                        />
                        <el-table-column
                          prop="c"
                          label="[T-90天, T-31天]"
                          min-width="120"
                        />
                        <el-table-column
                          prop="d"
                          label="[T-30天, T-1]"
                          width="120"
                        />
                        <el-table-column
                          prop="e"
                          label="当天"
                          min-width="60"
                        />
                        <el-table-column
                          prop="f"
                          label="用户分组"
                          width="140"
                        />
                      </el-table>
                    </div>
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

      <!-- <p style="color:#fff" class="mb20">1{{ dataSearch }}2</p> -->

      <div class="pr">
        <!-- 搜索栏组件 -->
        <search :data-condition="searchCondition" :data-hide="activeName === '1'" :data-search="dataSearch" :data-auth="authorityObj.sOption" @cbSearch="cbSearch" />
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
              <el-tab-pane label="活跃用户" name="0" />
              <el-tab-pane v-if="currentProject !== 'VS_App'" label="活跃用户构成" name="1" />
              <el-tab-pane label="登录活跃用户" name="2" />
              <el-tab-pane v-if="currentProject !== 'VS_App'" label="后台活跃用户" name="3" />
              <el-tab-pane v-if="currentProject !== 'VS_App'" label="活跃度" name="4" />
              <el-tab-pane label="启动天频" name="5" />
              <el-tab-pane label="人均启动次数" name="6" />
              <!-- <el-tab-pane label="平均启动间隔时长" name="7" /> -->
              <el-tab-pane label="平均使用时长" name="8" />
              <el-tab-pane v-if="currentProject !== 'VS_App'" label="升级用户数" name="9" />
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

      <!-- 活跃用户构成 -->
      <div v-if="activeName === '1'">
        <pie-chart :chart-data="lineChartData" />
        <!-- <bar-chart-vertical2 /> -->
      </div>

      <!-- 折线图 -->
      <div v-else v-loading="loading" element-loading-background="#00062D">
        <div v-if="activeName === '5'">
          <el-select v-model="remainShowType" size="mini" class="dark mr10 w120 mb20" placeholder="启动天频" @change="changeRemainShowType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 当 push召回率/卸载率 时，需要将图表转为百分比 -->
        <line-chart :chart-data="lineChartData" :data-tab="activeName" />
      </div>

      <!-- <compare :data-condition="searchCondition" :data-limit="activeName === '1'" :data-search="dataSearch" @cb="cbSetCondition" @cbSearch="cbSearch" /> -->
    </div>

  </div>
</template>

<script>
import {
  activeUserActivation,
  activeUserActiveUserInfo,
  activeUserActiveUserStructure,
  activeUserAvgStartNum,
  activeUserAvgTimeBetweenStart,
  activeUserAvgUseTime,
  activeUserBackActiveUser,
  activeUserLoginActiveUser,
  activeUserStartDayFrequency,
  activeUserUpdateUser,
  excel_active_user,
  excel_active_structure,
  excel_login_active,
  excel_back_active,
  excel_activation,
  excel_start_frequency,
  excel_avg_start,
  excel_avg_between,
  excel_avg_use_time,
  excel_update_active
} from '@/api/user'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'

import CommonSearch from '@/layout/mixin/commonSearch'
export default {
  name: 'ActiveUsers',
  components: {
    LineChart,
    PieChart
  },
  mixins: [CommonSearch],
  data() {
    return {
      currentProject: '',
      tableData: [
        {
          a: '<=T-91',
          b: '新增',
          c: '活跃',
          d: '活跃',
          e: '活跃',
          f: '忠实用户'
        },
        {
          a: '<=T-91',
          b: '新增',
          c: '非活跃',
          d: '活跃',
          e: '活跃',
          f: '较活跃用户'
        },
        {
          a: '<=T-91',
          b: '新增',
          c: '活跃',
          d: '非活跃',
          e: '活跃',
          f: '召回用户'
        },
        {
          a: '<=T-91',
          b: '新增',
          c: '非活跃',
          d: '非活跃',
          e: '活跃',
          f: '召回用户'
        },
        {
          a: '[T-90天, T-31天]',
          b: '',
          c: '新增',
          d: '活跃',
          e: '活跃',
          f: '较活跃用户'
        },
        {
          a: '[T-90天, T-31天]',
          b: '',
          c: '新增',
          d: '非活跃',
          e: '活跃',
          f: '召回用户'
        },
        {
          a: '[T-30天, T-1]',
          b: '',
          c: '',
          d: '新增',
          e: '活跃',
          f: '留存用户（30天内）'
        },
        {
          a: '当天',
          b: '',
          c: '',
          d: '',
          e: '新增',
          f: '新增用户'
        }
      ],
      pointData: [
        {
          point: '活跃用户',
          cont: [
            '在前台启动应用的用户即为活跃用户。一台设备打开多次会被计为一个活跃用户。'
          ]
        },
        {
          point: '活跃用户构成',
          VS_AppIsHide: true,
          cont: [
            '日活用户=当日新增用户+召回用户+（T-30~T-1新增用户的）n日留存用户+忠实用户+较活跃用户',
            '*忠实用户：T日开启 ∩ T-30~T-1日开启 ∩ T-30~T-91有开启(新增日期<T-90)；',
            '*较活跃用户：T日开启 ∩ T-30~T-1日开启 (新增日期<T-30&新增日期>T=90或新增日期<T-90∩ T-30~T-90没有开启)'
          ]
        },
        {
          point: '登录活跃用户',
          cont: [
            '登录状态的活跃用户'
          ]
        },
        {
          point: '后台活跃用户',
          VS_AppIsHide: true,
          cont: [
            '前台活跃用户+后台请求服务的用户'
          ]
        },
        {
          point: '活跃度',
          VS_AppIsHide: true,
          cont: [
            '活跃用户数/前后台活跃用户数'
          ]
        },
        {
          point: '启动天频',
          cont: [
            '30天启动天频：最近30天内活跃用户平均活跃天数；7天启动天频：最近7天内活跃用户平均活跃天数'
          ]
        },
        {
          point: '人均启动次数',
          cont: [
            '平均每天每人启动到前台的会话数'
          ]
        },
        // {
        //   point: '平均启动间隔时长',
        //   cont: [
        //     '每天相同用户连续两次启动到前台的时间间隔'
        //   ]
        // },
        {
          point: '人均使用时长',
          cont: [
            '平均每人每天使用vapp的时长'
          ]
        },
        {
          point: '升级用户数',
          VS_AppIsHide: true,
          cont: [
            '每天从低版本升级到高版本的用户数，数据源自firebase。'
          ]
        }
      ],
      loading: false,
      activeName: '0',
      indicatorKey: 1,
      lineChartData: {},
      remainShowType: '30d',
      options: [
        {
          value: '7d',
          label: '7日启动天频'
        },
        {
          value: '30d',
          label: '30日启动天频'
        }
      ],
      tabEventArr: [
        'getActiveUserActiveUserInfoData',
        'getActiveUserActiveUserStructureData',
        'getActiveUserLoginActiveUserData',
        'getActiveUserBackActiveUserData',
        'getActiveUserActivationData',
        'getActiveUserStartDayFrequencyData',
        'getActiveUserAvgStartNumData',
        'getActiveUserAvgTimeBetweenStartData',
        'getActiveUserAvgUseTimeData',
        'getActiveUserUpdateUserData'
      ],
      exportEventArr: [
        'excel_active_user',
        'excel_active_structure',
        'excel_login_active',
        'excel_back_active',
        'excel_activation',
        'excel_start_frequency',
        'excel_avg_start',
        'excel_avg_between',
        'excel_avg_use_time',
        'excel_update_active'
      ],
      // 不同tab的搜索条件权限
      authorityObj: {},
      authorityArr: [
        // 活跃用户
        {
          // 所有启动方式: firstStartupMode, 所有启动渠道: firstStartupChannel, 所有网络状态: netType, 所有流量类型: trafficSource
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          // 日：1  周：2  月：3
          sDate: ['D', 'W', 'M']
        },
        // 活跃用户构成
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', '', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // 登录活跃用户
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', '', 'trafficSource', 'osVersion'],
          sDate: ['D', 'W', 'M']
        },
        // 后台活跃用户
        {
          sOption: ['brand', '', '', '', 'trafficSource', 'osVersion'],
          sDate: ['D', 'W', 'M']
        },
        // 活跃度
        {
          sOption: ['brand', '', '', '', 'trafficSource', 'osVersion'],
          sDate: ['D', 'W', 'M']
        },
        // 启动天频
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // 人均启动次数
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // 平均启动间隔时长
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          sDate: ['D', '', '']
        },
        // 平均使用时长
        {
          sOption: ['brand', 'firstStartupMode', 'firstStartupChannel', 'netType', 'trafficSource', 'osVersion'],
          sDate: ['D', 'W', 'M']
        },
        // 升级用户数
        {
          sOption: ['brand', '', '', '', 'trafficSource', ''],
          sDate: ['D', '', '']
        }
      ]
    }
  },
  mounted() {
    this.currentProject = localStorage.getItem('project') || 'VAPP'
  },
  methods: {
    changeRemainShowType() {
      this.init()
    },
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
      // remainShowType="7d或30d"
      if (this.activeName === '5') {
        options.remainShowType = this.remainShowType || '30d'
      }
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
        this.exportAjax(excel_active_user)
      } else if (+this.activeName === 1) {
        this.exportAjax(excel_active_structure)
      } else if (+this.activeName === 2) {
        this.exportAjax(excel_login_active)
      } else if (+this.activeName === 3) {
        this.exportAjax(excel_back_active)
      } else if (+this.activeName === 4) {
        this.exportAjax(excel_activation)
      } else if (+this.activeName === 5) {
        this.exportAjax(excel_start_frequency)
      } else if (+this.activeName === 6) {
        this.exportAjax(excel_avg_start)
      } else if (+this.activeName === 7) {
        this.exportAjax(excel_avg_between)
      } else if (+this.activeName === 8) {
        this.exportAjax(excel_avg_use_time)
      } else if (+this.activeName === 9) {
        this.exportAjax(excel_update_active)
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
      // remainShowType="7d或30d"
      if (this.activeName === '5') {
        options.remainShowType = this.remainShowType || '30d'
      }
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
    // 2.4.7. 后台活跃用户
    getActiveUserBackActiveUserData() {
      this.initAjax(activeUserBackActiveUser)
    },
    // 2.4.3. 活跃用户构成
    getActiveUserActiveUserStructureData() {
      this.initAjax(activeUserActiveUserStructure)
    },
    // 2.4.2. 活跃用户
    getActiveUserActiveUserInfoData() {
      this.initAjax(activeUserActiveUserInfo)
    },
    // 2.4.8. 登录活跃用户
    getActiveUserLoginActiveUserData() {
      this.initAjax(activeUserLoginActiveUser)
    },
    // 2.4.1. 活跃度
    getActiveUserActivationData() {
      this.initAjax(activeUserActivation)
    },
    // 2.4.9. 启动天频
    getActiveUserStartDayFrequencyData() {
      this.initAjax(activeUserStartDayFrequency)
    },
    // 2.4.4. 人均启动次数
    getActiveUserAvgStartNumData() {
      this.initAjax(activeUserAvgStartNum)
    },
    // 2.4.5. 平均启动间隔时长
    getActiveUserAvgTimeBetweenStartData() {
      this.initAjax(activeUserAvgTimeBetweenStart)
    },
    // 2.4.6. 平均使用时长
    getActiveUserAvgUseTimeData() {
      this.initAjax(activeUserAvgUseTime)
    },
    // 2.4.10. 升级用户数
    getActiveUserUpdateUserData() {
      this.initAjax(activeUserUpdateUser)
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
