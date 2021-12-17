<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="入库时间">
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

<!--    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:materialPrice:add']"
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
          v-hasPermi="['manage:materialPrice:edit']"
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
          v-hasPermi="['manage:materialPrice:remove']"
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
          v-hasPermi="['manage:materialPrice:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <el-table v-loading="loading" :data="materialPriceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="材料名称" align="center" prop="materialName" />
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="入库时间" align="center" prop="weighInTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.weighInTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" align="center" prop="weighNetWeight" />
      <el-table-column label="价格" align="center" prop="mpPrice" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:materialPrice:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:materialPrice:remove']"
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

    <!-- 添加或修改价格管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原材id" prop="materialId">
          <el-input v-model="form.materialId" placeholder="请输入原材id" />
        </el-form-item>
        <el-form-item label="材料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入材料名称" />
        </el-form-item>
        <el-form-item label="供应商id" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商id" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input v-model="form.supplierName" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="入库时间" prop="weighInTime">
          <el-date-picker clearable size="small"
            v-model="form.weighInTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入库时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库数量" prop="weighNetWeight">
          <el-input v-model="form.weighNetWeight" placeholder="请输入入库数量" />
        </el-form-item>
        <el-form-item label="价格" prop="mpPrice">
          <el-input v-model="form.mpPrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="站点id" prop="msId">
          <el-input v-model="form.msId" placeholder="请输入站点id" />
        </el-form-item>
        <el-form-item label="磅房id" prop="prId">
          <el-input v-model="form.prId" placeholder="请输入磅房id" />
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
import { listMaterialPrice, getMaterialPrice, delMaterialPrice, addMaterialPrice, updateMaterialPrice, exportMaterialPrice } from "@/api/manage/materialPrice";

export default {
  name: "MaterialPrice",
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
      // 价格管理表格数据
      materialPriceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 入库时间时间范围
      daterangeWeighInTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        weighInTime: null,
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
    /** 查询价格管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeWeighInTime && '' != this.daterangeWeighInTime) {
        this.queryParams.params["beginWeighInTime"] = this.daterangeWeighInTime[0];
        this.queryParams.params["endWeighInTime"] = this.daterangeWeighInTime[1];
      }
      listMaterialPrice(this.queryParams).then(response => {
        this.materialPriceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        mpId: null,
        materialId: null,
        materialName: null,
        supplierId: null,
        supplierName: null,
        weighInTime: null,
        weighNetWeight: null,
        mpPrice: null,
        msId: null,
        prId: null,
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
      this.daterangeWeighInTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.mpId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加价格管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const mpId = row.mpId || this.ids
      getMaterialPrice(mpId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改价格管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.mpId != null) {
            updateMaterialPrice(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialPrice(this.form).then(response => {
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
      const mpIds = row.mpId || this.ids;
      this.$confirm('是否确认删除价格管理编号为"' + mpIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMaterialPrice(mpIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有价格管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportMaterialPrice(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
