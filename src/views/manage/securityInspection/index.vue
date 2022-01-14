<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="日期">
        <el-date-picker
          v-model="daterangeSiTime"
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
          >查询</el-button
        >
      </el-form-item>
      <el-row :gutter="10" class="mb8">
        <el-col :span="5">
          <el-form-item label="类别">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择别"
              clearable
              size="small"
            >
              <el-option
                v-for="i in type"
                :key="i.id"
                :label="i.dictLabel"
                :value="i.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="性质" prop="siType">
            <el-select
              v-model="queryParams.siType"
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in siTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="关联人" prop="userId">
            <el-select
              v-model="queryParams.userName"
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in userList"
                :key="dict.userId"
                :label="dict.nickName"
                :value="dict.nickName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form>
      <el-row :gutter="10">
        <el-col :span="1.5" :offset="20"
          ><el-button icon="el-icon-search" size="mini" @click="handleQuery"
            >进行中</el-button
          ></el-col
        >
        <el-col :span="1.5"
          ><el-button icon="el-icon-search" size="mini" @click="handleQuery"
            >已完成</el-button
          ></el-col
        >
        <el-col :span="1.5"
          ><el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >导出</el-button
          ></el-col
        >
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      :data="securityInspectionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="类别"
        align="center"
        prop="ssType"
        :formatter="ssType"
      />
      <el-table-column label="项目" align="center" prop="projectName" />
      <el-table-column
        label="巡检性质"
        align="center"
        prop="siTypeFormat"
        :formatter="siTypeFormat"
      />
      <el-table-column label="计划时间" align="center" prop="siTime" width="180"
        ><template slot-scope="scope">
          <span>{{ parseTime(scope.row.siTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实际时间"
        align="center"
        prop="siTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.siTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="siStatus"
        :formatter="siStatusFormat"
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
            @click="handleShow(scope.row)"
            v-hasPermi="['manage:securityInspection:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:securityInspection:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:securityInspection:remove']"
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

    <!-- 添加或修改安全巡检对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="10">
        <el-form ref="form" :rules="rules" label-width="120px" :model="form">
          <el-col :span="12">
            <el-form-item label="巡检类型" prop="siType">
              <el-input v-model="form.siType" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划执行时间" prop="siTime">
              <el-input v-model="form.siTime" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-input v-model="form.siStatus" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              style="border-top: 10px solid #eee; padding-top: 20px"
              v-for="(i, p) in form.securityInspectionDetails"
              :key="p"
            >
              <el-row :gutter="10">
                <el-form>
                  <el-col :span="10">
                    <el-form-item label="巡检位置">
                      <el-col :span="18">
                        <el-input v-model="i.ssPosition" readonly />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="巡检项目">
                      <el-col :span="18">
                        <el-input v-model="i.ssName" readonly />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="巡检说明">
                      <el-col>
                        <el-input v-model="i.sidRemark" type="textarea" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="图片数据" prop="emrImgData">
                      <el-col :span="18">
                        <el-upload
                          class="upload-demo"
                          :action="uploadFileUrl"
                          :headers="headers"
                          :on-preview="handlePreview"
                          :on-remove="picHandleRemove"
                          :on-success="picUploadSuccess"
                          :file-list="picFileList[i]"
                          list-type="picture"
                        >
                          <el-button
                            size="small"
                            type="primary"
                            v-if="isShowBtn"
                            >点击上传</el-button
                          >
                          <div
                            slot="tip"
                            class="el-upload__tip"
                            v-if="isShowBtn"
                          >
                            只能上传jpg/png文件，且不超过500kb
                          </div>
                        </el-upload>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="录音数据" prop="emrAudioData">
                      <el-col :span="18">
                        <el-upload
                          class="upload-demo"
                          ref="audUpload"
                          :action="uploadFileUrl"
                          :headers="headers"
                          :on-preview="handlePreview"
                          :on-remove="audHandleRemove"
                          :on-success="audUploadSuccess"
                          :file-list="audFileList[i]"
                          :auto-upload="false"
                        >
                          <el-button
                            slot="trigger"
                            size="small"
                            type="primary"
                            v-if="isShowBtn"
                            >选取文件</el-button
                          >
                          <el-button
                            style="margin-left: 10px"
                            size="small"
                            type="success"
                            @click="audSubmitUpload"
                            v-if="isShowBtn"
                            >上传到服务器
                          </el-button>
                          <div
                            slot="tip"
                            class="el-upload__tip"
                            v-if="isShowBtn"
                          >
                            点击上传文件
                          </div>
                        </el-upload>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="视频数据" prop="emrVideoData">
                      <el-col :span="18">
                        <el-upload
                          class="upload-demo"
                          ref="vidUpload"
                          :action="uploadFileUrl"
                          :headers="headers"
                          :on-preview="handlePreview"
                          :on-remove="vidHandleRemove"
                          :on-success="vidUploadSuccess"
                          :file-list="vidFileList[i]"
                          :auto-upload="false"
                        >
                          <el-button
                            slot="trigger"
                            size="small"
                            type="primary"
                            v-if="isShowBtn"
                            >选取文件</el-button
                          >
                          <el-button
                            style="margin-left: 10px"
                            size="small"
                            type="success"
                            @click="vidSubmitUpload"
                            v-if="isShowBtn"
                            >上传到服务器
                          </el-button>
                          <div
                            slot="tip"
                            class="el-upload__tip"
                            v-if="isShowBtn"
                          >
                            点击上传文件
                          </div>
                        </el-upload>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer" v-if="isShowBtn">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSecurityInspection,
  getSecurityInspection,
  delSecurityInspection,
  addSecurityInspection,
  updateSecurityInspection,
  exportSecurityInspection,
} from "@/api/manage/securityInspection";
import { getToken } from "@/utils/auth";
import { listUser } from "@/api/system/user";

export default {
  name: "SecurityInspection",
  components: {},
  data() {
    return {
      userList: null,
      isShowBtn: true,
      //文件数据
      audFileList: [],
      vidFileList: [],
      picFileList: [],
      // 上传的图片服务器地址
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
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
      // 安全巡检表格数据
      securityInspectionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 巡检类型字典
      siTypeOptions: [],
      // 计划执行时间时间范围
      daterangeSiTime: [],
      // 状态字典
      siStatusOptions: [],
      // 查询参数
      queryParams: {
        userName:null,
        pageNum: 1,
        pageSize: 10,
        msId: null,
        ssrId: null,
        siType: null,
        siTime: null,
        siStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      type: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("m_security_inspection_type").then((response) => {
      this.siTypeOptions = response.data;
    });
    this.getDicts("m_security_inspection_status").then((response) => {
      this.siStatusOptions = response.data;
    });
    this.getDicts("m_security_setting_type").then((response) => {
      this.type = response.data;
    });
    this.getUserList();
  },
  methods: {
    /** 查询安全巡检列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeSiTime && "" != this.daterangeSiTime) {
        this.queryParams.params["beginSiTime"] = this.daterangeSiTime[0];
        this.queryParams.params["endSiTime"] = this.daterangeSiTime[1];
      }
      listSecurityInspection(this.queryParams).then((response) => {
        this.securityInspectionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 巡检性质字典翻译
    siTypeFormat(row, column) {
      return this.selectDictLabel(this.siTypeOptions, row.siType);
    },

    ssType(row, column) {
      return this.selectDictLabel(this.type, row.ssType);
    },
    siType(row, column) {
      return this.selectDictLabel(this.type, row.siType);
    },
    // 状态字典翻译
    siStatusFormat(row, column) {
      return this.selectDictLabel(this.siStatusOptions, row.siStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        siId: null,
        msId: null,
        ssrId: null,
        siType: null,
        siTime: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        siStatus: "0",
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
      this.daterangeSiTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.siId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加安全巡检";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const siId = row.siId || this.ids;
      getSecurityInspection(siId).then((response) => {
        this.form = response.data;
        for (const i of this.form.securityInspectionDetails) {
          if (i.imgData) {
            this.picFileList.push(JSON.parse(i.imgData));
          }
          if (i.audioData) {
            this.audFileList.push(JSON.parse(i.audioData));
          }
          if (i.videoData) {
            this.vidFileList.push(JSON.parse(i.videoData));
          }
        }

        this.open = true;
        this.isShowBtn = true;
        this.title = "修改安全巡检";
      });
    },

    handleShow(row) {
      this.reset();
      const siId = row.siId || this.ids;
      getSecurityInspection(siId).then((response) => {
        this.form = response.data;
        console.log(this.form);
        for (const i of this.form.securityInspectionDetails) {
          if (i.imgData) {
            this.picFileList.push(JSON.parse(i.imgData));
          }
          if (i.audioData) {
            this.audFileList.push(JSON.parse(i.audioData));
          }
          if (i.videoData) {
            this.vidFileList.push(JSON.parse(i.videoData));
          }
        }
        // console.log(this.picFileList, this.audFileList, this.vidFileList);

        this.open = true;
        this.isShowBtn = false;
        this.title = "查看安全巡检";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // this.form.emrImgData = JSON.stringify(this.picFileList);
          // this.form.emrAudioData = JSON.stringify(this.audFileList);
          // this.form.emrVideoData = JSON.stringify(this.vidFileList);
          if (this.form.siId != null) {
            updateSecurityInspection(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSecurityInspection(this.form).then((response) => {
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
      const siIds = row.siId || this.ids;
      this.$confirm(
        '是否确认删除安全巡检编号为"' + siIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSecurityInspection(siIds);
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
      this.$confirm("是否确认导出所有安全巡检数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportSecurityInspection(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 点击文件列表*/
    handlePreview(file) {
      if (file.status === "success") {
        let ele = document.createElement("a"); // 创建下载链接
        ele.download = file.name;
        ele.style.display = "none";
        ele.href = process.env.VUE_APP_BASE_API + file.url;
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
    vidHandleRemove(file, fileList) {
      this.vidFileList = [];
      fileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.vidFileList.push(file);
      });
    },
    audHandleRemove(file, fileList) {
      this.audFileList = [];
      fileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.audFileList.push(file);
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
    audUploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        file.url = response.fileName;
        this.audFileList = [];
        fileList.forEach((item) => {
          let file = { name: item.name, url: item.url };
          this.audFileList.push(file);
        });
      }
    },
    /** 上传成功*/
    vidUploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        file.url = response.fileName;
        this.vidFileList = [];
        fileList.forEach((item) => {
          let file = { name: item.name, url: item.url };
          this.vidFileList.push(file);
        });
      }
    },
    /** 上传文件*/
    audSubmitUpload() {
      this.$refs.audUpload.submit();
    },
    /** 上传文件*/
    vidSubmitUpload() {
      this.$refs.vidUpload.submit();
    },
    /** 查询系统用户 */
    getUserList() {
      listUser({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.userList = response.rows;
        this.userList = this.userList.filter((user) => user.admin !== true);
      });
    },
  },
};
</script>
