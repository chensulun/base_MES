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
      </el-form-item>
      <el-form-item label="">
        <el-select
          v-model="queryParams.type"
          @change="getEntry"
          clearable
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
      </el-form-item>
    </el-form>

    <el-row :gutter="20" class="mb8" v-loading="loading">
      <el-col :span="12">
        <el-table
          v-show="queryParams.type == null || queryParams.type == ''"
          :data="datalist"
        >
          <!-- <el-table-column label="日期" align="center" width="150px" prop="date"/>-->
          <el-table-column label="用电量" align="center" prop="dl" />
          <el-table-column label="用气量" align="center" prop="ql" />
          <el-table-column label="用水量" align="center" prop="sl" />
          <el-table-column label="用油量" align="center" prop="yl" />
        </el-table>
        <el-table v-show="queryParams.type == 4" :data="datalist">
          <!-- <el-table-column label="日期" align="center" width="150px" prop="date"/>-->
          <el-table-column label="用电量" align="center" prop="dl" />
          <el-table-column label="用气量" align="center" prop="ql" />
          <el-table-column label="用水量" align="center" prop="sl" />
          <el-table-column label="用油量" align="center" prop="yl" />
        </el-table>
        <el-table
          v-show="queryParams.type == 2 && showDataType === 1"
          :data="datalist"
        >
          <!-- <el-table-column label="日期" align="center" width="150px" prop="date"/>-->
          <el-table-column label="用电量" align="center" prop="dl" />
          <el-table-column label="用气量" align="center" prop="ql" />
          <el-table-column label="用水量" align="center" prop="sl" />
          <el-table-column label="用油量" align="center" prop="yl" />
        </el-table>

        <el-table
          v-show="queryParams.type === 1 && showDataType === 0"
          :data="datalist"
        >
          <el-table-column label="电能(筛分)" align="center" prop="sf" />
          <el-table-column label="电能(老再生)" align="center" prop="lzs" />
          <el-table-column label="电能(新再生1)" align="center" prop="xzs1" />
          <el-table-column label="电能(新再生2)" align="center" prop="xzs2" />
          <el-table-column label="电能(原生)" align="center" prop="ys" />
          <el-table-column label="电能(CNG)" align="center" prop="cng" />
        </el-table>
        <el-table
          v-show="queryParams.type === 1 && showDataType === 1"
          :data="datalist"
        >
          <el-table-column
            label="电能(电加热沥青)"
            align="center"
            prop="dnlq"
          />
          <el-table-column label="电能(破碎)" align="center" prop="dnps" />
          <el-table-column label="电能(生产)" align="center" prop="dnsc" />
        </el-table>
        <el-table
          v-show="queryParams.type === 3 && showDataType === 1"
          :data="datalist"
        >
          <el-table-column label="水(清洗)" align="center" prop="sqx" />
          <el-table-column label="水(软化)" align="center" prop="srh" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="myChart" :style="{ width: '100%', height: '500px' }"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import { getEntry } from "@/api/production/energyConsumption";
import { getMS } from "@/utils/station";

export default {
  name: "index",
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
      // 进场时间时间范围
      daterangeCreateTime: [],
      // 总条数
      total: 0,
      //表格数据
      datalist: [],

      xData: ["用电量", "用气量", "用水量", "用油量"],
      yData: [],

      options: [
        {
          value: 1,
          label: "用电量",
        },
        {
          value: 2,
          label: "用气量",
        },
        {
          value: 3,
          label: "用水量",
        },
        {
          value: 4,
          label: "用油量",
        },
      ],

      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        beingDate: null,
        endDate: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      showDataType: 0,
    };
  },
  created() {
    this.initSelectData();
    this.getEntry();
  },
  methods: {
    //初始换下拉数据
    initSelectData() {
      let msName = getMS();
      if (msName.indexOf("常熟") !== -1) {
        this.showDataType = 1;
        this.options = [
          {
            value: 1,
            label: "用电量",
          },
          {
            value: 2,
            label: "用气量",
          },
          {
            value: 3,
            label: "用水量",
          },
          {
            value: 4,
            label: "用油量",
          },
        ];
      }
    },
    /** 查询列表 */
    getEntry() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.beingDate = this.daterangeCreateTime[0];
        this.queryParams.endDate = this.daterangeCreateTime[1];
      }
      getEntry(this.queryParams).then((response) => {
        let arrayData = [];
        arrayData.push(response.obj);
        this.datalist = arrayData;
        console.log(this.datalist);
        let obj = response.obj;
        if (this.queryParams.type !== 1) {
          this.yData = [];
          this.xData = ["用油量", "用电量", "用水量", "用气量"];
          for (let k in obj) {
            this.yData.push(obj[k]);
          }
          if (this.queryParams.type == 2) {
            this.datalist = [{}];
            this.datalist[0].ql = response.obj.steamTotal;
            console.log(this.datalist);
            // this.datalist = arrayData;
            this.yData = [];
            this.yData[3] = obj.steamTotal;
            // console.log(obj);
          }
          if (this.queryParams.type == 3) {
            this.xData = ["水(清洗)", "水(软化)"];
            // this.datalist = [{}];
            console.log(response.obj);
            this.yData[0] = obj.sqx;
            this.yData[1] = obj.srh;
          }
          console.log(this.yData);
          this.drawLine();
        }
        if (this.queryParams.type === 1) {
          this.yData = [];
          this.xData = [
            "电能(筛分)",
            "电能(老再生)",
            "电能(新再生1)",
            "电能(新再生2)",
            "电能(原生)",
            "电能(CNG)",
          ];
          let msName = getMS();
          if (msName.indexOf("常熟") !== -1) {
            this.xData = ["电能(电加热沥青)", "电能(破碎)", "电能(生产)"];
          }
          for (let k in obj) {
            this.yData.push(obj[k]);
          }
          this.drawLine();
        }
        this.total = response.num;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getEntry();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: "#26C44F",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.xData,
        },
        series: [
          {
            name: "合计总量",
            type: "bar",
            stack: "总量",
            data: this.yData,
          },
        ],
      });
    },
  },
  mounted() {
    //this.drawLine();
  },
};
</script>

<style scoped>
</style>
