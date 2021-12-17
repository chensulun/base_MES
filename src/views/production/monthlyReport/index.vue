<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="日期">
        <el-date-picker
          v-model="daterangeWeighInTime"
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

    <el-table v-loading="loading" :data="dynamicTableList" >
      <el-table-column label="编号" align="center" prop="msId"/>
      <el-table-column label="生产日期" align="center" prop="msName"/>
      <el-table-column label="月份" align="center" prop="msAddress"/>
      <el-table-column label="备注" align="center" prop="msLon"/>
      <el-table-column label="下载" align="center" prop="msLat"/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
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
        daterangeWeighInTime: [],
        // 总条数
        total: 0,
        // 站点信息表格数据
        dynamicTableList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          msName: null,
          msAddress: null,
          msLon: null,
          msLat: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        }
      };
    },
    methods: {
      /** 查询列表 */
      getList() {
        /*        this.loading = true;
                listMixingStation(this.queryParams).then(response => {
                  this.mixingStationList = response.rows;
                  this.total = response.total;
                  this.loading = false;
                });*/
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
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有站点信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          //return exportMixingStation(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      }
    }
  }
</script>

<style scoped>

</style>
