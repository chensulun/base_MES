<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="申请类型" prop="saType">
        <el-select
          v-model="queryParams.saType"
          placeholder="请选择申请类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in saTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="saUserName">
        <el-input
          v-model="queryParams.saUserName"
          placeholder="请输入申请人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
          v-hasPermi="['erp:securityApprove:add']"
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
          v-hasPermi="['erp:securityApprove:edit']"
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
          v-hasPermi="['erp:securityApprove:remove']"
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
          v-hasPermi="['erp:securityApprove:export']"
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
      :data="securityApproveList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="saUserName" />
      <el-table-column label="作业班组/人"  align="center" prop="saGroupUserName" />
      <el-table-column label="申请类型"  align="center"   prop="saType" :formatter="saTypeFormat" />
      <el-table-column label="安全级别/种类"  align="center"  prop="saLevel" :formatter="saLevelFormat" />
      <el-table-column label="作业开始时间"  align="center"  prop="saStartTime" width="180" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.saStartTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="作业结束时间" align="center"  prop="saEndTime" width="180" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.saEndTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="saStatus" :formatter="saStatusFormat" />

      <el-table-column  label="操作"  align="center"  class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:securityApprove:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:securityApprove:remove']"
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

    <!-- 添加或修改安全审批对话框 -->
    <el-dialog :title="title"  :visible.sync="open"  width="1000px" append-to-body :close-on-click-modal="false" >
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">
          <el-col>
            <el-form-item label="申请类型" prop="saType">
              <el-select v-model="form.saType" placeholder="请选择申请类型">
                <el-option
                  v-for="dict in saTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="申请人" prop="saUserName">
              <el-select allow-create  filterable  v-model="form.saUserId"  @change="userSelectChange" placeholder="请选择申请人" >
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.nickName"
                  :value="dict.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="作业班组/人" prop="saGroupUserName">
              <el-select allow-create  filterable  v-model="form.saGroupUserId"  @change="groupUserSelectChange" placeholder="请选择班组/人名字" >
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.nickName"
                  :value="dict.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="作业部位" prop="saPosition">
              <el-input
                v-model="form.saPosition"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="安全作业级别/种类" prop="saLevel">
              <el-select allow-create  filterable  v-model="form.saLevel"  placeholder="安全作业级别/种类" >
                <el-option
                  v-for="dict in saLevelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col></el-col>
          <el-col :span="10">
            <el-form-item label="作业开始时间" prop="saStartTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.saStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择作业开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="作业结束时间" prop="saEndTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.saEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择作业结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="作业原因" prop="saRemark">
              <el-input
                v-model="form.saRemark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="安全措施" prop="saMeasures">
              <el-input
                v-model="form.saMeasures"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="附件" prop="saFileData">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadFileUrl"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >选取文件</el-button
                >
                <el-button
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="submitUpload"
                  >上传到服务器
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
  listSecurityApprove,
  getSecurityApprove,
  delSecurityApprove,
  addSecurityApprove,
  updateSecurityApprove,
  exportSecurityApprove,
} from "@/api/erp/securityApprove";
import { getToken } from "@/utils/auth";
import { listUser } from "@/api/system/user";

export default {
  name: "SecurityApprove",
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
      // 安全审批表格数据
      securityApproveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 申请类型字典
      saTypeOptions: [],
      // 安全作业级别/种类字典
      saLevelOptions: [],
      // 安全审核状态
      saStatusOptions: [],
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        saType: null,
        saUserName: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
      userList: [],
    };
  },
  created() {
    this.getList();
    this.getUserList();
    this.getDicts("erp_security_approve_type").then((response) => {
      this.saTypeOptions = response.data;
    });
    this.getDicts("erp_security_approve_level").then((response) => {
      this.saLevelOptions = response.data;
    });
    this.getDicts("erp_security_approve_status").then((response) => {
      this.saStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询安全审批列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] =
          this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listSecurityApprove(this.queryParams).then((response) => {
        this.securityApproveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 申请类型字典翻译
    saTypeFormat(row, column) {
      return this.selectDictLabel(this.saTypeOptions, row.saType);
    },
    // 安全作业级别/种类字典翻译
    saLevelFormat(row, column) {
      return this.selectDictLabel(this.saLevelOptions, row.saLevel);
    },
    // 安全作业级别/种类字典翻译
    saStatusFormat(row, column) {
      return this.selectDictLabel(this.saStatusOptions, row.saStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        saId: null,
        saType: null,
        saUserId: null,
        saUserName: null,
        saGroupUserId: null,
        saGroupUserName: null,
        saPosition: null,
        saLevel: null,
        saStartTime: null,
        saEndTime: null,
        saRemark: null,
        saMeasures: null,
        saFileData: null,
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
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.saId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加安全审批";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const saId = row.saId || this.ids;
      getSecurityApprove(saId).then((response) => {
        this.form = response.data;
        this.fileList = JSON.parse(this.form.saFileData);
        this.open = true;
        this.title = "修改安全审批";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.saFileData = JSON.stringify(this.fileList);
          if (this.form.saId != null) {
            updateSecurityApprove(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSecurityApprove(this.form).then((response) => {
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
      const saIds = row.saId || this.ids;
      this.$confirm(
        '是否确认删除安全审批编号为"' + saIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSecurityApprove(saIds);
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
      this.$confirm("是否确认导出所有安全审批数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportSecurityApprove(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    handlePreview(file) {
      if (file.status === "success") {
        let ele = document.createElement("a"); // 创建下载链接
        ele.download = file.name;
        ele.style.display = "none";
        ele.href = file.url;
        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
      }
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      fileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.fileList.push(file);
      });
    },
    /** 上传文件*/
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 上传成功*/
    uploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        file.url = response.fileName;
        this.fileList = [];
        fileList.forEach((item) => {
          item.url = process.env.VUE_APP_BASE_API + item.url;
          let file = { name: item.name, url: item.url };
          this.fileList.push(file);
        });
      }
    },
    /** 查询系统用户 */
    getUserList() {
      listUser({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.userList = response.rows.filter((user) => user.admin !== true);
      });
    },
    /** 申请人人下拉事件*/
    userSelectChange(userId) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      this.form.saUserName = user.nickName;
    },
    groupUserSelectChange(userId) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      this.form.saGroupUserName = user.nickName;
    },
  },
};
</script>
