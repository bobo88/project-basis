<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-select v-model="currentProject" class="inline-block vt diy-select" size="mini" placeholder="请选择" @change="changeProject">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      </template>

      <!-- 多语言： -->
      <!-- <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
        <div>
          <i class="el-icon-s-tools"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="language==='zh'" command="zh">
            中文
          </el-dropdown-item>
          <el-dropdown-item :disabled="language==='en'" command="en">
            English
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span class="f14 mr10 ml20">{{ userPerms }}</span>
          <i class="el-icon-user user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
    // SizeSelect,
    // Search
  },
  data() {
    return {
      language: '',
      // VAPP, VAPP_LITE, ALL, VS_App
      options: [
        {
          value: 'VAPP',
          label: 'VAPP'
        }, {
          value: 'VAPP_LITE',
          label: 'VAPP_LITE'
        }, {
          value: 'VS_App',
          label: 'VS_App'
        }
      ],
      currentProject: 'VAPP'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    userPerms() {
      return this.$localStore.get('userPerms') || {}
    }
  },
  mounted() {
    if (localStorage.getItem('project')) {
      this.currentProject = localStorage.getItem('project') || 'VAPP'
    } else {
      localStorage.setItem('project', 'VAPP')
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      localStorage.setItem('language', lang)
    },
    changeProject() {
      localStorage.setItem('project', this.currentProject)
      this.$nextTick(() => {
        setTimeout(() => {
          location.reload()
        }, 200)
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // store.commit('SET_TOKEN', response.headers['x-auth-token'])
      // // console.log(3456, store)
      // setToken(response.headers['x-auth-token'])
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  margin-left: 2px;
  height: 50px;
  overflow: hidden;
  position: relative;
  color: #fff;
  background: #040f51;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          display: inline-block;
          cursor: pointer;
          border-radius: 10px;
          vertical-align: middle;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #fff;;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
