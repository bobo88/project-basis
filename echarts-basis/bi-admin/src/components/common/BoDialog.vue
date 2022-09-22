<template>
  <div class="bo-dialog-comp clearfix">
    <el-dialog
      :title="dataDialog.title"
      class="search-dialog"
      center
      :modal="false"
      :visible.sync="dialogVisible"
      width="520px"
      :before-close="handleClose"
    >
      <div class="search-dialog-cont">
        <!-- // type: 'createAccount'表示创建账号，'createAccountSucc'表示创建用户成功
        // 'updateAccount'编辑账号，'updateAccountSucc'表示编辑账号成功
        // 'resetPassword'重置密码，'resetPasswordSucc'表示重置密码成功
        // 'stopAccount'表示停用账号，'stopAccountSucc'表示停用账号成功
        // 'openAccount'表示启用账号, 'openAccountSucc'表示启用账号成功
        // 'addGroup'表示新建分组，'editGroup'表示编辑分组，'deleteGroup'表示移除分组, 'deleteGroupSucc'表示移除分组成功 -->
        <div v-if="dataDialog.type === 'createAccount' || dataDialog.type === 'updateAccount'" class="tc">
          <p class="w300 mb10 inline-block tl">账号</p>
          <el-input v-model="dataDialog.name" :disabled="dataDialog.type === 'updateAccount'" size="mini" class="w300 inline-block mb20" placeholder="请输入账号名称" />
          <p class="w300 mb10 inline-block tl">分组</p>
          <el-select v-model="dataDialog.roleIds" v-loading="loading" multiple filterable element-loading-background="rgba(255, 255, 255, 0.5) !important" size="mini" class="w300" placeholder="请选择分组">
            <el-option
              v-for="item in groupList"
              :key="item.roleId"
              :label="item.name"
              :disabled="item.roleId === 3"
              :value="item.roleId"
            >
              <!-- <span style="float: left" class="mr10"><el-checkbox v-model="item.key"></el-checkbox></span> -->
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </div>
        <div v-else-if="dataDialog.type === 'addGroup' || dataDialog.type === 'editGroup'" class="tc">
          <p class="w300 mb10 inline-block tl">分组名称</p>
          <el-input v-model="dataDialog.name" size="mini" class="w300 inline-block" placeholder="请输入分组名称" />
        </div>
        <div v-else class="tc">
          {{ dataDialogCont }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dataDialog.cancelBtn" size="mini" class="w100 btn-item" type="primary" plain @click="dialogVisible = false">{{ dataDialog.cancelBtn }}</el-button>
        <el-button v-if="dataDialog.okBtn" size="mini" class="w100 btn-item mr20" type="primary" @click="submit">{{ dataDialog.okBtn }} <i v-if="tcLoading" class="el-icon-loading" /></el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSystemRoleList,
  addSystemUser,
  editSystemUser,
  systemUserResetPwd,
  addSystemRole,
  editSystemRole,
  deleteRoleById
} from '@/api/role'
export default {
  name: 'BoDialog',
  props: {
    dataDialog: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      tcLoading: false,
      groupList: []
    }
  },
  computed: {
    dataDialogCont() {
      // type: 'createAccount'表示创建账号，'createAccountSucc'表示创建用户成功
      // 'updateAccount'编辑账号，'updateAccountSucc'表示编辑账号成功
      // 'resetPassword'重置密码，'resetPasswordSucc'表示重置密码成功
      // 'stopAccount'表示停用账号，'stopAccountSucc'表示停用账号成功
      // 'openAccount'表示启用账号, 'openAccountSucc'表示启用账号成功
      // 'addGroup'表示新建分组，'editGroup'表示编辑分组，'deleteGroup'表示移除分组, 'deleteGroupSucc'表示移除分组成功
      const thisType = this.dataDialog.type
      const thisKey = this.dataDialog.name
      if (thisType === 'createAccount') {
        // return `账号密码已发送到 ${thisKey} 的邮箱中，请查收。`
      } else if (thisType === 'createAccountSucc') {
        return `账号密码已发送到 ${thisKey} 的邮箱中，请查收。`
      } else if (thisType === 'updateAccount') {
        // return `账号 ${thisKey} 编辑。`
      } else if (thisType === 'updateAccountSucc') {
        return `账号 ${thisKey} 编辑成功。`
      } else if (thisType === 'resetPassword') {
        return `重置账号 ${thisKey} 的密码，是否确认执行此操作？`
      } else if (thisType === 'resetPasswordSucc') {
        return `新密码已经发送到 ${thisKey} 的邮箱中，请查收。`
      } else if (thisType === 'stopAccount') {
        return `账号 ${thisKey} 不能够登录了，是否确认执行此操作？`
      } else if (thisType === 'stopAccountSucc') {
        return `账号 ${thisKey} 已被停用。`
      } else if (thisType === 'openAccount') {
        return `账号 ${thisKey} 能再次登录，并且被放回被停用前所有在的群组中。是否确认此操作？`
      } else if (thisType === 'openAccountSucc') {
        return `账号 ${thisKey} 已启用。`
      } else if (thisType === 'addGroup') {
        // return `账号 ${thisKey} 已被停用。`
      } else if (thisType === 'addGroupSucc') {
        return `分组 ${thisKey} 创建成功`
      } else if (thisType === 'editGroup') {
        // return `账号 ${thisKey} 已被停用。`
      } else if (thisType === 'editGroupSucc') {
        return `分组 ${thisKey} 编辑成功`
      } else if (thisType === 'deleteGroup') {
        return `移除“${thisKey}”群组，是否确认执行此操作？`
      } else if (thisType === 'deleteGroupSucc') {
        return `“${thisKey}”群组已被移除`
      }
      return ''
    }
  },
  mounted() {
    this.getGroupList()
  },
  methods: {
    getGroupList() {
      this.loading = true
      getSystemRoleList().then(response => {
        const { data } = response
        this.groupList = data
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    show() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    submitAfterFun() {
      this.tcLoading = false
      if (this.dataDialog.cbFun) {
        this.$emit('cb', {
          type: this.dataDialog.type,
          name: this.dataDialog.name,
          id: this.dataDialog.id,
          roleIds: this.dataDialog.roleIds,
          title: this.dataDialog.title,
          cbFun: this.dataDialog.cbFun
          // key: this.dataDialog.key
        })
        this.dialogVisible = false
      } else {
        this.dialogVisible = false
      }
    },
    submit() {
      // const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if ((this.dataDialog.type === 'createAccount' || this.dataDialog.type === 'updateAccount') && !reg.test(this.dataDialog.name)) {
        this.$message.error('账号必须是正确的邮箱地址！')
        return false
      }
      if ((this.dataDialog.type === 'createAccount' || this.dataDialog.type === 'updateAccount') && this.dataDialog.roleIds.length === 0) {
        this.$message.error('请选择账号分组！')
        return false
      }
      if ((this.dataDialog.type === 'addGroup' || this.dataDialog.type === 'editGroup') && !this.dataDialog.name) {
        this.$message.error('请输入分组名称！')
        return false
      }
      // ajax.............
      // 新增账号
      if (this.dataDialog.type === 'createAccount') {
        const options = Object.assign({}, {
          status: 0,
          name: this.dataDialog.name,
          roleIds: this.dataDialog.roleIds || []
        })
        this.tcLoading = true
        addSystemUser(options).then(response => {
          if (parseInt(response.code) === 200) {
            this.submitAfterFun()
          }
        }).catch(error => {
          this.tcLoading = false
          console.log(error)
        })
      // 编辑账号 (包含 停用账号/启用账号 )
      // 'updateAccount'编辑账号，'updateAccountSucc'表示编辑账号成功
      // 'stopAccount'表示停用账号，'stopAccountSucc'表示停用账号成功
      // 'openAccount'表示启用账号, 'openAccountSucc'表示启用账号成功
      } else if (this.dataDialog.type === 'updateAccount' || this.dataDialog.type === 'stopAccount' || this.dataDialog.type === 'openAccount') {
        const options = Object.assign({}, {
          status: this.dataDialog.type === 'stopAccount' ? 1 : 0,
          userId: this.dataDialog.id,
          name: this.dataDialog.name,
          roleIds: this.dataDialog.roleIds || []
        })
        this.tcLoading = true
        editSystemUser(options).then(response => {
          if (parseInt(response.code) === 200) {
            this.submitAfterFun()
          }
        }).catch(error => {
          this.tcLoading = false
          console.log(error)
        })
      // 新建分组
      } else if (this.dataDialog.type === 'addGroup') {
        const options = Object.assign({}, {
          name: this.dataDialog.name
        })
        this.tcLoading = true
        addSystemRole(options).then(response => {
          // this.$message.success(`'${this.dataDialog.name}'分组创建成功`)
          if (parseInt(response.code) === 200) {
            this.submitAfterFun()
          }
        }).catch(error => {
          this.tcLoading = false
          console.log(error)
        })
      // 编辑分组
      } else if (this.dataDialog.type === 'editGroup') {
        const options = Object.assign({}, {
          roleId: this.dataDialog.id,
          name: this.dataDialog.name
        })
        this.tcLoading = true
        editSystemRole(options).then(response => {
          if (parseInt(response.code) === 200) {
            this.submitAfterFun()
          }
        }).catch(error => {
          this.tcLoading = false
          console.log(error)
        })
      // 移除分组
      } else if (this.dataDialog.type === 'deleteGroup') {
        const options = Object.assign({}, {
          roleId: this.dataDialog.id
        })
        this.tcLoading = true
        deleteRoleById(options).then(response => {
          if (parseInt(response.code) === 200) {
            this.submitAfterFun()
          }
        }).catch(error => {
          this.tcLoading = false
          console.log(error)
        })
      // 重置密码
      } else if (this.dataDialog.type === 'resetPassword') {
        const options = Object.assign({}, {
          userId: this.dataDialog.id
        })
        this.tcLoading = true
        systemUserResetPwd(options).then(response => {
          if (parseInt(response.code) === 200) {
            this.submitAfterFun()
          }
        }).catch(error => {
          this.tcLoading = false
          console.log(error)
        })
      // 操作成功提示
      } else if (this.dataDialog.type.indexOf('Succ') > 0) {
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-comp {
    padding-right: 120px;
    padding-bottom: 20px;
    color: #fff;
    border-bottom: 1px dashed rgba(151, 151, 151, 1);
    .btn-item {
      margin-left: 0 !important;
    }
  }
</style>
