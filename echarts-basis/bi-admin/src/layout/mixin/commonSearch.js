import Search from '@/components/common/search'
import Compare from '@/components/common/compare'
import {
  commonConfigChannel,
  commonConfigCountry,
  commonConfigVersion
} from '@/api/dashboard'

export default {
  name: 'commonSearch',
  components: {
    Search,
    Compare
  },
  data() {
    return {
      exportStatus: false,
      dataOptions: {
        // 品牌(数组类型)
        brand: 'ALL',
        // 渠道(数组类型)
        channel: 'ALL',
        // 版本(数组类型)
        clientVersionCode: 'ALL',
        // 国家(数组类型)
        country: 'ALL',
        // dateType: 日期类型（日使用D，周使用w，月使用M）
        dateType: 'D',
        // dimCompare: 维度对比框使用，对应选择维度，共有（渠道=channel，版本=clientVersionCode，国家=country，
        // 平台=platform,是否回填=isBackfill，品牌=brand，
        // 留存类型=remainType，启动方式=firstStartupMode，启动渠道=firstStartupChannel，
        // 网络状态=netType，流量来源=trafficSource）
        // dimCompare: '',
        // dtFrom: 开始日期(包含), 格式yyyy-MM-dd
        dtFrom: '',
        // 结束日期(不包含), 格式yyyy-MM-dd
        dtTo: '',
        // 首次启动渠道(数组类型)
        firstStartupChannel: 'ALL',
        // 首次启动方式(数组类型)
        firstStartupMode: 'ALL',
        // 回填前用0,回填后用1，非字符串
        isBackfill: 0,
        // 网络状态(数组类型)
        netType: 'ALL',
        // 平台(数组类型)
        platform: 'ALL',
        // // 留存用户数展示比例或用户数类型(比率用per，用户数cnt)
        // remainShowType: 'ALL',
        // // 留存流量类型,remain_compare接口和导出数据接口使用，用于页
        // // 面点击类型时使用（如新增用户=remain_new_user，活跃用户=re
        // // main_active_user，老用户=remain_old_user）
        // remainUserType: 'ALL',
        // 留存类型（总留存，主动留存，被动留存）
        remainType: 'ALL',
        // 流量来源,取值:自然流量/非自然流量(数组类型)
        trafficSource: 'ALL',
        osVersion: 'ALL'
      },
      dataSearch: {
        // 品牌(数组类型)
        brand: '',
        brandMultiple: '',
        // 渠道(数组类型)
        channel: '',
        channelMultiple: '',
        // 版本(数组类型)
        clientVersionCode: '',
        clientVersionCodeMultiple: '',
        // 国家(数组类型)
        country: '',
        countryMultiple: '',
        // dateType: 日期类型（日使用D，周使用w，月使用M）
        dateType: 'D',
        // dimCompare: 维度对比框使用，对应选择维度，共有（渠道=channel，版本=clientVersionCode，国家=country，
        // 平台=platform,是否回填=isBackfill，品牌=brand，
        // 留存类型=remainType，启动方式=firstStartupMode，启动渠道=firstStartupChannel，
        // 网络状态=netType，流量来源=trafficSource）
        dimCompare: '',
        // dtFrom: 开始日期(包含), 格式yyyy-MM-dd
        dtFrom: '',
        // 结束日期(不包含), 格式yyyy-MM-dd
        dtTo: '',
        // 首次启动渠道(数组类型)
        firstStartupChannel: '',
        firstStartupChannelMultiple: '',
        // 首次启动方式(数组类型)
        firstStartupMode: '',
        firstStartupModeMultiple: '',
        // 回填前用0,回填后用1，非字符串
        isBackfill: 0,
        isBackfillMultiple: 0,
        // 网络状态(数组类型)
        netType: '',
        netTypeMultiple: '',
        // 平台(数组类型)
        platform: '',
        platformMultiple: '',
        // 留存用户数展示比例或用户数类型(比率用per，用户数cnt)
        remainShowType: '',
        // 留存类型（总留存，主动留存，被动留存）
        remainType: '',
        remainTypeMultiple: '',
        // 流量来源,取值:自然流量/非自然流量(数组类型)
        trafficSource: '',
        trafficSourceMultiple: '',
        // 系统版本
        osVersion: ''
      },
      searchCondition: {
        // 品牌(数组类型)
        brandList: [],
        // 渠道(数组类型)
        channelList: [],
        // 版本(数组类型)
        clientVersionCodeList: [],
        osVersionList: [],
        // 国家(数组类型)
        countryList: [],
        // 首次启动渠道(数组类型)
        firstStartupChannelList: [],
        // 首次启动方式(数组类型)
        firstStartupModeList: [],
        // 回填前用0,回填后用1，非字符串
        isBackfillList: [
          {
            key: 0,
            value: '回填前'
          },
          {
            key: 1,
            value: '回填后'
          }
        ],
        // 网络状态(数组类型)
        netTypeList: [],
        // 平台(数组类型)
        platformList: [
          {
            key: 'android',
            value: 'android'
          },
          {
            key: 'ios',
            value: 'ios'
          }
        ],
        // 留存类型（总留存，主动留存，被动留存）(数组类型)
        remainTypeList: [
          {
            key: '总留存',
            value: 'ALL'
          },
          {
            key: '主动留存',
            value: '主动留存'
          },
          {
            key: '被动留存',
            value: '被动留存'
          }
        ],
        // 流量来源,取值:自然流量/非自然流量(数组类型)
        trafficSourceList: []
      }
    }
  },
  watch: {
    // 监听搜索条件的变化
    dataSearch: {
      handler(val) {
        // platform channel country
        let _channel = ''
        let _country = ''
        let _platform = ''
        if (!this.dataSearch.channel || (this.dataSearch.channel && this.dataSearch.channel.length === 0)) {
          _channel = 'ALL'
        } else {
          _channel = this.dataSearch.channel
        }
        if (!this.dataSearch.country || (this.dataSearch.country && this.dataSearch.country.length === 0)) {
          _country = 'ALL'
        } else {
          _country = this.dataSearch.country
        }
        if (!this.dataSearch.platform || (this.dataSearch.platform && this.dataSearch.platform.length === 0)) {
          _platform = 'ALL'
        } else {
          _platform = this.dataSearch.platform
        }
        this.dataOptions = Object.assign({}, {
          brand: this.dataSearch.brand || 'ALL',
          channel: _channel,
          clientVersionCode: this.dataSearch.clientVersionCode || 'ALL',
          country: _country,
          dateType: this.dataSearch.dateType || 'D',
          // dimCompare: this.dataSearch.dimCompare || '',
          dtFrom: this.dataSearch.dtFrom || '',
          dtTo: this.dataSearch.dtTo || '',
          firstStartupChannel: this.dataSearch.firstStartupChannel || 'ALL',
          firstStartupMode: this.dataSearch.firstStartupMode || 'ALL',
          isBackfill: +this.dataSearch.isBackfill,
          netType: this.dataSearch.netType || 'ALL',
          platform: _platform,
          remainType: this.dataSearch.remainType || 'ALL',
          trafficSource: this.dataSearch.trafficSource || 'ALL',
          osVersion: this.dataSearch.osVersion || 'ALL'
        })
        console.log(888, this.dataOptions)
      },
      deep: true
    }
  },
  created() {
    this.authorityObj = this.authorityArr[0]
  },
  mounted() {
    this.$nextTick(() => {
      // 通用搜索
      this.getChannelListData()
      this.getCountryListData()
      this.getVersionListData()
      this.init()
    })
  },
  methods: {
    cbSearch(options) {
      if (options && options.isGroup) {
        this.$set(this.dataOptions, 'dimCompare', this.dataSearch.dimCompare)
      }
      console.log(688, options, this.dataOptions)
      this.init(options)
    },
    // 获取通用配置的搜索条件 - 渠道/国家/版本
    getChannelListData() {
      commonConfigChannel().then(response => {
        const { data } = response
        console.log('获取 channelList: ', data)
        this.searchCondition.channelList = data
      }).catch(error => {
        console.log(error)
      })
    },
    getCountryListData() {
      commonConfigCountry().then(response => {
        const { data } = response
        console.log('获取 countryList: ', data)
        this.searchCondition.countryList = data
      }).catch(error => {
        console.log(error)
      })
    },
    getVersionListData() {
      commonConfigVersion().then(response => {
        const { data } = response
        console.log('获取 clientVersionCodeList: ', data)
        this.searchCondition.clientVersionCodeList = data
      }).catch(error => {
        console.log(error)
      })
    },
    handleClick() {
      // 设置搜索条件的权限
      this.dataSearch.dateType = 'D'
      this.dataSearch.dimCompare = ''
      this.$nextTick(() => {
        this.authorityObj = this.authorityArr[+this.activeName]
        this.init()
      })
    },
    changeGroup(key) {
      if (!this.authorityObj.sDate.includes(key)) {
        return false
      }
      this.dataSearch.dateType = key
    }
  }
}
