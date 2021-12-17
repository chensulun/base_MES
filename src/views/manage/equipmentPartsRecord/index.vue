<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作类型" prop="eprType">
        <el-select v-model="queryParams.eprType" placeholder="请选择操作类型" clearable size="small">
          <el-option
            v-for="dict in eprTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配件" prop="epId">
        <el-input
          v-model="queryParams.epId"
          placeholder="请输入配件"
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

    <!--<el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:equipmentPartsRecord:add']"
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
          v-hasPermi="['manage:equipmentPartsRecord:edit']"
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
          v-hasPermi="['manage:equipmentPartsRecord:remove']"
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
          v-hasPermi="['manage:equipmentPartsRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <el-table v-loading="loading" :data="equipmentPartsRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="配件名称" align="center" prop="epName" />
      <el-table-column label="操作类型" align="center" prop="eprType" :formatter="eprTypeFormat" />
      <el-table-column label="出入数量" align="center" prop="eprValue" />
      <el-table-column label="开始数量" align="center" prop="epStartValue" />
      <el-table-column label="结束数量" align="center" prop="epEndValue" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改配件库消耗记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="操作值" prop="eprValue">
          <el-input v-model="form.eprValue" placeholder="请输入操作值" />
        </el-form-item>
        <el-form-item label="操作类型 0入库 1出库" prop="eprType">
          <el-select v-model="form.eprType" placeholder="请选择操作类型 0入库 1出库">
            <el-option
              v-for="dict in eprTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配件id" prop="epId">
          <el-input v-model="form.epId" placeholder="请输入配件id" />
        </el-form-item>
        <el-form-item label="配件名称" prop="epName">
          <el-input v-model="form.epName" placeholder="请输入配件名称" />
        </el-form-item>
        <el-form-item label="开始数量" prop="epStartValue">
          <el-input v-model="form.epStartValue" placeholder="请输入开始数量" />
        </el-form-item>
        <el-form-item label="操作后数量" prop="epEndValue">
          <el-input v-model="form.epEndValue" placeholder="请输入操作后数量" />
        </el-form-item>
        <el-form-item label="站点id" prop="msId">
          <el-input v-model="form.msId" placeholder="请输入站点id" />
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
import { listEquipmentPartsRecord, getEquipmentPartsRecord, delEquipmentPartsRecord, addEquipmentPartsRecord, updateEquipmentPartsRecord, exportEquipmentPartsRecord } from "@/api/manage/equipmentPartsRecord";
import {getMSId} from '@/utils/station'
export default {
  name: "EquipmentPartsRecord",
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
      // 配件库消耗记录表格数据
      equipmentPartsRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 操作类型 0入库 1出库字典
      eprTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eprType: null,
        epId: null,
        msId: null,
      },
      // 表单参数
      form: {},
      //站点id
      msId:null,
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    //获取站点id
    this.msId = getMSId();
    this.getList();
    this.getDicts("m_equipment_parts_record_type").then(response => {
      this.eprTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询配件库消耗记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.msId = this.msId;
      listEquipmentPartsRecord(this.queryParams).then(response => {
        this.equipmentPartsRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 操作类型 0入库 1出库字典翻译
    eprTypeFormat(row, column) {
      return this.selectDictLabel(this.eprTypeOptions, row.eprType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
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
      this.ids = selection.map(item => item.eprId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加配件库消耗记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const eprId = row.eprId || this.ids
      getEquipmentPartsRecord(eprId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改配件库消耗记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.eprId != null) {
            updateEquipmentPartsRecord(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEquipmentPartsRecord(this.form).then(response => {
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
      const eprIds = row.eprId || this.ids;
      this.$confirm('是否确认删除配件库消耗记录编号为"' + eprIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEquipmentPartsRecord(eprIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有配件库消耗记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportEquipmentPartsRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
