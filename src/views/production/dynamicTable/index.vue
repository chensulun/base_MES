<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="日期">
        <el-date-picker
          v-model="daterangeCreateTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
      <el-form-item label="选择项目" prop="project">
        <el-select
          v-model="queryParams.project"
          style="width: 120px"
          @change="getList"
          placeholder="选择项目"
        >
          <el-option
            v-for="item in projectList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择类型" prop="product">
        <el-select
          v-model="queryParams.product"
          style="width: 120px"
          @change="getList"
          placeholder="选择类型"
        >
          <el-option
            v-for="item in productList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="异常类型" prop="state">
        <el-select
          v-model="queryParams.state"
          style="width: 120px"
          @change="getList"
          placeholder="请选择"
        >
          <el-option
            v-for="item in stateList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="异常程度" prop="ysb_error">
        <el-select
          v-model="queryParams.ysb_error"
          style="width: 120px"
          @change="getList"
          placeholder="请选择"
        >
          <el-option
            v-for="item in errorList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['manage:mixingStation:export']"
          >导出
        </el-button>
      </el-col>
    </el-row>
    <!--, dataShowType=1-->
    <el-table v-if="dataShowType === 1" v-loading="loading" :data="arr">
      <el-table-column
        label="时间"
        align="center"
        width="150px"
        prop="dateTime"
      />
      <el-table-column label="盘次" align="center" prop="guanci" />
      <el-table-column label="仓1" align="center" width="120px" prop="one_S">
        <template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.one_S,
                scope.row.onenum,
                scope.row.oneMin,
                scope.row.oneMax,
                scope.row.one_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓2" align="center" width="120px" prop="two_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.two_S,
                scope.row.twonum,
                scope.row.twoMin,
                scope.row.twoMax,
                scope.row.two_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓3" align="center" width="120px" prop="three_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.three_S,
                scope.row.threenum,
                scope.row.threeMin,
                scope.row.threeMax,
                scope.row.three_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓4" align="center" width="120px" prop="four_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.four_S,
                scope.row.fournum,
                scope.row.fourMin,
                scope.row.fourMax,
                scope.row.four_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓5" align="center" width="120px" prop="five_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.five_S,
                scope.row.fivenum,
                scope.row.fiveMin,
                scope.row.fiveMax,
                scope.row.five_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓6" align="center" width="120px" prop="six_1_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.six_1_S,
                scope.row.six_1num,
                scope.row.six_1Min,
                scope.row.six_1Max,
                scope.row.six_1_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="粉料1" align="center" width="120px" prop="six_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.six_S,
                scope.row.sixnum,
                scope.row.sixMin,
                scope.row.sixMax,
                scope.row.six_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="粉料2" align="center" width="120px" prop="seven_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.seven_S,
                scope.row.sevennum,
                scope.row.sevenMin,
                scope.row.sevenMax,
                scope.row.seven_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="再生料" align="center" width="120px" prop="zsl_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.zsl_S,
                scope.row.zslnum,
                scope.row.zslMin,
                scope.row.zslMax,
                scope.row.zsl_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="沥青" align="center" width="120px" prop="eight_S"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.eight_S,
                scope.row.eight_1num,
                scope.row.eight_1Min,
                scope.row.eight_1Max,
                scope.row.eight_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="油石比" align="center" prop="ysb"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.ysb,
                scope.row.ysbnum,
                scope.row.ysbMin,
                scope.row.ysbMax,
                scope.row.ysb
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" prop="zl"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.zl,
                scope.row.zlnum,
                scope.row.zlMin,
                scope.row.zlMax,
                scope.row.zl
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="石料总量" align="center" prop="ctotal"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.ctotal,
                scope.row.ctotalnum,
                scope.row.ctotalMin,
                scope.row.ctotalMax,
                scope.row.ctotal
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleSearch(scope.row)"
            v-if="scope.row.guanci.indexOf('盘') != '-1'"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 默认, dataShowType=0 -->
    <el-table v-if="dataShowType === 0" v-loading="loading" :data="arr">
      <el-table-column
        label="时间"
        align="center"
        width="150px"
        prop="dateTime"
      />
      <el-table-column label="盘次" align="center" prop="guanci" />
      <el-table-column label="仓1" align="center" width="120px" prop="one_S_P">
        <template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.one_S_P,
                scope.row.onenum,
                scope.row.oneMin,
                scope.row.oneMax,
                scope.row.one_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓2" align="center" width="120px" prop="two_S_P">
        <template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.two_S_P,
                scope.row.twonum,
                scope.row.twoMin,
                scope.row.twoMax,
                scope.row.two_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓3" align="center" width="120px" prop="three_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.three_S_P,
                scope.row.threenum,
                scope.row.threeMin,
                scope.row.threeMax,
                scope.row.three_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓4" align="center" width="120px" prop="four_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.four_S_P,
                scope.row.fournum,
                scope.row.fourMin,
                scope.row.fourMax,
                scope.row.four_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓5" align="center" width="120px" prop="five_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.five_S_P,
                scope.row.fivenum,
                scope.row.fiveMin,
                scope.row.fiveMax,
                scope.row.five_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓6" align="center" width="120px" prop="six_1_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.six_1_S_P,
                scope.row.six_1num,
                scope.row.six_1Min,
                scope.row.six_1Max,
                scope.row.six_1_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="粉料1" align="center" width="120px" prop="six_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.six_S_P,
                scope.row.sixnum,
                scope.row.sixMin,
                scope.row.sixMax,
                scope.row.six_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        label="粉料2"
        align="center"
        width="120px"
        prop="seven_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.seven_S_P,
                scope.row.sevennum,
                scope.row.sevenMin,
                scope.row.sevenMax,
                scope.row.seven_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="粉料3" align="center" width="120px" prop="nine_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.nine_S_P,
                scope.row.nine_Snum,
                scope.row.nine_SMin,
                scope.row.nine_SMax,
                scope.row.nine_S_P
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        label="再生料"
        align="center"
        width="120px"
        prop="zsl_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.zsl_S_P,
                scope.row.zslnum,
                scope.row.zslMin,
                scope.row.zslMax,
                scope.row.zsl_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        label="沥青"
        align="center"
        width="120px"
        prop="eight_1_S_P"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.eight_1_S_P,
                scope.row.eight_1num,
                scope.row.eight_1Min,
                scope.row.eight_1Max,
                scope.row.eight_1_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="油石比" align="center" prop="ysb"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.ysb,
                scope.row.ysbnum,
                scope.row.ysbMin,
                scope.row.ysbMax,
                scope.row.ysb
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" prop="zl"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.zl,
                scope.row.zlnum,
                scope.row.zlMin,
                scope.row.zlMax,
                scope.row.zl
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="石料总量" align="center" prop="ctotal"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.ctotal,
                scope.row.ctotalnum,
                scope.row.ctotalMin,
                scope.row.ctotalMax,
                scope.row.ctotal
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleSearch(scope.row)"
            v-if="scope.row.guanci.indexOf('盘') != '-1'"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--鑫丰, dataShowType=2-->
    <el-table v-if="dataShowType === 2" v-loading="loading" :data="arr">
      <el-table-column
        label="时间"
        align="center"
        width="150px"
        prop="dateTime"
      />
      <el-table-column label="盘次" align="center" prop="guanci" />
      <el-table-column label="仓1" align="center" width="120px" prop="one">
        <template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.one,
                scope.row.onenum,
                scope.row.oneMin,
                scope.row.oneMax,
                scope.row.one_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓2" align="center" width="120px" prop="two">
        <template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.two,
                scope.row.twonum,
                scope.row.twoMin,
                scope.row.twoMax,
                scope.row.two_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓3" align="center" width="120px" prop="three"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.three,
                scope.row.threenum,
                scope.row.threeMin,
                scope.row.threeMax,
                scope.row.three_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓4" align="center" width="120px" prop="four"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.four,
                scope.row.fournum,
                scope.row.fourMin,
                scope.row.fourMax,
                scope.row.four_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓5" align="center" width="120px" prop="five"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.five,
                scope.row.fivenum,
                scope.row.fiveMin,
                scope.row.fiveMax,
                scope.row.five_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="仓6" align="center" width="120px" prop="six_1"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.six_1,
                scope.row.six_1num,
                scope.row.six_1Min,
                scope.row.six_1Max,
                scope.row.six_1_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="粉料1" align="center" width="120px" prop="six"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.six,
                scope.row.sixnum,
                scope.row.sixMin,
                scope.row.sixMax,
                scope.row.six_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="粉料2" align="center" width="120px" prop="seven"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.seven,
                scope.row.sevennum,
                scope.row.sevenMin,
                scope.row.sevenMax,
                scope.row.seven_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="再生料" align="center" width="120px" prop="zshsl"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.zshsl,
                scope.row.zslnum,
                scope.row.zslMin,
                scope.row.zslMax,
                scope.row.zsl_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="沥青" align="center" width="120px" prop="eight"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.eight,
                scope.row.eight_1num,
                scope.row.eight_1Min,
                scope.row.eight_1Max,
                scope.row.eight_1_S_B
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="油石比" align="center" prop="ysb"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.ysb,
                scope.row.ysbnum,
                scope.row.ysbMin,
                scope.row.ysbMax,
                scope.row.ysb
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" prop="zl"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.zl,
                scope.row.zlnum,
                scope.row.zlMin,
                scope.row.zlMax,
                scope.row.zl
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="石料总量" align="center" prop="ctotal"
        ><template slot-scope="scope">
          <div
            v-html="
              createHtml(
                scope.row.ctotal,
                scope.row.ctotalnum,
                scope.row.ctotalMin,
                scope.row.ctotalMax,
                scope.row.ctotal
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleSearch(scope.row)"
            v-if="scope.row.guanci.indexOf('盘') != '-1'"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改项目列表对话框 -->
    <el-dialog
      :visible.sync="open"
      width="1400px"
      append-to-body
      :close-on-click-modal="false"
      class="mydialog"
      title="合成级配"
    >
      <Form :list="list"></Form>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  projectList,
  pBHByDate,
  modelList,
} from "@/api/production/dynamicTable";
import { getMS, getPeId } from "@/utils/station";
import Form from "./components/Form";
import axios from "axios";

export default {
  name: "DynamicTable",
  components: {
    Form,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 时间范围
      daterangeCreateTime: [],
      // 总条数
      total: 0,
      // 动态表数据
      dynamicTableList: [],
      //动态表数据处理后
      arr: [],
      //项目列表
      projectList: [],
      //生产类型列表
      productList: [],
      stateList: ["配比", "油石比"],
      errorList: ["一般", "严重"],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        beginDate: null,
        endDate: null,
        project: null,
        type: null,
        product: null,
        ysb_error: null,
        state: null,
        // sbName: "SB-A5000",
        sbName: null,
      },
      // 弹窗表单参数
      list: [],
      // 是否显示弹窗
      open: false,
      // 表单校验
      rules: {},
      //展示数据类型 0:混合 1:比例, 2:鑫丰
      dataShowType: -1,
      //质量参数表
      modelList: [],
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.createHtml();
  },
  methods: {
    initDataShowType() {
      let msName = getMS();
      if (msName.indexOf("彭山") > -1) {
        this.dataShowType = 1;
      } else if (msName.indexOf("鑫丰") > -1) {
        this.dataShowType = 2;
      } else if (msName.indexOf("金堂") > -1) {
        this.dataShowType = 1;
      } else {
        this.dataShowType = 0;
      }
    },
    /**查询生产类型列表*/
    getProductList() {
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.beginDate = this.daterangeCreateTime[0];
        this.queryParams.endDate = this.daterangeCreateTime[1];
      }
      pBHByDate(this.queryParams).then((response) => {
        this.productList = response.list;
      });
    },

    /**查询项目列表*/
    getProjectList() {
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.beginDate = this.daterangeCreateTime[0];
        this.queryParams.endDate = this.daterangeCreateTime[1];
      }
      projectList(this.queryParams).then((response) => {
        this.projectList = response.list;
      });
    },
    /** 查询列表 */
    getList() {
      var that = this;
      that.loading = true;
      that.queryParams.params = {};
      if (null != that.daterangeCreateTime && "" != that.daterangeCreateTime) {
        that.queryParams.beginDate = that.daterangeCreateTime[0];
        that.queryParams.endDate = that.daterangeCreateTime[1];
      }
      list(that.queryParams).then((response) => {
        that.dynamicTableList = response.list;
        that.total = response.num;
        that.loading = false;
        // console.log(that.dynamicTableList);
        that.getModelList();
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.getProjectList();
      this.getProductList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          //return exportMixingStation(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 查看按钮操作 */
    handleSearch(row) {
      axios({
        method: "get",
        url: "https://test.zgdrkj.cn:8443/cs/api/data/getCompoundJp",
        params: { id: row.id },
      })
        .then((res) => {
          this.list = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
      //发送请求,回显
      this.open = true;
    },
    /*参数列表*/
    getModelList() {
      var that = this;
      let peId = getPeId();
      this.initDataShowType();
      // var data = { qpType: 0, peProductionType: 'AC-16' }
      var data = { qpType: 0, peId: peId };
      modelList(data).then((response) => {
        that.modelList = response.rows;
        // console.log(that.modelList);
        // console.log(that.dynamicTableList);
        for (let i = 0; i < that.modelList.length; i++) {
          var Type = that.modelList[i].peProductionType;
          for (let j = 0; j < that.dynamicTableList.length; j++) {
            if (Type == that.dynamicTableList[j].pbh) {
              var c = { ...that.dynamicTableList[j], ...that.modelList[i] };
              that.dynamicTableList[j] = c;
            }
          }
        }
        if (this.dataShowType == 0) {
          for (let k = 0; k < that.dynamicTableList.length; k += 3) {
            var onenum =
              that.dynamicTableList[k + 2].one_S_B -
              that.dynamicTableList[k + 1].one_S_B;
            that.dynamicTableList[k + 2].onenum = onenum.toFixed(2);
            var twonum =
              that.dynamicTableList[k + 2].two_S_B -
              that.dynamicTableList[k + 1].two_S_B;
            that.dynamicTableList[k + 2].twonum = twonum.toFixed(2);
            var threenum =
              that.dynamicTableList[k + 2].three_S_B -
              that.dynamicTableList[k + 1].three_S_B;
            that.dynamicTableList[k + 2].threenum = threenum.toFixed(2);
            var fournum =
              that.dynamicTableList[k + 2].four_S_B -
              that.dynamicTableList[k + 1].four_S_B;
            that.dynamicTableList[k + 2].fournum = fournum.toFixed(2);
            var fivenum =
              that.dynamicTableList[k + 2].five_S_B -
              that.dynamicTableList[k + 1].five_S_B;
            that.dynamicTableList[k + 2].fivenum = fivenum.toFixed(2);
            var six_1num =
              that.dynamicTableList[k + 2].six_1_S_B -
              that.dynamicTableList[k + 1].six_1_S_B;
            that.dynamicTableList[k + 2].six_1num = six_1num.toFixed(2);
            var sixnum =
              that.dynamicTableList[k + 2].six_S_B -
              that.dynamicTableList[k + 1].six_S_B;
            that.dynamicTableList[k + 2].sixnum = sixnum.toFixed(2);
            var sevennum =
              that.dynamicTableList[k + 2].seven_S_B -
              that.dynamicTableList[k + 1].seven_S_B;
            that.dynamicTableList[k + 2].sevennum = sevennum.toFixed(2);
            var zslnum =
              that.dynamicTableList[k + 2].zsl_S_B -
              that.dynamicTableList[k + 1].zsl_S_B;
            that.dynamicTableList[k + 2].zslnum = zslnum.toFixed(2);
            var eight_1num =
              that.dynamicTableList[k + 2].eight_1_S_B -
              that.dynamicTableList[k + 1].eight_1_S_B;
            that.dynamicTableList[k + 2].eight_1num = eight_1num.toFixed(2);
            var ysbnum =
              that.dynamicTableList[k + 2].ysb -
              that.dynamicTableList[k + 1].ysb;
            that.dynamicTableList[k + 2].ysbnum = ysbnum.toFixed(2);
            var zlnum =
              that.dynamicTableList[k + 2].zl - that.dynamicTableList[k + 1].zl;
            that.dynamicTableList[k + 2].zlnum = zlnum.toFixed(2);
            var ctotalnum =
              that.dynamicTableList[k + 2].ctotal -
              that.dynamicTableList[k + 1].ctotal;
            that.dynamicTableList[k + 2].ctotalnum = ctotalnum.toFixed(2);
          }
        } else if (this.dataShowType == 1) {
          for (let k = 0; k < that.dynamicTableList.length; k += 3) {
            var onenum =
              that.dynamicTableList[k + 2].one_S_B -
              that.dynamicTableList[k + 1].one_S_B;
            that.dynamicTableList[k + 2].onenum = onenum.toFixed(2);
            var twonum =
              that.dynamicTableList[k + 2].two_S_B -
              that.dynamicTableList[k + 1].two_S_B;
            that.dynamicTableList[k + 2].twonum = twonum.toFixed(2);
            var threenum =
              that.dynamicTableList[k + 2].three_S_B -
              that.dynamicTableList[k + 1].three_S_B;
            that.dynamicTableList[k + 2].threenum = threenum.toFixed(2);
            var fournum =
              that.dynamicTableList[k + 2].four_S_B -
              that.dynamicTableList[k + 1].four_S_B;
            that.dynamicTableList[k + 2].fournum = fournum.toFixed(2);
            var fivenum =
              that.dynamicTableList[k + 2].five_S_B -
              that.dynamicTableList[k + 1].five_S_B;
            that.dynamicTableList[k + 2].fivenum = fivenum.toFixed(2);
            var six_1num =
              that.dynamicTableList[k + 2].six_1_S_B -
              that.dynamicTableList[k + 1].six_1_S_B;
            that.dynamicTableList[k + 2].six_1num = six_1num.toFixed(2);
            var sixnum =
              that.dynamicTableList[k + 2].six_S_B -
              that.dynamicTableList[k + 1].six_S_B;
            that.dynamicTableList[k + 2].sixnum = sixnum.toFixed(2);
            var sevennum =
              that.dynamicTableList[k + 2].seven_S_B -
              that.dynamicTableList[k + 1].seven_S_B;
            that.dynamicTableList[k + 2].sevennum = sevennum.toFixed(2);
            var zslnum =
              that.dynamicTableList[k + 2].zsl_S_B -
              that.dynamicTableList[k + 1].zsl_S_B;
            that.dynamicTableList[k + 2].zslnum = zslnum.toFixed(2);
            var eight_1num =
              that.dynamicTableList[k + 2].eight_1_S_B -
              that.dynamicTableList[k + 1].eight_1_S_B;
            that.dynamicTableList[k + 2].eight_1num = eight_1num.toFixed(2);
            var ysbnum =
              that.dynamicTableList[k + 2].ysb -
              that.dynamicTableList[k + 1].ysb;
            that.dynamicTableList[k + 2].ysbnum = ysbnum.toFixed(2);
            var zlnum =
              that.dynamicTableList[k + 2].zl - that.dynamicTableList[k + 1].zl;
            that.dynamicTableList[k + 2].zlnum = zlnum.toFixed(2);
            var ctotalnum =
              that.dynamicTableList[k + 2].ctotal -
              that.dynamicTableList[k + 1].ctotal;
            that.dynamicTableList[k + 2].ctotalnum = ctotalnum.toFixed(2);
          }
        } else if (this.dataShowType == 2) {
          for (let k = 0; k < that.dynamicTableList.length; k += 3) {
            var onenum =
              that.dynamicTableList[k + 2].one -
              that.dynamicTableList[k + 1].one;
            that.dynamicTableList[k + 2].onenum = onenum.toFixed(2);
            var twonum =
              that.dynamicTableList[k + 2].two -
              that.dynamicTableList[k + 1].two;
            that.dynamicTableList[k + 2].twonum = twonum.toFixed(2);
            var threenum =
              that.dynamicTableList[k + 2].three -
              that.dynamicTableList[k + 1].three;
            that.dynamicTableList[k + 2].threenum = threenum.toFixed(2);
            var fournum =
              that.dynamicTableList[k + 2].four -
              that.dynamicTableList[k + 1].four;
            that.dynamicTableList[k + 2].fournum = fournum.toFixed(2);
            var fivenum =
              that.dynamicTableList[k + 2].five -
              that.dynamicTableList[k + 1].five;
            that.dynamicTableList[k + 2].fivenum = fivenum.toFixed(2);
            var six_1num =
              that.dynamicTableList[k + 2].six_1 -
              that.dynamicTableList[k + 1].six_1;
            that.dynamicTableList[k + 2].six_1num = six_1num.toFixed(2);
            var sixnum =
              that.dynamicTableList[k + 2].six -
              that.dynamicTableList[k + 1].six;
            that.dynamicTableList[k + 2].sixnum = sixnum.toFixed(2);
            var sevennum =
              that.dynamicTableList[k + 2].seven -
              that.dynamicTableList[k + 1].seven;
            that.dynamicTableList[k + 2].sevennum = sevennum.toFixed(2);
            var zslnum =
              that.dynamicTableList[k + 2].zshsl -
              that.dynamicTableList[k + 1].zshsl;
            that.dynamicTableList[k + 2].zslnum = zslnum.toFixed(2);
            var eight_1num =
              that.dynamicTableList[k + 2].eight -
              that.dynamicTableList[k + 1].eight;
            that.dynamicTableList[k + 2].eight_1num = eight_1num.toFixed(2);
            var ysbnum =
              that.dynamicTableList[k + 2].ysb -
              that.dynamicTableList[k + 1].ysb;
            that.dynamicTableList[k + 2].ysbnum = ysbnum.toFixed(2);
            var zlnum =
              that.dynamicTableList[k + 2].zl - that.dynamicTableList[k + 1].zl;
            that.dynamicTableList[k + 2].zlnum = zlnum.toFixed(2);
            var ctotalnum =
              that.dynamicTableList[k + 2].ctotal -
              that.dynamicTableList[k + 1].ctotal;
            that.dynamicTableList[k + 2].ctotalnum = ctotalnum.toFixed(2);
          }
        }
        that.arr = that.dynamicTableList;
        // console.log(that.arr);
      });
    },
    /*变色*/
    createHtml(value, num, min, max, _S_B) {
      // console.log(value, num, min, max, _S_B);
      if (min && max) {
        if (num > max) {
          return `<div style="color:red">${value}</div>`;
        } else if (num < min) {
          return `<div style="color:blue">${value}</div>`;
        } else {
          return `<div>${value}</div>`;
        }
      } else {
        return `<div>${value}</div>`;
      }
    },
  },
};
</script>

<style scoped lang='scss' rel='stylesheet/scss'>
.mydialog {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #eee;
  }
}
</style>
