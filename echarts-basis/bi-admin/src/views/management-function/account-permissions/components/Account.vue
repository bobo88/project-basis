<template>
  <div>
    <div class="group-box mb40" style="width:162px;">
      <span class="group-item" style="width:80px;" :class="{'current': accountStatus === '0'}" @click="changeGroup('0')">激活</span>
      <span class="group-item" style="width:80px;" :class="{'current': accountStatus === '1'}" @click="changeGroup('1')">已停用</span>
    </div>

    <div class="search-box mb30 clearfix vm">
      <!-- 激活 -->
      <el-select v-show="accountStatus === '0'" v-model="dateType" filterable size="mini" class="dark mr10 w120 vm mb5">
        <el-option key="0" label="注册日期" value="createDate" />
        <el-option key="1" label="上次登录日期" value="loginDate" />
      </el-select>
      <!-- 已停用 -->
      <el-select v-show="accountStatus === '1'" v-model="dateType" filterable size="mini" class="dark mr10 w120 vm mb5">
        <el-option key="0" label="注册日期" value="createDate" />
        <el-option key="2" label="停用日期" value="disableDate" />
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

      <el-input v-model="searchValue" size="mini" class="customize-input w300 inline-block mr20 vm mb5" placeholder="可模糊搜索账号和权限分组" />

      <el-button size="mini" class="w80 btn-item mr20 vm mb5" type="primary" @click="search">搜索</el-button>

      <div class="fr">
        <a href="javascript:;" class="customize-add-btn inline-block" @click="createAccount">
          <i class="el-icon-plus" />
          创建账号
        </a>
      </div>
    </div>

    <div v-if="accountStatus === '0'" class="table-box">
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
          prop="username"
          label="账号"
        />
        <el-table-column
          align="center"
          prop="roles"
          label="分组"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="注册时间"
        />
        <el-table-column
          align="center"
          prop="commonTime"
          label="上次登录"
        />
        <el-table-column
          align="center"
          label="管理"
          width="250"
        >
          <template slot-scope="scope">
            <div>
              <a href="javascript:;" class="customize-btn mr10" @click="editAccount(scope.row)">编辑</a>
              <a href="javascript:;" class="customize-btn mr10" @click="resetPassword(scope.row)">重置密码</a>
              <a href="javascript:;" class="customize-btn" @click="stopAccount(scope.row)">停用账号</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="table-box">
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
          prop="username"
          label="账号"
        />
        <el-table-column
          align="center"
          prop="roles"
          label="分组"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="注册时间"
        />
        <el-table-column
          align="center"
          prop="commonTime"
          label="停用时间"
        />
        <el-table-column
          align="center"
          label="管理"
          width="250"
        >
          <template slot-scope="scope">
            <div>
              <a href="javascript:;" class="customize-btn" @click="openAccount(scope.row)">启用账号</a>
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
  getSystemUserList
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
      accountStatus: '0',
      searchValue: '',
      // 日期类型
      dateType: 'createDate',
      // 默认日期
      dtFrom: '',
      dtTo: '',
      value1: [],
      tableData: [],
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
        dateType: this.dateType,
        status: this.accountStatus
        // dtFrom: this.value1[0] ? this.value1[0] : '',
        // dtTo: this.value1[1] ? this.value1[1] : '',
        // searchValue: this.searchValue || ''
      })
      if (this.value1 && this.value1.length === 2) {
        options.dtFrom = this.value1[0]
        options.dtTo = this.value1[1]
      }
      if (this.searchValue) {
        options.searchValue = this.searchValue
      }
      getSystemUserList(options).then(response => {
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
    changeGroup(key) {
      if (this.accountStatus === key) {
        return false
      }
      // this.initDate()
      this.dateType = 'createDate'
      this.accountStatus = key
      this.getDataList()
      // console.log('ajax table data........')
      // this.loading = true
      // setTimeout(() => {
      //   this.loading = false
      // }, 1000)
    },
    createAccount() {
      this.dataDialog = {
        type: 'createAccount',
        name: '',
        title: '创建账号',
        cancelBtn: '',
        okBtn: '创建',
        id: '',
        roleIds: [3],
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    },
    editAccount(item) {
      this.dataDialog = {
        type: 'updateAccount',
        name: item.username,
        title: '编辑账号',
        cancelBtn: '取消',
        okBtn: '确定',
        id: item.userId,
        roleIds: item.roleIds || [],
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    },
    openAccount(item) {
      this.dataDialog = {
        type: 'openAccount',
        name: item.username,
        title: '启用账号',
        cancelBtn: '取消',
        okBtn: '确认激活',
        id: item.userId,
        roleIds: item.roleIds || [],
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    },
    resetPassword(item) {
      this.dataDialog = {
        type: 'resetPassword',
        name: item.username,
        title: '重置密码',
        cancelBtn: '取消',
        okBtn: 'OK',
        id: item.userId,
        roleIds: item.roleIds || [],
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    },
    stopAccount(item) {
      this.dataDialog = {
        type: 'stopAccount',
        name: item.username,
        title: '停用账号',
        cancelBtn: '取消',
        okBtn: '确认停用',
        id: item.userId,
        roleIds: item.roleIds || [],
        cbFun: 'showOk'
      }
      this.$nextTick(() => {
        this.$refs.boDialogRef.show()
      })
    }
  }
}
</script>
