<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="daterangeEmEntryTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="姓名" prop="emUserName">
        <el-input
          v-model="queryParams.emUserName"
          placeholder="请输入姓名"
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
          v-hasPermi="['erp:employeeManagement:add']"
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
          v-hasPermi="['erp:employeeManagement:edit']"
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
          v-hasPermi="['erp:employeeManagement:remove']"
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
          v-hasPermi="['erp:employeeManagement:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="employeeManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="员工编号" align="center" prop="emCode"/>
      <el-table-column label="姓名" align="center" prop="emUserName"/>
      <el-table-column label="员工类型" align="center" prop="emType" :formatter="emTypeFormat"/>
      <el-table-column label="联系方式" align="center" prop="emPhone"/>
      <el-table-column label="学历" align="center" prop="emEducation"/>
      <el-table-column label="年龄" align="center" prop="emAge"/>
      <el-table-column label="部门" align="center" prop="emDepartment"/>
      <el-table-column label="岗位" align="center" prop="emPost"/>
      <el-table-column label="入职时间" align="center" prop="emEntryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.emEntryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleSearch(scope.row)"
            v-hasPermi="['manage:task:query']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:employeeManagement:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:employeeManagement:remove']"
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

    <!-- 添加或修改员工管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="8">
            <el-form-item label="员工编号" prop="emCode">
              <el-input v-model="form.emCode" placeholder="请输入员工编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="emUserName">
              <el-input v-model="form.emUserName" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄" prop="emAge">
              <el-input v-model="form.emAge" placeholder="请输入年龄"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="emCarNo">
              <el-input v-model="form.emCarNo" placeholder="请输入身份证号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" prop="emNativePlace">
              <el-input v-model="form.emNativePlace" placeholder="请输入籍贯"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业学校" prop="emSchool">
              <el-input v-model="form.emSchool" placeholder="请输入毕业学校"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业时间" prop="emGraduationTime">
              <el-date-picker clearable size="small"
                              v-model="form.emGraduationTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择毕业时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历" prop="emEducation">
              <el-input v-model="form.emEducation" placeholder="请输入学历"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="emPhone">
              <el-input v-model="form.emPhone" placeholder="请输入联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住址" prop="emAddress">
              <el-input v-model="form.emAddress" placeholder="请输入住址"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工类型" prop="emType">
              <el-select v-model="form.emType" placeholder="请选择员工类型">
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
            <el-form-item label="部门" prop="emDepartment">
              <el-input v-model="form.emDepartment" placeholder="请输入部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" prop="emPost">
              <el-input v-model="form.emPost" placeholder="请输入岗位"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="emEntryTime">
              <el-date-picker clearable size="small"
                              v-model="form.emEntryTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择入职时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="emRemark">
              <el-input v-model="form.emRemark" type="textarea"  placeholder="请输入内容"/>
            </el-form-item>
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
        </el-form>
      </el-row>
      <div slot="footer" v-if="add" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listEmployeeManagement,
    getEmployeeManagement,
    delEmployeeManagement,
    addEmployeeManagement,
    updateEmployeeManagement,
    exportEmployeeManagement
  } from "@/api/erp/employeeManagement";
  import {getToken} from "@/utils/auth";

  export default {
    name: "EmployeeManagement",
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
        // 员工管理表格数据
        employeeManagementList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 员工类型字典
        emTypeOptions: [],
        // 入职时间时间范围
        daterangeEmEntryTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          emUserName: null,
          emEntryTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        // 上传的图片服务器地址
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        //文件数据
        fileList: [],
        //新增修改显示
        add: true,
      };
    },
    created() {
      this.getList();
      this.getDicts("erp_employee_management_type").then(response => {
        this.emTypeOptions = response.data;
      });
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
            let file = {name: item.name, url: item.url};
            this.fileList.push(file);
          });
        }
      },
      handleRemove(file, fileList) {
        this.fileList = [];
        fileList.forEach(item => {
          let file = {name: item.name, url: item.url};
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
      /** 查询员工管理列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeEmEntryTime && '' != this.daterangeEmEntryTime) {
          this.queryParams.params["beginEmEntryTime"] = this.daterangeEmEntryTime[0];
          this.queryParams.params["endEmEntryTime"] = this.daterangeEmEntryTime[1];
        }
        listEmployeeManagement(this.queryParams).then(response => {
          this.employeeManagementList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 员工类型字典翻译
      emTypeFormat(row, column) {
        return this.selectDictLabel(this.emTypeOptions, row.emType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          emId: null,
          emCode: null,
          emUserName: null,
          emAge: null,
          emCarNo: null,
          emNativePlace: null,
          emSchool: null,
          emGraduationTime: null,
          emEducation: null,
          emPhone: null,
          emAddress: null,
          emType: null,
          emDepartment: null,
          emPost: null,
          emEntryTime: null,
          emRemark: null,
          emFileData: null,
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
        this.daterangeEmEntryTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.emId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加员工信息";
      },
      /** 查看按钮操作 */
      handleSearch(row) {
        this.reset();
        const emId = row.emId || this.ids
        getEmployeeManagement(emId).then(response => {
          this.form = response.data;
          this.fileList = [];
          if (this.form.emFileData) {
            this.fileList = JSON.parse(this.form.emFileData);
          }
          this.add = false;
          this.open = true;
          this.title = "查看员工信息";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const emId = row.emId || this.ids
        getEmployeeManagement(emId).then(response => {
          this.form = response.data;
          this.fileList = [];
          if (this.form.emFileData) {
            this.fileList = JSON.parse(this.form.emFileData);
          }
          this.add = true;
          this.open = true;
          this.title = "修改员工信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.emFileData = JSON.stringify(this.fileList);
            if (this.form.emId != null) {
              updateEmployeeManagement(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addEmployeeManagement(this.form).then(response => {
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
        const emIds = row.emId || this.ids;
        this.$confirm('是否确认删除员工管理编号为"' + emIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delEmployeeManagement(emIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有员工管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportEmployeeManagement(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
