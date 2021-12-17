<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同id" prop="contractId">
        <el-input
          v-model="queryParams.contractId"
          placeholder="请输入合同id"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['erp:contractModifyPrice:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:contractModifyPrice:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:contractModifyPrice:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
		  :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['erp:contractModifyPrice:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractModifyPriceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="cdpId" />
      <el-table-column label="合同编号" align="center" prop="contractCode" />
      <el-table-column label="项目名称" align="center" prop="contractProjectName" />
      <el-table-column label="客户名称" align="center" prop="contractCustomerName" />
      <el-table-column label="备注" align="center" prop="cdpRemark" />
      <el-table-column label="合同状态" align="center" prop="cdpStatus" :formatter="cdpStatusFormat" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:contractModifyPrice:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:contractModifyPrice:remove']"
          >删除</el-button>
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

    <!-- 添加或修改调价单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同id" prop="contractId">
          <el-input v-model="form.contractId" placeholder="请输入合同id" />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractCode">
          <el-input v-model="form.contractCode" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="项目名称" prop="contractProjectName">
          <el-input v-model="form.contractProjectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="客户名称" prop="contractCustomerName">
          <el-input v-model="form.contractCustomerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contractContacts">
          <el-input v-model="form.contractContacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contractPhone">
          <el-input v-model="form.contractPhone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="调价后产品数据" prop="cdpProductData">
          <el-input v-model="form.cdpProductData" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="cdpRemark">
          <el-input v-model="form.cdpRemark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="合同类型">
          <el-radio-group v-model="form.cdpType">
            <el-radio
              v-for="dict in cdpTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="合同状态" prop="cdpStatus">
          <el-select v-model="form.cdpStatus" placeholder="请选择合同状态">
            <el-option
              v-for="dict in cdpStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listContractModifyPrice, getContractModifyPrice, delContractModifyPrice, addContractModifyPrice, updateContractModifyPrice, exportContractModifyPrice } from "@/api/erp/contractModifyPrice";

export default {
  name: "ContractModifyPrice",
  components: {
  },
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
      // 调价单表格数据
      contractModifyPriceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 合同类型字典
      cdpTypeOptions: [],
      // 合同状态字典
      cdpStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: null,
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
    this.getDicts("erp_contract_type").then(response => {
      this.cdpTypeOptions = response.data;
    });
    this.getDicts("erp_contract_status").then(response => {
      this.cdpStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询调价单列表 */
    getList() {
      this.loading = true;
      listContractModifyPrice(this.queryParams).then(response => {
        this.contractModifyPriceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 合同类型字典翻译
    cdpTypeFormat(row, column) {
      return this.selectDictLabel(this.cdpTypeOptions, row.cdpType);
    },
    // 合同状态字典翻译
    cdpStatusFormat(row, column) {
      return this.selectDictLabel(this.cdpStatusOptions, row.cdpStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        cdpId: null,
        contractId: null,
        contractCode: null,
        contractProjectName: null,
        contractCustomerName: null,
        contractContacts: null,
        contractPhone: null,
        cdpProductData: null,
        cdpProductDataList: [],
        cdpRemark: null,
        cdpType: "0",
        cdpStatus: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.cdpId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加调价单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cdpId = row.cdpId || this.ids
      getContractModifyPrice(cdpId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改调价单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cdpId != null) {
            updateContractModifyPrice(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContractModifyPrice(this.form).then(response => {
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
      const cdpIds = row.cdpId || this.ids;
      this.$confirm('是否确认删除调价单编号为"' + cdpIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delContractModifyPrice(cdpIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有调价单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportContractModifyPrice(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
