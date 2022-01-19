<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="创建时间">
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
      <el-form-item label="项目名称" prop="pfrmContractName">
        <el-input
          v-model="queryParams.pfrmContractName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="pfrmStatus">
        <el-select
          v-model="queryParams.pfrmStatus"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in pfrmStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['erp:projectFundRecoveryManagement:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:projectFundRecoveryManagement:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:projectFundRecoveryManagement:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['erp:projectFundRecoveryManagement:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="projectFundRecoveryManagementList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="合同编号"
        align="center"
        prop="pfrmContractCode"
      />
      <el-table-column
        label="项目名称"
        align="center"
        prop="pfrmContractName"
      />
      <el-table-column
        label="发包单位"
        align="center"
        prop="pfrmContractUnit"
      />
      <el-table-column
        label="签订金额"
        align="center"
        prop="pfrmContractTotal"
      />
      <el-table-column label="决算金额" align="center" />
      <el-table-column label="最新决算时间" align="center" />
      <el-table-column label="已收款项" align="center" />
      <el-table-column label="应收款项" align="center" />
      <el-table-column
        label="状态"
        align="center"
        prop="pfrmStatus"
        :formatter="pfrmStatusFormat"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="lookDetail(scope.row)"
            v-hasPermi="['erp:projectFundRecoveryManagement:edit']"
            >查看明细</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:projectFundRecoveryManagement:edit']"
            >修改</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:projectFundRecoveryManagement:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改项目资金回收对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="pfrmContractName">
          <el-input
            v-model="form.pfrmContractName"
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="决算单编号" prop="pfrmContractCode">
          <el-input
            v-model="form.pfrmContractCode"
            placeholder="请输入决算单编号"
          />
        </el-form-item>
        <el-form-item label="约定比例" prop="pfrmContractUnit">
          <el-input
            v-model="form.pfrmContractUnit"
            placeholder="请输入约定比例"
          />
        </el-form-item>
        <el-form-item label="本次回收金额" prop="pfrmContractTotal">
          <el-input
            v-model="form.pfrmContractTotal"
            placeholder="请输入本次回收金额"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看明细 -->
    <el-dialog
      :title="title"
      :visible.sync="detailOpen"
      width="1200px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="10">
        <el-table
          v-loading="loading"
          :data="form.dataList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="决算单号" align="center" prop="famCode" />
          <el-table-column label="发包单位" align="center" prop="famGroup" />
          <el-table-column label="分包班组" align="center" prop="famGroup" />
          <el-table-column label="决算日期" align="center" prop="famAmount" />
          <el-table-column label="决算价" align="center" prop="famTotal" />
          <el-table-column label="已收款项" align="center" prop="famTotal" />
          <el-table-column label="应收账款余额" align="center" prop="famTotal" width="100px"/>
          <el-table-column label="到期应收账款" align="center" prop="famTotal" width="100px"/>
          <el-table-column label="应收款日期" align="center" prop="famTotal" />
          <el-table-column label="责任人" align="center" prop="famTotal" />
          <el-table-column label="状态" align="center" prop="famTotal" />
          <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="lookItems(scope.row)"
            v-hasPermi="['erp:projectFundRecoveryManagement:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:projectFundRecoveryManagement:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看items -->
    <el-dialog
      :title="title"
      :visible.sync="itemsOpen"
      width="1200px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="10">
        <el-table
          v-loading="loading"
          :data="form.dataList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="编号" align="center" prop="famCode" />
          <el-table-column label="约定付款日期" align="center" prop="famGroup"/>
          <el-table-column label="约定应付金额" align="center" prop="famGroup" />
          <el-table-column label="约定比例" align="center" prop="famAmount" />
          <el-table-column label="当前状态" align="center" prop="famTotal" />
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listProjectFundRecoveryManagement,
  getProjectFundRecoveryManagement,
  delProjectFundRecoveryManagement,
  addProjectFundRecoveryManagement,
  updateProjectFundRecoveryManagement,
  exportProjectFundRecoveryManagement,
} from "@/api/erp/projectFundRecoveryManagement";

export default {
  name: "ProjectFundRecoveryManagement",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
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
      // 项目资金回收表格数据
      projectFundRecoveryManagementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      detailOpen: false,
      itemsOpen: false,
      // 状态字典
      pfrmStatusOptions: [],
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pfrmContractName: null,
        pfrmStatus: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("erp_project_fund_recovery_management_status").then(
      (response) => {
        this.pfrmStatusOptions = response.data;
      }
    );
  },
  methods: {
    /** 查询项目资金回收列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] =
          this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listProjectFundRecoveryManagement(this.queryParams).then((response) => {
        this.projectFundRecoveryManagementList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    pfrmStatusFormat(row, column) {
      return this.selectDictLabel(this.pfrmStatusOptions, row.pfrmStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        pfrmId: null,
        pfrmContractId: null,
        pfrmContractName: null,
        pfrmContractCode: null,
        pfrmContractUnit: null,
        pfrmContractTotal: null,
        pfrmStatus: "0",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.pfrmId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目资金回收";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pfrmId = row.pfrmId || this.ids;
      getProjectFundRecoveryManagement(pfrmId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目资金回收";
      });
    },
    lookDetail(row) {
      this.reset();
      const pfrmId = row.pfrmId || this.ids;
      this.detailOpen = true;
      getProjectFundRecoveryManagement(pfrmId).then((response) => {
        this.form = response.data;
        // this.title = "修改项目资金回收";
      });
    },
    lookItems(row) {
      this.reset();
      const pfrmId = row.pfrmId || this.ids;
      this.itemsOpen = true;
      getProjectFundRecoveryManagement(pfrmId).then((response) => {
        this.form = response.data;
        // this.title = "修改项目资金回收";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pfrmId != null) {
            updateProjectFundRecoveryManagement(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProjectFundRecoveryManagement(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const pfrmIds = row.pfrmId || this.ids;
      this.$confirm(
        '是否确认删除项目资金回收编号为"' + pfrmIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProjectFundRecoveryManagement(pfrmIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有项目资金回收数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportProjectFundRecoveryManagement(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
