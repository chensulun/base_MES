<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
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
          v-hasPermi="['erp:customer:add']"
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
          v-hasPermi="['erp:customer:edit']"
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
          v-hasPermi="['erp:customer:remove']"
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
          v-hasPermi="['erp:customer:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="客户编号" align="center" prop="customerCode"/>
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="法人代表" align="center" prop="customerRepresentative"/>
      <el-table-column label="联系方式" align="center" prop="customerPhone"/>
      <el-table-column label="地区" align="center" prop="customerRegion"/>
      <el-table-column label="详细地址" align="center" prop="customerAddress"/>
      <el-table-column label="客户等级" align="center" prop="customerLevel"/>
      <el-table-column label="信用度" align="center" prop="customerCredit"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:customer:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:customer:remove']"
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

    <!-- 添加或修改客户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="24">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人代表" prop="customerRepresentative">
              <el-input v-model="form.customerRepresentative" placeholder="请输入法人代表"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="customerPhone">
              <el-input v-model="form.customerPhone" placeholder="请输入联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区" prop="customerRegion">
              <el-input v-model="form.customerRegion" placeholder="请输入地区"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细地址" prop="customerAddress">
              <el-input type="textarea" v-model="form.customerAddress" placeholder="请输入详细地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户等级" prop="customerLevel">
              <el-input v-model="form.customerLevel" placeholder="请输入客户等级"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信用度" prop="customerCredit">
              <el-input v-model="form.customerCredit" placeholder="请输入信用度"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>客情追踪</el-divider>
          </el-col>
          <el-col :span="24">
            <el-table border :data="form.customerSituationList" style="width: 100%">
              <el-table-column prop="name" align="center" label="名称">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.name" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="position" align="center" label="职位">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.position" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="phone" align="center" label="联系方式">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.phone" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="contacts" align="center" label="客户经理">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.contacts" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="n" align="center" label="描述">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.n" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.customerSituationList)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              :style="{width: '100%'}"
              @click="addRow"
            >新增
            </el-button>
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
    listCustomer,
    getCustomer,
    delCustomer,
    addCustomer,
    updateCustomer,
    exportCustomer
  } from "@/api/erp/customer";

  export default {
    name: "Customer",
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
        // 客户信息表格数据
        customerList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          customerName: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 添加材料行*/
      addRow() {
        let material = {name: '', position: '', phone: '',contacts:'', n: ''};
        if (!this.form.customerSituationList){
          this.form.customerSituationList = [];
        }
        this.form.customerSituationList.push(material);
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      /** 查询客户信息列表 */
      getList() {
        this.loading = true;
        listCustomer(this.queryParams).then(response => {
          this.customerList = response.rows;
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
          customerId: null,
          customerCode: null,
          customerName: null,
          customerRepresentative: null,
          customerPhone: null,
          customerRegion: null,
          customerAddress: null,
          customerContacts: null,
          customerLevel: null,
          customerCredit: null,
          customerSituationData: null,
          customerSituationList:[],
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
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.customerId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加客户信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const customerId = row.customerId || this.ids
        getCustomer(customerId).then(response => {
          this.form = response.data;
          this.form.customerSituationList = JSON.parse(this.form.customerSituationData);
          this.open = true;
          this.title = "修改客户信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.customerSituationData = JSON.stringify(this.form.customerSituationList);
            if (this.form.customerId != null) {
              updateCustomer(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCustomer(this.form).then(response => {
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
        const customerIds = row.customerId || this.ids;
        this.$confirm('是否确认删除客户信息编号为"' + customerIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delCustomer(customerIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有客户信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportCustomer(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
