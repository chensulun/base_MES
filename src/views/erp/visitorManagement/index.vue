<!--  -->
<template>
  <div class="app-container">
    <el-container>
      <el-header class="my-header">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-one">
              <div class="text">
                <span>总在场人数</span>
                <span>100人</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-two">
              <div class="text">
                <span>工作人数</span>
                <span>80人</span>
              </div>
            </div>
          </el-col
          >
          <el-col :span="8">
            <div class="grid-content bg-three">
              <div class="text">
                <span>访客</span>
                <span>20人</span>
              </div>
            </div>
          </el-col
          >
        </el-row>
      </el-header>
      <el-main class="my-main">
        <div class="btnList">
          <el-button v-for="(region,index) in vmRegionOptions" :key="index"
                     class="my-btn"
                     :class="{ activeBtn: checkItem === index }"
                     @click="getRegionDataList(region.dictValue,index)"
          >{{region.dictLabel}}
          </el-button>
        </div>
        <div class="detailList">
          <div class="dataList">
            <!-- 按钮 -->
            <el-button
              class="my-btn"
              :class="{ qdkaction: this.checkTime == 1 }"
              @click="getTodayTime"
            >当日
            </el-button>
            <el-button
              class="my-btn"
              :class="{ qdkaction: this.checkTime == 2 }"
              @click="getThisWeekTime"
            >本周
            </el-button>
            <el-button
              class="my-btn"
              :class="{ qdkaction: this.checkTime == 3 }"
              @click="getThisMonthTime"
            >当月
            </el-button>
            <!-- 选择日期 -->
            <el-date-picker
              class="my-dateRange"
              v-model="date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-button class="my-btn my-sureBtn" @click="getList"
            >确认
            </el-button
            >
          </div>
          <!-- Form表单 -->
          <div class="my-form">
            <el-table :data="visitorManagementList" style="width: 100%" v-loading="loading">
              <el-table-column label="姓名" align="center" prop="vmUserName"/>
              <el-table-column label="工作单位" align="center" prop="vmWorkUnit"/>
              <el-table-column label="拜访对象" align="center" prop="vmVisitingObject"/>
              <el-table-column label="事由" align="center" prop="vmRemark"/>
              <el-table-column label="类型" align="center" prop="vmType" :formatter="vmTypeFormat"/>
              <el-table-column label="进场方式" align="center" prop="vmIntoMode" :formatter="vmIntoModeFormat"/>
              <el-table-column label="随停车牌" align="center" prop="vmCarNo"/>
              <el-table-column label="入场时间" align="center" prop="vmIntoTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.vmIntoTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出场时间" align="center" prop="vmOutTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.vmOutTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="停留时长" align="center" prop="vmResidenceTime"/>
            </el-table>
            <!-- 分页按钮 -->
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import moment from "moment";
  import {listVisitorManagement} from "@/api/erp/visitorManagement";

  export default {
    name: "VisitorManagement",
    data() {
      return {
        // 遮罩层
        loading: false,
        date: [], //时间控件的值
        checkItem: 0, //厂区按钮的样式
        checkTime: 0, //时间按钮的样式
        command: "", //下拉框的值
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          vmUserName: null,
          vmPhone: null,
          vmType: null,
          vmIntoMode: null,
          vmIntoTime: null,
          vmRegion: null,
        },
        visitorManagementList: [],
        // 访客区域字典
        vmRegionOptions: [],
        // 类型字典
        vmTypeOptions: [],
        // 进场方式字典
        vmIntoModeOptions: [],
      };
    },

    created() {
      this.getList();
      this.getDicts("erp_visitor_management_type").then(response => {
        this.vmTypeOptions = response.data;
      });
      this.getDicts("erp_visitor_management_into_mode").then(response => {
        this.vmIntoModeOptions = response.data;
      });
      this.getDicts("erp_visitor_management_region").then(response => {
        this.vmRegionOptions = response.data;
      });

    },
    methods: {
      //获取地区数据
      getRegionDataList(value, index) {
        this.checkItem = index;
        this.queryParams.vmRegion = value;
        this.getList();
      },
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.date && '' != this.date) {
          this.date[0] = moment(this.date[0]).format("YYYY-MM-DD");
          this.date[1] = moment(this.date[1]).format("YYYY-MM-DD");
          this.queryParams.params["beginVmIntoTime"] = this.date[0];
          this.queryParams.params["endVmIntoTime"] = this.date[1];
        }
        listVisitorManagement(this.queryParams).then(response => {
          this.visitorManagementList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 类型字典翻译
      vmTypeFormat(row, column) {
        return this.selectDictLabel(this.vmTypeOptions, row.vmType);
      },
      // 进场方式字典翻译
      vmIntoModeFormat(row, column) {
        return this.selectDictLabel(this.vmIntoModeOptions, row.vmIntoMode);
      },
      // 访客区域字典翻译
      vmRegionFormat(row, column) {
        return this.selectDictLabel(this.vmRegionOptions, row.vmRegion);
      },
      getTodayTime() {
        this.checkTime = 1;
        let date = this.parseTime(new Date(), "{y}-{m}-{d}");
        this.date = [date, date];
        this.getList();
      },
      getThisWeekTime() {
        this.checkTime = 2;
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
        this.checkTime = 3;
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
    },
  };
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
  .app-container {
    background-color: rgb(238, 238, 238);

    .bg-one {
      background-color: rgb(37, 206, 207);
    }

    .bg-two {
      background-color: rgb(79, 191, 232);
    }

    .bg-three {
      background-color: rgb(165, 159, 213);
    }
  }

  .my-header {
    height: 92px !important;
    //   margin-bottom: 20px;
    .grid-content {
      border-radius: 4px;
      height: 92px;
      display: flex;

      .icon {
        width: 80px;
        height: 100%;
        line-height: 34px;
        display: flex;

        img {
          width: 34px;
          height: 34px;
          display: inline-block;
          margin: auto;
          align-items: center;
          justify-content: center;
        }
      }

      .onePxLine {
        width: 1px;
        height: 59px;
        background-color: white;
        margin: auto 0;
      }

      .text {
        color: #fff;
        display: flex;
        flex-direction: row;
        align-items: left;
        justify-content: center;
        margin-left: 20px;
        line-height: 92px;

        > span {
          font-size: 20px;
        }

        > span:last-child {
          margin-left: 20px;
          font-size: 30px;
          font-weight: 600;
        }
      }
    }
  }

  .my-main {
    //   background-color: #fff !important;
    .btnList {
      padding: 20px 30px;
      background-color: #fff;

      > .my-btn {
        margin: 10px 38px 0 0 !important;
        color: rgb(85, 101, 126);
        background-color: rgb(237, 238, 243);
        border: 0;
        border-radius: 0;
        font-size: 16px;

        &.activeBtn {
          background-color: rgb(25, 185, 155);
          color: white;
          font-weight: 700;
        }
      }
    }

    .detailList {
      min-height: 300px;
      background-color: white;

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
          margin-right: 40px !important;
        }
      }

      .my-dropdown {
        border: 1px solid gray;
        padding: 5px;
        color: black;
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
    }
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  // 下面的是啥
  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
