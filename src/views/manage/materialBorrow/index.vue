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
    <!-- 
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:materialBorrow:add']"
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
          v-hasPermi="['manage:materialBorrow:edit']"
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
          v-hasPermi="['manage:materialBorrow:remove']"
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
          v-hasPermi="['manage:materialBorrow:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="materialBorrowList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="id" align="center" prop="mbId" /> -->
      <el-table-column label="借用单位" align="center" prop="mbCompany" />
      <el-table-column label="借用材料" align="center" prop="mbMaterialName" />
      <el-table-column
        label="计划借用数量"
        align="center"
        prop="mbMaterialQuantity"
      />
      <el-table-column
        label="借用实际数量"
        align="center"
        prop="mbMaterialActualQuantity"
      />
      <el-table-column label="材料价格" align="center" prop="mbMaterialPrice" />
      <el-table-column
        label="借用时限"
        align="center"
        prop="mbStartTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.mbStartTime, "{y}-{m}-{d}") }}</span
          ><span>{{ parseTime(scope.row.mbEndTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="mbStatus"
        :formatter="mbStatusFormat"
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
            v-hasPermi="['manage:materialBorrow:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:materialBorrow:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:materialBorrow:remove']"
            >结算</el-button
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

    <!-- 添加或修改借用管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="10">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="24">
            <el-form-item label="借用单位" prop="mbCompany">
              <el-col :span="10">
                <el-input
                  v-model="form.mbCompany"
                  placeholder="请输入借用单位"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借用材料" prop="mbMaterialName">
              <el-select
                v-model="form.mbMaterialName"
                style="width: 100%"
                @change="cChange"
                placeholder="请选择材料规格"
              >
                <el-option
                  v-for="dict in cMaterialList"
                  :key="dict.materialId"
                  :label="dict.materialName"
                  :value="dict.materialId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借用数量" prop="mbMaterialQuantity">
              <el-input
                v-model="form.mbMaterialQuantity"
                placeholder="请输入借用数量"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="材料价格" prop="mbMaterialPrice">
              <el-col :span="10">
                <el-input
                  v-model="form.mbMaterialPrice"
                  placeholder="请输入材料价格"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="借用期限" prop="mbStartTime">
              <el-date-picker
                v-model="timeArr"
                size="small"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="mbRemark">
              <el-input
                v-model="form.mbRemark"
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

    <!-- 结算弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="openjs"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="归还材料" prop="mbMaterialName">
          <el-input v-model="form.mbMaterialName" :readonly="true" />
        </el-form-item>

        <el-form-item label="归还实际数量" prop="mbMaterialActualQuantity">
          <el-input v-model="form.mbMaterialActualQuantity" :readonly="true" />
        </el-form-item>
        <el-form-item label="归还价格" prop="mbMaterialPrice">
          <el-input v-model="form.mbMaterialPrice" :readonly="true" />
        </el-form-item>
        <el-form-item label="盈亏" prop="mbRemark">
          <el-input v-model="form.mbRemark" :readonly="true" />
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
  listMaterialBorrow,
  getMaterialBorrow,
  delMaterialBorrow,
  addMaterialBorrow,
  updateMaterialBorrow,
  exportMaterialBorrow,
} from "@/api/manage/materialBorrow";
import { listMaterial } from "@/api/manage/material";

export default {
  name: "MaterialBorrow",
  components: {},
  data() {
    return {
      timeArr: [],
      //材料规格
      cMaterialList: [],
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
      // 借用管理表格数据
      materialBorrowList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openjs: false,
      // 状态(借用中 已归还 超期)字典
      mbStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mbCompany: null,
        mbMaterialId: null,
        mbMaterialName: null,
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
    this.getDicts("m_material_borrow_status").then((response) => {
      this.mbStatusOptions = response.data;
    });
    this.getMaterialList();
  },
  methods: {
    /** 查询借用管理列表 */
    getList() {
      this.loading = true;
      listMaterialBorrow(this.queryParams).then((response) => {
        this.materialBorrowList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态(借用中 已归还 超期)字典翻译
    mbStatusFormat(row, column) {
      return this.selectDictLabel(this.mbStatusOptions, row.mbStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        mbId: null,
        mbCode: null,
        mbCompany: null,
        mbMaterialId: null,
        mbMaterialName: null,
        mbMaterialQuantity: null,
        mbMaterialActualQuantity: null,
        mbMaterialPrice: null,
        mbStartTime: null,
        mbEndTime: null,
        mbRemark: null,
        mbStatus: "0",
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
      this.ids = selection.map((item) => item.mbId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加借用管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const mbId = row.mbId || this.ids;
      getMaterialBorrow(mbId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改借用管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.form.mbStartTime = this.timeArr[0];
      this.form.mbEndTime = this.timeArr[0];
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.mbId != null) {
            updateMaterialBorrow(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialBorrow(this.form).then((response) => {
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
      const mbIds = row.mbId || this.ids;
      this.$confirm(
        '是否确认删除借用管理编号为"' + mbIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delMaterialBorrow(mbIds);
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
      this.$confirm("是否确认导出所有借用管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportMaterialBorrow(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 原材料列表 */
    getMaterialList() {
      listMaterial(null).then((response) => {
        this.materialList = response.data;
        this.cMaterialList = response.data;

        this.pMaterialList = this.materialList.filter(
          (item) => item.parentId === 0
        );
      });
    },
    //材料变化
    cChange(materialId) {
      let material = this.cMaterialList.find((item) => {
        return item.materialId === materialId;
      });
      this.form.mbMaterialName = material.materialName;
      this.form.mbMaterialId = material.materialId;
    },
  },
};
</script>
