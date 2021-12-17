<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="配件名称" prop="epName">
        <el-input
          v-model="queryParams.epName"
          placeholder="请输入配件名称"
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
          v-hasPermi="['manage:equipmentParts:add']"
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
          v-hasPermi="['manage:equipmentParts:edit']"
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
          v-hasPermi="['manage:equipmentParts:remove']"
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
          v-hasPermi="['manage:equipmentParts:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleRecordAdd"
        >入库</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="equipmentPartsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="配件名称" align="center" prop="epName" />
      <el-table-column label="配件数量" align="center" prop="epValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:equipmentParts:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:equipmentParts:remove']"
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

    <!-- 添加或修改配件库管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="配件名称" prop="epName">
          <el-input v-model="form.epName" placeholder="请输入配件名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--入库弹框-->
    <el-dialog title="入库" :visible.sync="recordOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="recordForm" :model="recordForm" :rules="rules" label-width="80px">
        <el-form-item label="配件" prop="epName">
          <el-select v-model="recordForm.epId" placeholder="请选择配件" style="width: 100%">
            <el-option
              v-for="dict in equipmentPartsAllList"
              :key="dict.epId"
              :label="dict.epName"
              :value="dict.epId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" prop="eprValue">
          <el-input type="number" v-model="recordForm.eprValue" placeholder="请输入操作值" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="recordSubmitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEquipmentParts, getEquipmentParts, delEquipmentParts, addEquipmentParts, updateEquipmentParts, exportEquipmentParts } from "@/api/manage/equipmentParts";
import {getMSId} from '@/utils/station'

export default {
  name: "EquipmentParts",
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
      // 配件库管理表格数据
      equipmentPartsList: [],
      //全部配件
      equipmentPartsAllList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //入库弹框
      recordOpen: false,
      //站点id
      msId:null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        epName: null,
        msId: null,
      },
      // 表单参数
      form: {},
      // 入库表单
      recordForm:{},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    //获取站点id
    this.msId = getMSId();
    this.getList();
    this.getAllList();
  },
  methods: {
    /** 查询配件库管理全部列表 */
    getAllList() {
      let query = {msId: this.msId};
      listEquipmentParts(query).then(response => {
        this.equipmentPartsAllList = response.rows;
      });
    },
    /** 查询配件库管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.msId = this.msId;
      listEquipmentParts(this.queryParams).then(response => {
        this.equipmentPartsList = response.rows;
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
        epId: null,
        epName: null,
        epValue: 0,
        msId: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    // 入库表单重置
    recordReset() {
      this.recordForm = {
        eprId: null,
        eprValue: null,
        eprType: null,
        epId: null,
        epName: null,
        epStartValue: null,
        epEndValue: null,
        msId: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("recordForm");
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
      this.ids = selection.map(item => item.epId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加配件库管理";
    },

    /** 新增按钮操作 */
    handleRecordAdd() {
      this.reset();
      this.recordOpen = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const epId = row.epId || this.ids
      getEquipmentParts(epId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改配件库管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.epId != null) {
            updateEquipmentParts(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.msId = this.msId;
            addEquipmentParts(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 入库提交按钮 */
    recordSubmitForm() {
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const epIds = row.epId || this.ids;
      this.$confirm('是否确认删除配件库管理编号为"' + epIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEquipmentParts(epIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有配件库管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportEquipmentParts(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
