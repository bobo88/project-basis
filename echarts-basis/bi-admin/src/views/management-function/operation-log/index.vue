<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">操作日志</p>
        </el-col>
      </el-row>

      <div class="search-box mb30">
        <!-- 日期区间 -->
        <el-date-picker
          v-model="value1"
          class="dark mr10 vm"
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
        <el-input v-model="searchValue" size="mini" class="customize-input w300 inline-block mr20 vm" placeholder="文本模糊查询，一般查询账号名" />
        <el-button size="mini" class="w80 btn-item mr20 vm" type="primary" @click="search">搜索</el-button>
      </div>

      <div v-loading="loading" class="table-box">
        <div v-if="tableDataArr && tableDataArr.length > 0">
          <div v-for="item in tableDataArr" :key="item.date" class="mb50">
            <el-table
              class="customize-table"
              size="small"
              :data="item.tableData"
              style="width: 100%;"
            >
              <!--  max-height:300px; overflow:auto; -->
              <el-table-column
                prop="operate"
                :label="item.date"
              />
            </el-table>
          </div>
        </div>
        <div v-else class="tc nodata-cont">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  systemOper_logList
} from '@/api/role'
export default {
  name: 'PermissionsManagement',
  data() {
    return {
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
      searchValue: '',
      dtFrom: '',
      dtTo: '',
      value1: [],
      loading: false,
      options: [{
        value: '1',
        label: '查看'
      }, {
        value: '2',
        label: '不能查看'
      }],
      options2: [{
        value: '2',
        label: '不能查看'
      }, {
        value: '3',
        label: '修改'
      }],
      value: '',
      tableDataArr: []
    }
  },
  mounted() {
    this.initDate()
    this.getDataList()
  },
  methods: {
    initDate() {
      this.dtFrom = this.$filters.dateFormatYyyyMmDd(new Date(new Date().getTime() - 3600 * 1000 * 24 * 30))
      this.dtTo = this.$filters.dateFormatYyyyMmDd(new Date())
      this.value1 = [this.dtFrom, this.dtTo]
    },
    search() {
      if (!this.value1 || (this.value1 && this.value1.length !== 2)) {
        this.$message.error('请先选择日期！')
        return false
      }
      this.getDataList()
    },
    getDataList() {
      const options = Object.assign({}, {
        dtFrom: this.value1[0] ? this.value1[0] : '',
        dtTo: this.value1[1] ? this.value1[1] : '',
        searchValue: this.searchValue
      })
      this.loading = true
      systemOper_logList(options).then(response => {
        const { data } = response
        this.tableDataArr = data
        this.loading = false
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
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
    padding-bottom: 30px;
    border: 1px solid rgba(32, 107, 255, 1);
    border-radius: 8px;
    overflow: hidden;
  }
  .nodata-cont {
    padding: 30px 0;
    line-height: 30px;
    color: #fff;
  }
}
</style>

