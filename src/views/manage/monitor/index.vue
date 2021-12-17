<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="监控类型" prop="monitorType">
        <el-select v-model="queryParams.monitorType" placeholder="请选择监控类型" clearable size="small">
          <el-option
            v-for="dict in monitorTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
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
          v-hasPermi="['manage:monitor:add']"
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
          v-hasPermi="['manage:monitor:edit']"
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
          v-hasPermi="['manage:monitor:remove']"
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
          v-hasPermi="['manage:monitor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="monitorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="监控名称" align="center" prop="monitorName" />
      <el-table-column label="监控类型" align="center" prop="monitorType" :formatter="monitorTypeFormat" />
      <el-table-column label="监控地址" align="center" prop="monitorUrl" />
      <el-table-column label="站点" align="center" prop="msName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:monitor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:monitor:remove']"
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

    <!-- 添加或修改监控管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="监控名称" prop="monitorName">
          <el-input v-model="form.monitorName" placeholder="请输入监控名称" />
        </el-form-item>
        <el-form-item label="监控类型" prop="monitorType">
          <el-select v-model="form.monitorType" placeholder="请选择监控类型">
            <el-option
              v-for="dict in monitorTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控地址" prop="monitorUrl">
          <el-input v-model="form.monitorUrl" placeholder="请输入监控地址" />
        </el-form-item>
        <el-form-item label="站点" prop="msId">
          <el-select v-model="form.msId" placeholder="请选择站点id">
            <el-option
              v-for="item in mixingStationList"
              :key="item.msId"
              :value="item.msId"
              :label="item.msName"
            />
          </el-select>
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
import { listMonitor, getMonitor, delMonitor, addMonitor, updateMonitor, exportMonitor } from "@/api/manage/monitor";
import { listMixingStation} from "@/api/manage/mixingStation";

export default {
  name: "Monitor",
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
      // 监控管理表格数据
      monitorList: [],
      //站点信息
      mixingStationList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 监控类型字典
      monitorTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        monitorType: null,
        msId: null,
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
    this.getDicts("m_monitor_type").then(response => {
      this.monitorTypeOptions = response.data;
    });
    this.getMixingStationList();
  },
  methods: {
    /** 查询站点信息列表 */
    getMixingStationList(){
      listMixingStation(null).then(response =>{
        this.mixingStationList = response.rows;
      });
    },
    /** 查询监控管理列表 */
    getList() {
      this.loading = true;
      listMonitor(this.queryParams).then(response => {
        this.monitorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 监控类型字典翻译
    monitorTypeFormat(row, column) {
      return this.selectDictLabel(this.monitorTypeOptions, row.monitorType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        monitorId: null,
        monitorName: null,
        monitorType: null,
        monitorUrl: null,
        msId: null,
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
      this.ids = selection.map(item => item.monitorId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加监控管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const monitorId = row.monitorId || this.ids
      getMonitor(monitorId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改监控管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.monitorId != null) {
            updateMonitor(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMonitor(this.form).then(response => {
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
      const monitorIds = row.monitorId || this.ids;
      this.$confirm('是否确认删除监控管理编号为"' + monitorIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMonitor(monitorIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有监控管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportMonitor(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
