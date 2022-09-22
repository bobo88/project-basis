<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-openeds="['/user-analysis','/management-function']"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routesPerms" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      // menuPerms: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    menuPerms() {
      // console.log(123456, this.$localStore.get('menuPerms'), 99)
      return this.$localStore.get('menuPerms') || []
    },
    permission_routesPerms() {
      /**
       * 1.整体概览权限字符串：
       * dashboard:overview:list,2.用户分析对应权限字符串：user:analysis:list,3.留存分析对应权
        限字符串：user:remain:list,4.后台功能对应权限字符串：system:back:edit
        综合概览: Dashboard  ---- dashboard:overview:list
        用户分析: UserAnalysis  ---- user:analysis:list
        留存分析: RetentionAnalysis   ---- user:remain:list
        后台功能: ManagementFunction  ---- system:back:edit
       */
      const rtn = this.permission_routes.map(i => {
        if (i.name === 'Dashboard' && !this.menuPerms.includes('dashboard:overview:list')) {
          this.$set(i, 'status', 'ishide')
        }
        if (i.name === 'UserAnalysis' && !this.menuPerms.includes('user:analysis:list')) {
          this.$set(i, 'status', 'ishide')
        }
        if (i.name === 'RetentionAnalysis' && !this.menuPerms.includes('user:remain:list')) {
          this.$set(i, 'status', 'ishide')
        }
        if (i.name === 'ManagementFunction' && !this.menuPerms.includes('system:back:edit')) {
          this.$set(i, 'status', 'ishide')
        }
        return i
      })
      // console.log(588, this.permission_routes, rtn.filter(i => i.status !== 'ishide'))
      return rtn.filter(i => i.status !== 'ishide')
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    // this.menuPerms = this.$localStore.get('menuPerms') || []
    // console.log(888, this.menuPerms)
    // console.log(999, this.permission_routes)
  }
}
</script>
