<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
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
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
      <el-form-item label="项目名称" prop="pfrmContractName">
        <el-input
          v-model="queryParams.pfrmContractName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="pfrmStatus">
        <el-select
          v-model="queryParams.pfrmStatus"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in pfrmStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
        >新增资金回收
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectFundRecoveryManagementList" @selection-change="handleSelectionChange">
      <el-table-column label="合同编号" align="center" prop="pfrmContractCode"/>
      <el-table-column label="项目名称" align="center" prop="pfrmContractName"/>
      <el-table-column label="发包单位" align="center" prop="pfrmContractUnit"/>
      <el-table-column label="签订金额" align="center" prop="pfrmContractTotal"/>
      <el-table-column label="决算金额" align="center" prop="receivable"/>
      <el-table-column label="最新决算时间" align="center" prop="newestFamTime">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.newestFamTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已收款项" align="center" prop="received">
        <template slot-scope="scope">
          {{scope.row.received || 0}}
        </template>
      </el-table-column>
      <el-table-column label="应收款项" align="center" prop="">
        <template slot-scope="scope">
          {{(scope.row.receivable || 0) - (scope.row.received || 0 )}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="pfrmStatus" :formatter="pfrmStatusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="lookDetail(scope.row)"
            v-hasPermi="['erp:projectFundRecoveryManagement:edit']"
          >查看明细
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:projectFundRecoveryManagement:remove']"
          >删除
          </el-button
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

    <!-- 添加或修改项目资金回收对话框 -->
    <el-dialog title="资金回收" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="famContractId">
          <el-select allow-create filterable style="width: 100%" v-model="form.famContractId"
                     @change="contractListSelectChange" placeholder="请选择">
            <el-option
              v-for="item in contractList"
              :key="item.contractId"
              :label="item.contractProjectName"
              :value="item.contractId">
              <span style="float: left">{{ item.contractProjectName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.contractCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="决算单编号" prop="famId">
          <el-select allow-create filterable style="width: 100%" v-model="form.famId"
                     @change="finalAccountManagementSelectChange" placeholder="请选择">
            <el-option
              v-for="item in finalAccountManagementList"
              :key="item.famId"
              :label="item.famCode"
              :value="item.famId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="约定比例" prop="fasId">
          <el-select allow-create filterable style="width: 100%" v-model="form.fasId"
                     placeholder="请选择">
            <el-option
              v-for="item in finalAccountStageList"
              :key="item.fasId"
              :label="item.fasProportion"
              :value="item.fasId">
              <span style="float: left">阶段比例:{{ item.fasProportion }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">阶段金额:{{ item.fasAmount }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="本次回收金额" prop="pfrrAmount">
          <el-input type="number" v-model="form.pfrrAmount" placeholder="请输入本次回收金额"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看明细 -->
    <el-dialog :title="title" :visible.sync="detailOpen" width="1500px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="10">
        <el-table v-loading="loading" :data="detailsList" @selection-change="handleSelectionChange">
          <el-table-column label="决算单号" align="center" prop="famCode"/>
          <el-table-column label="发包单位" align="center" prop="famCustomerName"/>
          <el-table-column label="分包班组" align="center" prop="famGroup"/>
          <el-table-column label="决算时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{
                parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="决算价" align="center" prop="famTotal"/>
          <el-table-column label="已收款项" align="center" prop="received"/>
          <el-table-column label="应收账款余额" align="center" prop="receivable"/>
          <el-table-column label="到期应收账款" align="center" prop="dueReceivable"/>
          <el-table-column label="应收款日期" align="center" prop="collectionTime" width="180"/>
          <el-table-column label="责任人" align="center" prop="famContacts"/>
          <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="lookItems(scope.row)"
                v-hasPermi="['erp:projectFundRecoveryManagement:edit']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <!-- 查看items -->
    <el-dialog title="收款阶段" :visible.sync="itemsOpen" width="700px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="10">
        <el-table :data="stageList">
          <el-table-column type="index" label="编号" width="50"></el-table-column>
          <el-table-column label="约定付款日期" width="230" align="center" prop="fasTime">
            <template slot-scope="scope">
              <el-date-picker
                @change="itemChange(scope.row)"
                v-model="scope.row.fasTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="约定应付金额" align="center" prop="fasAmount">
            <template slot-scope="scope">
              {{scope.row.fasAmount = (scope.row.fasProportion/100 * famTotal)}}
            </template>
          </el-table-column>
          <el-table-column label="约定比例" align="center" prop="fasProportion">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fasProportion" @change="itemChange(scope.row)" type="number" placeholder=""/>
            </template>
          </el-table-column>
          <el-table-column label="当前状态" align="center" prop="fasStatus" :formatter="fasStatusFormat"/>
        </el-table>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {
    delProjectFundRecoveryManagement,
    listProjectFundRecoveryManagement
  } from "@/api/erp/projectFundRecoveryManagement";
  import {listByDetailsFinalAccountManagement} from "@/api/erp/finalAccountManagement";
  import {listFinalAccountStage, updateFinalAccountStage} from "@/api/erp/finalAccountStage";
  import {addProjectFundRecoveryRecord} from "@/api/erp/projectFundRecoveryRecord";
  import {listContract} from "@/api/erp/contract";
  import {
    listFinalAccountManagement
  } from "@/api/erp/finalAccountManagement";

  export default {
    name: "ProjectFundRecoveryManagement",
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
        // 项目资金回收表格数据
        projectFundRecoveryManagementList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        detailOpen: false,
        itemsOpen: false,
        // 状态字典
        pfrmStatusOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          pfrmContractName: null,
          pfrmStatus: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //详情列表
        detailsList: [],
        //阶段列表
        stageList: [],
        famTotal: 0,
        //合同列表
        contractList: [],
        //决算单列表
        finalAccountManagementList: [],
        //决算单阶段列表
        finalAccountStageList: []
      };
    },
    created() {

      this.getList();
      this.getDicts("erp_project_fund_recovery_management_status").then(
        (response) => {
          this.pfrmStatusOptions = response.data;
        }
      );
      this.getContractList();
    },
    methods: {
      finalAccountManagementSelectChange(famId) {
        let query = {famId: famId};
        listFinalAccountStage(query).then(response => {
          this.finalAccountStageList = response.rows;
        });
      },
      /** 合同下拉*/
      contractListSelectChange(contractId) {
        let query = {famContractId: contractId};
        this.finalAccountManagementList = [];
        listFinalAccountManagement(query).then((response) => {
          this.finalAccountManagementList = response.rows;
        });
      },
      getContractList() {
        let query = {contractStatus: "1"};
        listContract(query).then((response) => {
          this.contractList = response.rows;
        });
      },
      //新增资金回收按钮
      handleAdd() {
        this.reset();
        this.open = true;
        this.finalAccountManagementList =  [];
        this.finalAccountStageList = [];
      },
      /** 查询项目资金回收列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] =
            this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listProjectFundRecoveryManagement(this.queryParams).then((response) => {
          this.projectFundRecoveryManagementList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 状态字典翻译
      pfrmStatusFormat(row, column) {
        return this.selectDictLabel(this.pfrmStatusOptions, row.pfrmStatus);
      },
      statusFormat(row, column) {
        return this.selectDictLabel(this.pfrmStatusOptions, row.status);
      },
      fasStatusFormat(row, column) {
        return this.selectDictLabel(this.pfrmStatusOptions, row.fasStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          pfrrId: null,
          fasId: null,
          pfrrAmount: null,
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
        this.daterangeCreateTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map((item) => item.pfrmId);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      lookDetail(row) {
        let contractId = row.pfrmContractId;
        this.title = "决算单列表";
        this.detailOpen = true;
        if (contractId) {
          let query = {famContractId: contractId};
          listByDetailsFinalAccountManagement(query).then((response) => {
            this.detailsList = response.rows;
          });
        }
      },
      lookItems(row) {
        this.itemsOpen = true;
        this.famTotal = row.famTotal;
        this.stageList = [];
        if (row.famId) {
          let query = {famId: row.famId};
          listFinalAccountStage(query).then(response => {
            this.stageList = response.rows;
          });
        }
      },
      itemChange(row) {
        updateFinalAccountStage(row).then(response => {
          this.msgSuccess("修改成功");
        });
      },
      /** 提交按钮 */
      submitForm() {
        addProjectFundRecoveryRecord(this.form).then(response => {
          this.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        const pfrmIds = row.pfrmId || this.ids;
        this.$confirm('是否确认删除项目资金回收编号为"' + pfrmIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delProjectFundRecoveryManagement(pfrmIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
    },
  };
</script>
