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
      <el-form-item label="资产类别" prop="assetsType">
        <el-select
          v-model="queryParams.assetsType"
          placeholder="请选择资产类别"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in assetsTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资产名称" prop="assetsName">
        <el-input
          v-model="queryParams.assetsName"
          placeholder="请输入资产名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产状态" prop="assetsStatus">
        <el-select
          v-model="queryParams.assetsStatus"
          placeholder="请选择资产状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in assetsStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['erp:assets:add']"
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
          v-hasPermi="['erp:assets:edit']"
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
          v-hasPermi="['erp:assets:remove']"
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
          v-hasPermi="['erp:assets:export']"
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
      :data="assetsList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="资产id" align="center" prop="assetsId" /> -->
      <el-table-column label="资产编号" align="center" prop="assetsCode" />
      <el-table-column
        label="资产类别"
        align="center"
        prop="assetsType"
        :formatter="assetsTypeFormat"
      />
      <el-table-column label="资产名称" align="center" prop="assetsName" />
      <el-table-column
        label="资产制造商"
        align="center"
        prop="assetsManufacturer"
      />
      <el-table-column
        label="资产状态"
        align="center"
        prop="assetsStatus"
        :formatter="assetsStatusFormat"
      />
      <el-table-column label="负责人" align="center" prop="assetsResponsible" />
      <el-table-column
        label="采购时间"
        align="center"
        prop="assetsPurchaseTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.assetsPurchaseTime, "{y}-{m}-{d}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="入库时间"
        align="center"
        prop="assetsWarehousingTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.assetsWarehousingTime, "{y}-{m}-{d}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="mac地址" align="center" prop="assetsMac" />
      <el-table-column
        label="资产存储位置"
        align="center"
        prop="assetsPosition"
      />
      <el-table-column label="文件数据" align="center" prop="assetsFileData" />
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
            >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:assets:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:assets:remove']"
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

    <!-- 添加或修改资产管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="12">
            <el-form-item label="资产编号" prop="assetsCode">
              <el-input
                v-model="form.assetsCode"
                placeholder="请输入资产编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产类别" prop="assetsType">
              <el-select v-model="form.assetsType" placeholder="请选择资产类别">
                <el-option
                  v-for="dict in assetsTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产名称" prop="assetsName">
              <el-input
                v-model="form.assetsName"
                placeholder="请输入资产名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产制造商" prop="assetsManufacturer">
              <el-input
                v-model="form.assetsManufacturer"
                placeholder="请输入资产制造商"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产状态" prop="assetsStatus">
              <el-select
                v-model="form.assetsStatus"
                placeholder="请选择资产状态"
              >
                <el-option
                  v-for="dict in assetsStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="assetsResponsible">
              <el-input
                v-model="form.assetsResponsible"
                placeholder="请输入负责人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购时间" prop="assetsPurchaseTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.equipmentPurchaseTime"
                type="datetime"
                value-format="yyyy-MM-dd"
                placeholder="选择采购时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库时间" prop="assetsWarehousingTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.assetsWarehousingTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择入库时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="mac地址" prop="assetsMac">
              <el-input v-model="form.assetsMac" placeholder="请输入mac地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产存储位置" prop="assetsPosition">
              <el-input
                v-model="form.assetsPosition"
                placeholder="请输入资产存储位置"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="查看"
      :visible.sync="showOpen"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="18">
            <el-col :span="12">
              <el-form-item label="设备名称" prop="equipmentName">
                <el-input
                  readonly
                  v-model="form.equipmentName"
                  placeholder="请输入资产名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号" prop="equipmentCode">
                <el-input
                  readonly
                  v-model="form.equipmentCode"
                  placeholder="请输入设备编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类别" prop="equipmentType">
                <el-select
                  disabled
                  v-model="form.equipmentType"
                  placeholder="请选择设备类别"
                >
                  <!-- <el-option
                    v-for="dict in equipmentType"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option> -->
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="制造商" prop="equipmentManufacturer">
                <el-input
                  readonly
                  v-model="form.equipmentManufacturer"
                  placeholder="请输入制造商"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备状态" prop="equipmentStatus">
                <el-select
                  disabled
                  v-model="form.equipmentStatus"
                  placeholder="请选择设备状态"
                >
                  <!-- <el-option
                    v-for="dict in equipmentStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="equipmentResponsible">
                <el-input
                  readonly
                  v-model="form.equipmentResponsible"
                  placeholder="请输入负责人"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购时间" prop="equipmentPurchaseTime">
                <el-date-picker
                  readonly
                  clearable
                  size="small"
                  v-model="form.equipmentPurchaseTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择采购时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库时间" prop="equipmentWarehousingTime">
                <el-date-picker
                  readonly
                  clearable
                  size="small"
                  v-model="form.equipmentWarehousingTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择入库时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="存储位置" prop="equipmentPosition">
                <el-input
                  readonly
                  v-model="form.equipmentPosition"
                  placeholder="请输入存储位置"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="MAC地址" prop="equipmentMac">
                <el-input
                  readonly
                  v-model="form.equipmentMac"
                  placeholder="请输入mac地址"
                />
              </el-form-item>
            </el-col>
          </el-col>
          <!-- <el-col :span="6">
            <vue-qr :text="qrText" :size="200"></vue-qr>
          </el-col> -->
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAssets,
  getAssets,
  delAssets,
  addAssets,
  updateAssets,
  exportAssets,
} from "@/api/erp/assets";
import vueQr from "vue-qr";

export default {
  name: "Assets",
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
      // 资产管理表格数据
      assetsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 资产类别字典
      assetsTypeOptions: [],
      // 资产状态字典
      assetsStatusOptions: [],
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assetsType: null,
        assetsName: null,
        assetsStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      qrText: null,
      showOpen: false,
    };
  },
  created() {
    this.getList();
    this.getDicts("erp_assets_type").then((response) => {
      this.assetsTypeOptions = response.data;
    });
    this.getDicts("erp_assets_status").then((response) => {
      this.assetsStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询资产管理列表 */
    getList() {
      this.loading = true;
      listAssets(this.queryParams).then((response) => {
        this.assetsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 资产类别字典翻译
    assetsTypeFormat(row, column) {
      return this.selectDictLabel(this.assetsTypeOptions, row.assetsType);
    },
    // 资产状态字典翻译
    assetsStatusFormat(row, column) {
      return this.selectDictLabel(this.assetsStatusOptions, row.assetsStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        assetsId: null,
        assetsCode: null,
        assetsType: null,
        assetsName: null,
        assetsManufacturer: null,
        assetsStatus: null,
        assetsResponsible: null,
        assetsPurchaseTime: null,
        assetsWarehousingTime: null,
        assetsMac: null,
        assetsPosition: null,
        assetsFileData: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.assetsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资产管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const assetsId = row.assetsId || this.ids;
      getAssets(assetsId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资产管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.assetsId != null) {
            updateAssets(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAssets(this.form).then((response) => {
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
      const assetsIds = row.assetsId || this.ids;
      this.$confirm(
        '是否确认删除资产管理编号为"' + assetsIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delAssets(assetsIds);
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
      this.$confirm("是否确认导出所有资产管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportAssets(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 修改按钮操作 */
    handleShow(row) {
      this.reset();
      const equipmentId = row.equipmentId || this.ids;
      let qrText = { type: "zc", key: this.form.equipmentCode };
      this.qrText = JSON.stringify(qrText);

      this.showOpen = true;
      // getEquipment(equipmentId).then((response) => {
      //   this.form = response.data;
      // });
    },
  },
};
</script>
