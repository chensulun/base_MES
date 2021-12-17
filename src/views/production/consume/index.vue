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
    </el-form>


    <el-row :gutter="20" class="mb8">
      <el-col :span="12">
        <el-table v-loading="loading" :data="datalist" >
          <el-table-column label="时间" align="center" width="150px" prop="date"/>
          <el-table-column label="回收料" align="center" prop="HSL"/>
          <el-table-column label="骨料" align="center" prop="GLSL"/>
          <el-table-column label="新粉" align="center" prop="XFSL"/>
          <el-table-column label="沥青" align="center" prop="LQSL"/>
          <el-table-column label="添加剂" align="center" prop="TJJSL"/>
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
        <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import echarts from 'echarts'
  import {list} from "@/api/production/consume";

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

        xData:["回收料", "骨料", "新粉", "沥青", "添加剂"],
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
          let obj = response.obj;
          if (this.datalist) {
            this.yData = [];
            for (let k in obj) {
              if (k !== 'date' && k !== 'total'){
                this.yData.push(obj[k])
              }
            }
            console.log(this.yData);
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
