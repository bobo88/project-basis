<template>
  <div class="dashboard-editor-container">
    <!-- <div class="vapp-real-time-tit">
      Vapp Data Center
    </div> -->

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="14" :lg="16">
        <div class="chart-wrapper" style="margin-bottom: 10px; height: 990px;">
          <el-row :gutter="10" class="mb30">
            <el-col :xs="8" :sm="8" :md="8" :lg="8">
              <p class="chart-tit">基础指标
                <el-tooltip class="item" effect="light" content="在前台启动应用的用户即为活跃用户。一台设备打开多次会被计为一个活跃用户。计算7天均值" placement="top-start">
                  <i class="iconfont icon-wenhao" />
                </el-tooltip>
              </p>
            </el-col>
            <el-col :xs="16" :sm="16" :md="16" :lg="16" class="tr">
              <span class="oprate-tit inline-block pr10 mr30">
                <i class="el-icon-refresh-right" />
                每5分钟更新一次
              </span>
              <span class="oprate-tit inline-block pr10">
                <i class="el-icon-download" />
                导出数据
              </span>
            </el-col>
          </el-row>

          <div class="key-indicator">
            <el-row :gutter="10" class="mb30">
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 1}" @click="changeKeyIndicator(1)">
                  <p class="tit">新增用户数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 === 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 2}" @click="changeKeyIndicator(2)">
                  <p class="tit">活跃用户数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 !== 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 3}" @click="changeKeyIndicator(3)">
                  <p class="tit">会话数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 === 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 4}" @click="changeKeyIndicator(4)">
                  <p class="tit">轮询用户数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 === 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="mb30">
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 5}" @click="changeKeyIndicator(5)">
                  <p class="tit">登录用户数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 === 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 6}" @click="changeKeyIndicator(6)">
                  <p class="tit">观看用户数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 !== 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 7}" @click="changeKeyIndicator(7)">
                  <p class="tit">VV数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 !== 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
              <el-col :xs="6" :sm="6" :lg="6">
                <div class="dividi" :class="{'current': +indicatorKey === 8}" @click="changeKeyIndicator(8)">
                  <p class="tit">发布视频数</p>
                  <p class="num">{{ 12345678 | numberFormat }}</p>
                  <p class="trend">昨日同期 -12.0% <i class="icon-arrow" :class="123 !== 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
                </div>
              </el-col>
            </el-row>
          </div>

          <div>
            <div class="mb30">
              <div class="mb20">
                <el-date-picker
                  v-model="xxxxxx"
                  type="date"
                  size="mini"
                  class="dark"
                  style="width:130px;"
                  placeholder="选择日期"
                />
              </div>

              <div class="clearfix">
                <div class="fr group-box">
                  <span class="group-item" :class="{'current': +groupKey === 1}" @click="changeGroup(1)">分钟</span>
                  <span class="group-item" :class="{'current': +groupKey === 2}" @click="changeGroup(2)">小时</span>
                  <span class="group-item" :class="{'current': +groupKey === 3}" @click="changeGroup(3)">累计</span>
                </div>
              </div>
            </div>
            <!-- 折线图 -->
            <line-chart :chart-data="lineChartData" />
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="10" :lg="8">
        <div class="chart-wrapper" style="margin-bottom:10px; height: 490px;">
          <div class="clearfix mb30">
            <p class="chart-tit inline-block">同时在线活跃用户数</p>
            <span class="fr oprate-tit inline-block pr10">
              <i class="el-icon-refresh-right" />
              每1分钟更新一次
            </span>
          </div>

          <div class="dividi-theme mb30">
            <p class="num">{{ 1200 | numberFormat }}</p>
            <p class="trend">昨日峰值 1600, 12.0% <i class="icon-arrow" :class="123 !== 123 ? 'el-icon-bottom' : 'el-icon-top'" /></p>
          </div>

          <bar-chart-vertical :chart-data="barChartDataVerticalVV" />
        </div>
        <div class="chart-wrapper" style="margin-bottom:10px; height: 490px;">
          <div class="clearfix mb30">
            <p class="chart-tit inline-block">热门事件</p>
            <span class="fr oprate-tit inline-block pr10">
              <i class="el-icon-refresh-right" />
              每5分钟更新一次
            </span>
          </div>
          <bar-chart :chart-data="barChartDataVV" />
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import BarChartVertical from './components/BarChartVertical'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    BarChart,
    BarChartVertical
  },
  data() {
    return {
      xxxxxx: '',
      indicatorKey: 1,
      groupKey: 2,
      lineChartData: lineChartData.newVisitis,
      barChartDataVerticalVV: {}
    }
  },
  methods: {
    changeKeyIndicator(key) {
      this.indicatorKey = key
    },
    changeGroup(key) {
      this.groupKey = key
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
  .group-box {
    width: 182px;
    height: 30px;
    border: 1px solid #fff;
    border-radius: 8px;
    .group-item {
      display: inline-block;
      width: 60px;
      height: 28px;
      line-height: 28px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      &.current {
        color: #00062D;
        background: #fff;
        border-radius: 7px;
      }
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
