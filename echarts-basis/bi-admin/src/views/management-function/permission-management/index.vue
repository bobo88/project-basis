<template>
  <div class="dashboard-editor-container">

    <div class="chart-wrapper" style="margin-bottom: 10px;">
      <el-row :gutter="10" class="mb30">
        <el-col :xs="8" :sm="8" :md="8" :lg="8">
          <p class="chart-tit">权限管理</p>
        </el-col>
      </el-row>

      <div class="table-box">
        <el-table
          v-loading="loading"
          class="customize-table not-hidden"
          align="center"
          size="small"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            align="center"
            prop="roleName"
            label="群组"
          />
          <el-table-column
            align="center"
            label="综合概览"
          >
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.roleName === '管理员'" class="disable-btn">{{ options1Format(scope.row.overview) }}</span>
                <div v-else class="pr">
                  <a v-if="!scope.row.overviewStatus" href="javascript:;" @click="changePermission(1, scope.row)">{{ options1Format(scope.row.overview) }}</a>
                  <div v-else class="change-perm-box">
                    <i class="el-icon-arrow-down" @click="closeChangePerBox(scope.$index, 1, scope.row)" />
                    <el-radio-group v-model="scope.row.overview">
                      <el-radio
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.value"
                        class="mb20"
                      >
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <!-- <el-select v-model="scope.row.overview" size="mini" class="customize-select w120" placeholder="请选择" @change="changPerms(scope.$index, scope.row, 1)">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户分析"
          >
            <template slot-scope="scope">
              <div class="pr">
                <span v-if="scope.row.roleName === '管理员'" class="disable-btn">{{ options2Format(scope.row.userAnalysis) }}</span>
                <div v-else class="pr">
                  <a v-if="!scope.row.userAnalysisStatus" href="javascript:;" @click="changePermission(2, scope.row)">{{ options2Format(scope.row.userAnalysis) }}</a>
                  <div v-else class="change-perm-box">
                    <i class="el-icon-arrow-down" @click="closeChangePerBox(scope.$index, 2, scope.row)" />
                    <el-radio-group v-model="scope.row.userAnalysis">
                      <el-radio
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.value"
                        class="mb20"
                      >
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="留存分析"
          >
            <template slot-scope="scope">
              <div class="pr">
                <span v-if="scope.row.roleName === '管理员'" class="disable-btn">{{ options3Format(scope.row.remainAnalysis) }}</span>
                <div v-else class="pr">
                  <a v-if="!scope.row.remainAnalysisStatus" href="javascript:;" @click="changePermission(3, scope.row)">{{ options3Format(scope.row.remainAnalysis) }}</a>
                  <div v-else class="change-perm-box">
                    <i class="el-icon-arrow-down" @click="closeChangePerBox(scope.$index, 3, scope.row)" />
                    <el-radio-group v-model="scope.row.remainAnalysis">
                      <el-radio
                        v-for="item in options3"
                        :key="item.value"
                        :label="item.value"
                        class="mb20"
                      >
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="后台功能"
          >
            <template slot-scope="scope">
              <div class="pr">
                <span v-if="scope.row.roleName === '管理员'" class="disable-btn">{{ options4Format(scope.row.background) }}</span>
                <div v-else class="pr">
                  <a v-if="!scope.row.backgroundStatus" href="javascript:;" @click="changePermission(4, scope.row)">{{ options4Format(scope.row.background) }}</a>
                  <div v-else class="change-perm-box">
                    <i class="el-icon-arrow-down" @click="closeChangePerBox(scope.$index, 4, scope.row)" />
                    <el-radio-group v-model="scope.row.background">
                      <el-radio
                        v-for="item in options4"
                        :key="item.value"
                        :label="item.value"
                        class="mb20"
                      >
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSystemRoleListRolePerms,
  editSystemRole
} from '@/api/role'
export default {
  name: 'PermissionsManagement',
  data() {
    return {
      loading: false,
      isChangeStatus: false,
      options1: [{
        value: 1,
        label: '查看'
      }, {
        value: null,
        label: '不能查看'
      }],
      options2: [{
        value: 2,
        label: '查看'
      }, {
        value: null,
        label: '不能查看'
      }],
      options3: [{
        value: 3,
        label: '查看'
      }, {
        value: null,
        label: '不能查看'
      }],
      options4: [{
        value: null,
        label: '不能查看'
      }, {
        value: 4,
        label: '修改'
      }],
      value: '',
      tableData: []
    }
  },
  computed: {
    options1Format() {
      return function(key) {
        return this.options1.filter(i => i.value === key)[0].label
      }
    },
    options2Format() {
      return function(key) {
        return this.options2.filter(i => i.value === key)[0].label
      }
    },
    options3Format() {
      return function(key) {
        return this.options3.filter(i => i.value === key)[0].label
      }
    },
    options4Format() {
      return function(key) {
        return this.options4.filter(i => i.value === key)[0].label
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    changePermission(key, item) {
      console.log(key, item, this.isChangeStatus)
      if (this.isChangeStatus) {
        return
      }
      if (key === 1) {
        item.overviewStatus = true
      } else if (key === 2) {
        item.userAnalysisStatus = true
      } else if (key === 3) {
        item.remainAnalysisStatus = true
      } else if (key === 4) {
        item.backgroundStatus = true
      }
      this.isChangeStatus = true
    },
    closeChangePerBox(index, key, item) {
      if (key === 1) {
        item.overviewStatus = false
      } else if (key === 2) {
        item.userAnalysisStatus = false
      } else if (key === 3) {
        item.remainAnalysisStatus = false
      } else if (key === 4) {
        item.backgroundStatus = false
      }
      this.isChangeStatus = false
      this.changPerms(index, item)
    },
    getDataList() {
      this.loading = true
      getSystemRoleListRolePerms().then(response => {
        const { data } = response
        this.tableData = data.map(i => {
          this.$set(i, 'overviewStatus', false)
          this.$set(i, 'userAnalysisStatus', false)
          this.$set(i, 'remainAnalysisStatus', false)
          this.$set(i, 'backgroundStatus', false)
          return i
        })
        this.loading = false
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    changPerms(index, item, key) {
      console.log(index, item, key)
      const _menuIds = []
      item.overview ? _menuIds.push(item.overview) : ''
      item.userAnalysis ? _menuIds.push(item.userAnalysis) : ''
      item.remainAnalysis ? _menuIds.push(item.remainAnalysis) : ''
      item.background ? _menuIds.push(item.background) : ''
      const options = {
        roleId: item.roleId,
        menuIds: _menuIds
      }
      this.loading = true
      editSystemRole(options).then(response => {
        // const { data } = response
        this.$message.success('权限修改成功！')
        this.loading = false
      }).catch(error => {
        this.$message.error('权限修改发生异常！')
        this.loading = false
        console.log(error)
      })
    },
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
    padding-bottom: 100px;
    border: 1px solid rgba(32, 107, 255, 1);
    border-radius: 8px;
    overflow: hidden;
  }
}
.disable-btn {
  color: rgba(255, 255, 255, 0.4);
}
.change-perm-box {
  position: absolute;
  z-index: 9;
  top: -10px;
  left: 50%;
  margin-left: -72px;
  padding: 20px 16px;
  width: 144px;
  height: 100px;
  background: #020F43;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}
</style>

