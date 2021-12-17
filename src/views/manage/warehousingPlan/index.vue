<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="日期">
        <el-date-picker
          v-model="daterangeCreateTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="材料类型" prop="wpMaterialType">
        <el-select v-model="queryParams.wpMaterialType" placeholder="请选择材料类型" clearable size="small">
          <el-option
            v-for="dict in wpMaterialTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="wpSupplierName">
        <el-input
          v-model="queryParams.wpSupplierName"
          placeholder="请输入供应商"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="承运单位" prop="wpCarrier">
        <el-input
          v-model="queryParams.wpCarrier"
          placeholder="请输入承运单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="wpStatus">
        <el-select v-model="queryParams.wpStatus" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in wpStatusOptions"
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
          v-hasPermi="['manage:warehousingPlan:add']"
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
          v-hasPermi="['manage:warehousingPlan:edit']"
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
          v-hasPermi="['manage:warehousingPlan:remove']"
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
          v-hasPermi="['manage:warehousingPlan:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"  style="top: 30px" :data="warehousingPlanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="wpId"/>
      <el-table-column label="材料类型" align="center" prop="wpMaterialType" :formatter="wpMaterialTypeFormat"/>
      <el-table-column label="供应商名称" align="center" prop="wpSupplierName"/>
      <el-table-column label="承运单位" align="center" prop="wpCarrier"/>
      <el-table-column label="联系电话" align="center" prop="wpPhone"/>
      <el-table-column label="计划量" align="center" prop="wpPhone"/>
      <el-table-column label="入库量" align="center" prop="wpPhone"/>
      <el-table-column label="计划金额" align="center" prop="wpPhone"/>
      <el-table-column label="实付金额" align="center" prop="wpPhone"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="审核状态" align="center" prop="wpStatus" :formatter="wpStatusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:warehousingPlan:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:warehousingPlan:remove']"
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

    <!-- 添加或修改入库计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="8">
            <el-form-item label="材料类型" prop="wpMaterialType">
              <el-select v-model="form.wpMaterialType" placeholder="请选择材料类型">
                <el-option
                  v-for="dict in wpMaterialTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商">
              <el-select v-model="form.wpSupplierId" @change="supplierSelectChange" placeholder="请选择供应商"
                         :style="{width: '100%'}">
                <el-option
                  v-for="dict in supplierList"
                  :key="dict.supplierId"
                  :label="dict.supplierName"
                  :value="dict.supplierId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同" prop="wpContractId">
              <el-select v-model="form.wpContractId" @change="contractSelectChange" placeholder="请选择合同"
                         :style="{width: '100%'}">
                <el-option
                  v-for="dict in contractList"
                  :key="dict.contractId"
                  :label="dict.contractCode"
                  :value="dict.contractId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="承运单位" prop="wpCarrier">
              <el-input v-model="form.wpCarrier" placeholder="请输入承运单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="wpPhone">
              <el-input v-model="form.wpPhone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核状态" prop="wpStatus">
              <el-select v-model="form.wpStatus" placeholder="请选择审核状态">
                <el-option
                  v-for="dict in wpStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="24">
            <el-table border :data="form.wpDataList" style="width: 100%">
              <el-table-column prop="name" align="center" width="150" label="材料名称">
                <template slot-scope="scope">
                  <el-select filterable v-model="scope.row.materialId" @change="materialSelectChange(scope.row)" placeholder="请选择">
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
              <el-table-column prop="quantity" align="center" label="计划入库量">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.quantity" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="price" align="center" label="签订价格">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.price" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="amount" align="center" label="金额">
                <template slot-scope="scope">
                  {{scope.row.amount = scope.row.quantity * scope.row.price}}
                </template>
              </el-table-column>
              <el-table-column prop="remark" align="center" label="备注">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.remark" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.wpDataList)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              :style="{width: '100%'}"
              @click="addRow"
            >新增
            </el-button>
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
    addWarehousingPlan,
    delWarehousingPlan,
    exportWarehousingPlan,
    getWarehousingPlan,
    listWarehousingPlan,
    updateWarehousingPlan
  } from "@/api/manage/warehousingPlan";
  import {listSupplier} from "@/api/manage/supplier";
  import {listMaterial} from "@/api/manage/material";
  import {listContract} from "@/api/manage/contract";

  export default {
    name: "WarehousingPlan",
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
        // 入库计划表格数据
        warehousingPlanList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 材料类型字典
        wpMaterialTypeOptions: [],
        // 审核状态字典
        wpStatusOptions: [],
        //原材数据
        materialList: [],
        materialList1: [],
        // 合同表格数据
        contractList: [],
        // 日期时间范围
        daterangeCreateTime: [],
        // 供应商表格数据
        supplierList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          wpMaterialType: null,
          wpSupplierName: null,
          wpCarrier: null,
          wpStatus: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getSupplierList();
      this.getMaterialList();
      this.getContractList();
      this.getDicts("m_wp_material_type").then(response => {
        this.wpMaterialTypeOptions = response.data;
      });
      this.getDicts("m_wp_status").then(response => {
        this.wpStatusOptions = response.data;
      });
    },
    methods: {
      /** 合同下拉事件*/
      contractSelectChange(contractId) {
        let contract = this.contractList.find((item) => {
          return item.contractId === contractId;
        });
        this.form.wpContractCode = contract.contractCode;
      },
      /** 获取合同数据 */
      getContractList() {
        listContract(null).then(response => {
          this.contractList = response.rows;
        });
      },
      /** 原材下拉事件*/
      materialSelectChange(data) {
        let material = this.materialList1.find((item) => {
          return item.materialId === data.materialId;
        });
        data.materialName = material.materialName;
        this.$forceUpdate();
      },
      /** 获取原材数据 */
      getMaterialList() {
        listMaterial(null).then(response => {
          this.materialList1 = response.data;
          this.materialList = this.handleTree(response.data, "materialId", "parentId");
        });
      },
      /** 供应商下拉事件*/
      supplierSelectChange(supplierId){
        let supplier = this.supplierList.find((item) => {
          return item.supplierId === supplierId
        });
        this.form.wpSupplierName = supplier.supplierName;
      },
      /** 获取供应商列表*/
      getSupplierList() {
        listSupplier(null).then(response => {
          this.supplierList = response.rows;
        });
      },
      /** 添加材料行*/
      addRow() {
        let material = {materialId: '', materialName: '', quantity: 0, price: 0, amount: 0, remark: ''};
        if (!this.form.wpDataList){
          this.form.wpDataList = [];
        }
        this.form.wpDataList.push(material);
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      /** 查询入库计划列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listWarehousingPlan(this.queryParams).then(response => {
          this.warehousingPlanList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 材料类型字典翻译
      wpMaterialTypeFormat(row, column) {
        return this.selectDictLabel(this.wpMaterialTypeOptions, row.wpMaterialType);
      },
      // 审核状态字典翻译
      wpStatusFormat(row, column) {
        return this.selectDictLabel(this.wpStatusOptions, row.wpStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          wpId: null,
          wpMaterialType: null,
          wpSupplierId: null,
          wpSupplierName: null,
          wpContractId: null,
          wpContractCode: null,
          wpCarrier: null,
          wpPhone: null,
          wpStatus: null,
          wpData: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          wpDataList:[]
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
        this.ids = selection.map(item => item.wpId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd: function () {
        this.reset();
        this.open = true;
        this.title = "添加入库计划";
        //默认第一个合同数据
        if (this.contractList.length > 0) {
          let contract = this.contractList[0];
          console.log(contract);
          this.form.wpContractId = contract.contractId;
          this.form.wpContractCode = contract.contractId;
          this.form.wpSupplierId = contract.contractSupplierId;
          this.form.wpSupplierName = contract.contractSupplierName;
          this.form.wpDataList = JSON.parse(contract.contractMaterialData);
        }
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const wpId = row.wpId || this.ids
        getWarehousingPlan(wpId).then(response => {
          this.form = response.data;
          this.form.wpDataList = JSON.parse(this.form.wpData);
          this.open = true;
          this.title = "修改入库计划";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.wpData = JSON.stringify(this.form.wpDataList);
            if (this.form.wpId != null) {
              updateWarehousingPlan(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addWarehousingPlan(this.form).then(response => {
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
        const wpIds = row.wpId || this.ids;
        this.$confirm('是否确认删除入库计划编号为"' + wpIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delWarehousingPlan(wpIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有入库计划数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportWarehousingPlan(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>

