<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="创建时间">
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
      <el-form-item label="客户名称" prop="contractCustomerName">
        <el-input
          v-model="queryParams.contractCustomerName"
          placeholder="请输入客户名称"
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
          v-hasPermi="['erp:contract:add']"
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
          v-hasPermi="['erp:contract:edit']"
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
          v-hasPermi="['erp:contract:remove']"
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
          v-hasPermi="['erp:contract:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="合同编号" align="center" prop="contractCode"/>
      <el-table-column label="项目名称" align="center" prop="contractProjectName"/>
      <el-table-column label="商品名称" align="center" prop="">
        <template slot-scope="scope">
          <span v-for="(item,index) in JSON.parse(scope.row.contractProductData)">{{item.name }}<span
            v-if="(index + 1) < JSON.parse(scope.row.contractProductData).length">/</span></span>
        </template>
      </el-table-column>
      <el-table-column label="需求量" align="center" prop="">
        <template slot-scope="scope">
          <span>{{ getNum(scope.row.contractProductData) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同额" align="center" prop="">
        <template slot-scope="scope">
          <span>{{ getTotal(scope.row.contractProductData) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" prop="contractContacts"/>
      <el-table-column label="联系方式" align="center" prop="contractPhone"/>
      <el-table-column label="审核状态" align="center" prop="contractStatus" :formatter="contractStatusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleCdpAdd(scope.row)"
            v-hasPermi="['erp:contract:edit']"
          >增加调价单
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="cdpShow(scope.row)"
            v-hasPermi="['erp:contract:edit']"
          >调价单列表
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:contract:query']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:contract:remove']"
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

    <!-- 添加或修改合同管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="contractProjectName">
              <el-select allow-create filterable v-model="form.contractProjectName" placeholder="请选择项目"
                         @change="projectTrackingListSelectChange">
                <el-option
                  v-for="dict in projectTrackingList"
                  :key="dict.ptName"
                  :label="dict.ptName"
                  :value="dict.ptName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input readonly v-model="form.contractCode" placeholder="无需填写"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户名称" prop="contractCustomerName">
              <el-input v-model="form.contractCustomerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contractContacts">
              <el-input v-model="form.contractContacts" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contractPhone">
              <el-input v-model="form.contractPhone" placeholder="请输入联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-table border show-summary
                      :data="form.contractProductDataList"
                      :summary-method="getSummaries"
                      style="width: 100%">
              <el-table-column prop="name" align="center" label="产品名称">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.name" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="需求量">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.num" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="price" align="center" label="单价">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.price" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="total" align="center" label="总金额">
                <template slot-scope="scope">
                  {{scope.row.total = (scope.row.num * scope.row.price).toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.contractProductDataList)"
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
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-form-item label="支付条件" prop="contractTaxRate">
              <el-col :span="24" v-for="(item,index) in form.contractPaymentDataList">
                <el-col :span="8">
                  <el-form-item :label="'阶段'+(index + 1)" :prop="'stage'+index">
                    <el-input v-model="item.stage" type="number" placeholder=""/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="付款时间" :prop="'time'+index">
                    <el-input v-model="item.time"  placeholder=""/>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteRow(index,form.contractPaymentDataList)"
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
              @click="addPaymentDataList"
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
          <el-col :span="24">
            <el-form-item label="审核状态">
              <el-radio-group v-model="form.contractType">
                <el-radio
                  v-for="dict in contractTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改合同调价单对话框 -->
    <el-dialog :title="cdpTitle" :visible.sync="cdpOpen" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="cdpForm" :model="cdpForm" :rules="rules" label-width="80px">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="contractProjectName">
              <el-input readonly v-model="cdpForm.contractProjectName" placeholder="项目名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input readonly v-model="cdpForm.contractCode" placeholder="请输入合同编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户名称" prop="contractCustomerName">
              <el-input readonly v-model="cdpForm.contractCustomerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contractContacts">
              <el-input readonly v-model="cdpForm.contractContacts" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contractPhone">
              <el-input readonly v-model="cdpForm.contractPhone" placeholder="请输入联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-table border
                      :data="cdpForm.cdpProductDataList"
                      style="width: 100%">
              <el-table-column prop="name" align="center" label="产品名称">
                <template slot-scope="scope">
                  <el-input size="small"  v-model="scope.row.name" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="签订价">
                <template slot-scope="scope">
                  {{scope.row.price}}
                </template>
              </el-table-column>
              <el-table-column prop="price" align="center" label="调后价">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.newPrice" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="price" width="250px" align="center" label="生效时间">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.time"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, cdpForm.cdpProductDataList)"
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
              @click="addCdpRow"
            >新增
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
          <el-col :span="24">
            <el-form-item label="调价事由" prop="contractPhone">
              <el-input type="textarea" v-model="cdpForm.cdpRemark" placeholder="请输入调价事由"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核状态">
              <el-radio-group v-model="cdpForm.cdpType">
                <el-radio
                  v-for="dict in contractTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" v-if="cdpAdd" class="dialog-footer">
        <el-button type="primary" @click="cdpSubmitForm">确 定</el-button>
        <el-button @click="cdpCancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 调价单列表 -->
    <el-dialog title="调价单列表" :visible.sync="cdpListOpen" width="1200px" append-to-body :close-on-click-modal="false">
      <el-table v-loading="loading" :data="contractModifyPriceList">
        <el-table-column label="合同编号" align="center" prop="contractCode"/>
        <el-table-column label="项目名称" align="center" prop="contractProjectName"/>
        <el-table-column label="客户名称" align="center" prop="contractCustomerName"/>
        <el-table-column label="备注" align="center" prop="cdpRemark"/>
        <el-table-column label="合同状态" align="center" prop="cdpStatus" :formatter="cdpStatusFormat"/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-zoom-in"
              @click="showCdp(scope.row)"
              v-hasPermi="['erp:contractModifyPrice:edit']"
            >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  } from "@/api/erp/contract";

  import {addContractModifyPrice, getContractModifyPrice, listContractModifyPrice} from "@/api/erp/contractModifyPrice";
  import {listProject} from "@/api/manage/project";
  import {listProjectTracking} from "@/api/erp/projectTracking";

  import {getToken} from "@/utils/auth";

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
        // 合同管理表格数据
        contractList: [],
        //调价单
        contractModifyPriceList: [],
        //项目追踪列表
        projectTrackingList: [],
        // 弹出层标题
        title: "",
        // 弹出层标题
        cdpTitle: "",
        // 是否显示弹出层
        open: false,
        // 是否显示调价单弹出层
        cdpOpen: false,
        //调价单列表
        cdpListOpen: false,
        // 合同类型字典
        contractTypeOptions: [],
        // 审核状态字典
        contractStautsOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 上传的图片服务器地址
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        //文件数据
        fileList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          contractCustomerName: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 调价单表单参数
        cdpForm: {},
        // 表单校验
        rules: {},
        //调价单新增
        cdpAdd: false
      };
    },
    created() {
      this.getList();
      this.getDicts("erp_contract_type").then(response => {
        this.contractTypeOptions = response.data;
      });
      this.getDicts("erp_contract_status").then(response => {
        this.contractStautsOptions = response.data;
      });
      this.getProjectTrackingList();
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
      //获取需求量
      getNum(data) {
        let _data = JSON.parse(data);
        return _data.map(item => item.num).reduce((prev, curr) => {
          return Number(prev) + Number(curr);
        }, 0);

      },
      //获取总金额
      getTotal(data) {
        let _data = JSON.parse(data);
        return _data.map(item => item.num * item.price).reduce((prev, curr) => {
          return Number(prev) + Number(curr);
        }, 0);

      },
      /** 项目追踪下拉事件*/
      projectTrackingListSelectChange(projectName) {
        let project = this.projectTrackingList.find((item) => {
          return item.ptName === projectName;
        });
        if (project) {
          //this.form.contractCode = project.ptCode;
          this.form.contractCustomerName = project.ptCustomerName;
          this.form.contractContacts = project.ptCustomerRepresentative;
          this.form.contractPhone = project.ptCustomerPhone;
          this.form.contractProductDataList = JSON.parse(project.ptProductData);
          if (project.projectId) {
            this.form.projectId = project.projectId;
          }else {
            this.form.projectId = null;
          }
        }
      },
      /** 查询项目追踪列表 */
      getProjectTrackingList() {
        listProjectTracking(null).then(response => {
          this.projectTrackingList = response.rows;
          let projectQuery = {projectType:1};

          listProject(projectQuery).then(response => {
            let projectList = response.rows;
            for (let i = 0; i < projectList.length; i++) {
              let project = projectList[i];
              let projectTracking = {ptName:project.projectName,ptCustomerName:project.customerName,ptCustomerRepresentative:'',ptCustomerPhone:''};
              let signDataList = JSON.parse(project.projectSignData);
              let productDataList = [];
              for (let j = 0; j < signDataList.length; j++) {
                let signData = signDataList[j];
                let productData = {name:signData.type,num:signData.num,price:"0"};
                productDataList.push(productData);
              }
              projectTracking.projectId = project.projectId;
              projectTracking.ptProductData = JSON.stringify(productDataList);
              this.projectTrackingList.push(projectTracking);
            }
        });
        });
      },
      /** 合计*/
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if (index === 1 || index === 3) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            } else {
              sums[index] = 'N/A';
            }
          }
        });

        return sums;
      },
      /** 增加支付条件输入框*/
      addPaymentDataList() {
        let stage = {stage: null,time:null};
        this.form.contractPaymentDataList.push(stage);
      },
      /** 添加材料行*/
      addRow() {
        let material = {name: '', num: 0, price: 0, total: 0};
        if (!this.form.contractProductDataList) {
          this.form.contractProductDataList = [];
        }
        this.form.contractProductDataList.push(material);
      },
      /** 添加材料行*/
      addCdpRow() {
        let material = {name: '', num: 0, price: 0, total: 0,newPrice:0,time:''};
        if (!this.cdpForm.cdpProductDataList) {
          this.cdpForm.cdpProductDataList = [];
        }
        this.cdpForm.cdpProductDataList.push(material);
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      /** 查询合同管理列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
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
      // 合同类型字典翻译
      contractTypeFormat(row, column) {
        return this.selectDictLabel(this.contractTypeOptions, row.contractType);
      },
      // 审核状态字典翻译
      contractStatusFormat(row, column) {
        return this.selectDictLabel(this.contractStautsOptions, row.contractStatus);
      },
      // 审核状态字典翻译
      cdpStatusFormat(row, column) {
        return this.selectDictLabel(this.contractStautsOptions, row.cdpStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 取消按钮
      cdpCancel() {
        this.cdpOpen = false;
        this.cdpReset();
      },
      // 表单重置
      reset() {
        this.form = {
          contractId: null,
          contractCode: null,
          contractProjectName: null,
          contractCustomerName: null,
          contractContacts: null,
          contractPhone: null,
          contractProductData: null,
          contractProductDataList: [],
          contractPaymentData: null,
          contractPaymentDataList: [{stage: null,time:null}],
          contractType: "0",
          contractStatus: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          projectId:null,
        };
        this.fileList = [];
        this.resetForm("form");
      },
      // 调价单表单重置
      cdpReset() {
        this.cdpForm = {
          cdpId: null,
          contractId: null,
          contractCode: null,
          contractProjectName: null,
          contractCustomerName: null,
          contractContacts: null,
          contractPhone: null,
          cdpProductData: null,
          cdpProductDataList: [],
          cdpRemark: null,
          cdpType: "0",
          cdpStatus: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          cdpFileData: null
        };
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
        this.title = "添加合同管理";
      },
      /** 新增调价单按钮操作 */
      handleCdpAdd(row) {
        this.cdpReset();
        const contractId = row.contractId || this.ids
        getContract(contractId).then(response => {
          let _data = response.data;
          this.cdpForm.contractId = _data.contractId;
          this.cdpForm.contractCode = _data.contractCode;
          this.cdpForm.contractProjectName = _data.contractProjectName;
          this.cdpForm.contractCustomerName = _data.contractCustomerName;
          this.cdpForm.contractContacts = _data.contractContacts;
          this.cdpForm.contractPhone = _data.contractPhone;
          let productList = JSON.parse(_data.contractProductData);
          for (let i = 0; i < productList.length; i++) {
            productList[i].newPrice = productList[i].price;
            productList[i].time = '';
          }
          this.cdpForm.cdpProductDataList = productList;
          this.cdpOpen = true;
          this.cdpTitle = "添加调价单";
          this.cdpAdd = true;
        });
      },
      /** 查看调价单 */
      cdpShow(row) {
        this.loading = true;
        const contractId = row.contractId || this.ids;
        this.contractModifyPriceList = [];
        let query = {contractId: contractId};
        listContractModifyPrice(query).then(response => {
          this.contractModifyPriceList = response.rows;
          this.loading = false;
          this.cdpListOpen = true;
          this.cdpAdd = false;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const contractId = row.contractId || this.ids
        getContract(contractId).then(response => {
          this.form = response.data;
          this.form.contractProductDataList = JSON.parse(this.form.contractProductData);
          this.form.contractPaymentDataList = JSON.parse(this.form.contractPaymentData);
          if (this.form.contractEnclosureData) {
            this.fileList = JSON.parse(this.form.contractEnclosureData);
          }
          this.open = true;
          this.title = "修改合同管理";
        });
      }, /** 修改按钮操作 */
      showCdp(row) {
        this.cdpReset();
        const cdpId = row.cdpId || this.ids
        getContractModifyPrice(cdpId).then(response => {
          this.cdpForm = response.data;
          this.cdpForm.cdpProductDataList = JSON.parse(this.cdpForm.cdpProductData);
          if (this.cdpForm.cdpFileData) {
            this.fileList = JSON.parse(this.cdpForm.cdpFileData);
          }
          this.cdpOpen = true;
          this.cdpTitle = "调价单";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.contractProductData = JSON.stringify(this.form.contractProductDataList);
            this.form.contractPaymentData = JSON.stringify(this.form.contractPaymentDataList);
            this.form.contractEnclosureData = JSON.stringify(this.fileList);
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
          }
        });
      },
      /** 提交按钮 */
      cdpSubmitForm() {
        this.$refs["cdpForm"].validate(valid => {
          if (valid) {
            this.cdpForm.cdpProductData = JSON.stringify(this.cdpForm.cdpProductDataList);
            this.cdpForm.cdpFileData = JSON.stringify(this.fileList);
            addContractModifyPrice(this.cdpForm).then(response => {
              this.msgSuccess("新增成功");
              this.cdpOpen = false;
            });
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const contractIds = row.contractId || this.ids;
        this.$confirm('是否确认删除合同管理编号为"' + contractIds + '"的数据项?', "警告", {
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
        this.$confirm('是否确认导出所有合同管理数据项?', "警告", {
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
