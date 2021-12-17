<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="workflowType">
        <el-select v-model="queryParams.workflowType" placeholder="请选择类型" clearable size="small">
          <el-option
            v-for="dict in workflowTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workflowFormdataList">
      <el-table-column label="任务名称" align="center" prop="taskName"/>
      <el-table-column label="表单名" align="center" prop="controlName"/>
      <el-table-column label="表单值" align="center" prop="controlValue"/>
      <el-table-column label="类型" align="center" prop="workflowType" :formatter="workflowTypeFormat"/>
      <el-table-column label="审核时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="showInfo(scope.row)"
          >详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 审批对话框 -->
    <el-dialog :title="title" :visible.sync="open" v-if="open" width="1100px" append-to-body :close-on-click-modal="false">
      <contractHistoryForm :contractId="businessKey" v-if="'contract' == definitionKey"/>
      <taskPlanHistoryForm :taskPlanId="businessKey" v-if="'taskPlan' == definitionKey"/>
    </el-dialog>
  </div>
</template>

<script>
  import {listWorkflowFormdata} from "@/api/activiti/workflowFormdata";
  import contractHistoryForm from "@/views/erp/contract/contractHistoryForm";
  import taskPlanHistoryForm from "@/views/manage/taskPlan/taskPlanHistoryForm";

  export default {
    name: "workflowData",
    components: {contractHistoryForm,taskPlanHistoryForm},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        businessKey: '',
        definitionKey: '',
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 审核记录表格数据
        workflowFormdataList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 类型 contract 合同审核字典
        workflowTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          workflowType: null,
          taskName: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("act_workflow_type").then(response => {
        this.workflowTypeOptions = response.data;
      });
    },
    methods: {
      /** 查询审核记录列表 */
      getList() {
        this.loading = true;
        listWorkflowFormdata(this.queryParams).then(response => {
          this.workflowFormdataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 类型 contract 合同审核字典翻译
      workflowTypeFormat(row, column) {
        return this.selectDictLabel(this.workflowTypeOptions, row.workflowType);
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
      /**
       * 查看详情
       */
      showInfo(row) {

        this.businessKey = row.targetId;
        this.definitionKey = row.workflowType;
        this.title = "详情";
        this.open = true;
      }
    }
  };
</script>
