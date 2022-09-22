<template>
  <div>
    <div class="search-box mb30 clearfix vm">
      <el-select v-model="timeTypeGroup" filterable size="mini" class="dark mr10 w120 vm mb5">
        <el-option key="0" label="创建日期" value="0" />
      </el-select>
      <!-- 日期区间 -->
      <el-date-picker
        v-model="value1"
        class="dark mr10 vm mb5"
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

      <el-input v-model="searchValue" size="mini" class="customize-input w300 inline-block mr20 vm mb5" placeholder="可模糊搜索权限分组" />

      <el-button size="mini" class="w80 btn-item mr20 vm mb5" type="primary" @click="search">搜索</el-button>

      <div class="fr">
        <a href="javascript:;" class="customize-add-btn inline-block" @click="addGroup">
          <i class="el-icon-plus" />
          创建分组
        </a>
      </div>
    </div>

    <div class="table-box">
      <el-table
        v-loading="loading"
        class="customize-table"
        align="center"
        size="small"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          width="50"
        />
        <el-table-column
          align="center"
          prop="name"
          label="分组名称"
        />
        <el-table-column
          align="center"
          prop="userNum"
          label="组员"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          align="center"
          label="管理"
          width="250"
        >
          <template slot-scope="scope">
            <div>
              <a v-if="scope.row.name !== '管理员' && scope.row.name !== '所有用户'" href="javascript:;" class="customize-btn mr10" @click="editGroup(scope.row)">编辑名称</a>
              <a v-if="scope.row.userNum === 0" href="javascript:;" class="customize-btn" @click="deleteGroup(scope.row)">移除分组</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <bo-dialog ref="boDialogRef" :data-dialog="dataDialog" @cb="boDialogCb" />
  </div>
</template>

<script>
import {
  getSystemRoleList
} from '@/api/role'
import BoDialog from '@/components/common/BoDialog'
export default {
  components: {
    BoDialog
  },
  data() {
    return {
      loading: false,
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
      timeTypeGroup: '0',
      searchValue: '',
      // 默认日期
      dtFrom: '',
      dtTo: '',
      value1: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      // 默认弹窗数据对象
      dataDialog: {
        type: '',
        title: '',
        cancelBtn: '',
        okBtn: '',
        key: '',
        cbFun: ''
      }
    }
  },
  created() {
    // this.initDate()
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    initDate() {
      this.dtFrom = this.$filters.dateFormatYyyyMmDd(new Date(new Date().getTime() - 3600 * 1000 * 24 * 30))
      this.dtTo = this.$filters.dateFormatYyyyMmDd(new Date())
      this.value1 = [this.dtFrom, this.dtTo]
    },
    search() {
      // if (!this.value1 || (this.value1 && this.value1.length !== 2)) {
      //   this.$message.error('请先选择日期！')
      //   return false
      // }
      this.getDataList()
    },
    getDataList() {
      this.loading = true
      if (!this.value1 || (this.value1 && this.value1.length !== 2)) {
        this.value1 = []
      }
      const options = Object.assign({}, {
        status: this.accountStatus
        // dtFrom: this.value1[0] ? this.value1[0] : '',
        // dtTo: this.value1[1] ? this.value1[1] : ''
      })
      if (this.value1 && this.value1.length === 2) {
        options.dtFrom = this.value1[0]
        options.dtTo = this.value1[1]
      }
      if (this.searchValue) {
        options.searchValue = this.searchValue
      }
      getSystemRoleList(options).then(response => {
        const { data } = response
        this.tableData = data
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    // 弹窗回调函数
    boDialogCb(cbOptions) {
      this.getDataList()
      this[cbOptions.cbFun](cbOptions)
    },
    showOk(options) {
      this.dataDialog = {
        type: options.type + 'Succ',
        title: options.title,
        okBtn: 'OK',
        name: options.name
      }
      this.$nextTick(() => {
        console.log(this.dataDialog, 123)
        this.$refs.boDialogRef.show()
      })
    },
    addGroup() {
      this.dataDialog = {
        type: 'addGroup',
        name: '',
        title: '新建分组',
        cancelBtn: '',
        okBtn: '创建',
        id: '',
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    },
    editGroup(item) {
      this.dataDialog = {
        type: 'editGroup',
        name: item.name,
        title: '编辑分组',
        cancelBtn: '',
        okBtn: '确定',
        id: item.roleId,
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    },
    deleteGroup(item) {
      this.dataDialog = {
        type: 'deleteGroup',
        name: item.name,
        title: '移除分组',
        cancelBtn: '取消',
        okBtn: '确认移除',
        id: item.roleId,
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    }
  }
}
</script>
