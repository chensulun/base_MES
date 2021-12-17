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
      <el-form-item label="设备类别" prop="equipmentType">
        <el-select v-model="queryParams.equipmentType" placeholder="请选择设备类别" clearable size="small">
          <el-option
            v-for="dict in equipmentTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态" prop="equipmentStatus">
        <el-select v-model="queryParams.equipmentStatus" placeholder="请选择设备状态" clearable size="small">
          <el-option
            v-for="dict in equipmentStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="equipmentResponsible">
        <el-input
          v-model="queryParams.equipmentResponsible"
          placeholder="请输入负责人"
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
          v-hasPermi="['manage:equipment:add']"
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
          v-hasPermi="['manage:equipment:edit']"
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
          v-hasPermi="['manage:equipment:remove']"
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
          v-hasPermi="['manage:equipment:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="equipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="资产名称" align="center" prop="equipmentName"/>
      <el-table-column label="制造商" align="center" prop="equipmentManufacturer"/>
      <el-table-column label="设备类别" align="center" prop="equipmentType" :formatter="equipmentTypeFormat"/>
      <el-table-column label="编号" align="center" prop="equipmentCode"/>
      <el-table-column label="存储位置" align="center" prop="equipmentPosition"/>
      <el-table-column label="状态" align="center" prop="equipmentStatus" :formatter="equipmentStatusFormat"/>
      <el-table-column label="采购时间" align="center" prop="equipmentPurchaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.equipmentPurchaseTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center" prop="equipmentWarehousingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.equipmentWarehousingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="MAC地址" align="center" prop="equipmentMac"/>
      <el-table-column label="负责人" align="center" prop="equipmentResponsible"/>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
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
            v-hasPermi="['manage:equipment:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:equipment:remove']"
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

    <!-- 添加或修改资产管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="12">
            <el-form-item label="设备编号" prop="equipmentCode">
              <el-input v-model="form.equipmentCode" placeholder="请输入设备编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类别" prop="equipmentType">
              <el-select v-model="form.equipmentType" placeholder="请选择设备类别">
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
            <el-form-item label="资产名称" prop="equipmentName">
              <el-input v-model="form.equipmentName" placeholder="请输入资产名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制造商" prop="equipmentManufacturer">
              <el-input v-model="form.equipmentManufacturer" placeholder="请输入制造商"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备状态" prop="equipmentStatus" >
              <el-select  v-model="form.equipmentStatus" placeholder="请选择设备状态">
                <el-option
                  v-for="dict in equipmentStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="equipmentResponsible">
              <el-input v-model="form.equipmentResponsible" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购时间" prop="equipmentPurchaseTime">
              <el-date-picker clearable size="small"
                              v-model="form.equipmentPurchaseTime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择采购时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库时间" prop="equipmentWarehousingTime">
              <el-date-picker clearable size="small"
                              v-model="form.equipmentWarehousingTime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择入库时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="存储位置" prop="equipmentPosition">
              <el-input v-model="form.equipmentPosition" placeholder="请输入存储位置"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="MAC地址" prop="equipmentMac">
              <el-input v-model="form.equipmentMac" placeholder="请输入mac地址"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="showOpen" width="1000px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="18">
            <el-col :span="12">
              <el-form-item label="设备名称" prop="equipmentName">
                <el-input readonly v-model="form.equipmentName" placeholder="请输入资产名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号" prop="equipmentCode">
                <el-input readonly v-model="form.equipmentCode" placeholder="请输入设备编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类别" prop="equipmentType">
                <el-select disabled v-model="form.equipmentType" placeholder="请选择设备类别">
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
              <el-form-item label="制造商" prop="equipmentManufacturer">
                <el-input readonly v-model="form.equipmentManufacturer" placeholder="请输入制造商"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备状态" prop="equipmentStatus" >
                <el-select disabled  v-model="form.equipmentStatus" placeholder="请选择设备状态">
                  <el-option
                    v-for="dict in equipmentStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="equipmentResponsible">
                <el-input readonly v-model="form.equipmentResponsible" placeholder="请输入负责人"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购时间" prop="equipmentPurchaseTime">
                <el-date-picker readonly clearable size="small"
                                v-model="form.equipmentPurchaseTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择采购时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库时间" prop="equipmentWarehousingTime">
                <el-date-picker readonly clearable size="small"
                                v-model="form.equipmentWarehousingTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择入库时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="存储位置" prop="equipmentPosition">
                <el-input readonly v-model="form.equipmentPosition" placeholder="请输入存储位置"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="MAC地址" prop="equipmentMac">
                <el-input readonly v-model="form.equipmentMac" placeholder="请输入mac地址"/>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="6">
            <vue-qr :logoSrc="imageUrl" :text="qrText" :size="200"></vue-qr>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import {
    addEquipment,
    delEquipment,
    exportEquipment,
    getEquipment,
    listEquipment,
    updateEquipment
  } from "@/api/manage/equipment";
  import vueQr from 'vue-qr';

  export default {
    name: "Equipment",
    components: {vueQr},
    data() {
      return {
        imageUrl: require("@/assets/logo/logo.png"),
        qrText:"",
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
        equipmentList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        showOpen: false,
        // 设备类别字典
        equipmentTypeOptions: [],
        // 设备状态字典
        equipmentStatusOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          equipmentType: null,
          equipmentStatus: null,
          equipmentResponsible: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("m_equipment_type").then(response => {
        this.equipmentTypeOptions = response.data;
      });
      this.getDicts("m_equipment_status").then(response => {
        this.equipmentStatusOptions = response.data;
      });
    },
    methods: {
      /** 查询资产管理列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listEquipment(this.queryParams).then(response => {
          this.equipmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 设备类别字典翻译
      equipmentTypeFormat(row, column) {
        return this.selectDictLabel(this.equipmentTypeOptions, row.equipmentType);
      },
      // 设备状态字典翻译
      equipmentStatusFormat(row, column) {
        return this.selectDictLabel(this.equipmentStatusOptions, row.equipmentStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          equipmentId: null,
          equipmentCode: null,
          equipmentType: null,
          equipmentName: null,
          equipmentManufacturer: null,
          equipmentStatus: null,
          equipmentResponsible: null,
          equipmentPurchaseTime: null,
          equipmentWarehousingTime: null,
          equipmentMac: null,
          equipmentPosition: null,
          equipmentFileData: null,
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
        this.ids = selection.map(item => item.equipmentId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加资产";
      },
      /** 修改按钮操作 */
      handleShow(row) {
        this.reset();
        const equipmentId = row.equipmentId || this.ids
        getEquipment(equipmentId).then(response => {
          this.form = response.data;
          let qrText = {"type":"zc","key":this.form.equipmentCode};
          this.qrText = JSON.stringify(qrText);
          this.showOpen = true;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const equipmentId = row.equipmentId || this.ids
        getEquipment(equipmentId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改资产";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.equipmentId != null) {
              updateEquipment(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addEquipment(this.form).then(response => {
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
        const equipmentIds = row.equipmentId || this.ids;
        this.$confirm('是否确认删除资产管理编号为"' + equipmentIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delEquipment(equipmentIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有资产管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportEquipment(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
