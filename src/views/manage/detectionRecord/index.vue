<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="车牌" prop="weighLicensePlate">
        <el-input
          v-model="queryParams.weighLicensePlate"
          placeholder="请输入车牌"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检测结果" prop="drStatus">
        <el-select v-model="queryParams.drStatus" placeholder="请选择检测结果" clearable size="small">
          <el-option
            v-for="dict in drStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--    <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['manage:detectionRecord:add']"
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
              v-hasPermi="['manage:detectionRecord:edit']"
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
              v-hasPermi="['manage:detectionRecord:remove']"
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
              v-hasPermi="['manage:detectionRecord:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>-->

    <el-table v-loading="loading" :data="detectionRecordList" @row-click="rowClick" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="车牌" align="center" prop="weighLicensePlate"/>
      <el-table-column label="物料类型" align="center" prop="weighMaterialType"/>
      <el-table-column label="供应商" align="center" prop="weighMaterialCompany"/>
      <el-table-column label="仓位" align="center" prop="drPosition"/>
      <el-table-column label="毛重" align="center" prop="weighGrossWeight"/>
      <el-table-column label="皮重" align="center" prop="weighSkinWeight"/>
      <el-table-column label="进场时间" align="center" prop="weighInTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.weighInTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测结果" align="center" prop="drStatus" :formatter="drStatusFormat"/>
      <el-table-column label="检测人" align="center" prop="updateBy"/>
      <el-table-column label="检测时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.native.prevent="seePic(scope.row)"
          >查看图片
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

    <el-row :gutter="15">
      <el-form ref="form" style="margin-top: 50px" :model="form" :rules="rules" label-width="100px">
        <el-col :span="6">
          <el-col :span="24">
            <el-form-item label="车牌" prop="weighLicensePlate">
              <el-input readonly v-model="form.weighLicensePlate" placeholder="请输入车牌"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="扣除(千克)" prop="drDeduction">
              <el-input v-model="form.drDeduction" placeholder="请输入扣除"/>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="24">
            <el-form-item label="原材仓位" prop="drPosition">
              <el-input v-model="form.drPosition" placeholder="请输入原材仓位"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="扣除比例(%)" prop="drDeductionProportion">
              <el-input v-model="form.drDeductionProportion" placeholder="请输入扣除比例"/>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="24">
            <el-form-item label="备注" prop="drRemark">
              <el-input v-model="form.drRemark" type="textarea" rows="4" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="4" v-show="form.drId && form.drStatus === '0'">
          <el-col :span="24" style="text-align: center">
            <el-button type="success" @click="submitForm('1')">合格</el-button>
          </el-col>
          <el-col :span="24" style="margin-top: 20px;text-align: center">
            <el-button type="danger" @click="submitForm('2')">不合格</el-button>
          </el-col>
        </el-col>
      </el-form>
    </el-row>
    <!-- 添加或修改报检单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="榜单id" prop="weighId">
          <el-input v-model="form.weighId" placeholder="请输入榜单id"/>
        </el-form-item>
        <el-form-item label="过磅编号" prop="weighCode">
          <el-input v-model="form.weighCode" placeholder="请输入过磅编号"/>
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
          <el-input v-model="form.weighNetWeight" placeholder="请输入净重"/>
        </el-form-item>
        <el-form-item label="毛重" prop="weighGrossWeight">
          <el-input v-model="form.weighGrossWeight" placeholder="请输入毛重"/>
        </el-form-item>
        <el-form-item label="皮重" prop="weighSkinWeight">
          <el-input v-model="form.weighSkinWeight" placeholder="请输入皮重"/>
        </el-form-item>
        <el-form-item label="物料类型" prop="weighMaterialType">
          <el-select v-model="form.weighMaterialType" placeholder="请选择物料类型">
            <el-option label="请选择字典生成" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌" prop="weighLicensePlate">
          <el-input v-model="form.weighLicensePlate" placeholder="请输入车牌"/>
        </el-form-item>
        <el-form-item label="工程名称" prop="weighProjectName">
          <el-input v-model="form.weighProjectName" placeholder="请输入工程名称"/>
        </el-form-item>
        <el-form-item label="任务编号" prop="weighTaskCode">
          <el-input v-model="form.weighTaskCode" placeholder="请输入任务编号"/>
        </el-form-item>
        <el-form-item label="物料公司" prop="weighMaterialCompany">
          <el-input v-model="form.weighMaterialCompany" placeholder="请输入物料公司"/>
        </el-form-item>
        <el-form-item label="运输状态">
          <el-radio-group v-model="form.weighTransportStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发货状态">
          <el-radio-group v-model="form.weighShipmentStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="施工地点" prop="weighConstructionSite">
          <el-input v-model="form.weighConstructionSite" placeholder="请输入施工地点"/>
        </el-form-item>
        <el-form-item label="施工单位" prop="weighConstructionCompany">
          <el-input v-model="form.weighConstructionCompany" placeholder="请输入施工单位"/>
        </el-form-item>
        <el-form-item label="报检单状态 (未检 合格 不合格)" prop="drStatus">
          <el-select v-model="form.drStatus" placeholder="请选择报检单状态 (未检 合格 不合格)">
            <el-option
              v-for="dict in drStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原材仓位" prop="drPosition">
          <el-input v-model="form.drPosition" placeholder="请输入原材仓位"/>
        </el-form-item>
        <el-form-item label="扣除" prop="drDeduction">
          <el-input v-model="form.drDeduction" placeholder="请输入扣除"/>
        </el-form-item>
        <el-form-item label="扣除比例" prop="drDeductionProportion">
          <el-input v-model="form.drDeductionProportion" placeholder="请输入扣除比例"/>
        </el-form-item>
        <el-form-item label="备注" prop="drRemark">
          <el-input v-model="form.drRemark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="站点id" prop="msId">
          <el-input v-model="form.msId" placeholder="请输入站点id"/>
        </el-form-item>
        <el-form-item label="磅房id" prop="prId">
          <el-input v-model="form.prId" placeholder="请输入磅房id"/>
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false">
      <el-row :gutter="1">
        <el-col :span="12" v-for="(item,index) in imgUrlList">
          <el-image  :key="item" :src="item" :preview-src-list="imgUrlList" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listDetectionRecord,
    getDetectionRecord,
    delDetectionRecord,
    addDetectionRecord,
    updateDetectionRecord,
    exportDetectionRecord
  } from "@/api/manage/detectionRecord";

  export default {
    name: "DetectionRecord",
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
        // 报检单表格数据
        detectionRecordList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 进场时间时间范围
        daterangeWeighInTime: [],
        // 报检单状态 (未检 合格 不合格)字典
        drStatusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          weighLicensePlate: null,
          drStatus: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //弹框显示
        dialogVisible: false,
        imgUrlList: []
      };
    },
    created() {
      this.getList();
      this.getDicts("m_detection_record_status").then(response => {
        this.drStatusOptions = response.data;
      });
    },
    methods: {
      seePic(row) {
        this.dialogVisible = true;
        this.imgUrlList = [];
        if (row.drData) {
          let fileList = JSON.parse(row.drData || {});
          for (let i = 0; i < fileList.length; i++) {
            let file = fileList[i];
            this.imgUrlList.push(process.env.VUE_APP_BASE_API + file.fileName);
          }
        }
      },
      /** 查询报检单列表 */
      getList() {
        this.reset();
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeWeighInTime && '' != this.daterangeWeighInTime) {
          this.queryParams.params["beginWeighInTime"] = this.daterangeWeighInTime[0];
          this.queryParams.params["endWeighInTime"] = this.daterangeWeighInTime[1];
        }
        listDetectionRecord(this.queryParams).then(response => {
          this.detectionRecordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 报检单状态 (未检 合格 不合格)字典翻译
      drStatusFormat(row, column) {
        return this.selectDictLabel(this.drStatusOptions, row.drStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          drId: null,
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
          weighTransportStatus: "0",
          weighShipmentStatus: "0",
          weighConstructionSite: null,
          weighConstructionCompany: null,
          drStatus: null,
          drPosition: null,
          drDeduction: null,
          drDeductionProportion: null,
          drRemark: null,
          msId: null,
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
        this.daterangeWeighInTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.drId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加报检单";
      },
      /** 某一行被点击 */
      rowClick(row, column, event) {

        const drId = row.drId || this.ids;
        getDetectionRecord(drId).then(response => {
          this.form = response.data;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const drId = row.drId || this.ids
        getDetectionRecord(drId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改报检单";
        });
      },
      /** 提交按钮 */
      submitForm(status) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.drId != null) {
              this.form.drStatus = status;
              updateDetectionRecord(this.form).then(response => {
                this.msgSuccess("操作成功");
                this.open = false;
                this.getList();
                this.reset();
              });
            } /*else {
              addDetectionRecord(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }*/
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const drIds = row.drId || this.ids;
        this.$confirm('是否确认删除报检单编号为"' + drIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDetectionRecord(drIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有报检单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportDetectionRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
