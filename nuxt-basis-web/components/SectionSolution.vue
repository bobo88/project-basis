<template>
  <el-row class="section-solution" justify="space-between">
    <el-col :span="6">
      <div class="solution-item">
        <h5>深圳市臂云科技有限公司</h5>
        <div class="solution-desc">
          <h6>云游戏解决方案</h6>
          <p>先试玩，再下载，有效提升转化效率</p>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="solution-item">
        <h5>深圳市臂云科技有限公司</h5>
        <div class="solution-desc">
          <h6>云游戏解决方案</h6>
          <p>先试玩，再下载，有效提升转化效率</p>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="solution-item">
        <h5>深圳市臂云科技有限公司</h5>
        <div class="solution-desc">
          <h6>云游戏解决方案</h6>
          <p>先试玩，再下载，有效提升转化效率</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
  // xx
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .section-solution {
    margin-bottom: 30px !important;
    height: 500px;
    display: flex;
    color: #000;
    font-size: 30px;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    align-items: center;
    justify-content: center;
    .solution-item {
      height: 500px;
      // display: flex;
      // text-align: center;
      // align-items: center;
      // justify-content: center;
      font-size: 20px;
      background: rgba(255, 255, 255, 0.9);
      h5 {
        padding: 0 10px;
        height: 300px;
        line-height: 300px;
        font-size: 22px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .solution-desc {
        padding: 0 10px;
        h6 {
          font-size: 18px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p {
          height: 100px;
          line-height: 100px;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
