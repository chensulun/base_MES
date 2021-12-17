<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="站点" prop="msId">
        <el-select v-model="queryParams.msId" placeholder="请选择站点" clearable size="small">
          <el-option
            v-for="item in mixingStationList"
            :key="item.msId"
            :value="item.msId"
            :label="item.msName"
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
          v-hasPermi="['manage:productionEquipment:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:productionEquipment:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:productionEquipment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
		  :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['manage:productionEquipment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productionEquipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="站点" align="center" prop="msName" />
      <el-table-column label="过磅磅房" align="center" prop="prName" />
      <el-table-column label="设备名称" align="center" prop="peName" />
      <el-table-column label="生产设备数据地址" align="center" prop="peDatabase" />
      <el-table-column label="设备请求路径" align="center" prop="peUrl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:productionEquipment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:productionEquipment:remove']"
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

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="站点" prop="msId">
          <el-select v-model="form.msId" placeholder="请选择站点">
            <el-option
              v-for="item in mixingStationList"
              :key="item.msId"
              :value="item.msId"
              :label="item.msName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="过磅磅房" prop="prId">
          <el-select v-model="form.prId" placeholder="请选择过磅磅房">
            <el-option
              v-for="item in poundRoomList"
              :key="item.prId"
              :value="item.prId"
              :label="item.prName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="peName">
          <el-input v-model="form.peName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="数据地址" prop="peDatabase">
          <el-input v-model="form.peDatabase" placeholder="请输入生产设备数据地址" />
        </el-form-item>
        <el-form-item label="请求地址" prop="peUrl">
          <el-input v-model="form.peUrl" placeholder="请输入请求地址" />
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
import { listProductionEquipment, getProductionEquipment, delProductionEquipment, addProductionEquipment, updateProductionEquipment, exportProductionEquipment } from "@/api/manage/productionEquipment";
import { listPoundRoom} from "@/api/manage/poundRoom";
import { listMixingStation} from "@/api/manage/mixingStation";

export default {
  name: "ProductionEquipment",
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
      // 设备信息表格数据
      productionEquipmentList: [],
      //磅房列表
      poundRoomList:[],
      //站点信息
      mixingStationList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        msId: null,
        peName: null,
        peDatabase: null,
        peDataType: null,
        prId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getMixingStationList();
    this.getPoundRoomList();
  },
  methods: {

    /** 查询磅房信息列表 */
    getPoundRoomList(){
      listPoundRoom(null).then(response =>{
        this.poundRoomList = response.rows;
      });
    },
    /** 查询站点信息列表 */
    getMixingStationList(){
      listMixingStation(null).then(response =>{
        this.mixingStationList = response.rows;
      });
    },
    /** 查询设备信息列表 */
    getList() {
      this.loading = true;
      listProductionEquipment(this.queryParams).then(response => {
        this.productionEquipmentList = response.rows;
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
        peId: null,
        msId: null,
        peName: null,
        peDatabase: null,
        peDataType: null,
        peUrl: null,
        prId: null,
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
      this.ids = selection.map(item => item.peId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const peId = row.peId || this.ids
      getProductionEquipment(peId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.peId != null) {
            updateProductionEquipment(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProductionEquipment(this.form).then(response => {
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
      const peIds = row.peId || this.ids;
      this.$confirm('是否确认删除设备信息编号为"' + peIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProductionEquipment(peIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有设备信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportProductionEquipment(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
