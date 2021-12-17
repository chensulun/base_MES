<!--  -->
<template>
  <div>
    <!-- F1 -->
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
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button class="my-btn my-sureBtn" @click="getList">确认</el-button>
      <!-- 选择榜单类型 -->
      <div>
        <span style="margin-right: 10px; line-height: 34px">榜单类型</span>
        <el-select
          v-model="queryParams.type"
          @change="getList"
          size="mini"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- F2 -->
    <!-- Form表单 -->
    <div class="my-form">
      <el-table :data="dataList" style="width: 100%" v-loading="loading">
        <el-table-column
          prop="gbbh"
          align="center"
          label="磅单号"
          show-tooltip-when-overflow="true"
        ></el-table-column>
        <el-table-column
          prop="ccsj"
          align="center"
          label="出场时间"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="jcsj"
          align="center"
          label="进场时间"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="jz"
          align="center"
          label="净重（吨）"
          width="85px"
        ></el-table-column>
        <el-table-column
          prop="wllx"
          align="center"
          label="物料名称"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="materialLocation"
          align="center"
          label="物料位置"
        ></el-table-column>
        <el-table-column
          prop="cph"
          align="center"
          label="车牌号"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="gcmc"
          align="center"
          label="工程名称"
          show-tooltip-when-overflow="true"
        ></el-table-column>
        <el-table-column
          prop="wldw"
          align="center"
          show-overflow-tooltip="true"
          label="物料单位"
        ></el-table-column>
        <!--        <el-table-column prop="productionPlant"  align="center" label="生产工厂">
                </el-table-column>
                <el-table-column prop="weighingEquipment" align="center"  label="过磅设备">
                </el-table-column>
                <el-table-column prop="weighingMethod" align="center" label="过磅方式">
                </el-table-column>-->
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="seePic(scope.row)"
              size="small"
              type="primary"
            >
              查看图片
            </el-button>
          </template>
        </el-table-column>
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
    <el-dialog title="查看" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false">
      <el-row :gutter="1">
        <el-col :span="12" v-for="(item,index) in imgUrlList">
          <el-image  :key="item" :src="item" :preview-src-list="imgUrlList" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import moment from "moment";
  import {list} from "@/api/production/jxc";
  import {img} from "@/api/manage/weighRecord";
  import {getPrId} from "@/utils/station";

  export default {
    data() {
      return {
        // 遮罩层
        loading: false,
        date: [], //时间控件的值
        checkItem: 0, //时间按钮的样式
        command: "", //下拉框的值
        total: 0,
        // 查询参数
        queryParams: {
          page: 1,
          pageSize: 10,
          beginDate: null,
          endDate: null,
          type: null,
        },
        options: [
          {
            value: "销售发货",
            label: "销售发货",
          },
          {
            value: "采购收货",
            label: "采购收货",
          },
          {
            value: "作废",
            label: "作废",
          },
        ],
        dataList: [],
        //弹框显示
        dialogVisible: false,
        imgUrlList: []
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
          // console.log(this.queryParams);
        }
        list(this.queryParams).then((response) => {
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
      //下拉框的值
      handleCommand(command) {
        this.command = command;
      },
      seePic(row) {
        this.imgUrlList = [];
        this.dialogVisible = true;
        //row.gbbh
        img(getPrId(), row.gbbh).then((response) => {
          if (response.data) {
            let data = response.data;
            if (data.imgUrl) {
              this.imgUrlList.push(process.env.VUE_APP_BASE_API + data.imgUrl);
            }
            if (data.imgUrl1) {
              this.imgUrlList.push(process.env.VUE_APP_BASE_API + data.imgUrl1);
            }
            if (data.imgUrl2) {
              this.imgUrlList.push(process.env.VUE_APP_BASE_API + data.imgUrl2);
            }
          }
        });
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
</style>
