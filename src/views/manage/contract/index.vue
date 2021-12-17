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
      <el-form-item label="供应商" prop="contractSupplierId">
        <el-select v-model="queryParams.contractSupplierId" placeholder="请选择供应商">
          <el-option
            v-for="dict in supplierList"
            :key="dict.supplierId"
            :label="dict.supplierName"
            :value="dict.supplierId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授权代表" prop="contractSupplierRepresentative">
        <el-input
          v-model="queryParams.contractSupplierRepresentative"
          placeholder="请输入授权代表"
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
          v-hasPermi="['manage:contract:add']"
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
          v-hasPermi="['manage:contract:edit']"
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
          v-hasPermi="['manage:contract:remove']"
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
          v-hasPermi="['manage:contract:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" style="top: 30px" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="合同编号" align="center" prop="contractCode"/>
      <el-table-column label="供应商名称" align="center" prop="contractSupplierName"/>
      <el-table-column label="授权代表" align="center" prop="contractSupplierRepresentative"/>
      <el-table-column label="联系电话" align="center" prop="contractSupplierPhone"/>
      <el-table-column label="签订量" align="center" prop="contractQuantity"/>
      <el-table-column label="合同额" align="center" prop="contractAmount"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签单时间" align="center" prop="signTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:contract:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:contract:remove']"
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

    <!-- 添加或修改合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-user-solid"></i>基本信息</el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="contractSupplierId">
              <el-select v-model="form.contractSupplierId" placeholder="请选择供应商" @change="supplierSelectChange">
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
            <el-form-item label="供应商简称" prop="contractSupplierName">
              <el-input readonly v-model="form.contractSupplierAbbreviation" placeholder="请输入供应商简称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="承运单位" prop="contractCarrier">
              <el-input v-model="form.contractCarrier" placeholder="请输入承运单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权代表" prop="contractSupplierRepresentative">
              <el-input readonly v-model="form.contractSupplierRepresentative" placeholder="请输入授权代表"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="contractSupplierPhone">
              <el-input readonly v-model="form.contractSupplierPhone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>产品信息</el-divider>
          </el-col>
          <el-col :span="24"  v-for="(data,index) in form.inputMaterialList">
            <el-col :span="6">
              <el-form-item label="原材料名称" prop="contractSupplierPhone">
                <el-select filterable v-model="data.materialId" @change="materialSelectChange(data)" placeholder="请选择">
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
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="签订量" prop="contractSupplierPhone">
                <el-input v-model="data.quantity" type="number" @input="forceUpdate" placeholder="请输入签订量"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产地" prop="contractSupplierPhone">
                <el-input v-model="data.address"  @input="forceUpdate" placeholder="请输入产地"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="签订价格" prop="contractSupplierPhone">
                <el-input v-model="data.price" type="number" @input="forceUpdate" placeholder="请输入签订价格"/>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button size="mini" icon="el-icon-delete"
                         @click="deleteInputMaterial(index,form.inputMaterialList)" circle></el-button>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              size="mini"
              style="margin-left:100px"
              @click="addInputMaterialList"
            >新增产品信息
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>合同信息</el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同模板" prop="contractTemplate">
              <el-input readonly v-model="form.contractTemplate" placeholder="不使用模板"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input readonly v-model="form.contractCode" placeholder="无需输入"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率" prop="contractTaxRate">
              <el-input v-model="form.contractTaxRate" placeholder="请输入税率"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="支付条件" prop="contractTaxRate">
              <el-col :span="24" v-for="(item,index) in form.contractTaxRateList">
                <el-col :span="8">
                  <el-form-item :label="'阶段'+(index + 1)" :prop="'contractTaxRate'+index">
                    <el-input v-model="item.contractTaxRate" type="number" @input="forceUpdate" placeholder=""/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="付款时间" :prop="'time'+index">
                    <el-input v-model="item.time" @input="forceUpdate"  placeholder=""/>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteInputMaterial(index,form.contractTaxRateList)"
                    circle>
                  </el-button>
                </el-col>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              size="mini"
              style="float:right"
              @click="addContractTaxRateList"
            >新增支付条件
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="contractEnclosureData">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadFileUrl"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">点击上传文件</div>
              </el-upload>
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
    addContract,
    delContract,
    exportContract,
    getContract,
    listContract,
    updateContract
  } from "@/api/manage/contract";

  import {listMaterial} from "@/api/manage/material";
  import {getToken} from "@/utils/auth";
  import {listSupplier} from "@/api/manage/supplier";
  import {getMSId} from '@/utils/station';

  export default {
    name: "Contract",
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
        // 合同表格数据
        contractList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 创建时间时间范围
        daterangeCreateTime: [],
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        //原材数据
        materialList: [],
        materialList1: [],
        // 供应商表格数据
        supplierList: [],
        //文件数据
        fileList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          contractSupplierId: null,
          contractSupplierRepresentative: null,
          createTime: null,
          msId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //站点id
        msId: null,
      };
    },
    created() {
      //获取站点id
      this.msId = getMSId();
      this.getList();
      this.getMaterialList();
      this.getSupplierList();
    },
    methods: {
      /** 上传文件*/
      submitUpload() {
        this.$refs.upload.submit();
      },
      /** 上传成功*/
      uploadSuccess(response, file, fileList) {
        if (response.code === 200) {
          file.url = response.fileName;
          this.fileList = [];
          fileList.forEach(item => {
            let file = {name:item.name,url:item.url};
            this.fileList.push(file);
          });
        }
      },
      handleRemove(file, fileList) {
        this.fileList = [];
        fileList.forEach(item => {
          let file = {name:item.name,url:item.url};
          this.fileList.push(file);
        });
      },
      /** 点击文件列表*/
      handlePreview(file) {
        if (file.status === 'success') {
          let ele = document.createElement('a');// 创建下载链接
          ele.download = file.name;
          ele.style.display = 'none';
          ele.href = process.env.VUE_APP_BASE_API + file.url;
          document.body.appendChild(ele);
          ele.click();
          document.body.removeChild(ele);
        }
      },
      /** 增加税率输入框*/
      addContractTaxRateList() {
        let contractTaxRate = {contractTaxRate: null,time:null};
        this.form.contractTaxRateList.push(contractTaxRate);
        this.$forceUpdate();
      },
      /** 刷新*/
      forceUpdate(){
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
      /** 获取原材数据 */
      getMaterialList() {
        this.loading = true;
        listMaterial(this.queryParams).then(response => {
          this.materialList1 = response.data;
          this.materialList = this.handleTree(response.data, "materialId", "parentId");
        });
      },
      /** 原材下拉事件*/
      supplierSelectChange(supplierId) {
        let supplier = this.supplierList.find((item) => {
          return item.supplierId === supplierId;
        });
        this.form.contractSupplierName = supplier.supplierName;
        this.form.contractSupplierAbbreviation = supplier.supplierAbbreviation;
        this.form.contractSupplierRepresentative = supplier.supplierRepresentative;
        this.form.contractSupplierPhone = supplier.supplierPhone;
      },
      /** 查询供应商列表 */
      getSupplierList() {
        listSupplier(this.queryParams).then(response => {
          this.supplierList = response.rows;
        });
      },
      /** 删除原材数据 */
      deleteInputMaterial(index, rows) {
        rows.splice(index, 1);
        this.$forceUpdate();
      },
      /** 增加原材数据 */
      addInputMaterialList() {
        let material = {materialId: null, materialName: null, quantity: null, price: null,address:null};
        this.form.inputMaterialList.push(material);
        this.$forceUpdate();
      },
      /** 查询合同列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        this.queryParams.msId = this.msId;
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listContract(this.queryParams).then(response => {
          this.contractList = response.rows;
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
          contractId: null,
          contractSupplierId: null,
          contractSupplierName: null,
          contractSupplierAbbreviation: null,
          contractSupplierRepresentative: null,
          contractSupplierPhone: null,
          contractQuantity: null,
          contractAmount: null,
          contractCarrier: null,
          contractMaterialData: null,
          contractTemplate: null,
          contractCode: null,
          contractTaxRate: null,
          contractPaymentData: null,
          contractEnclosureData: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          signTime: null,
          inputMaterialList: [{materialId: null, materialName: null, quantity: null, price: null,address:null}],
          contractTaxRateList: [{contractTaxRate: null,time:null}],
          msId: null,
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
        this.ids = selection.map(item => item.contractId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加合同";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const contractId = row.contractId || this.ids
        getContract(contractId).then(response => {
          this.form = response.data;
          this.form.inputMaterialList = JSON.parse(this.form.contractMaterialData);
          this.form.contractTaxRateList = JSON.parse(this.form.contractPaymentData);
          this.fileList = JSON.parse(this.form.contractEnclosureData);
          this.open = true;
          this.title = "修改合同";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          let quantity = 0, amount = 0;
          this.form.inputMaterialList.forEach(item => {
            quantity += Number(item.quantity);
            amount += Number(item.quantity) * Number(item.price);
          });
          this.form.contractAmount = amount;
          this.form.contractQuantity = quantity;
          this.form.contractMaterialData = JSON.stringify(this.form.inputMaterialList);
          this.form.contractPaymentData = JSON.stringify(this.form.contractTaxRateList);
          this.form.contractEnclosureData = JSON.stringify(this.fileList);
          this.form.msId = this.msId;
          if (this.form.contractId != null) {
            updateContract(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContract(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const contractIds = row.contractId || this.ids;
        this.$confirm('是否确认删除合同编号为"' + contractIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delContract(contractIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有合同数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportContract(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
