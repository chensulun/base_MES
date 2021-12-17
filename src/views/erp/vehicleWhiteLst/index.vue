<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="车牌" prop="vwlCarNo">
        <el-input
          v-model="queryParams.vwlCarNo"
          placeholder="请输入车牌"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驾驶员" prop="vwlDriver">
        <el-input
          v-model="queryParams.vwlDriver"
          placeholder="请输入驾驶员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="vwlPhone">
        <el-input
          v-model="queryParams.vwlPhone"
          placeholder="请输入联系方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色" prop="vwlType">
        <el-select v-model="queryParams.vwlType" placeholder="请选择角色" clearable size="small">
          <el-option
            v-for="dict in vwlTypeOptions"
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
          v-hasPermi="['erp:vehicleWhiteLst:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:vehicleWhiteLst:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:vehicleWhiteLst:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['erp:vehicleWhiteLst:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vehicleWhiteLstList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="车牌" align="center" prop="vwlCarNo"/>
      <el-table-column label="驾驶员" align="center" prop="vwlDriver"/>
      <el-table-column label="联系方式" align="center" prop="vwlPhone"/>
      <el-table-column label="角色" align="center" prop="vwlType" :formatter="vwlTypeFormat"/>
      <el-table-column label="所属单位" align="center" prop="vwlAffiliatedUnit"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:vehicleWhiteLst:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:vehicleWhiteLst:remove']"
          >删除
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

    <!-- 添加或修改车辆白名单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车牌" prop="vwlCarNo">
          <el-input v-model="form.vwlCarNo" placeholder="请输入车牌"/>
        </el-form-item>
        <el-form-item label="驾驶员" prop="vwlDriver">
          <el-input v-model="form.vwlDriver" placeholder="请输入驾驶员"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="vwlPhone">
          <el-input v-model="form.vwlPhone" placeholder="请输入联系方式"/>
        </el-form-item>
        <el-form-item label="所属单位" prop="vwlAffiliatedUnit">
          <el-input v-model="form.vwlAffiliatedUnit" placeholder="请输入所属单位"/>
        </el-form-item>
        <el-form-item label="角色" prop="vwlType">
          <el-radio-group v-model="form.vwlType">
            <el-radio
              v-for="dict in vwlTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
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
    listVehicleWhiteLst,
    getVehicleWhiteLst,
    delVehicleWhiteLst,
    addVehicleWhiteLst,
    updateVehicleWhiteLst,
    exportVehicleWhiteLst
  } from "@/api/erp/vehicleWhiteLst";

  export default {
    name: "VehicleWhiteLst",
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
        // 车辆白名单表格数据
        vehicleWhiteLstList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 类型(员工 )字典
        vwlTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          vwlCarNo: null,
          vwlDriver: null,
          vwlPhone: null,
          vwlType: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("erp_vehicle_white_list_type").then(response => {
        this.vwlTypeOptions = response.data;
      });
    },
    methods: {
      /** 查询车辆白名单列表 */
      getList() {
        this.loading = true;
        listVehicleWhiteLst(this.queryParams).then(response => {
          this.vehicleWhiteLstList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 类型(员工 )字典翻译
      vwlTypeFormat(row, column) {
        return this.selectDictLabel(this.vwlTypeOptions, row.vwlType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          vwlId: null,
          vwlCarNo: null,
          vwlDriver: null,
          vwlPhone: null,
          vwlType: null,
          vwlAffiliatedUnit: null,
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
        this.ids = selection.map(item => item.vwlId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加车辆白名单";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const vwlId = row.vwlId || this.ids
        getVehicleWhiteLst(vwlId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改车辆白名单";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.vwlId != null) {
              updateVehicleWhiteLst(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addVehicleWhiteLst(this.form).then(response => {
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
        const vwlIds = row.vwlId || this.ids;
        this.$confirm('是否确认删除车辆白名单编号为"' + vwlIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delVehicleWhiteLst(vwlIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有车辆白名单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportVehicleWhiteLst(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
