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
          v-hasPermi="['erp:securityHandover:add']"
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
          v-hasPermi="['erp:securityHandover:edit']"
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
          v-hasPermi="['erp:securityHandover:remove']"
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
          v-hasPermi="['erp:securityHandover:export']"
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
      :data="securityHandoverList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="交底时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上报人员" align="center" prop="createBy" />
      <el-table-column label="班组" align="center" prop="shGroupOne" />
      <el-table-column label="安全程度" align="center" prop="shStatus" />
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
            v-hasPermi="['erp:securityHandover:edit']"
            >查看</el-button
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

    <!-- 添加或修改安全交底对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body  :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="200px">
          <el-col :span="10">
            <el-form-item label="交底班组" prop="shGroupOne">
              <el-input
                v-model="form.shGroupOne"
                placeholder="请输入交底班组"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="责任人" prop="shGroupOneUserName">
              <template slot-scope="scope">
                <el-select
                  allow-create
                  filterable
                  v-model="form.shGroupOneUserName"
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
          <el-col :span="10">
            <el-form-item label="被交底班组" prop="shGroupTwo">
              <el-input
                v-model="form.shGroupTwo"
                placeholder="请输入被交底班组"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="责任人" prop="shGroupTwoUserName">
              <template slot-scope="scope">
                <el-select
                  allow-create
                  filterable
                  v-model="form.shGroupTwoUserName"
                  @change="personLiableSelectChange1($event, scope.row)"
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
          <el-col>
            <el-form-item label="参会缺席人员" prop="shAbsentPerson">
              <template slot-scope="scope">
                <el-select
                  allow-create
                  filterable
                  v-model="form.shAbsentPerson"
                  @change="personLiableSelectChange2($event, scope.row)"
                  placeholder="请选择"
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
          <el-col :span="10">
            <el-form-item label="上一班开始时间" prop="shStartTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.shStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择上一班开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="上一班结束时间" prop="shEndTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.shEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择上一班结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="交底内容" prop="shRemark">
              <el-input
                v-model="form.shRemark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="安全程度">
              <el-radio-group v-model="form.shStatus">
                <el-radio label="1">请选择字典生成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="附件" prop="shFileData">
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
  listSecurityHandover,
  getSecurityHandover,
  delSecurityHandover,
  addSecurityHandover,
  updateSecurityHandover,
  exportSecurityHandover,
} from "@/api/erp/securityHandover";
import { listUser } from "@/api/system/user";
import { getToken } from "@/utils/auth";

export default {
  name: "SecurityHandover",
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
      // 安全交底表格数据
      securityHandoverList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      userList: [],
      fileList: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    /** 查询安全交底列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] =
          this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listSecurityHandover(this.queryParams).then((response) => {
        this.securityHandoverList = response.rows;
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
        shId: null,
        shGroupOne: null,
        shGroupOneUserId: null,
        shGroupOneUserName: null,
        shGroupTwo: null,
        shGroupTwoUserId: null,
        shGroupTwoUserName: null,
        shAbsentPerson: null,
        shStartTime: null,
        shEndTime: null,
        shRemark: null,
        shStatus: "0",
        shFileData: null,
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
      this.ids = selection.map((item) => item.shId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加安全交底";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const shId = row.shId || this.ids;
      getSecurityHandover(shId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改安全交底";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.shId != null) {
            updateSecurityHandover(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSecurityHandover(this.form).then((response) => {
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
      const shIds = row.shId || this.ids;
      this.$confirm(
        '是否确认删除安全交底编号为"' + shIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSecurityHandover(shIds);
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
      this.$confirm("是否确认导出所有安全交底数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportSecurityHandover(queryParams);
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
      this.form.shGroupOneUserName = user.nickName;
      this.form.shGroupOneUserId = user.userId;
    },
    /** 被交底责任人下拉事件*/
    personLiableSelectChange1(userId, row) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      this.form.shGroupTwoUserName = user.nickName;
      this.form.shGroupTwoUserId = user.userId;
    },
    /** 缺席下拉事件*/
    personLiableSelectChange2(userId, row) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      this.form.shAbsentPerson = user.nickName;
    },
    /** 查询系统用户 */
    getUserList() {
      listUser({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.userList = response.rows.filter((user) => user.admin !== true);
      });
    },
    /** 上传文件*/
    submitUpload() {
      this.$refs.upload.submit();
    },
    picHandleRemove(file, fileList) {
      this.picFileList = [];
      fileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.picFileList.push(file);
      });
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      fileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.fileList.push(file);
      });
    },
    /** 上传成功*/
    picUploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        file.url = response.fileName;
        this.picFileList = [];
        fileList.forEach((item) => {
          item.url = process.env.VUE_APP_BASE_API + item.url;
          let file = { name: item.name, url: item.url };
          this.picFileList.push(file);
        });
      }
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
  },
};
</script>
