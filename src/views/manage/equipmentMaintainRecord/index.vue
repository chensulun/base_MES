<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="设备类型" prop="equipmentType">
        <el-select
          v-model="queryParams.equipmentType"
          placeholder="请选择设备类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in equipmentTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修类别" prop="emType">
        <el-select
          v-model="queryParams.emType"
          placeholder="请选择维修类别"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in emTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="保养人员" prop="emMaintainer">
        <el-input
          v-model="queryParams.emMaintainer"
          placeholder="请输入保养人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="emrStatus">
        <el-select
          v-model="queryParams.emrStatus"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in emrStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['manage:equipmentMaintainRecord:add']"
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
          v-hasPermi="['manage:equipmentMaintainRecord:edit']"
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
          v-hasPermi="['manage:equipmentMaintainRecord:remove']"
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
          v-hasPermi="['manage:equipmentMaintainRecord:export']"
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
      :data="equipmentMaintainRecordList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="id" align="center" prop="emrId" /> -->
      <el-table-column
        label="设备类型"
        align="center"
        prop="equipmentType"
        :formatter="equipmentTypeFormat"
      />
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column
        label="维修类别"
        align="center"
        prop="emType"
        :formatter="emTypeFormat"
      />
      <el-table-column label="保养人员" align="center" prop="emMaintainer" />
      <el-table-column
        label="保养人员电话"
        align="center"
        prop="emMaintainerPhone"
      />
      <el-table-column label="负责人" align="center" prop="emDirector" />
      <el-table-column
        label="负责人电话"
        align="center"
        prop="emDirectorPhone"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="emrStatus"
        :formatter="emrStatusFormat"
      />
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
            icon="el-icon-search"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:equipmentMaintainRecord:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:equipmentMaintainRecord:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:equipmentMaintainRecord:remove']"
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

    <!-- 添加或修改设备保养记录对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="10">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="12">
            <el-form-item label="设备类型" prop="equipmentType">
              <el-select
                v-model="form.equipmentType"
                placeholder="请选择设备类型"
              >
                <el-option
                  v-for="dict in equipmentTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="设备id" prop="equipmentId">
              <el-input v-model="form.equipmentId" placeholder="请输入设备id" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input
                v-model="form.equipmentName"
                placeholder="请输入设备名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修类别" prop="emType">
              <el-select v-model="form.emType" placeholder="请选择维修类别">
                <el-option
                  v-for="dict in emTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养要求" prop="emRemark">
              <el-input v-model="form.emRemark" placeholder="请输入保养要求" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消耗数据" prop="emConsumeData">
              <el-input
                v-model="form.emConsumeData"
                placeholder="请输入消耗数据"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养人员" prop="emMaintainer">
              <el-input
                v-model="form.emMaintainer"
                placeholder="请输入保养人员"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养人员电话" prop="emMaintainerPhone">
              <el-input
                v-model="form.emMaintainerPhone"
                placeholder="请输入保养人员电话"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="emDirector">
              <el-input v-model="form.emDirector" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人电话" prop="emDirectorPhone">
              <el-input
                v-model="form.emDirectorPhone"
                placeholder="请输入负责人电话"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养标准" prop="emStandard">
              <el-input
                v-model="form.emStandard"
                placeholder="请输入保养标准"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养情况" prop="emrInfo">
              <el-input
                v-model="form.emrInfo"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片数据" prop="emrImgData">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="录音数据" prop="emrAudioData">
              <el-upload
                class="upload-demo"
                ref="audUpload"
                :action="uploadFileUrl"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="aduHandleRemove"
                :on-success="audUploadSuccess"
                :file-list="audFileList"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >选取文件</el-button
                >
                <el-button
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="audSubmitUpload"
                  >上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">点击上传文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频数据" prop="emrVideoData">
              <el-upload
                class="upload-demo"
                ref="vidUpload"
                :action="uploadFileUrl"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="vidHandleRemove"
                :on-success="vidUploadSuccess"
                :file-list="vidFileList"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >选取文件</el-button
                >
                <el-button
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="vidSubmitUpload"
                  >上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">点击上传文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.emrStatus">
                <el-radio
                  v-for="dict in emrStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
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
  </div>
</template>

<script>
import {
  listEquipmentMaintainRecord,
  getEquipmentMaintainRecord,
  delEquipmentMaintainRecord,
  addEquipmentMaintainRecord,
  updateEquipmentMaintainRecord,
  exportEquipmentMaintainRecord,
} from "@/api/manage/equipmentMaintainRecord";
import { getToken } from "@/utils/auth";

export default {
  name: "EquipmentMaintainRecord",
  components: {},
  data() {
    return {
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
      // 设备保养记录表格数据
      equipmentMaintainRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设备类型字典
      equipmentTypeOptions: [],
      // 维修类别字典
      emTypeOptions: [],
      // 状态字典
      emrStatusOptions: [],
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipmentType: null,
        emType: null,
        emMaintainer: null,
        emrStatus: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("m_equipment_type").then((response) => {
      this.equipmentTypeOptions = response.data;
    });
    this.getDicts("m_equipment_maintenance_record_type").then((response) => {
      this.emTypeOptions = response.data;
    });
    this.getDicts("m_equipment_maintain_record_status").then((response) => {
      this.emrStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询设备保养记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] =
          this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listEquipmentMaintainRecord(this.queryParams).then((response) => {
        this.equipmentMaintainRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 设备类型字典翻译
    equipmentTypeFormat(row, column) {
      return this.selectDictLabel(this.equipmentTypeOptions, row.equipmentType);
    },
    // 维修类别字典翻译
    emTypeFormat(row, column) {
      return this.selectDictLabel(this.emTypeOptions, row.emType);
    },
    // 状态字典翻译
    emrStatusFormat(row, column) {
      return this.selectDictLabel(this.emrStatusOptions, row.emrStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        emrId: null,
        equipmentType: null,
        equipmentId: null,
        equipmentName: null,
        emType: null,
        emRemark: null,
        emConsumeData: null,
        emMaintainer: null,
        emMaintainerPhone: null,
        emDirector: null,
        emDirectorPhone: null,
        emStandard: null,
        emrInfo: null,
        emrImgData: null,
        emrAudioData: null,
        emrVideoData: null,
        emrStatus: "0",
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
      this.ids = selection.map((item) => item.emrId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备保养记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const emrId = row.emrId || this.ids;
      getEquipmentMaintainRecord(emrId).then((response) => {
        this.form = response.data;
        this.picFileList = JSON.parse(this.form.emrImgData);
        this.audFileList = JSON.parse(this.form.emrAudioData);
        this.vidFileList = JSON.parse(this.form.emrVideoData);
        this.open = true;
        this.title = "修改设备保养记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.emrImgData = JSON.stringify(this.picFileList);
          this.form.emrAudioData = JSON.stringify(this.audFileList);
          this.form.emrVideoData = JSON.stringify(this.vidFileList);
          console.log(this.form);
          if (this.form.emrId != null) {
            updateEquipmentMaintainRecord(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEquipmentMaintainRecord(this.form).then((response) => {
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
      const emrIds = row.emrId || this.ids;
      this.$confirm(
        '是否确认删除设备保养记录编号为"' + emrIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delEquipmentMaintainRecord(emrIds);
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
      this.$confirm("是否确认导出所有设备保养记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportEquipmentMaintainRecord(queryParams);
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
    picHandleRemove(file, picFileList) {
      this.picFileList = [];
      picFileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.picFileList.push(file);
      });
    },
    vidHandleRemove(file, vidFileList) {
      this.vidFileList = [];
      vidFileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.vidFileList.push(file);
      });
    },
    aduHandleRemove(file, audFileList) {
      this.audFileList = [];
      audFileList.forEach((item) => {
        let file = { name: item.name, url: item.url };
        this.audFileList.push(file);
      });
    },
    /** 上传成功*/
    picUploadSuccess(response, file, picFileList) {
      if (response.code === 200) {
        file.url = response.fileName;
        this.picFileList = [];
        picFileList.forEach((item) => {
          item.url = process.env.VUE_APP_BASE_API + item.url;
          let file = { name: item.name, url: item.url };
          this.picFileList.push(file);
        });
      }
    },

    /** 上传成功*/
    audUploadSuccess(response, file, audFileList) {
      if (response.code === 200) {
        file.url = response.fileName;
        this.audFileList = [];
        audFileList.forEach((item) => {
          let file = { name: item.name, url: item.url };
          this.audFileList.push(file);
        });
      }
    },
    /** 上传成功*/
    vidUploadSuccess(response, file, vidFileList) {
      if (response.code === 200) {
        file.url = response.fileName;
        this.vidFileList = [];
        vidFileList.forEach((item) => {
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
  },
};
</script>
