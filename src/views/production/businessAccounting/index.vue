<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

      <el-form-item label="选择类型" prop="type">
        <el-select v-model="queryParams.type" style="width: 120px" @change="getList" placeholder="选择类型">
          <el-option
            v-for="item in typeList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择项目" prop="tem">
        <el-select v-model="queryParams.productName"  @change="getList" placeholder="请选择">
          <el-option
            v-for="item in projectList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
    </el-form>


    <el-row :gutter="20" class="mb8">
      <el-col :span="12">
        <el-table v-loading="loading" :data="datalist" >
          <el-table-column label="生产类型" align="center" width="150px" prop="_id"/>
          <el-table-column label="总量" align="center" prop="total"/>
        </el-table>
        <!--        <pagination
                  v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.page"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList"
                />-->
      </el-col>
      <el-col :span="12">
        <div id="myChart" :style="{width: '100%', height: '550px'}"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import echarts from 'echarts'
  import {list, projectList, PBList} from "@/api/production/businessAccounting";

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
        //项目列表
        projectList: [],
        //生产类型列表
        typeList: [],
        //温度类型

        xData:[],
        yData:[],

        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          page: 1,
          pageSize: 10,
          beginDate: null,
          endDate: null,
          type: null,
          productName: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /**查询生产类型列表*/
      getTypeList(){
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.beginDate = this.daterangeCreateTime[0];
          this.queryParams.endDate = this.daterangeCreateTime[1];
        }
        PBList(this.queryParams).then(response => {
          this.typeList = response.list;
        });
      },
      /**查询batch列表*/
      getProjectList(){
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.beginDate = this.daterangeCreateTime[0];
          this.queryParams.endDate = this.daterangeCreateTime[1];
        }
        projectList(this.queryParams).then(response => {
          this.projectList = response.list;
        });
      },
      /** 查询列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.beginDate = this.daterangeCreateTime[0];
          this.queryParams.endDate = this.daterangeCreateTime[1];
        }
        list(this.queryParams).then(response => {
          this.datalist = response.list;
          if (this.datalist) {
            this.xData = this.datalist.map(function(index, value) {
              return index._id;
            });
            this.yData = this.datalist.map(function(index, value) {
              return index.total;
            });
            this.xData.pop();
            this.yData.pop();
            this.drawLine();
          }
          this.total = response.num;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
        this.getTypeList();
        this.getProjectList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption(
          {
            color: "#26C44F",
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: this.xData
            },
            series: [

              {
                name: '合计总量',
                type: 'bar',
                stack: '总量',
                data: this.yData
              }
            ]
          }
        );
      }
    },
    mounted() {
      //this.drawLine();
    }
  }
</script>

<style scoped>

</style>
