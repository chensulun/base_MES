<!--  -->
<template>
  <div>
    <div class="dataList">
      <!-- 按钮 -->
      <el-button
        class="my-btn"
        :class="{ qdkaction: this.checkItem == 1 }"
        @click="getTodayTime"
        >当日
      </el-button>
      <el-button
        class="my-btn"
        :class="{ qdkaction: this.checkItem == 2 }"
        @click="getThisWeekTime"
        >本周
      </el-button>
      <el-button
        class="my-btn"
        :class="{ qdkaction: this.checkItem == 3 }"
        @click="getThisMonthTime"
        >当月
      </el-button>
      <!-- 选择日期 -->
      <el-date-picker
        class="my-dateRange"
        v-model="date"
        type="daterange"
        range-separator="-"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button class="my-btn my-sureBtn" @click="getList">确认</el-button>
      <el-button class="my-btn my-sureBtn">筛选</el-button>
      <el-button class="my-btn my-sureBtn">下载</el-button>
    </div>
    <!-- Form表单 -->
    <div class="my-form">
      <el-table
        :data="dataList"
        style="width: 100%"
        :cell-style="rowClass"
        :header-cell-style="headClass"
      >
        <el-table-column prop="wllx" label="材料类型"></el-table-column>
        <el-table-column prop="wldw" label="供应商"></el-table-column>
        <el-table-column prop="jz" label="净重"></el-table-column>
      </el-table>
      <!-- 分页按钮 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";

import { ajaxPutLogList } from "@/api/production/jxc";

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      date: [], //时间控件的值
      checkItem: 0,
      total: 0,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        beginDate: null,
        endDate: null,
      },
      dataList: [],
    };
  },

  components: {},

  computed: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      if (null != this.date && "" != this.date) {
        this.date[0] = moment(this.date[0]).format("YYYY-MM-DD");
        this.date[1] = moment(this.date[1]).format("YYYY-MM-DD");
        this.queryParams.beginDate = this.date[0];
        this.queryParams.endDate = this.date[1];
      }
      ajaxPutLogList(this.queryParams).then((response) => {
        this.dataList = response.list;
        this.total = response.num;
        this.loading = false;
      });
    },
    getTodayTime() {
      this.checkItem = 1;
      let date = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.date = [date, date];
      this.getList();
    },
    getThisWeekTime() {
      this.checkItem = 2;
      const startDate = moment()
        .week(moment().week())
        .startOf("week")
        .format("YYYY-MM-DD");
      const endDate = moment()
        .week(moment().week())
        .endOf("week")
        .format("YYYY-MM-DD");
      this.date = [startDate, endDate];
      this.getList();
    },
    getThisMonthTime() {
      this.checkItem = 3;
      const startDate = moment()
        .month(moment().month())
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = moment()
        .month(moment().month())
        .endOf("month")
        .format("YYYY-MM-DD");
      this.date = [startDate, endDate];
      this.getList();
    },
    // 确认时间
    sureDate() {
      console.log(this.date);
    },
    // 表头样式设置
    headClass() {
      return "text-align: center;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.dataList {
  padding: 20px 30px;
  display: flex;
  flex-wrap: wrap;
  // align-items: center;
  .my-btn {
    width: 60px;
    // height: 28px;
    height: 36px;
    margin: 0 !important;
    margin-right: 20px !important;
    font-size: 14px;
    background-color: #fff;
    font-weight: 400;
    color: #888888;
    border: 1px solid #e6e6e6;
    font-weight: 400;
    text-align: center;
    padding: 0;

    //
    &.qdkaction::before {
      content: "";
      width: 3px;
      height: 8px;
      position: absolute;
      right: 4px;
      bottom: 2px;
      border: 1px solid #fff;
      border-top-color: transparent;
      border-left-color: transparent;
      transform: rotate(36deg);
      z-index: 2;
    }

    &.qdkaction {
      position: relative;
    }

    &.qdkaction::after {
      content: "";
      display: block;
      height: 0px;
      width: 0px;
      position: absolute;
      bottom: 0;
      right: 0;
      color: #fff;
      /**对号大小*/
      font-size: 10px;
      line-height: 8px;
      border: 10px solid;
      border-color: transparent #19b99b #19b99b transparent;
    }
  }

  .my-dateRange {
    // height: 28px;
    margin-right: 14px !important;
  }

  .my-sureBtn {
    // height: 28px;
    border-radius: 17px;
    background-color: #1ab99b;
    color: white;
    margin-right: 20px !important;
  }
}

.my-form {
  padding: 0 30px;

  .my-btnGroup {
    position: relative;

    .my-btnGroupItem {
      position: absolute;
      margin-top: 10px;
      right: 0;
    }
  }
}
</style>
