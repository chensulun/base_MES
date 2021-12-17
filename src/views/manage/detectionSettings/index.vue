<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="材料名称" prop="dsMaterialName">
        <el-select v-model="queryParams.dsMaterialName" placeholder="请选择材料名称" clearable size="small">
          <el-option label="请选择字典生成" value=""/>
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
          v-hasPermi="['manage:detectionSettings:add']"
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
          v-hasPermi="['manage:detectionSettings:edit']"
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
          v-hasPermi="['manage:detectionSettings:remove']"
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
          v-hasPermi="['manage:detectionSettings:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detectionSettingsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="材料类别" align="center" prop="dsMaterialPName"/>
      <el-table-column label="材料规格" align="center" prop="dsMaterialName"/>
      <el-table-column label="检测类型" align="center" prop="dsType" :formatter="dsTypeFormat"/>
      <el-table-column label="检测值" align="center" prop="dsValue"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:detectionSettings:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:detectionSettings:remove']"
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

    <!-- 添加或修改报检设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="材料类别" prop="dsMaterialPId">
          <el-select v-model="form.dsMaterialPId" style="width: 100%" @change="pChange" placeholder="请选择材料类别">
            <el-option
              v-for="dict in pMaterialList"
              :key="dict.materialId"
              :label="dict.materialName"
              :value="dict.materialId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="材料规格" prop="dsMaterialId">
          <el-select v-model="form.dsMaterialId" style="width: 100%" @change="cChange" placeholder="请选择材料规格">
            <el-option
              v-for="dict in cMaterialList"
              :key="dict.materialId"
              :label="dict.materialName"
              :value="dict.materialId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检测类型">
          <el-radio-group v-model="form.dsType">
            <el-radio
              v-for="dict in dsTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="检测值" prop="dsValue">
          <el-input v-model="form.dsValue" placeholder="请输入检测值"/>
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
    listDetectionSettings,
    getDetectionSettings,
    delDetectionSettings,
    addDetectionSettings,
    updateDetectionSettings,
    exportDetectionSettings
  } from "@/api/manage/detectionSettings";
  import {listMaterial} from "@/api/manage/material";
  import {getMSId} from '@/utils/station'

  export default {
    name: "DetectionSettings",
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
        // 报检设置表格数据
        detectionSettingsList: [],
        //原材料列表
        materialList: [],
        //材料类别
        pMaterialList: [],
        //材料规格
        cMaterialList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 检测类型 0 累计重量 1车次字典
        dsTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dsMaterialName: null,
          msId: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //站点id
        msId: null
      };
    },
    created() {
      this.msId = getMSId();
      this.getList();
      this.getDicts("m_detection_settings_type").then(response => {
        this.dsTypeOptions = response.data;
      });
      this.getMaterialList();
    },
    methods: {
      //材料变化
      cChange(materialId) {
        let material = this.cMaterialList.find((item) => {
          return item.materialId === materialId
        });
        this.form.dsMaterialName = material.materialName;
      },
      //上级菜单变化
      pChange(materialId) {
        let material = this.pMaterialList.find((item) => {
          return item.materialId === materialId
        });
        this.form.dsMaterialPName = material.materialName;
        this.findC(materialId);
      },
      findC(pId) {
        this.cMaterialList = this.materialList.filter(item => item.parentId === pId);
      },
      /** 原材料列表 */
      getMaterialList() {
        listMaterial(null).then(response => {
          this.materialList = response.data;
          this.pMaterialList = this.materialList.filter(item => item.parentId === 0);
        });
      },
      /** 查询报检设置列表 */
      getList() {
        this.loading = true;
        this.queryParams.msId = this.msId;
        listDetectionSettings(this.queryParams).then(response => {
          this.detectionSettingsList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 检测类型 0 累计重量 1车次字典翻译
      dsTypeFormat(row, column) {
        return this.selectDictLabel(this.dsTypeOptions, row.dsType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          dsId: null,
          msId: null,
          dsMaterialPId: null,
          dsMaterialPName: null,
          dsMaterialId: null,
          dsMaterialName: null,
          dsType: "0",
          dsValue: null,
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
        this.ids = selection.map(item => item.dsId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加报检设置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const dsId = row.dsId || this.ids
        getDetectionSettings(dsId).then(response => {
          this.form = response.data;
          this.findC(this.form.dsMaterialPId);
          this.open = true;
          this.title = "修改报检设置";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.dsId != null) {
              updateDetectionSettings(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              this.form.msId = this.msId;
              addDetectionSettings(this.form).then(response => {
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
        const dsIds = row.dsId || this.ids;
        this.$confirm('是否确认删除报检设置编号为"' + dsIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDetectionSettings(dsIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有报检设置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportDetectionSettings(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
