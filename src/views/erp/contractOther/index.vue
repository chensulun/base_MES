<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!-- <el-form-item label="借用单位" prop="mbCompany">
        <el-input
          v-model="queryParams.mbCompany"
          placeholder="请输入借用单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="借用材料id" prop="mbMaterialId">
        <el-input
          v-model="queryParams.mbMaterialId"
          placeholder="请输入借用材料id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="客户名称" prop="mbMaterialName">
        <el-input
          v-model="queryParams.mbMaterialName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['erp:contractOther:add']"
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
          v-hasPermi="['erp:contractOther:edit']"
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
          v-hasPermi="['erp:contractOther:remove']"
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
          v-hasPermi="['erp:contractOther:export']"
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
      :data="contractOtherList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="合同id" align="center" prop="coId" /> -->
      <el-table-column label="合同编号" align="center" prop="coCode" />
      <el-table-column label="购买单位" align="center" prop="coCompany" />
      <!-- <el-table-column label="产品id" align="center" prop="coProductId" /> -->
      <el-table-column label="购买产品" align="center" prop="coProductName" />
      <el-table-column
        label="计划购买数量"
        align="center"
        prop="coProductQuantity"
      />
      <el-table-column
        label="实际购买数量"
        align="center"
        prop="coProductActualQuantity"
      />
      <el-table-column label="购买价格" align="center" prop="coProductPrice" />
      <el-table-column label="合同额" align="center" prop="coProductPrice" />
      <el-table-column label="联系人" align="center" prop="coContacts" />
      <el-table-column label="联系方式" align="center" prop="coContactsPhone" />
      <el-table-column
        label="状态"
        align="center"
        prop="coStatus"
        :formatter="coStatusFormat"
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:contractOther:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:contractOther:remove']"
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

    <!-- 添加或修改其他销售对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同编号" prop="coCode">
          <el-input v-model="form.coCode" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="购买单位" prop="coProductPrice">
          <el-input
            v-model="form.coProductPrice"
            placeholder="请输入购买单位"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="coContacts">
          <el-input v-model="form.coContacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="coContactsPhone">
          <el-input
            v-model="form.coContactsPhone"
            placeholder="请输入联系方式"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="coProductName">
          <el-input v-model="form.coProductName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="购买数量" prop="coProductQuantity">
          <el-input
            v-model="form.coProductQuantity"
            placeholder="请输入购买数量"
          />
        </el-form-item>
        <el-form-item label="购买价格" prop="coProductPrice">
          <el-input
            v-model="form.coProductPrice"
            placeholder="请输入购买价格"
          />
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
import {
  listContractOther,
  getContractOther,
  delContractOther,
  addContractOther,
  updateContractOther,
  exportContractOther,
} from "@/api/erp/contractOther";

export default {
  name: "ContractOther",
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
      // 其他销售表格数据
      contractOtherList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      coStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        coCompany: null,
        coCode: null,
        coContacts: null,
        coContactsPhone: null,
        coProductId: null,
        coProductName: null,
        coProductQuantity: null,
        coProductActualQuantity: null,
        coProductPrice: null,
        coStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("erp_contract_other_status").then((response) => {
      this.coStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询其他销售列表 */
    getList() {
      this.loading = true;
      listContractOther(this.queryParams).then((response) => {
        this.contractOtherList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    coStatusFormat(row, column) {
      return this.selectDictLabel(this.coStatusOptions, row.coStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        coId: null,
        coCompany: null,
        coCode: null,
        coContacts: null,
        coContactsPhone: null,
        coProductId: null,
        coProductName: null,
        coProductQuantity: null,
        coProductActualQuantity: null,
        coProductPrice: null,
        coStatus: "0",
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.coId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加其他销售";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const coId = row.coId || this.ids;
      getContractOther(coId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改其他销售";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.coId != null) {
            updateContractOther(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContractOther(this.form).then((response) => {
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
      const coIds = row.coId || this.ids;
      this.$confirm(
        '是否确认删除其他销售编号为"' + coIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delContractOther(coIds);
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
      this.$confirm("是否确认导出所有其他销售数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportContractOther(queryParams);
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
