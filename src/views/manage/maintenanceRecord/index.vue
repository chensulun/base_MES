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
      <el-form-item label="资产名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修类型" prop="emrType">
        <el-select v-model="queryParams.emrType" placeholder="请选择设备维修记录类型" clearable size="small">
          <el-option
            v-for="dict in emrTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['manage:maintenanceRecord:add']"
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
          v-hasPermi="['manage:maintenanceRecord:edit']"
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
          v-hasPermi="['manage:maintenanceRecord:remove']"
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
          v-hasPermi="['manage:maintenanceRecord:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="maintenanceRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="资产类型" align="center" prop="equipmentType" :formatter="equipmentTypeFormat"/>
      <el-table-column label="资产名称" align="center" prop="equipmentName"/>
      <el-table-column label="维修类型" align="center" prop="emrType" :formatter="emrTypeFormat"/>
      <el-table-column label="维修时间" align="center" prop="emrTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.emrTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修说明" align="center" prop="emrRemark"/>
      <el-table-column label="维修人员" align="center" prop="emrMaintainer"/>
      <el-table-column label="负责人" align="center" prop="emrDirector"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:maintenanceRecord:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:maintenanceRecord:remove']"
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

    <!-- 添加或修改维修记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="12">
            <el-form-item label="设备类型" prop="equipmentType">
              <el-select v-model="form.equipmentType" placeholder="请选择设备类型">
                <el-option
                  v-for="dict in equipmentTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备"  prop="equipmentId">
              <el-select v-model="form.equipmentId" @change="equipmentSelectChange" placeholder="请选择设备">
                <el-option
                  v-for="dict in equipmentList"
                  :key="dict.equipmentId"
                  :label="dict.equipmentName"
                  :value="dict.equipmentId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修类别" prop="emrType">
              <el-select v-model="form.emrType" placeholder="请选择设备维修记录类型">
                <el-option
                  v-for="dict in emrTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="维修时间" prop="emrTime">
              <el-date-picker clearable size="small"
                              v-model="form.emrTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择维修时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="维修说明" prop="emrRemark">
              <el-input type="textarea" v-model="form.emrRemark" placeholder="请输入维修说明"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>消耗数据</el-divider>
          </el-col>
          <el-col :span="24"  v-for="(data,index) in form.emrConsumeDataList">
            <el-col :span="10">
              <el-form-item label="配件名称" prop="contractSupplierPhone">
                <el-input v-model="data.name"  placeholder="请输入配件名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="配件数量" prop="contractSupplierPhone">
                <el-input v-model="data.num" type="number" placeholder="请输入配件数量"/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button size="mini" icon="el-icon-delete"
                         @click="deleteInput(index,form.emrConsumeDataList)" circle></el-button>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-button
              plain
              icon="el-icon-plus"
              size="mini"
              style="margin-left:100px"
              @click="addInputConsumeDataList"
            >增加消耗配件
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i></el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修人员" prop="emrMaintainer">
              <el-input v-model="form.emrMaintainer" placeholder="请输入维修人员"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="emrMaintainerPhone">
              <el-input v-model="form.emrMaintainerPhone" placeholder="请输入维修人员电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="emrDirector">
              <el-input v-model="form.emrDirector" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="emrDirectorPhone">
              <el-input v-model="form.emrDirectorPhone" placeholder="请输入负责人电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="emrPictureData">
              <el-upload
                class="upload-demo"
                :action="uploadFileUrl"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="picHandleRemove"
                :on-success="picUploadSuccess"
                :file-list="picFileList"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件" prop="emrVideoData">
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
    listMaintenanceRecord,
    getMaintenanceRecord,
    delMaintenanceRecord,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    exportMaintenanceRecord
  } from "@/api/manage/maintenanceRecord";

  import {
    listEquipment
  } from "@/api/manage/equipment";
  import {getToken} from "@/utils/auth";

  export default {
    name: "MaintenanceRecord",
    components: {},
    data() {
      return {
        fileList: [],
        picFileList: [],
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
        // 维修记录表格数据
        maintenanceRecordList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 设备类型字典
        equipmentTypeOptions: [],
        // 设备维修记录类型字典
        emrTypeOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          equipmentName: null,
          emrType: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //设备列表
        equipmentList: []
      };
    },
    created() {
      this.getList();
      this.getDicts("m_equipment_type").then(response => {
        this.equipmentTypeOptions = response.data;
      });
      this.getDicts("m_equipment_maintenance_record_type").then(response => {
        this.emrTypeOptions = response.data;
      });
      this.getEquipmentList();
    },
    methods: {
      /** 增加消耗数据 */
      addInputConsumeDataList() {
        let data = {name: null, num: null};
        this.form.emrConsumeDataList.push(data);
      },
      /** 删除消耗数据 */
      deleteInput(index, rows) {
        rows.splice(index, 1);
      },
      /** 上传成功*/
      picUploadSuccess(response, file, fileList) {
        if (response.code === 200) {
          file.url = response.fileName;
          this.picFileList = [];
          fileList.forEach(item => {
            item.url = process.env.VUE_APP_BASE_API + item.url;
            let file = {name:item.name,url:item.url};
            this.picFileList.push(file);
          });
        }
      },
      /** 上传成功*/
      uploadSuccess(response, file, fileList) {
        if (response.code === 200) {
          file.url = response.fileName;
          this.fileList = [];
          fileList.forEach(item => {
            item.url = process.env.VUE_APP_BASE_API + item.url;
            let file = {name:item.name,url:item.url};
            this.fileList.push(file);
          });
        }
      },
      /** 上传文件*/
      submitUpload() {
        this.$refs.upload.submit();
      },
      picHandleRemove(file, fileList) {
        this.picFileList = [];
        fileList.forEach(item => {
          let file = {name:item.name,url:item.url};
          this.picFileList.push(file);
        });
      },
      handleRemove(file, fileList) {
        this.fileList = [];
        fileList.forEach(item => {
          let file = {name:item.name,url:item.url};
          this.fileList.push(file);
        });
      },
      handlePreview(file) {
        if (file.status === 'success') {
          let ele = document.createElement('a');// 创建下载链接
          ele.download = file.name;
          ele.style.display = 'none';
          ele.href = file.url;
          document.body.appendChild(ele);
          ele.click();
          document.body.removeChild(ele);
        }
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      equipmentSelectChange(equipmentId) {
        let equipment = this.equipmentList.find((item) => {
          return item.equipmentId === equipmentId;
        });
        this.form.equipmentName = equipment.equipmentName;
      },
      /** 查询资产管理列表 */
      getEquipmentList() {
        listEquipment(null).then(response => {
          this.equipmentList = response.rows;
        });
      },
      /** 查询维修记录列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listMaintenanceRecord(this.queryParams).then(response => {
          this.maintenanceRecordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 设备类型字典翻译
      equipmentTypeFormat(row, column) {
        return this.selectDictLabel(this.equipmentTypeOptions, row.equipmentType);
      },
      // 设备维修记录类型字典翻译
      emrTypeFormat(row, column) {
        return this.selectDictLabel(this.emrTypeOptions, row.emrType);
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
          emrType: null,
          emrTime: null,
          emrRemark: null,
          emrConsumeData: null,
          emrConsumeDataList: [{name:null,num:null}],
          emrMaintainer: null,
          emrMaintainerPhone: null,
          emrDirector: null,
          emrDirectorPhone: null,
          emrPictureData: null,
          emrVideoData: null,
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
        this.ids = selection.map(item => item.emrId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加维修记录";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const emrId = row.emrId || this.ids
        getMaintenanceRecord(emrId).then(response => {
          this.form = response.data;
          this.picFileList = JSON.parse(this.form.emrPictureData);
          this.fileList = JSON.parse(this.form.emrVideoData);
          this.form.emrConsumeDataList = JSON.parse(this.form.emrConsumeData);
          this.open = true;
          this.title = "修改维修记录";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            console.log(this.picFileList);
            this.form.emrPictureData = JSON.stringify(this.picFileList);
            this.form.emrVideoData = JSON.stringify(this.fileList);
            this.form.emrConsumeData = JSON.stringify(this.form.emrConsumeDataList);
            console.log(this.form);
            if (this.form.emrId != null) {
              updateMaintenanceRecord(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMaintenanceRecord(this.form).then(response => {
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
        this.$confirm('是否确认删除维修记录编号为"' + emrIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delMaintenanceRecord(emrIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有维修记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportMaintenanceRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
<style>
</style>
