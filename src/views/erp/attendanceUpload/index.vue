<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="员工名字" prop="apUserName">
        <el-input
          v-model="queryParams.apUserName"
          placeholder="请输入员工名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作日期" prop="apDate">
        <el-input
          v-model="queryParams.apDate"
          placeholder="请输入工作日期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门" prop="apDepartment">
        <el-input
          v-model="queryParams.apDepartment"
          placeholder="请输入部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="科室" prop="apDepartmentDetails">
        <el-input
          v-model="queryParams.apDepartmentDetails"
          placeholder="请输入科室"
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
        <el-upload
          class="upload-demo"
          :headers="headers"
          :on-success="uploadSuccess"
          :action="uploadFileUrl">
          <el-button icon="el-icon-upload" size="mini" plain type="primary">上传</el-button>
        </el-upload>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="attendanceUploadList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工名字" align="center" prop="apUserName" />
      <el-table-column label="工作日期" align="center" prop="apDate" />
      <el-table-column label="科室" align="center" prop="apDepartmentDetails" />
      <el-table-column label="1" align="center" width="35" prop="one" />
      <el-table-column label="2" align="center" width="35" prop="two" />
      <el-table-column label="3" align="center" width="35" prop="three" />
      <el-table-column label="4" align="center" width="35" prop="four" />
      <el-table-column label="5" align="center" width="35" prop="five" />
      <el-table-column label="6" align="center" width="35" prop="six" />
      <el-table-column label="7" align="center" width="35" prop="seven" />
      <el-table-column label="8" align="center" width="35" prop="eight" />
      <el-table-column label="9" align="center" width="35" prop="nine" />
      <el-table-column label="10" align="center" width="35" prop="ten" />
      <el-table-column label="11" align="center" width="35" prop="eleven" />
      <el-table-column label="12" align="center" width="35" prop="twelve" />
      <el-table-column label="13" align="center" width="35" prop="thirteen" />
      <el-table-column label="14" align="center" width="35" prop="fourteen" />
      <el-table-column label="15" align="center" width="35" prop="fifteen" />
      <el-table-column label="16" align="center" width="35" prop="sixteen" />
      <el-table-column label="17" align="center" width="35" prop="seventeen" />
      <el-table-column label="18" align="center" width="35" prop="eighteen" />
      <el-table-column label="19" align="center" width="35" prop="nineteen" />
      <el-table-column label="20" align="center" width="35" prop="twenty" />
      <el-table-column label="21" align="center" width="35" prop="twentyOne" />
      <el-table-column label="22" align="center" width="35" prop="twentyTwo" />
      <el-table-column label="23" align="center" width="35" prop="twentyThree" />
      <el-table-column label="24" align="center" width="35" prop="twentyFour" />
      <el-table-column label="25" align="center" width="35" prop="twentyFive" />
      <el-table-column label="26" align="center" width="35" prop="twentySix" />
      <el-table-column label="27" align="center" width="35" prop="twentySeven" />
      <el-table-column label="28" align="center" width="35" prop="twentyEight" />
      <el-table-column label="29" align="center" width="35" prop="twentyNine" />
      <el-table-column label="30" align="center" width="35" prop="thirty" />
      <el-table-column label="31" align="center" width="35" prop="thirtyOne" />
      <el-table-column label="√小计" align="center" prop="totalOne" />
      <el-table-column label="W小计" align="center" prop="totalTwo" />
      <el-table-column label="√+W合计" align="center" prop="totalThree" />
      <el-table-column label="国假" align="center" prop="totalFour" />
      <el-table-column label="事假" align="center" prop="totalFive" />
      <el-table-column label="病假" align="center" prop="totalSix" />
      <el-table-column label="调休" align="center" prop="totalSeven" />
      <el-table-column label="矿工" align="center" prop="totalEight" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:attendanceUpload:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:attendanceUpload:remove']"
          >删除</el-button>
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

    <!-- 添加或修改员工考勤(上传)对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工名字" prop="apUserName">
          <el-input v-model="form.apUserName" placeholder="请输入员工名字" />
        </el-form-item>
        <el-form-item label="工作日期" prop="apDate">
          <el-input v-model="form.apDate" placeholder="请输入工作日期" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="部门" prop="apDepartment">
          <el-input v-model="form.apDepartment" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="科室" prop="apDepartmentDetails">
          <el-input v-model="form.apDepartmentDetails" placeholder="请输入科室" />
        </el-form-item>
        <el-form-item label="1" prop="one">
          <el-input v-model="form.one" placeholder="请输入1" />
        </el-form-item>
        <el-form-item label="2" prop="two">
          <el-input v-model="form.two" placeholder="请输入2" />
        </el-form-item>
        <el-form-item label="3" prop="three">
          <el-input v-model="form.three" placeholder="请输入3" />
        </el-form-item>
        <el-form-item label="4" prop="four">
          <el-input v-model="form.four" placeholder="请输入4" />
        </el-form-item>
        <el-form-item label="5" prop="five">
          <el-input v-model="form.five" placeholder="请输入5" />
        </el-form-item>
        <el-form-item label="6" prop="six">
          <el-input v-model="form.six" placeholder="请输入6" />
        </el-form-item>
        <el-form-item label="7" prop="seven">
          <el-input v-model="form.seven" placeholder="请输入7" />
        </el-form-item>
        <el-form-item label="8" prop="eight">
          <el-input v-model="form.eight" placeholder="请输入8" />
        </el-form-item>
        <el-form-item label="9" prop="nine">
          <el-input v-model="form.nine" placeholder="请输入9" />
        </el-form-item>
        <el-form-item label="10" prop="ten">
          <el-input v-model="form.ten" placeholder="请输入10" />
        </el-form-item>
        <el-form-item label="11" prop="eleven">
          <el-input v-model="form.eleven" placeholder="请输入11" />
        </el-form-item>
        <el-form-item label="12" prop="twelve">
          <el-input v-model="form.twelve" placeholder="请输入12" />
        </el-form-item>
        <el-form-item label="13" prop="thirteen">
          <el-input v-model="form.thirteen" placeholder="请输入13" />
        </el-form-item>
        <el-form-item label="14" prop="fourteen">
          <el-input v-model="form.fourteen" placeholder="请输入14" />
        </el-form-item>
        <el-form-item label="15" prop="fifteen">
          <el-input v-model="form.fifteen" placeholder="请输入15" />
        </el-form-item>
        <el-form-item label="16" prop="sixteen">
          <el-input v-model="form.sixteen" placeholder="请输入16" />
        </el-form-item>
        <el-form-item label="17" prop="seventeen">
          <el-input v-model="form.seventeen" placeholder="请输入17" />
        </el-form-item>
        <el-form-item label="18" prop="eighteen">
          <el-input v-model="form.eighteen" placeholder="请输入18" />
        </el-form-item>
        <el-form-item label="19" prop="nineteen">
          <el-input v-model="form.nineteen" placeholder="请输入19" />
        </el-form-item>
        <el-form-item label="20" prop="twenty">
          <el-input v-model="form.twenty" placeholder="请输入20" />
        </el-form-item>
        <el-form-item label="21" prop="twentyOne">
          <el-input v-model="form.twentyOne" placeholder="请输入21" />
        </el-form-item>
        <el-form-item label="22" prop="twentyTwo">
          <el-input v-model="form.twentyTwo" placeholder="请输入22" />
        </el-form-item>
        <el-form-item label="23" prop="twentyThree">
          <el-input v-model="form.twentyThree" placeholder="请输入23" />
        </el-form-item>
        <el-form-item label="24" prop="twentyFour">
          <el-input v-model="form.twentyFour" placeholder="请输入24" />
        </el-form-item>
        <el-form-item label="25" prop="twentyFive">
          <el-input v-model="form.twentyFive" placeholder="请输入25" />
        </el-form-item>
        <el-form-item label="26" prop="twentySix">
          <el-input v-model="form.twentySix" placeholder="请输入26" />
        </el-form-item>
        <el-form-item label="27" prop="twentySeven">
          <el-input v-model="form.twentySeven" placeholder="请输入27" />
        </el-form-item>
        <el-form-item label="28" prop="twentyEight">
          <el-input v-model="form.twentyEight" placeholder="请输入28" />
        </el-form-item>
        <el-form-item label="29" prop="twentyNine">
          <el-input v-model="form.twentyNine" placeholder="请输入29" />
        </el-form-item>
        <el-form-item label="30" prop="thirty">
          <el-input v-model="form.thirty" placeholder="请输入30" />
        </el-form-item>
        <el-form-item label="31" prop="thirtyOne">
          <el-input v-model="form.thirtyOne" placeholder="请输入31" />
        </el-form-item>
        <el-form-item label="√小计" prop="totalOne">
          <el-input v-model="form.totalOne" placeholder="请输入√小计" />
        </el-form-item>
        <el-form-item label="W小计" prop="totalTwo">
          <el-input v-model="form.totalTwo" placeholder="请输入W小计" />
        </el-form-item>
        <el-form-item label="√+W合计" prop="totalThree">
          <el-input v-model="form.totalThree" placeholder="请输入√+W合计" />
        </el-form-item>
        <el-form-item label="国假" prop="totalFour">
          <el-input v-model="form.totalFour" placeholder="请输入国假" />
        </el-form-item>
        <el-form-item label="事假" prop="totalFive">
          <el-input v-model="form.totalFive" placeholder="请输入事假" />
        </el-form-item>
        <el-form-item label="病假" prop="totalSix">
          <el-input v-model="form.totalSix" placeholder="请输入病假" />
        </el-form-item>
        <el-form-item label="调休" prop="totalSeven">
          <el-input v-model="form.totalSeven" placeholder="请输入调休" />
        </el-form-item>
        <el-form-item label="矿工" prop="totalEight">
          <el-input v-model="form.totalEight" placeholder="请输入矿工" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listAttendanceUpload, getAttendanceUpload, delAttendanceUpload, addAttendanceUpload, updateAttendanceUpload, exportAttendanceUpload } from "@/api/erp/attendanceUpload";
import {getToken} from "@/utils/auth";
export default {
  name: "AttendanceUpload",
  components: {
  },
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
      // 员工考勤(上传)表格数据
      attendanceUploadList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        apUserName: null,
        apDate: null,
        apDepartment: null,
        apDepartmentDetails: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      //上传地址
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/erp/attendanceUpload/upload",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 上传成功*/
    uploadSuccess(response, file, fileList) {
      console.log(response);
      if (response.code === 200) {

      }
    },
    /** 查询员工考勤(上传)列表 */
    getList() {
      this.loading = true;
      listAttendanceUpload(this.queryParams).then(response => {
        this.attendanceUploadList = response.rows;
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
        apId: null,
        apUserName: null,
        apDate: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        apDepartment: null,
        apDepartmentDetails: null,
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
        ten: null,
        eleven: null,
        twelve: null,
        thirteen: null,
        fourteen: null,
        fifteen: null,
        sixteen: null,
        seventeen: null,
        eighteen: null,
        nineteen: null,
        twenty: null,
        twentyOne: null,
        twentyTwo: null,
        twentyThree: null,
        twentyFour: null,
        twentyFive: null,
        twentySix: null,
        twentySeven: null,
        twentyEight: null,
        twentyNine: null,
        thirty: null,
        thirtyOne: null,
        totalOne: null,
        totalTwo: null,
        totalThree: null,
        totalFour: null,
        totalFive: null,
        totalSix: null,
        totalSeven: null,
        totalEight: null,
        remark: null
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
      this.ids = selection.map(item => item.apId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加员工考勤(上传)";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const apId = row.apId || this.ids
      getAttendanceUpload(apId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改员工考勤(上传)";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.apId != null) {
            updateAttendanceUpload(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAttendanceUpload(this.form).then(response => {
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
      const apIds = row.apId || this.ids;
      this.$confirm('是否确认删除员工考勤(上传)编号为"' + apIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAttendanceUpload(apIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有员工考勤(上传)数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportAttendanceUpload(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
