<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修类别" prop="emType">
        <el-select v-model="queryParams.emType" placeholder="请选择维修类别" clearable size="small">
          <el-option
            v-for="dict in emTypeOptions"
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
          v-hasPermi="['manage:equipmentMaintain:add']"
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
          v-hasPermi="['manage:equipmentMaintain:edit']"
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
          v-hasPermi="['manage:equipmentMaintain:remove']"
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
          v-hasPermi="['manage:equipmentMaintain:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="equipmentMaintainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="设备类型" align="center" prop="equipmentType" :formatter="equipmentTypeFormat"/>
      <el-table-column label="设备名称" align="center" prop="equipmentName"/>
      <el-table-column label="维修类别" align="center" prop="emType" :formatter="emTypeFormat"/>
      <el-table-column label="保养要求" align="center" prop="emRemark"/>
      <el-table-column label="保养人员" align="center" prop="emMaintainer"/>
      <el-table-column label="负责人" align="center" prop="emDirector"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:equipmentMaintain:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:equipmentMaintain:remove']"
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

    <!-- 添加或修改维保管理对话框 -->
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
            <el-form-item label="设备" prop="equipmentId">
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
          <el-col :span="24">
            <el-form-item label="保养要求" prop="emRemark">
              <el-input type="textarea" v-model="form.emRemark" placeholder="请输入保养要求"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"><i class="el-icon-s-order"></i>消耗数据</el-divider>
          </el-col>
          <el-col :span="24"  v-for="(data,index) in form.emConsumeDataList">
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
                         @click="deleteInput(index,form.emConsumeDataList)" circle></el-button>
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
            <el-form-item label="保养人员" prop="emMaintainer">
              <el-input v-model="form.emMaintainer" placeholder="请输入保养人员"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="emMaintainerPhone">
              <el-input v-model="form.emMaintainerPhone" placeholder="请输入保养人员电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="emDirector">
              <el-input v-model="form.emDirector" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="emDirectorPhone">
              <el-input v-model="form.emDirectorPhone" placeholder="请输入负责人电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产量" prop="emOutput">
              <el-input v-model="form.emOutput" placeholder="请输入生产量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小时" prop="emHour">
              <el-input v-model="form.emHour" placeholder="请输入小时"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="保养标准" prop="emStandard">
              <el-input type="textarea" v-model="form.emStandard" placeholder="请输入保养标准"/>
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
    listEquipmentMaintain,
    getEquipmentMaintain,
    delEquipmentMaintain,
    addEquipmentMaintain,
    updateEquipmentMaintain,
    exportEquipmentMaintain
  } from "@/api/manage/equipmentMaintain";
  import {
    listEquipment
  } from "@/api/manage/equipment";

  export default {
    name: "EquipmentMaintain",
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
        // 维保管理表格数据
        equipmentMaintainList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 设备类型字典
        equipmentTypeOptions: [],
        // 维修类别字典
        emTypeOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          equipmentName: null,
          emType: null,
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
      this.getDicts("m_equipment_maintain_type").then(response => {
        this.emTypeOptions = response.data;
      });
      this.getEquipmentList();
    },
    methods: {

      /** 增加消耗数据 */
      addInputConsumeDataList() {
        let data = {name: null, num: null};
        this.form.emConsumeDataList.push(data);
      },
      /** 删除消耗数据 */
      deleteInput(index, rows) {
        rows.splice(index, 1);
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
      /** 查询维保管理列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listEquipmentMaintain(this.queryParams).then(response => {
          this.equipmentMaintainList = response.rows;
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
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          emId: null,
          equipmentType: null,
          equipmentId: null,
          equipmentName: null,
          emType: null,
          emRemark: null,
          emConsumeData: null,
          emConsumeDataList: [{name:null,num:null}],
          emMaintainer: null,
          emMaintainerPhone: null,
          emDirector: null,
          emDirectorPhone: null,
          emOutput: null,
          emHour: null,
          emStandard: null,
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
        this.ids = selection.map(item => item.emId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加维保管理";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const emId = row.emId || this.ids
        getEquipmentMaintain(emId).then(response => {
          this.form = response.data;
          this.form.emConsumeDataList = JSON.parse(this.form.emConsumeData);
          this.open = true;
          this.title = "修改维保管理";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.emConsumeData = JSON.stringify(this.form.emConsumeDataList);
            if (this.form.emId != null) {
              updateEquipmentMaintain(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addEquipmentMaintain(this.form).then(response => {
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
        this.$confirm('是否确认删除维保管理编号为"' + emIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delEquipmentMaintain(emIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有维保管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportEquipmentMaintain(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
