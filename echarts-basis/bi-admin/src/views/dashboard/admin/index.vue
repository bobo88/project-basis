<template>
  <div class="dashboard-editor-container">
    <!-- 测试： -->
    <!-- <el-button>{{$t('sceneHome.start')}}</el-button>
    <el-date-picker
      v-model="ABC"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker> -->

    <div class="vapp-data-center-tit vapp-data-center-normal-tit mb10">
      {{ curProject === 'VS_App' ? 'VS_App' : 'Vapp' }} Data Center
    </div>
    <div class="vapp-data-center-tit vapp-data-center-kx-tit mb10">
      <img class="img" src="@/assets/vapp_data_tit.png" alt="">
    </div>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="7">
        <div class="chart-wrapper" style="margin-bottom:10px; height: 325px;">
          <p class="chart-tit">最近7天新增 & 活跃用户</p>
          <line-chart />
        </div>
        <div class="chart-wrapper" style="margin-bottom:10px; height: 325px;">
          <p class="chart-tit">最近7天版本分布（均值，展示top10）</p>
          <div style="display:inline-block; width: 48%; margin-right: 2%">
            <raddar-chart :chart-data="raddarChartDataActive" />
          </div>
          <div style="display:inline-block; width: 48%;">
            <raddar-chart :chart-data="raddarChartDataNew" />
          </div>
        </div>
        <div class="chart-wrapper" style="margin-bottom:10px; height: 325px;">
          <p class="chart-tit">最近7天渠道分布（均值，展示top8）</p>
          <bar-chart :chart-data="barChartDataVV" />
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="10">
        <div class="chart-wrapper" style="margin-bottom:10px; height: 660px;">
          <div class="data-center-box">
            <el-row :gutter="5">
              <el-col :xs="14" :sm="24" :lg="14">
                <div class="data-total">
                  <h3>累计用户数</h3>
                  <h4 class="total-num">{{ userData.user | numberFormat }}</h4>
                </div>
              </el-col>
              <el-col :xs="10" :sm="24" :lg="10">
                <div class="data-total">
                  <h3>累计注册用户数</h3>
                  <h4 class="total-num">{{ userData.regUser | numberFormat }}</h4>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :xs="12" :sm="12" :lg="12">
                <el-table
                  align="right"
                  class="transparent"
                  size="mini"
                  :data="countryData"
                  style="width: 100%;"
                >
                  <el-table-column
                    type="index"
                    align="left"
                    width="30"
                  />
                  <el-table-column
                    prop="countryCnName"
                    align="left"
                    label="国家"
                  />
                  <el-table-column align="right" label="累计用户数">
                    <template slot-scope="scope">
                      {{ scope.row.user | numberFormat }}
                    </template>
                  </el-table-column>
                  <el-table-column align="right" label="占比">
                    <template slot-scope="scope">
                      {{ scope.row.percent | toPercent }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :xs="12" :sm="12" :lg="12">
                <africa-chart @cb="cbCountryData" />
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="chart-wrapper" style="margin-bottom:10px; height: 325px;">
          <p class="chart-tit mb30">关键指标</p>
          <div class="key-indicator">
            <el-row :gutter="10" class="mb30">
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="dividi">
                  <p class="tit">
                    日活
                    <el-tooltip class="item" effect="light" content="在前台启动应用的用户即为活跃用户。一台设备打开多次会被计为一个活跃用户。计算7天均值" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.dayActiveUser | numberFormat }}</p>
                </div>
              </el-col>
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="dividi">
                  <p class="tit">周活
                    <el-tooltip class="item" effect="light" content="最近7天的活跃用户数" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.weekActiveUser | numberFormat }}</p>
                </div>
              </el-col>
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="dividi">
                  <p class="tit">月活
                    <el-tooltip class="item" effect="light" content="最近30天的活跃用户数" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.monActiveUser | numberFormat }}</p>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="mb30">
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="dividi">
                  <p class="tit">7日启动天频
                    <el-tooltip class="item" effect="light" content="最近7天的活跃用户平均活跃天数，该指标可以反映产品的用户粘性" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.startupRate7d ? (userData.startupRate7d).toFixed(2) : '' }}天</p>
                </div>
              </el-col>
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="dividi">
                  <p class="tit">30日启动天频
                    <el-tooltip class="item" effect="light" content="最近30天的活跃用户平均活跃天数，该指标可以反映产品的用户粘性" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.startupRate30d ? (userData.startupRate30d).toFixed(2) : '' }}天</p>
                </div>
              </el-col>
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="dividi">
                  <p class="tit">新增次留
                    <el-tooltip class="item" effect="light" content="第0天新增用户在第1天活跃的占比，算7天均值" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.userRemain | toPercent }}</p>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="warning">
                  <i class="icon el-icon-warning-outline" />
                  <p class="tit">崩溃率
                    <el-tooltip class="item" effect="light" content="最近7天用户至少遇到一次崩溃的活跃日占比（均值）；仅安卓，数据源自google_play 后台" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.crashRate | toPercent }}</p>
                </div>
              </el-col>
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="warning">
                  <i class="icon el-icon-warning-outline" />
                  <p class="tit">ANR 发生率
                    <el-tooltip class="item" effect="light" content="最近7天用户至少遇到一次页面超过5s没有响应的活跃日占比（均值）；仅安卓，数据源自google_play 后台" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.anrRate | toPercent }}</p>
                </div>
              </el-col>
              <el-col :xs="8" :sm="8" :lg="8">
                <div class="warning">
                  <i class="icon el-icon-warning-outline" />
                  <p class="tit">卸载率
                    <el-tooltip class="item" effect="light" content="最近7天平均卸载率，卸载率的计算：每天卸载用户数/日活用户数，数据源自firebase" placement="top-start">
                      <i class="iconfont icon-wenhao" />
                    </el-tooltip>
                  </p>
                  <p class="num">{{ userData.uninstallRate | toPercent }}</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="7">
        <div class="chart-wrapper" style="margin-bottom:10px; height: 660px;">
          <p class="chart-tit">{{ curProject === 'VS_App' ? '最近7天播放&下载数据' : 'VV数据' }}</p>
          <div class="mb30">
            <bar-chart-vertical :chart-data="barChartDataVerticalVV" />
          </div>

          <el-row :gutter="10">
            <el-col :xs="8" :sm="8" :lg="8">
              <div class="vv-data-total">
                <div class="mb30">
                  <h3>人均使用时长:</h3>
                  <h4 class="vv-time">{{ userData.avgUserTime | computedHmsTime }}</h4>
                </div>
                <div class="mb30">
                  <h3>人均播放时长:</h3>
                  <h4 class="vv-time">{{ userData.avgPlayTime | computedHmsTime }}</h4>
                </div>
                <div>
                  <h3>人均缓冲时长:</h3>
                  <h4 class="vv-time">{{ userData.avgBufferTime | computedHmsTime }}</h4>
                </div>
              </div>
            </el-col>
            <el-col :xs="16" :sm="16" :lg="16">
              <p class="chart-tit">最近7天累计vv分段</p>
              <pie-chart />
            </el-col>
          </el-row>
        </div>
        <div class="chart-wrapper" style="margin-bottom:10px; height: 325px;">
          <p class="chart-tit">视频生产数据</p>
          <bar-chart-vertical2 />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getUsersNumber } from '@/api/dashboard'
import AfricaChart from './components/AfricaChart'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import BarChartVertical from './components/BarChartVertical'
import BarChartVertical2 from './components/BarChartVertical2'

export default {
  name: 'DashboardAdmin',
  components: {
    AfricaChart,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    BarChartVertical,
    BarChartVertical2
  },
  data() {
    return {
      ABC: '',
      // 用户独立数字记录: 记录多个数据
      userData: {},
      raddarChartDataNew: {
        key: 'new',
        title: '新增用户',
        color: '#206bff',
        shadowColor: 'rgba(32, 107, 255, 0.2)'
      },
      raddarChartDataActive: {
        key: 'active',
        title: '活跃用户',
        color: '#0bdbdd',
        shadowColor: 'rgba(11, 219, 221, 0.2)'
      },
      barChartDataVV: {},
      barChartDataVerticalVV: {},
      countryData: [],
      curProject: localStorage.getItem('project')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUsersNumberData()
    })
  },
  methods: {
    cbCountryData(data) {
      const tempArr = JSON.parse(JSON.stringify(data))
      this.countryData = tempArr.splice(0, 10)
    },
    // 获取 用户独立数字记录 数据
    getUsersNumberData() {
      getUsersNumber().then(response => {
        const { data } = response
        // console.log('获取 用户独立数字记录 数据 getUsersNumber: ', data)
        this.userData = data
      }).catch(error => {
        console.log(error)
      })
    },
    inputChange(val) {
      console.log(val, 12, val.match(/^(\d{1,9})(\.(\d{1,4}))?/))
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 30px 20px;
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
  .chart-wrapper {
    background: rgba(32, 107, 255, 0.1);
    padding: 15px;
    border: 1px solid rgba(32, 107, 255, 1);
    border-radius: 8px;
    overflow: hidden;
  }
  .data-center-box {
    padding-top: 80px;
    .data-total {
      margin-bottom: 50px;
      padding-left: 5%;
      h3 {
        height: 20px;
        line-height: 20px;
        color: #fff;
        font-size: 16px;
      }
      .total-num {
        height: 70px;
        line-height: 70px;
        color: rgba(8, 252, 192, 1);
        font-size: 46px;
        font-weight: 800;
      }
    }
  }
  .key-indicator {
    padding: 0 8%;
    color: #fff;
    .dividi {
      padding-left: 10px;
      height: 50px;
      border-left: 2px solid rgba(32, 107, 255, 1);
      p {
        font-weight: bold;
      }
      .tit {
        margin-bottom: 6px;
        height: 20px;
        line-height: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
      }
      .num {
        height: 24px;
        line-height: 24px;
        color: #fff;
        font-size: 24px;
      }
    }
    .warning {
      position: relative;
      z-index: 1;
      padding-left: 30px;
      height: 50px;
      .icon {
        position: absolute;
        z-index: 9;
        top: 0;
        left: 0;
        color: rgba(253, 204, 2, 0.8);
        font-size: 24px;
      }
      p {
        font-weight: bold;
      }
      .tit {
        margin-bottom: 6px;
        height: 20px;
        line-height: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
      }
      .num {
        height: 24px;
        line-height: 24px;
        color: #fff;
        font-size: 24px;
      }
    }
  }
  .vv-data-total {
    padding: 20px 0;
    color: #fff;
    border-right: 1px solid rgba(32, 107, 255, 1);
    h3 {
      margin-bottom: 5px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .vv-time {
      height: 30px;
      line-height: 30px;
      font-size: 24px;
      font-weight: 800;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
