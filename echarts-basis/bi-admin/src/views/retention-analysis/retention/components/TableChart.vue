<template>
  <div class="table-chart" style="width:100%; max-height: 510px;">
    <el-scrollbar style="width:100%;height:100%;">
      <el-row :gutter="0" class="mb10" style="width:100%;">
        <el-col :xs="20" :sm="20" :md="20" :lg="20">
          <el-table
            class="retention-table"
            :data="dataTable"
            max-height="490"
            border
            style="width: 100%;"
          >
            <el-table-column label="日期" prop="ds" width="100" align="center" />
            <el-table-column v-for="(item, index) in daysItems" :key="item" align="center">
              <!-- 自定义表头 -->
              <template slot="header" slot-scope="scope">
                <p class="t-t">
                  第
                  <span v-if="dataGroup === 'D'" class="inline-block tc">
                    {{ item }}天
                  </span>
                  <span v-else-if="dataGroup === 'W'" class="inline-block tc">
                    <span v-if="item === 14">8</span>
                    <span v-else-if="item === 30">9</span>
                    <span v-else-if="item === 31">10</span>
                    <span v-else-if="item === 40">11</span>
                    <span v-else-if="item === 50">12</span>
                    <span v-else>{{ item }}</span>周
                  </span>
                  <span v-else class="inline-block tc">
                    <span v-if="item === 14">8</span>
                    <span v-else-if="item === 30">9</span>
                    <span v-else-if="item === 31">10</span>
                    <span v-else-if="item === 40">11</span>
                    <span v-else-if="item === 50">12</span>
                    <span v-else>{{ item }}</span>月
                  </span>
                </p>
                <!-- // 留存用户数展示比例或用户数类型(比率用per，用户数cnt) -->
                <p v-if="dataRange" class="t-t">{{ dataType === 'per' ? (dataRange['avg' + item]*100).toFixed(2) + '%' : parseInt(dataRange['avg' + item] || 0) }}</p>
              </template>
              <!-- 自定义内容 -->
              <template slot-scope="scope">
                <div v-if="index === 0" class="item-box">
                  <p class="list-item" style="background: #003DB4">
                    {{ parseInt(scope.row.rlist[index]) ? (dataType === 'per' ? parseInt(scope.row.rlist[index])/100 : parseInt(scope.row.rlist[index])) : '' }}
                  </p>
                </div>
                <div v-else class="item-box" :style="scope.row.rlist[index] === null ? 'border:none' : ''" :class="range(parseInt(scope.row.rlist[index])) > 3 ? 'grey' : ''">
                  <p class="list-item" :style="{'background': scope.row.rlist[index] === null ? 'none' : bgColorItems[range(parseInt(scope.row.rlist[index]))].bgcolor}">
                    {{ scope.row.rlist[index] !== null ? scope.row.rlist[index] : '' }}
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- ************** 自定义表格 ******************** -->
          <!-- <table style="width:100%;" class="table-cont">
            <tr class="thead-box">
              <th>&nbsp;</th>
              <th v-for="(item, index) in daysItems" :key="index">
                <p class="t-t">
                  第<span class="inline-block tc" style="width:18px">{{ item }}</span>
                  <span v-if="dataGroup === 'D'">天</span>
                  <span v-else-if="dataGroup === 'W'">周</span>
                  <span v-else>月</span>
                </p>
                <p v-if="dataRange" class="t-t">{{ dataType === 'per' ? (dataRange['avg' + item]*100).toFixed(2) + '%' : parseInt(dataRange['avg' + item] || 0) }}</p>
              </th>
            </tr>
            <tr v-for="(item, index) in dataTable" :key="index">
              <td>
                <p class="t-t">{{ item.ds }}</p>
              </td>
              <td v-for="(listItem, i) in item.rlist" :key="i" :style="listItem === 0 ? 'border:none' : ''" :class="range(parseInt(listItem)) > 5 ? 'grey' : ''">
                <p class="list-item" :style="{'background': listItem === 0 ? 'none' : bgColorItems[range(parseInt(listItem))].bgcolor}">{{ listItem ? listItem : '' }}</p>
              </td>
            </tr>
          </table> -->
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" class="tr pt10 fr">
          <div v-show="dataType === 'per'" class="bgcolor-item-box">
            <p v-for="(item, index) in bgColorItems" :key="index" class="bgcolor-item">
              <span class="color-item" :style="{'background': item.bgcolor}" />
              <span v-if="!item.val" class="interval">[{{ item.min }}%,{{ item.max }}%)</span>
              <span v-else class="interval">{{ item.val }}%</span>
            </p>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import resize from './mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    dataType: {
      type: String,
      required: true
    },
    dataGroup: {
      type: String,
      required: true
    },
    dataRange: {
      type: Object,
      required: true
    },
    dataTable: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      daysItems: [0, 1, 2, 3, 4, 5, 6, 7, 14, 30, 31, 40, 50],
      tableListData: [],
      bgColorItems: [
        {
          bgcolor: '#003DB4',
          val: 100
        },
        {
          bgcolor: '#014CDF',
          min: 55,
          max: 100
        },
        {
          bgcolor: '#0B5EE2',
          min: 45,
          max: 55
        },
        {
          bgcolor: '#1C7CE8',
          min: 35,
          max: 45
        },
        {
          bgcolor: '#2C97ED',
          min: 25,
          max: 35
        },
        {
          bgcolor: '#3DB6F3',
          min: 15,
          max: 25
        },
        {
          bgcolor: '#4FD4F9',
          min: 10,
          max: 15
        },
        {
          bgcolor: '#60F3FE',
          min: 0,
          max: 10
        }
      ]
    }
  },
  mounted() {},
  methods: {
    range(val) {
      let rtnIndex = 0
      this.bgColorItems.filter((i, index) => {
        if (+val === 100) {
          rtnIndex = 0
          return
        }
        if ((val > i.min || val === i.min) && (val < i.max)) {
          rtnIndex = index
          return
        }
      })
      return rtnIndex
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-cont {
    td {
      border-radius: 3px;
      overflow: hidden;
      font-size: 14px;
    }
    .t-t {
      // margin-bottom: 5px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
      line-height: 20px;
      text-align: center;
    }
    .grey {
      .list-item {
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .list-item {
      // width: 110px;
      height: 40px;
      line-height: 40px;
      // border: 1px solid #00062D;
      color: rgba(255, 255, 255, 0.7);
      background: #00062D;
      text-align: center;
    }
  }
  .bgcolor-item-box {
    padding-right: 30px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
    .bgcolor-item {
      margin-bottom: 16px;
      .color-item {
        margin-right: 4px;
        display: inline-block;
        width: 15px;
        height: 8px;
        border-radius: 2px;
      }
      .interval {
        display: inline-block;
        width: 55px;
        text-align: left;
      }
    }
  }
</style>
