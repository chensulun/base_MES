<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="报岗模式" prop="model">
        <el-select v-model="queryParams.model" placeholder="请选择报岗模式" clearable size="small">
          <el-option
            v-for="dict in modelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['manage:materialPostReporting:add']"
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
          v-hasPermi="['manage:materialPostReporting:edit']"
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
          v-hasPermi="['manage:materialPostReporting:remove']"
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
          v-hasPermi="['manage:materialPostReporting:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="materialPostReportingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="原材名字" align="center" prop="materialName" />
      <el-table-column label="供应商名称" align="center" prop="supplierName" />
      <el-table-column label="订单编码" align="center" prop="orderCode" />
      <el-table-column label="报岗模式" align="center" prop="model" :formatter="modelFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:materialPostReporting:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:materialPostReporting:remove']"
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

    <!-- 添加或修改原材报岗对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原材id" prop="materialId">
          <el-input v-model="form.materialId" placeholder="请输入原材id" />
        </el-form-item>
        <el-form-item label="原材编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入原材编码" />
        </el-form-item>
        <el-form-item label="原材名字" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入原材名字" />
        </el-form-item>
        <el-form-item label="供应商id" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商id" />
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplierCode">
          <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="订单编码" prop="orderCode">
          <el-input v-model="form.orderCode" placeholder="请输入订单编码" />
        </el-form-item>
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="报岗模式 (0:未处理 1: 车车检 2:规则检 )">
          <el-radio-group v-model="form.model">
            <el-radio
              v-for="dict in modelOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
import { listMaterialPostReporting, getMaterialPostReporting, delMaterialPostReporting, addMaterialPostReporting, updateMaterialPostReporting, exportMaterialPostReporting } from "@/api/manage/materialPostReporting";

export default {
  name: "MaterialPostReporting",
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
      // 原材报岗表格数据
      materialPostReportingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 报岗模式 (0:未处理 1: 车车检 2:规则检 )字典
      modelOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        model: null,
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
    this.getDicts("m_material_post_reporting_model").then(response => {
      this.modelOptions = response.data;
    });
  },
  methods: {
    /** 查询原材报岗列表 */
    getList() {
      this.loading = true;
      listMaterialPostReporting(this.queryParams).then(response => {
        this.materialPostReportingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 报岗模式 (0:未处理 1: 车车检 2:规则检 )字典翻译
    modelFormat(row, column) {
      return this.selectDictLabel(this.modelOptions, row.model);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        mprId: null,
        materialId: null,
        materialCode: null,
        materialName: null,
        supplierId: null,
        supplierCode: null,
        supplierName: null,
        orderCode: null,
        orderId: null,
        model: "0",
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
      this.ids = selection.map(item => item.mprId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加原材报岗";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const mprId = row.mprId || this.ids
      getMaterialPostReporting(mprId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改原材报岗";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.mprId != null) {
            updateMaterialPostReporting(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialPostReporting(this.form).then(response => {
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
      const mprIds = row.mprId || this.ids;
      this.$confirm('是否确认删除原材报岗编号为"' + mprIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMaterialPostReporting(mprIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有原材报岗数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportMaterialPostReporting(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
