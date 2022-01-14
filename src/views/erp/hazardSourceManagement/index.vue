<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item label="危险源名称" prop="hsName">
        <el-input
          v-model="queryParams.hsName"
          placeholder="请输入危险源名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="责任人" prop="hsPersonLiableName">
        <el-input
          v-model="queryParams.hsPersonLiableName"
          placeholder="请输入责任人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目前状况" prop="hsStatus">
        <el-select
          v-model="queryParams.hsStatus"
          placeholder="请选择目前状况"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in hsStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['erp:hazardSourceManagement:add']"
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
          v-hasPermi="['erp:hazardSourceManagement:edit']"
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
          v-hasPermi="['erp:hazardSourceManagement:remove']"
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
          v-hasPermi="['erp:hazardSourceManagement:export']"
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
      :data="hazardSourceManagementList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="危险源名称" align="center" prop="hsName" />
      <el-table-column label="存在地址" align="center" prop="hsAddress" />
      <el-table-column
        label="危险等级"
        align="center"
        prop="hsHazardLevel"
        :formatter="hsHazardLevelFormat"
      />
      <el-table-column
        label="责任人名字"
        align="center"
        prop="hsPersonLiableName"
      />
      <el-table-column
        label="目前状况"
        align="center"
        prop="hsStatus"
        :formatter="hsStatusFormat"
      />
      <el-table-column
        label="时间"
        align="center"
        prop="hsTime"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:hazardSourceManagement:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:hazardSourceManagement:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:hazardSourceManagement:remove']"
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

    <!-- 添加或修改危险源管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col>
            <el-form-item label="危险源名称" prop="hsName">
              <el-input v-model="form.hsName" placeholder="请输入危险源名称" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="存放地址" prop="hsAddress">
              <el-input
                v-model="form.hsAddress"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="预计存在时间" prop="hsTime">
              <el-date-picker
                v-model="form.hsTime"
                size="small"
                style="width: 300px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可能危险性" prop="hsHazardInfo">
              <el-col>
                <el-input
                  v-model="form.hsHazardInfo"
                  type="textarea"
                  placeholder="请输入内容"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险等级" prop="hsHazardLevel">
              <el-select
                v-model="form.hsHazardLevel"
                placeholder="请选择危险等级"
              >
                <el-option
                  v-for="dict in hsHazardLevelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="责任人" prop="hsPersonLiableName">
              <template slot-scope="scope">
                <el-select
                  allow-create
                  filterable
                  v-model="form.hsPersonLiableName"
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
            <el-form-item label="应急预案" prop="hsFileData">
              <el-button type="primary">上传附件</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现场图片" prop="hsImgData">
              <el-button type="primary">上传附件</el-button>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="目前状况" prop="hsStatus">
              <el-select v-model="form.hsStatus" placeholder="请选择目前状况">
                <el-option
                  v-for="dict in hsStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
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
  listHazardSourceManagement,
  getHazardSourceManagement,
  delHazardSourceManagement,
  addHazardSourceManagement,
  updateHazardSourceManagement,
  exportHazardSourceManagement,
} from "@/api/erp/hazardSourceManagement";
import { listUser } from "@/api/system/user";

export default {
  name: "HazardSourceManagement",
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
      // 危险源管理表格数据
      hazardSourceManagementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 危险等级字典
      hsHazardLevelOptions: [],
      // 目前状况字典
      hsStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        hsName: null,
        hsPersonLiableName: null,
        hsStatus: null,
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
    this.getDicts("erp_hazard_source_management_level").then((response) => {
      this.hsHazardLevelOptions = response.data;
    });
    this.getDicts("erp_hazard_source_management_status").then((response) => {
      this.hsStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询危险源管理列表 */
    getList() {
      this.loading = true;
      listHazardSourceManagement(this.queryParams).then((response) => {
        this.hazardSourceManagementList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 危险等级字典翻译
    hsHazardLevelFormat(row, column) {
      return this.selectDictLabel(this.hsHazardLevelOptions, row.hsHazardLevel);
    },
    // 目前状况字典翻译
    hsStatusFormat(row, column) {
      return this.selectDictLabel(this.hsStatusOptions, row.hsStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        hsId: null,
        hsName: null,
        hsAddress: null,
        hsTime: null,
        hsHazardInfo: null,
        hsHazardLevel: null,
        hsPersonLiableId: null,
        hsPersonLiableName: null,
        hsFileData: null,
        hsImgData: null,
        hsStatus: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.ids = selection.map((item) => item.hsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "危险源新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const hsId = row.hsId || this.ids;
      getHazardSourceManagement(hsId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改危险源管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.hsId != null) {
            updateHazardSourceManagement(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHazardSourceManagement(this.form).then((response) => {
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
      const hsIds = row.hsId || this.ids;
      this.$confirm(
        '是否确认删除危险源管理编号为"' + hsIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delHazardSourceManagement(hsIds);
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
      this.$confirm("是否确认导出所有危险源管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportHazardSourceManagement(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 查询系统用户 */
    getUserList() {
      listUser({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.userList = response.rows.filter((user) => user.admin !== true);
      });
    },
    /** 责任人下拉事件*/
    personLiableSelectChange(userId, row) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      this.form.hsPersonLiableName = user.nickName;
    },
  },
};
</script>
