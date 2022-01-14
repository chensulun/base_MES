<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工资时间" prop="smDate">
        <el-date-picker clearable size="small"
                        v-model="queryParams.smDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择工资时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名" prop="smUserName">
        <el-input
          v-model="queryParams.smUserName"
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
          v-hasPermi="['erp:salaryManagement:add']"
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
          v-hasPermi="['erp:salaryManagement:edit']"
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
          v-hasPermi="['erp:salaryManagement:remove']"
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
          v-hasPermi="['erp:salaryManagement:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="salaryManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="姓名" align="center" prop="smUserName"/>
      <el-table-column label="部门" align="center" prop="smDepartment"/>
      <el-table-column label="工资时间" align="center" prop="smDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.smDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基本工资" align="center" prop="smBasePay"/>
      <el-table-column label="全勤工资" align="center" prop="smFullAttendance">
        <template slot-scope="scope">
          <span>{{ getRowValue(scope.row.addData,'全勤工资') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补贴" align="center" prop="smSubsidy">
        <template slot-scope="scope">
          <span>{{ getRowValue(scope.row.addData,'补贴') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绩效" align="center" prop="smAchievements">
      <template slot-scope="scope">
        <span>{{ getRowValue(scope.row.addData,'绩效') }}</span>
      </template>
      </el-table-column>
      <el-table-column label="提成" align="center" prop="smCommission">
        <template slot-scope="scope">
          <span>{{ getRowValue(scope.row.addData,'提成') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="迟到扣款" align="center" prop="smLate">
        <template slot-scope="scope">
          <span>{{ getRowValue(scope.row.deductionData,'迟到扣款') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请假扣款" align="center" prop="smLeave">
        <template slot-scope="scope">
          <span>{{ getRowValue(scope.row.deductionData,'请假扣款') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="个税" align="center" prop="smIndividualIncomeTax"/>
      <el-table-column label="社保" align="center" prop="smSocialSecurity"/>
      <el-table-column label="罚款" align="center" prop="smFine">
        <template slot-scope="scope">
          <span>{{ getRowValue(scope.row.deductionData,'罚款') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实发工资" align="center" prop="">
        <template slot-scope="scope">
          <span>{{ getValue(scope.row.addData,scope.row.deductionData,scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:salaryManagement:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:salaryManagement:remove']"
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

    <!-- 添加或修改工资管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="8">
            <el-form-item label="姓名" prop="smUserName">
              <el-input v-model="form.smUserName" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门" prop="smDepartment">
              <el-input v-model="form.smDepartment" placeholder="请输入部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="smEmail">
              <el-input v-model="form.smEmail" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工资时间" prop="smDate">
              <el-date-picker clearable size="small"
                              v-model="form.smDate"
                              type="month"
                              value-format="yyyy-MM-dd"
                              placeholder="选择工资时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基本工资" prop="smBasePay">
              <el-input v-model="form.smBasePay" type="number" placeholder="请输入基本工资" @change="getTaxValue"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col v-for="(item,index) in form.addList" :span="8">
            <el-form-item :key="index" :label="item.key" :prop="item.key">
              <el-col :span="20">
                <el-input type="number" @change="getTaxValue" v-model="item.value" :placeholder="'请输入'+ item.key"/>
              </el-col>
              <el-col :span="4">
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteRow(index,form.addList)"
                  circle>
                </el-button>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="20">
              <el-input size="mini" style="float: right;width: 150px" v-model="form.addKey" placeholder="请输入名称"/>
            </el-col>
            <el-col :span="4">
              <el-button
                plain
                icon="el-icon-plus"
                size="mini"
                @click="addKeyValue(form.addList,form.addKey)"
              >增加条目
              </el-button>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col v-for="(item,index) in form.deductionList" :span="8">
            <el-form-item :key="index" :label="item.key" :prop="item.key">
              <el-col :span="20">
                <el-input type="number" @change="getTaxValue" v-model="item.value" :placeholder="'请输入'+ item.key"/>
              </el-col>
              <el-col :span="4">
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteRow(index,form.deductionList)"
                  circle>
                </el-button>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="20">
              <el-input size="mini" style="float: right;width: 150px" v-model="form.deductionKey" placeholder="请输入名称"/>
            </el-col>
            <el-col :span="4">
              <el-button
                plain
                icon="el-icon-plus"
                size="mini"
                @click="addKeyValue(form.deductionList,form.deductionKey)"
              >增加条目
              </el-button>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个税" prop="smIndividualIncomeTax">
              <el-input v-model="form.smIndividualIncomeTax" placeholder="请输入个人所得税"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社保" prop="smSocialSecurity">
              <el-input v-model="form.smSocialSecurity" placeholder="请输入社保"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试用期" prop="smProbation">
              <el-input v-model="form.smProbation" placeholder="请输入试用期工资"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" prop="smProbationDate">
              <el-input v-model="form.smProbationDate" placeholder="请输入试用期时间"/>
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
    listSalaryManagement,
    getSalaryManagement,
    delSalaryManagement,
    addSalaryManagement,
    updateSalaryManagement,
    exportSalaryManagement,
    getInsurance,
    getTax,
  } from "@/api/erp/salaryManagement";

  export default {
    name: "SalaryManagement",
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
        // 工资管理表格数据
        salaryManagementList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          smUserName: null,
          smDate: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //社保
        insurance: null,
      };
    },
    created() {
      this.getList();
      this.getInsuranceValue()
    },
    methods: {
      getRowValue(data,row) {
        let list = JSON.parse(data);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          if (item.key === row) {
            return item.value;
          }
        }
        return 0;
      },
      //获取社保
      getInsuranceValue() {
        getInsurance().then(response => {
          this.insurance = response.data;
        });
      },
      //获取个税
      getTaxValue() {
        if (!this.form.smBasePay){
          return;
        }
        this.form.addData = JSON.stringify(this.form.addList);
        this.form.deductionData = JSON.stringify(this.form.deductionList);
        getTax(this.form).then(response => {
          this.form.smIndividualIncomeTax = response.data;
        });
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      addKeyValue(list, key) {
        if (!key) {
          this.msgError('请输入名称');
          return;
        }
        list.push({key: key, value: null});
        this.form.addKey = null;
        this.form.deductionKey = null;
      },
      /** 查询工资管理列表 */
      getList() {
        this.loading = true;
        listSalaryManagement(this.queryParams).then(response => {
          this.salaryManagementList = response.rows;
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
          smId: null,
          smUserName: null,
          smDepartment: null,
          smEmail: null,
          smDate: null,
          smBasePay: null,
          smFullAttendance: null,
          smSubsidy: null,
          smAchievements: null,
          smCommission: null,
          smLate: null,
          smLeave: null,
          smFine: null,
          smIndividualIncomeTax: null,
          smSocialSecurity: null,
          smProbation: null,
          smProbationDate: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          //奖励项
          addList: [{key: '全勤工资', value: null}, {key: '补贴', value: null}, {key: '绩效', value: null}, {
            key: '提成',
            value: null
          }],
          addKey: null,
          //扣除项
          deductionList: [{key: '迟到扣款', value: null}, {key: '请假扣款', value: null}, {key: '罚款', value: null}],
          deductionKey: [],
          addData: null,
          deductionData: null
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
        this.ids = selection.map(item => item.smId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加工资管理";
        this.form.smSocialSecurity = this.insurance;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const smId = row.smId || this.ids
        getSalaryManagement(smId).then(response => {
          this.form = response.data;
          this.form.addList = JSON.parse(this.form.addData);
          this.form.deductionList = JSON.parse(this.form.deductionData);
          this.open = true;
          this.title = "修改工资管理";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.addData = JSON.stringify(this.form.addList);
            this.form.deductionData = JSON.stringify(this.form.deductionList);
            if (this.form.smId != null) {
              updateSalaryManagement(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addSalaryManagement(this.form).then(response => {
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
        const smIds = row.smId || this.ids;
        this.$confirm('是否确认删除工资管理编号为"' + smIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delSalaryManagement(smIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有工资管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportSalaryManagement(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      },
      getValue(data,data1,row) {
        let list = JSON.parse(data);
        let list1 = JSON.parse(data1);
        let c=0,d= 0;
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
         c += Number(item.value);
        }
        for (let i = 0; i < list1.length; i++) {
          let item = list1[i];
         d += Number(item.value);
        }
        return row.smBasePay+c-row.smIndividualIncomeTax-row.smSocialSecurity-d
      },
    }
  };
</script>
