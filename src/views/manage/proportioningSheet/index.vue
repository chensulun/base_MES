<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="108px">
      <el-form-item label="混合料类型" prop="taskProductionType">
        <el-input
          v-model="queryParams.taskProductionType"
          placeholder="请输入混合料类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="psType">
        <el-select v-model="queryParams.psType" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in psTypeOptions"
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
          v-hasPermi="['manage:proportioningSheet:add']"
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
          v-hasPermi="['manage:proportioningSheet:edit']"
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
          v-hasPermi="['manage:proportioningSheet:remove']"
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
          v-hasPermi="['manage:proportioningSheet:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="proportioningSheetList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="配比单编号" align="center" prop="psCode"/>
      <el-table-column label="混合料类型" align="center" prop="taskProductionType"/>
      <el-table-column label="审核状态" align="center" prop="psType" :formatter="psTypeFormat"/>
      <el-table-column label="上传时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleSearch(scope.row)"
            v-hasPermi="['manage:proportioningSheet:edit']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:proportioningSheet:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:proportioningSheet:remove']"
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

    <!-- 添加或修改配比单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>基本信息</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="taskId">
              <el-select filterable v-model="form.taskId" @change="taskSelectChange" placeholder="请选择任务"
                         style="width: 100%">
                <el-option
                  v-for="item in taskList"
                  :key="item.taskId"
                  :label="item.projectName"
                  :value="item.taskId">
                  <span style="float: left">{{ item.projectName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.taskCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="混合料类型" prop="taskProductionType">
              <el-input readonly v-model="form.taskProductionType" placeholder="请输入混合料类型"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板选择" prop="taskProductionType">
              <el-select filterable v-model="form.modelId" @change="modelSelectChange" placeholder="请选择模板"
                         style="width: 100%">
                <el-option
                  v-for="item in proportioningSheetAllList"
                  :key="item.psId"
                  :label="item.psCode"
                  :value="item.psId">
                  <span style="float: left">{{ item.psCode }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.taskProductionType }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="沥青标号" prop="psAsphaltGrade">
              <el-input v-model="form.psAsphaltGrade" placeholder="请输入沥青标号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配比单编号" prop="psAsphaltGrade">
              <el-input v-model="form.psCode" placeholder="请输入配比单编号(不输入时系统自动生成)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="温度区间" prop="psTemperatureRange">
              <el-input v-model="form.psTemperatureRange" placeholder="请输入温度区间"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班次" prop="psClasses">
              <el-input v-model="form.psClasses" placeholder="请输入班次"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="天气" prop="psWeather">
              <el-input v-model="form.psWeather" placeholder="请输入天气"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="石料加热温度(℃)" prop="psHeatingTemperatureOfStone">
              <el-input v-model="form.psHeatingTemperatureOfStone" placeholder="请输入石料加热温度"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品出厂温度(℃)" prop="psFactoryTemperature">
              <el-input v-model="form.psFactoryTemperature" placeholder="请输入产品出厂温度"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机号" prop="psMachineNumber">
              <el-input v-model="form.psMachineNumber" placeholder="请输入机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="沥青加热温度(℃)" prop="psHeatingTemperatureOfAsphalt">
              <el-input v-model="form.psHeatingTemperatureOfAsphalt" placeholder="请输入沥青加热温度"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" prop="psDate">
              <el-date-picker clearable size="small"
                              v-model="form.psDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              style="width: 100%"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="干拌时间(s)" prop="psMixingTime">
              <el-input v-model="form.psMixingTime" placeholder="请输入干拌时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="湿拌时间(s)" prop="psWetMixingTime">
              <el-input v-model="form.psWetMixingTime" placeholder="请输入湿拌时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核状态" prop="psType">
              <el-select v-model="form.psType" placeholder="请选择审核状态">
                <el-option
                  v-for="dict in psTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="psRemark">
              <el-input type="textarea" v-model="form.psRemark" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>冷料仓配比</el-divider>
          </el-col>
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              size="mini"
              style="float:right"
              @click="addRow(0)"
            >
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-table border
                      :data="form.psColdMaterialDataList"
                      style="width: 100%">
              <el-table-column prop="name" align="center" label="冷料仓各规格">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.warehouse" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="原材料厂商">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.supplierId" @change="supplierSelectChange(scope.row)"
                             placeholder="请选择供应商">
                    <el-option
                      v-for="dict in supplierList"
                      :key="dict.supplierId"
                      :label="dict.supplierName"
                      :value="dict.supplierId"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="price" align="center" label="原材料规格">
                <template slot-scope="scope">
                  <el-select filterable v-model="scope.row.materialId" @change="materialSelectChange(scope.row)"
                             placeholder="请选择">
                    <el-option-group
                      v-for="material in materialList"
                      :key="material.materialId"
                      :label="material.materialName">
                      <el-option
                        v-for="children in material.children"
                        :key="children.materialId"
                        :label="children.materialName"
                        :value="children.materialId">
                      </el-option>
                    </el-option-group>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="total" align="center" label="重量/比例">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.value" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="total" align="center" label="备注">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.remark" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.psColdMaterialDataList)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>热料仓配比</el-divider>
          </el-col>
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              size="mini"
              style="float:right"
              @click="addRow(1)"
            >
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-table border
                      :data="form.psHotMaterialDataList"
                      style="width: 100%">
              <el-table-column prop="name" align="center" label="热料仓">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.warehouse" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="重量">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.value" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="备注">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.remark" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.psHotMaterialDataList)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" v-if="add" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addProportioningSheet,
    delProportioningSheet,
    exportProportioningSheet,
    getProportioningSheet,
    listProportioningSheet,
    updateProportioningSheet
  } from "@/api/manage/proportioningSheet";

  import {listSupplier} from "@/api/manage/supplier";
  import {listMaterial} from "@/api/manage/material";
  import {listTask} from "@/api/manage/task";

  export default {
    name: "ProportioningSheet",
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

        // 配比单表格数据
        proportioningSheetList: [],
        // 配比单全部数据
        proportioningSheetAllList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 审核状态字典
        psTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          taskProductionType: null,
          psType: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        add: false,
        //冷料仓初始数据
        initColdMaterialDataList: [
          {
            warehouse: '1-5',
            supplierId: null,
            supplierName: null,
            materialId: null,
            materialName: null,
            value: null,
            remark: null
          },
          {
            warehouse: '5-10',
            supplierId: null,
            supplierName: null,
            materialId: null,
            materialName: null,
            value: null,
            remark: null
          },
          {
            warehouse: '10-15',
            supplierId: null,
            supplierName: null,
            materialId: null,
            materialName: null,
            value: null,
            remark: null
          },
          {
            warehouse: '15-20',
            supplierId: null,
            supplierName: null,
            materialId: null,
            materialName: null,
            value: null,
            remark: null
          },
        ],
        //热料仓初始数据
        initHotMaterialDataList: [
          {warehouse: '仓1', value: null, remark: null},
          {warehouse: '仓2', value: null, remark: null},
          {warehouse: '仓3', value: null, remark: null},
          {warehouse: '仓4', value: null, remark: null},
          {warehouse: '仓5', value: null, remark: null},
          {warehouse: '仓6', value: null, remark: null},
          {warehouse: '仓7', value: null, remark: null},
          {warehouse: '粉料1', value: null, remark: null},
          {warehouse: '粉料2', value: null, remark: null},
          {warehouse: '回收料', value: null, remark: null},
          {warehouse: '回收粉', value: null, remark: null},
          {warehouse: '油石比', value: null, remark: null},
          {warehouse: '添加剂', value: null, remark: null},
        ],
        //原材数据
        materialList: [],
        materialList1: [],
        // 供应商表格数据
        supplierList: [],
        //任务列表
        taskList: []
      };
    },
    created() {
      this.getList();
      this.getDicts("m_proportioning_sheet_status").then(response => {
        this.psTypeOptions = response.data;
      });
      this.getMaterialList();
      this.getSupplierList();
      this.getTaskList();
      this.getAllList();
    },
    methods: {
      addRow(type) {
        if (type === 0) {
          let coldMaterial = {
            warehouse: null,
            supplierId: null,
            supplierName: null,
            materialId: null,
            materialName: null,
            value: null,
            remark: null
          };
          this.form.psColdMaterialDataList.push(coldMaterial);
        } else if (type === 1) {
          let hotMaterial = {warehouse: null, value: null, remark: null};
          this.form.psHotMaterialDataList.push(hotMaterial);
        }
      },
      /** 供应商下拉事件*/
      taskSelectChange(taskId) {
        let task = this.taskList.find((item) => {
          return item.taskId === taskId;
        });
        this.form.taskName = task.projectName;
        this.form.taskProductionType = task.taskProductionType;
      },
      /** 供应商下拉事件*/
      modelSelectChange(psId) {
        let ps = this.proportioningSheetAllList.find((item) => {
          return item.psId === psId;
        });
        let taskId = this.form.taskId;
        let taskProductionType = this.form.taskProductionType;
        let taskName = this.form.taskName;
        let modelId = this.form.modelId;
        let pId = this.form.psId;
        let psCode = this.form.psCode;
        this.form = JSON.parse(JSON.stringify(ps));
        this.form.psColdMaterialDataList = JSON.parse(this.form.psColdMaterialData);
        this.form.psHotMaterialDataList = JSON.parse(this.form.psHotMaterialData);
        this.form.taskId = taskId;
        this.form.taskProductionType = taskProductionType;
        this.form.taskName = taskName;
        this.form.modelId = modelId;
        this.form.psId = pId;
        this.form.psCode = psCode;
      },
      /** 获取任务列表*/
      getTaskList() {
        listTask(null).then(response => {
          this.taskList = response.rows;
        });
      },
      /** 供应商下拉事件*/
      supplierSelectChange(data) {
        let supplier = this.supplierList.find((item) => {
          return item.supplierId === data.supplierId;
        });
        data.supplierName = supplier.supplierName;
        this.$forceUpdate();
      },
      /** 原材下拉事件*/
      materialSelectChange(data) {
        let material = this.materialList1.find((item) => {
          return item.materialId === data.materialId;
        });
        data.materialName = material.materialName;
        this.$forceUpdate();
      },
      /** 获取供应商列表*/
      getSupplierList() {
        listSupplier(null).then(response => {
          this.supplierList = response.rows;
        });
      },
      /** 获取原材数据 */
      getMaterialList() {
        listMaterial(null).then(response => {
          this.materialList1 = response.data;
          this.materialList = this.handleTree(response.data, "materialId", "parentId");
        });
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      /** 查询配比单列表 */
      getAllList() {
        listProportioningSheet(null).then(response => {
          this.proportioningSheetAllList = response.rows;
        });
      },
      /** 查询配比单列表 */
      getList() {
        this.loading = true;
        listProportioningSheet(this.queryParams).then(response => {
          this.proportioningSheetList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 审核状态字典翻译
      psTypeFormat(row, column) {
        return this.selectDictLabel(this.psTypeOptions, row.psType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          psId: null,
          psCode: null,
          taskId: null,
          taskName: null,
          taskProductionType: null,
          psAsphaltGrade: null,
          psTemperatureRange: null,
          psClasses: null,
          psWeather: null,
          psHeatingTemperatureOfStone: null,
          psFactoryTemperature: null,
          psMachineNumber: null,
          psHeatingTemperatureOfAsphalt: null,
          psDate: null,
          psMixingTime: null,
          psWetMixingTime: null,
          psType: null,
          psRemark: null,
          psColdMaterialData: null,
          psColdMaterialDataList: [],
          psHotMaterialData: null,
          psHotMaterialDataList: [],
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          //模板id
          modelId: null,
        };
        this.form.psColdMaterialDataList = JSON.parse(JSON.stringify(this.initColdMaterialDataList));
        this.form.psHotMaterialDataList = JSON.parse(JSON.stringify(this.initHotMaterialDataList));
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
        this.ids = selection.map(item => item.psId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加配比单";
      },
      /** 查看按钮操作 */
      handleSearch(row) {
        this.reset();
        const psId = row.psId || this.ids
        getProportioningSheet(psId).then(response => {
          this.form = response.data;
          this.form.psColdMaterialDataList = JSON.parse(this.form.psColdMaterialData);
          this.form.psHotMaterialDataList = JSON.parse(this.form.psHotMaterialData);
          this.add = false;
          this.open = true;
          this.title = "查看配比单";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const psId = row.psId || this.ids
        getProportioningSheet(psId).then(response => {
          this.form = response.data;
          this.form.psColdMaterialDataList = JSON.parse(this.form.psColdMaterialData);
          this.form.psHotMaterialDataList = JSON.parse(this.form.psHotMaterialData);
          this.add = true;
          this.open = true;
          this.title = "修改配比单";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.psColdMaterialData = JSON.stringify(this.form.psColdMaterialDataList);
            this.form.psHotMaterialData = JSON.stringify(this.form.psHotMaterialDataList);
            if (this.form.psId != null) {
              updateProportioningSheet(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addProportioningSheet(this.form).then(response => {
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
        const psIds = row.psId || this.ids;
        this.$confirm('是否确认删除配比单编号为"' + psIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delProportioningSheet(psIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有配比单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportProportioningSheet(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
