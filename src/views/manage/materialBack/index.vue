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
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
      <el-form-item label="材料类型" prop="mbMaterialName">
        <el-input
          v-model="queryParams.mbMaterialName"
          placeholder="请输入材料类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:materialBorrow:add']"
          >新增</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:materialBack:add']"
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
          v-hasPermi="['manage:materialBack:edit']"
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
          v-hasPermi="['manage:materialBack:remove']"
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
          v-hasPermi="['manage:materialBack:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="materialBackList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="id" align="center" prop="id" /> -->
      <el-table-column label="归还单位" align="center" prop="company" />
      <el-table-column label="归还材料" align="center" prop="materialName" />
      <el-table-column
        label="计划归还数量"
        align="center"
        prop="materialQuantity"
      />
      <el-table-column
        label="实际归还数量"
        align="center"
        prop="materialActualQuantity"
      />
      <el-table-column label="材料单价" align="center" prop="materialPrice" />
      <el-table-column label="借用编号" align="center" prop="id" />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
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
            icon="el-icon-search"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:materialBack:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:materialBack:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:materialBack:remove']"
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
      :close-on-click-modal="false"
    />

    <!-- 添加或修改归还管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-row :gutter="10">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="12">
            <el-form-item label="借用合同" prop="mbId">
              <el-input v-model="form.mbId" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借用材料" prop="code">
              <el-input v-model="form.code" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借用数量" prop="company">
              <el-input v-model="form.company" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="company">
              <el-input v-model="form.company" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="借用单位" prop="company">
              <el-col :span="10">
                <el-input v-model="form.company" :readonly="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div
              style="
                width: 100%;
                height: 2px;
                background-color: #eee;
                margin-bottom: 20px;
              "
            ></div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归还材料" prop="materialName">
              <el-input
                v-model="form.materialName"
                placeholder="请输入归还材料"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归还数量" prop="materialQuantity">
              <el-input
                v-model="form.materialQuantity"
                placeholder="请输入归还数量"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="归还单价" prop="materialPrice">
              <el-col :span="10">
                <el-input
                  v-model="form.materialPrice"
                  placeholder="请输入材料价格"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-form>
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
  listMaterialBack,
  getMaterialBack,
  delMaterialBack,
  addMaterialBack,
  updateMaterialBack,
  exportMaterialBack,
} from "@/api/manage/materialBack";

export default {
  name: "MaterialBack",
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
      // 归还管理表格数据
      materialBackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态(归还中 结束)字典
      statusOptions: [],
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        company: null,
        materialId: null,
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
    this.getDicts("m_material_back_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询归还管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] =
          this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listMaterialBack(this.queryParams).then((response) => {
        this.materialBackList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态(归还中 结束)字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        mbId: null,
        code: null,
        company: null,
        materialId: null,
        materialName: null,
        materialQuantity: null,
        materialActualQuantity: null,
        materialPrice: null,
        remark: null,
        status: "0",
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加归还管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMaterialBack(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改归还管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateMaterialBack(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialBack(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除归还管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delMaterialBack(ids);
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
      this.$confirm("是否确认导出所有归还管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportMaterialBack(queryParams);
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
