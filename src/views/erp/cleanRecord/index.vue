<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="创建者" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建者"
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
          v-hasPermi="['erp:cleanRecord:add']"
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
          v-hasPermi="['erp:cleanRecord:edit']"
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
          v-hasPermi="['erp:cleanRecord:remove']"
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
          v-hasPermi="['erp:cleanRecord:export']"
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
      :data="cleanRecordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="crStartTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crStartTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center"
        prop="crEndTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crEndTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:cleanRecord:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:cleanRecord:remove']"
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

    <!-- 添加或修改环境卫生记录对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上报人" prop="crPeople">
          <template slot-scope="scope">
            <el-select
              allow-create
              filterable
              v-model="form.crPeople"
              @change="personLiableSelectChange($event, scope.row)"
              placeholder="请选择上报人"
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
        <el-form-item label="开始时间" prop="crStartTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.crStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="crEndTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.crEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="特别说明" prop="crRemark">
          <el-input
            v-model="form.crRemark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="图片数据" prop="crImgData">
          <el-upload
            class="upload-demo"
            :action="uploadFileUrl"
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="picHandleRemove"
            :on-success="picUploadSuccess"
            :file-list="picFileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
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
  listCleanRecord,
  getCleanRecord,
  delCleanRecord,
  addCleanRecord,
  updateCleanRecord,
  exportCleanRecord,
} from "@/api/erp/cleanRecord";
import { getToken } from "@/utils/auth";
import { listUser } from "@/api/system/user";

export default {
  name: "CleanRecord",
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
      // 环境卫生记录表格数据
      cleanRecordList: [],
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
        createBy: null,
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
      picFileList: [],
      userList: [],
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    /** 查询环境卫生记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] =
          this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listCleanRecord(this.queryParams).then((response) => {
        this.cleanRecordList = response.rows;
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
        crId: null,
        crStartTime: null,
        crEndTime: null,
        crRemark: null,
        crImgData: null,
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
      this.ids = selection.map((item) => item.crId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加环境卫生记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const crId = row.crId || this.ids;
      getCleanRecord(crId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改环境卫生记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.crId != null) {
            updateCleanRecord(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCleanRecord(this.form).then((response) => {
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
      const crIds = row.crId || this.ids;
      this.$confirm(
        '是否确认删除环境卫生记录编号为"' + crIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCleanRecord(crIds);
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
      this.$confirm("是否确认导出所有环境卫生记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportCleanRecord(queryParams);
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

    picHandleRemove(file, fileList) {
      this.picFileList = [];
      fileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.picFileList.push(file);
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
