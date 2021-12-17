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
      <!-- <el-form-item label="工程名称" prop="project">
        <el-select v-model="queryParams.project" style="width: 120px" @change="getList" placeholder="选择项目">
          <el-option
            v-for="item in projectList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item> -->
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
      <el-form-item label="选择温度" prop="tem">
        <el-select v-model="queryParams.tem" style="width: 120px" @change="getList" placeholder="请选择">
          <el-option
            v-for="item in temList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
    </el-form>


    <el-row :gutter="20" class="mb8">
      <el-col :span="12">
        <el-table v-loading="loading" :data="temperatureList" >
          <el-table-column label="时间" align="center" width="150px" prop="dateTime"/>
          <el-table-column label="材料类型" align="center" prop="pbh"/>
          <el-table-column label="出料温度" align="center" prop="wd"/>
          <el-table-column label="锅次" align="center" prop="guanci"/>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
      <el-col :span="12">
        <div id="myChart" :style="{width: '100%', height: '650px'}"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import echarts from 'echarts'
  import {list, projectList, tempPBList} from "@/api/production/temperatureFluctuation";

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
        // 温度表格数据
        temperatureList: [],
        //项目列表
        projectList: [],
        //生产类型列表
        typeList: [],
        //温度类型
        temList: ['出料温度', '沥青温度','再生温度'],
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
          project: null,
          tem: null,
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
      getProductList(){
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.beginDate = this.daterangeCreateTime[0];
          this.queryParams.endDate = this.daterangeCreateTime[1];
        }
        tempPBList(this.queryParams).then(response => {
          this.typeList = response.list;
        });
      },

      /**查询项目列表*/
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
          this.temperatureList = response.obj;
          if (this.temperatureList) {
            this.xData = this.temperatureList.map(function(index, value) {
              return index.dateTime;
            })
            this.yData = this.temperatureList.map(function(index, value) {
              return index.wd;
            })
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
        this.getProductList();
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
            grid: {
              top: 30,
              left: 40,
              right: 0,
              bottom: '20%'
            },
            tooltip: {
              trigger: 'axis',
            },
            xAxis: {
              type: 'category',
              data: this.xData,
              axisTick: {
                lineStyle: {
                  color: '#fff'
                }
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#148976'
                }
              },
              axisLabel: {
                rotate: 15
              }
            },
            yAxis: {
              name: '温度（℃）',
              type: 'value',
              splitLine: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#148976'
                }
              },
              axisTick: {
                lineStyle: {
                  color: '#fff'
                }
              },
            },
            series: [{
              name: '温度',
              data: this.yData,
              type: 'line',
              smooth: true,
              itemStyle: {
                color: '#00CAB0'
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#5BC450'
                  }, {
                    offset: 1,
                    color: '#ffe'
                  }])
                }
              },
              markLine: {
                data: [{
                  type: 'average',
                  name: '平均值'
                }],
                lineStyle: {
                  color: 'red'
                }
              }
            },

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
