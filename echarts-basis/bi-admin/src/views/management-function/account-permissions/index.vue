<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">用户账号管理</p>
        </el-col>
      </el-row>

      <div class="clearfix pr">
        <el-row :gutter="10" class="mb20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-tabs v-model="activeName" type="card" size="mini" @tab-click="handleClick">
              <el-tab-pane label="账号" name="0" />
              <el-tab-pane label="权限分组" name="1" />
            </el-tabs>
          </el-col>
        </el-row>
      </div>
      <!-- 账号 -->
      <div v-if="activeName === '0'">
        <account />
      </div>

      <!-- 权限分组 -->
      <div v-else>
        <authority />
      </div>
    </div>
  </div>
</template>

<script>
import Account from './components/Account'
import Authority from './components/Authority'
export default {
  name: 'AccountPermissions',
  components: {
    Account,
    Authority
  },
  data() {
    return {
      loading: false,
      activeName: '0'
    }
  },
  mounted() {
    // xx
  },
  methods: {
    handleClick() {}
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
    padding-bottom: 50px;
    border: 1px solid rgba(32, 107, 255, 1);
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>

