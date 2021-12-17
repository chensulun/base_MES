<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="进场时间">
        <el-date-picker
          v-model="daterangeWeighInTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="出场时间">
        <el-date-picker
          v-model="daterangeWeighOutTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="工程名称" prop="weighProjectName">
        <el-input
          v-model="queryParams.weighProjectName"
          placeholder="请输入工程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="磅房" prop="wpStatus">
        <el-select v-model="queryParams.prId" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in poundRoomList"
            :key="dict.prId"
            :label="dict.prName"
            :value="dict.prId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:weighRecord:add']"
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
          v-hasPermi="['manage:weighRecord:edit']"
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
          v-hasPermi="['manage:weighRecord:remove']"
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
          v-hasPermi="['manage:weighRecord:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="weighRecordList" @selection-change="handleSelectionChange">
      <el-table-column label="过磅编号" align="center" width="150px" prop="weighCode" />
      <el-table-column label="进场时间" align="center" prop="weighInTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.weighInTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出场时间" align="center" prop="weighOutTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.weighOutTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净重" align="center" prop="weighNetWeight" />
      <el-table-column label="毛重" align="center" prop="weighGrossWeight" />
      <el-table-column label="皮重" align="center" prop="weighSkinWeight" />
      <el-table-column label="物料类型" align="center" width="120px" prop="weighMaterialType" />
      <el-table-column label="车牌" align="center" width="150px" prop="weighLicensePlate" />
      <el-table-column label="工程名称" align="center" :show-overflow-tooltip="true" width="150px" prop="weighProjectName" />
      <el-table-column label="任务编号" align="center" width="150px" prop="weighTaskCode" />
      <el-table-column label="物料公司" align="center"  :show-overflow-tooltip="true" prop="weighMaterialCompany" />
      <el-table-column label="发货状态" align="center" prop="weighShipmentStatus" />
      <el-table-column label="施工地点" align="center" :show-overflow-tooltip="true" prop="weighConstructionSite" />
      <el-table-column label="施工单位" align="center" :show-overflow-tooltip="true" prop="weighConstructionCompany" />
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:weighRecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:weighRecord:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改称重记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="过磅编号" prop="weighCode">
          <el-input v-model="form.weighCode" placeholder="请输入过磅编号" />
        </el-form-item>
        <el-form-item label="进场时间" prop="weighInTime">
          <el-date-picker clearable size="small"
            v-model="form.weighInTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择进场时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出场时间" prop="weighOutTime">
          <el-date-picker clearable size="small"
            v-model="form.weighOutTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出场时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="净重" prop="weighNetWeight">
          <el-input v-model="form.weighNetWeight" placeholder="请输入净重" />
        </el-form-item>
        <el-form-item label="毛重" prop="weighGrossWeight">
          <el-input v-model="form.weighGrossWeight" placeholder="请输入毛重" />
        </el-form-item>
        <el-form-item label="皮重" prop="weighSkinWeight">
          <el-input v-model="form.weighSkinWeight" placeholder="请输入皮重" />
        </el-form-item>
        <el-form-item label="物料类型" prop="weighMaterialType">
          <el-select v-model="form.weighMaterialType" placeholder="请选择物料类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌" prop="weighLicensePlate">
          <el-input v-model="form.weighLicensePlate" placeholder="请输入车牌" />
        </el-form-item>
        <el-form-item label="工程名称" prop="weighProjectName">
          <el-input v-model="form.weighProjectName" placeholder="请输入工程名称" />
        </el-form-item>
        <el-form-item label="任务编号" prop="weighTaskCode">
          <el-input v-model="form.weighTaskCode" placeholder="请输入任务编号" />
        </el-form-item>
        <el-form-item label="物料公司" prop="weighMaterialCompany">
          <el-input v-model="form.weighMaterialCompany" placeholder="请输入物料公司" />
        </el-form-item>
        <el-form-item label="发货状态">
          <el-radio-group v-model="form.weighShipmentStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="施工地点" prop="weighConstructionSite">
          <el-input v-model="form.weighConstructionSite" placeholder="请输入施工地点" />
        </el-form-item>
        <el-form-item label="施工单位" prop="weighConstructionCompany">
          <el-input v-model="form.weighConstructionCompany" placeholder="请输入施工单位" />
        </el-form-item>
        <el-form-item label="站点id" prop="msId">
          <el-input v-model="form.msId" placeholder="请输入站点id" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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
import { listWeighRecord, getWeighRecord, delWeighRecord, addWeighRecord, updateWeighRecord, exportWeighRecord } from "@/api/manage/weighRecord";
import {getMSId} from '@/utils/station'
import { listPoundRoom} from "@/api/manage/poundRoom";

export default {
  name: "WeighRecord",
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
      // 称重记录表格数据
      weighRecordList: [],
      msId:[],
      //磅房数据
      poundRoomList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 进场时间时间范围
      daterangeWeighInTime: [],
      // 出场时间时间范围
      daterangeWeighOutTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        weighInTime: null,
        weighOutTime: null,
        weighProjectName: null,
        prId:null,
        msId:null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.msId = getMSId();
    this.getList();
    this.getPoundRoomList();
  },
  methods: {
    /** 查询磅房信息列表 */
    getPoundRoomList(){
      if (this.msId == null) {
        return;
      }
      let p = {msId:this.msId};
      listPoundRoom(p).then(response =>{
        this.poundRoomList = response.rows;
      });
    },
    /** 查询称重记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeWeighInTime && '' != this.daterangeWeighInTime) {
        this.queryParams.params["beginWeighInTime"] = this.daterangeWeighInTime[0];
        this.queryParams.params["endWeighInTime"] = this.daterangeWeighInTime[1];
      }
      if (null != this.daterangeWeighOutTime && '' != this.daterangeWeighOutTime) {
        this.queryParams.params["beginWeighOutTime"] = this.daterangeWeighOutTime[0];
        this.queryParams.params["endWeighOutTime"] = this.daterangeWeighOutTime[1];
      }
      if (this.msId == null) {
        this.msgSuccess("站点未选择");
        this.loading = false;
        return;
      }
      this.queryParams.msId = this.msId;
      listWeighRecord(this.queryParams).then(response => {
        this.weighRecordList = response.rows;
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
        weighId: null,
        weighCode: null,
        weighInTime: null,
        weighOutTime: null,
        weighNetWeight: null,
        weighGrossWeight: null,
        weighSkinWeight: null,
        weighMaterialType: null,
        weighLicensePlate: null,
        weighProjectName: null,
        weighTaskCode: null,
        weighMaterialCompany: null,
        weighShipmentStatus: "0",
        weighConstructionSite: null,
        weighConstructionCompany: null,
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
      this.daterangeWeighInTime = [];
      this.daterangeWeighOutTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.weighId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加称重记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const weighId = row.weighId || this.ids
      getWeighRecord(weighId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改称重记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.weighId != null) {
            updateWeighRecord(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWeighRecord(this.form).then(response => {
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
      const weighIds = row.weighId || this.ids;
      this.$confirm('是否确认删除称重记录编号为"' + weighIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWeighRecord(weighIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有称重记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportWeighRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
