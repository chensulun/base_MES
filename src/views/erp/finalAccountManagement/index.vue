<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="时间">
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>

      <el-form-item label="项目名称" prop="famContractName">
        <el-input
          v-model="queryParams.famContractName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="责任人" prop="famContacts">
        <template slot-scope="scope">
          <el-select
            allow-create
            filterable
            v-model="queryParams.famContacts"
            @change="personLiableSelectChange($event, scope.row)"
            placeholder="请选择责任人"
          >
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </template>
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
          v-hasPermi="['erp:finalAccountManagement:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['erp:finalAccountManagement:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['erp:finalAccountManagement:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['erp:finalAccountManagement:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="finalAccountManagementList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="决算单号" align="center" prop="famCode" />
      <el-table-column
        label="决算时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="决算项目" align="center" prop="famContractName" />
      <el-table-column label="发包单位" align="center" prop="famGroup" />
      <el-table-column label="发包组" align="center" prop="famGroup" />
      <el-table-column label="签订金额" align="center" prop="famAmount" />
      <el-table-column label="决算金额" align="center" prop="famTotal" />
      <el-table-column label="责任人" align="center" prop="famContacts" />
      <el-table-column label="电话" align="center" prop="famPhone" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:finalAccountManagement:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:finalAccountManagement:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:finalAccountManagement:remove']"
            >删除</el-button
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

    <!-- 添加或修改决算列表对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="10">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="24">
            <el-form-item label="决算单号" prop="famCode">
              <el-input v-model="form.famCode" placeholder="请输入决算单号" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="项目名称" prop="famContractName">
              <el-input
                v-model="form.famContractName"
                placeholder="请输入项目名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发包单位" prop="famCustomerName">
              <el-input
                v-model="form.famCustomerName"
                placeholder="请输入发包单位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发包组" prop="famGroup">
              <el-input v-model="form.famGroup" placeholder="请输入发包组" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="famContacts">
              <template slot-scope="scope">
                <el-select
                  allow-create
                  filterable
                  v-model="form.famContacts"
                  @change="personLiableSelectChange($event, scope.row)"
                  placeholder="请选择责任人"
                >
                  <el-option
                    v-for="dict in userList"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  ></el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="famPhone">
              <el-input v-model="form.famPhone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table
              v-loading="loading"
              :data="form.dataList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="决算内容" align="center" prop="famCode" />
              <el-table-column
                label="完成工作量"
                align="center"
                prop="famContractName"
              />
              <el-table-column label="单位" align="center" prop="famGroup" />
              <el-table-column
                label="决算单价"
                align="center"
                prop="famGroup"
              />
              <el-table-column
                label="决算金额"
                align="center"
                prop="famAmount"
              />
              <el-table-column label="备注" align="center" prop="famTotal" />
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteList(form.dataList, scope.$index)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="6" :offset="22">
              <el-button type="success" @click="addRow(form.dataList)"
                >新增
              </el-button>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-row :gutter="15">
          <el-col :span="4" :offset="10"> 合计 </el-col>
          <el-col :span="4">
            <el-input v-model="form.famGroup" />
          </el-col>
        </el-row>
        <el-button type="primary" @click="submitForm">确 定</el-button>

        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFinalAccountManagement,
  getFinalAccountManagement,
  delFinalAccountManagement,
  addFinalAccountManagement,
  updateFinalAccountManagement,
  exportFinalAccountManagement,
} from "@/api/erp/finalAccountManagement";
import { listUser } from "@/api/system/user";

export default {
  name: "FinalAccountManagement",
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
      // 决算列表表格数据
      finalAccountManagementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 决算时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        famContractName: null,
        famContacts: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      userList: [],
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    /** 查询决算列表列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] =
          this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listFinalAccountManagement(this.queryParams).then((response) => {
        this.finalAccountManagementList = response.rows;
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
        famId: null,
        famCode: null,
        famContractId: null,
        famContractName: null,
        famContractCode: null,
        famCustomerName: null,
        famGroup: null,
        famContacts: null,
        famPhone: null,
        famAmount: null,
        famTotal: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        dataList: [
          {
            ssName: null,
            ssStandard: null,
            ssPatrolmanId: null,
            ssPatrolmanName: null,
            ssPersonLiableId: null,
            ssPersonLiableName: null,
            ssProductionQuantity: null,
            ssDuration: null,
          },
        ],
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
      this.ids = selection.map((item) => item.famId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      console.log(selection);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加决算列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const famId = row.famId || this.ids;
      getFinalAccountManagement(famId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改决算列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.famId != null) {
            updateFinalAccountManagement(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFinalAccountManagement(this.form).then((response) => {
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
      const famIds = row.famId || this.ids;
      this.$confirm(
        '是否确认删除决算列表编号为"' + famIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delFinalAccountManagement(famIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有决算列表数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportFinalAccountManagement(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 责任人下拉事件*/
    personLiableSelectChange(userId, row) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      this.form.hsPersonLiableName = user.nickName;
    },
    /** 查询系统用户 */
    getUserList() {
      listUser({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.userList = response.rows.filter((user) => user.admin !== true);
      });
    },
    addRow(dataList) {
      dataList.push({
        ssName: null,
        ssStandard: null,
        ssPatrolmanId: null,
        ssPatrolmanName: null,
        ssPersonLiableId: null,
        ssPersonLiableName: null,
        ssProductionQuantity: null,
        ssDuration: null,
      });
    },
    deleteList(rows, index) {
      rows.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.a {
  float: right;
}
</style>
