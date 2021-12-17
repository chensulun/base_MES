<!--  -->
<template>
  <div class="app-container">
    <el-container>
      <el-header class="my-header">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-one">
              <div class="text">
                <span>在场车辆总数</span>
                <span>100辆</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6"
          >
            <div class="grid-content bg-two">
              <div class="text">
                <span>在场员工车数</span>
                <span>80辆</span>
              </div>
            </div>
          </el-col
          >
          <el-col :span="6"
          >
            <div class="grid-content bg-three">
              <div class="text">
                <span>在场访客车数</span>
                <span>15辆</span>
              </div>
            </div>
          </el-col
          >
          <el-col :span="6"
          >
            <div class="grid-content bg-three">
              <div class="text">
                <span>入口区</span>
                <span>5辆</span>
              </div>
            </div>
          </el-col
          >
        </el-row>
      </el-header>
      <el-main class="my-main">
        <div class="btnList">
          <el-button v-for="(region,index) in vamRegionOptions" :key="index"
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
            <div style="margin-right: 20px">
              <span style="margin-right: 10px; line-height: 34px">类型</span>
              <el-select v-model="queryParams.vamType" placeholder="请选择类型" @change="getList" clearable size="small">
                <el-option
                  v-for="dict in vamTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </div>
            <el-button class="my-btn my-sureBtn" @click="whiteName"
            >白名单
            </el-button
            >
          </div>
          <!-- Form表单 -->
          <div class="my-form">
            <el-table :data="vehicleAccessManagementList" style="width: 100%" v-loading="loading">
              <el-table-column label="车牌号" align="center" prop="vamCarNo"/>
              <el-table-column label="类型" align="center" prop="vamType" :formatter="vamTypeFormat"/>
              <el-table-column label="所属单位" align="center" prop="vamAffiliatedUnit"/>
              <el-table-column label="进场时间" align="center" prop="vamIntoTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.vamIntoTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出厂时间" align="center" prop="vamOutTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.vamOutTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
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
    <!-- 弹框1 -->
    <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-row :gutter="1">
        <!-- <el-col :span="12" v-for="(item, index) in imgUrlList" :key="index">
          <el-image :key="item" :src="item" :preview-src-list="imgUrlList" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col> -->
      </el-row>
    </el-dialog>
    <!-- 弹框2 -->
    <el-dialog
      title="白名单"
      :visible.sync="whiteNameVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-row :gutter="1">
        <el-col :span="24">
          <el-form label-width="80px" :model="whiteNameForm">
            <el-form-item label="车牌号">
              <el-input v-model="whiteNameForm.vwlCarNo"></el-input>
            </el-form-item>
            <el-form-item label="驾驶员">
              <el-input v-model="whiteNameForm.vwlDriver"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="whiteNameForm.vwlPhone"></el-input>
            </el-form-item>
            <el-form-item label="所属单位">
              <el-input v-model="whiteNameForm.vwlAffiliatedUnit"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-radio-group v-model="whiteNameForm.vwlType">
                <el-radio
                  v-for="dict in vwlTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>

          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from "moment";
  import {listVehicleAccessManagement} from "@/api/erp/vehicleAccessManagement";
  import { listVehicleWhiteLst, getVehicleWhiteLst, delVehicleWhiteLst, addVehicleWhiteLst, updateVehicleWhiteLst, exportVehicleWhiteLst } from "@/api/erp/vehicleWhiteLst";

  export default {
    name: "VehicleAccessManagement",

    data() {
      return {
        // 遮罩层
        loading: false,
        date: [], //时间控件的值
        checkItem: 0, //厂区按钮的样式
        checkTime: 0, //时间按钮的样式
        command: "", //下拉框的值
        total: 0,
        imgUrlList: [],
        options: [
          {
            value: "蓝牌",
            label: "蓝牌",
          },
          {
            value: "黄牌",
            label: "黄牌",
          },
          {
            value: "绿牌",
            label: "绿牌",
          },
        ],
        dialogVisible: false, //弹框1
        whiteNameVisible: false, //弹框2
        whiteNameForm: {},
        radio: [],
        vehicleAccessManagementList: [],
        // 类型字典
        vamTypeOptions: [],
        // 进场时间时间范围
        daterangeVamIntoTime: [],
        // 区域字典
        vamRegionOptions: [],
        // 白名单类型(员工 )字典
        vwlTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          vamCarNo: null,
          vamType: null,
          vamIntoTime: null,
          vamRegion: null,
        },
      };
    },

    created() {
      this.getList();
      this.getDicts("erp_vehicle_access_management_type").then(response => {
        this.vamTypeOptions = response.data;
      });
      this.getDicts("erp_vehicle_access_management_region").then(response => {
        this.vamRegionOptions = response.data;
      });

      this.getDicts("erp_vehicle_white_list_type").then(response => {
        this.vwlTypeOptions = response.data;
      });
    },
    methods: {
      //获取地区数据
      getRegionDataList(value, index) {
        this.checkItem = index;
        this.queryParams.vamRegion = value;
        this.getList();
      },
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.date && '' != this.date) {
          this.date[0] = moment(this.date[0]).format("YYYY-MM-DD");
          this.date[1] = moment(this.date[1]).format("YYYY-MM-DD");
          this.queryParams.params["beginVamIntoTime"] = this.date[0];
          this.queryParams.params["endVamIntoTime"] = this.date[1];
        }
        listVehicleAccessManagement(this.queryParams).then(response => {
          this.vehicleAccessManagementList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 类型字典翻译
      vamTypeFormat(row, column) {
        return this.selectDictLabel(this.vamTypeOptions, row.vamType);
      },
      // 区域字典翻译
      vamRegionFormat(row, column) {
        return this.selectDictLabel(this.vamRegionOptions, row.vamRegion);
      },
      reset() {
        this.whiteNameForm = {
          vwlId: null,
          vwlCarNo: null,
          vwlDriver: null,
          vwlPhone: null,
          vwlType: "0",
          vwlAffiliatedUnit: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("whiteNameForm");
      },
      /** 提交按钮 */
      submitForm() {
        addVehicleWhiteLst(this.whiteNameForm).then(response => {
          this.msgSuccess("新增白名单成功");
          this.whiteNameVisible = false;
        });
      },
      // 取消按钮
      cancel() {
        this.whiteNameVisible = false;
        this.reset();
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
      seePic(row) {
        this.dialogVisible = true;
        // this.imgUrlList = [];
        // img(getPrId(), row.gbbh).then((response) => {
        //   if (response.data) {
        //     let data = response.data;
        //     if (data.imgUrl) {
        //       this.imgUrlList.push(process.env.VUE_APP_BASE_API + data.imgUrl);
        //     }
        //     if (data.imgUrl1) {
        //       this.imgUrlList.push(process.env.VUE_APP_BASE_API + data.imgUrl1);
        //     }
        //     if (data.imgUrl2) {
        //       this.imgUrlList.push(process.env.VUE_APP_BASE_API + data.imgUrl2);
        //     }
        //   }
        // });
      },
      whiteName() {
        this.reset();
        this.whiteNameVisible = true;
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
