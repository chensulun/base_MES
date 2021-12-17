<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目编号" prop="projectCode">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目状态" prop="projectStatus">
        <el-select v-model="queryParams.projectStatus" placeholder="请选择项目状态" clearable size="small">
          <el-option
            v-for="dict in projectStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="queryParams.projectType" placeholder="请选择项目类型" clearable size="small">
          <el-option
            v-for="dict in projectTypeOptions"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:project:add']"
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
          v-hasPermi="['manage:project:edit']"
        >修改
        </el-button>
      </el-col>

      <!--      <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['manage:project:remove']"
              >删除
              </el-button>
            </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['manage:project:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-news"
          size="mini"
          :disabled="!single"
          @click="mergeProject"
        >合并项目
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" style="top: 30px" :data="projectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="项目名称" align="center" prop="projectName"/>
      <el-table-column label="项目编号" align="center" prop="projectCode"/>
      <el-table-column label="项目签订总量" align="center" prop="projectTotal"/>
      <el-table-column label="项目状态" align="center" prop="projectStatus" :formatter="projectStatusFormat"/>
      <el-table-column label="项目类型" align="center" prop="projectType" :formatter="projectTypeFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleSearch(scope.row)"
            v-hasPermi="['manage:project:query']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:project:edit']"
          >修改
          </el-button>
          <!--          <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['manage:project:remove']"
                    >删除
                    </el-button>-->
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

    <!-- 添加或修改项目列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1400px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <!-- 左侧部分 -->
          <el-col :span="7">
            <el-col :span="24">
              <el-divider content-position="left"><i class="el-icon-s-order"></i>项目信息</el-divider>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目性质">
                <el-radio-group v-model="form.projectType">
                  <el-radio
                    v-for="dict in projectTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="审核状态">
                <el-radio-group v-model="form.projectStatus">
                  <el-radio
                    v-for="dict in projectStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-table
                ref="signDataTable"
                :data="form.projectSignDataList"
                style="width: 80%"
              >
                <el-table-column
                  property="type"
                  label="砼类型"
                  align="center"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="num"
                  align="center"
                  label="签订量">
                </el-table-column>
                <el-table-column fixed="right" align="center" label="">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, form.projectSignDataList)"
                      type="text"
                      icon="el-icon-circle-close"
                      size="small">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-col :span="8">
                  <el-input size="mini" v-model="input1" placeholder="请输砼类型"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-input size="mini" type="number" v-model="input2" placeholder="请输签订量"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button icon="el-icon-plus" size="mini" @click="addSignData" circle></el-button>
                </el-col>
              </div>
            </el-col>
          </el-col>
          <!-- 右侧部分 -->
          <el-col :span="17">
            <el-col :span="24">
              <el-divider content-position="left"><i class="el-icon-s-order"></i>基本信息</el-divider>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="客户名称" prop="customerId">
                  <el-input v-if="form.customerName" v-model="form.customerName" placeholder="客户名称"/>
                  <el-select v-if="!form.customerName" filterable v-model="form.customerId"
                             @change="customerLSelectChange" placeholder="请选择" style="width: 100%;">
                    <el-option
                      v-for="item in customerList"
                      :key="item.customerId"
                      :label="item.customerName"
                      :value="item.customerId">
                      <span style="float: left">{{ item.customerName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.customerCode }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作地址" prop="projectAddress">
                  <el-input v-model="form.projectAddress" placeholder="请输入工作地址"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="项目编号" prop="projectCode">
                  <el-input v-model="form.projectCode" placeholder="请输入项目编号"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工程名称" prop="projectName">
                  <el-input v-model="form.projectName" placeholder="请输入项目名称"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="合同造价" prop="projectManufacturingCost">
                  <el-input v-model="form.projectManufacturingCost" placeholder="请输入项目造价"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="施工单位" prop="projectConstructionUnit">
                  <el-input v-model="form.projectConstructionUnit" placeholder="请输入项目施工单位"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="工地经度" prop="projectConstructionLat">
                  <el-input readonly v-model="form.projectConstructionLng" placeholder="请输入项目施工纬度"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工地纬度" prop="projectConstructionLat">
                  <el-input readonly v-model="form.projectConstructionLat" placeholder="请输入项目施工纬度"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="总签订量" prop="projectTotal">
                  <el-input readonly v-model="form.projectTotal" placeholder="请输入项目签订总量"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工地联系人" prop="projectSiteContact">
                  <el-input v-model="form.projectSiteContact" placeholder="请输入工地联系人"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="工地电话" prop="projectSiteContactNumber">
                  <el-input v-model="form.projectSiteContactNumber" placeholder="请输入工地联系电话"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总量控制" prop="projectTotalControl">
                  <el-input v-model="form.projectTotalControl" placeholder="请输入项目总量控制"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-form-item label="下发站点">
                <el-checkbox-group v-model="form.projectMsIdsList">
                  <el-checkbox
                    v-for="dict in mixingStationList"
                    :label="dict.msId"
                    :key="dict.msId"
                    @change="forceUpdate"
                  >{{dict.msName}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="form.projectRemark"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <baidu-map :center="center" @click="getClickInfo" :zoom="15" class="bm-view" :scroll-wheel-zoom="true">
                <!--比例尺控件-->
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                <!--缩放控件-->
                <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
                <!--内容-->
                <bm-control :offset="{ width: '10px', height: '10px' }">
                  <bm-auto-complete v-model="form.keyword" :sug-style="{ zIndex: 999999 }">
                    <el-input v-model="form.keyword" type="text" placeholder="请输入地名关键字" clearable>
                      <i slot="prefix" class="el-input__icon el-icon-search"/>
                    </el-input>
                  </bm-auto-complete>
                </bm-control>
                <!--搜索插件-->
                <bm-local-search
                  :keyword="form.keyword"
                  :auto-viewport="true"
                  :panel="false"
                />
                <!--标点-->
                <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
              </baidu-map>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" v-if="add" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="项目合并"
      :visible.sync="mergeProjectOpen"
      width="30%">
      <div style="margin-left: 30px">
        <span style="font-size: 15px">将项目编号:</span>
        <p v-for="item in this.projectCodes">{{item}}</p>
        <span>合并为一个项目,合并过后信息如下</span>
      </div>
      <el-form style="margin-top: 10px" :model="mergeProjectForm" label-width="100px">
        <el-form-item label="项目名称" prop="supplierName">
          <el-input v-model="mergeProjectForm.projectName"  placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="项目编号" prop="supplierAbbreviation">
          <el-input v-model="mergeProjectForm.projectCode"  placeholder="请输入项目编号"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mergeProjectOpen = false">取 消</el-button>
        <el-button type="primary" @click="submitMergeProjectForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {addProject, delProject, exportProject, getProject, listProject, updateProject,mergeProject} from "@/api/manage/project";
  import {listMixingStationByRole} from "@/api/manage/mixingStation";
  import {listCustomer} from "@/api/manage/customer";
  import {getMSId} from '@/utils/station'

  export default {
    name: "Project",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        //选中的项目编号
        projectCodes: [],
        //选中的项目名称
        projectNames: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 项目列表表格数据
        projectList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //项目合并
        mergeProjectOpen: false,
        // 项目状态字典
        projectStatusOptions: [],
        // 项目类型字典
        projectTypeOptions: [],
        //站点数据
        mixingStationList: [],
        //客户数据
        customerList: [],
        //地图属性
        center: {lng: 0, lat: 0},
        //新增左边数据
        input1: null,
        input2: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          projectName: null,
          projectCode: null,
          projectStatus: null,
          projectType: null,
          msId: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //添加
        add: true,
        msId: null,
        //项目合并表单
        mergeProjectForm: {
          ids:null,
          projectName:null,
          projectCode:null
        }
      };
    },
    created() {
      this.msId = getMSId();
      this.getList();
      this.getMixingStationList();
      this.getCustomerList();
      this.getDicts("m_project_status").then(response => {
        this.projectStatusOptions = response.data;
      });
      this.getDicts("m_project_type").then(response => {
        this.projectTypeOptions = response.data;
      });
    },
    methods: {
      /** 刷新*/
      forceUpdate() {
        this.$forceUpdate();
      },
      /** *
       * 地图点击事件。
       */
      getClickInfo(e) {
        // 调整地图中心位置
        this.center.lng = e.point.lng;
        this.center.lat = e.point.lat;
        this.form.projectConstructionLng = e.point.lng;
        this.form.projectConstructionLat = e.point.lat;
      },
      /** 增加签订属性 */
      addSignData() {
        let type = this.input1;
        let num = this.input2;
        if (!type || !num) {
          this.$message('输入参数错误');
          return;
        }
        let signData = {type: type, num: num};
        this.form.projectSignDataList.push(signData);
        this.input1 = null;
        this.input2 = null;
        this.updateTotal();
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
        this.updateTotal();
      },
      /**更新总量*/
      updateTotal() {
        let total = 0;
        this.form.projectSignDataList.forEach(item => {
          total += Number(item.num);
        });
        this.form.projectTotal = total;
      },
      /** 查询客户信息列表 */
      getCustomerList() {
        listCustomer(null).then(response => {
          this.customerList = response.rows;
        });
      },
      /** 原材下拉事件*/
      customerLSelectChange(customerId) {
        let customer = this.customerList.find((item) => {
          return item.customerId === customerId;
        });
        this.form.customerName = customer.customerName;
      },
      /** 查询站点信息列表 */
      getMixingStationList() {
        listMixingStationByRole(null).then(response => {
          this.mixingStationList = response.rows;
        });
      },
      /** 查询项目列表列表 */
      getList() {
        this.loading = true;
        this.queryParams.msId = this.msId;
        listProject(this.queryParams).then(response => {
          this.projectList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 项目状态字典翻译
      projectStatusFormat(row, column) {
        return this.selectDictLabel(this.projectStatusOptions, row.projectStatus);
      },
      // 项目类型字典翻译
      projectTypeFormat(row, column) {
        return this.selectDictLabel(this.projectTypeOptions, row.projectType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          projectId: null,
          projectName: null,
          projectAddress: null,
          projectCode: null,
          projectManufacturingCost: null,
          projectConstructionUnit: null,
          projectConstructionLng: null,
          projectConstructionLat: null,
          projectTotal: null,
          projectTotalControl: null,
          projectSiteContact: null,
          projectSiteContactNumber: null,
          projectRemark: null,
          projectStatus: "0",
          projectType: "0",
          customerId: null,
          customerName: null,
          projectMsIds: null,
          projectMsIdsList: [],
          projectSignData: null,
          projectSignDataList: [],
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,

          keyword: null,//地图属性
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
        this.ids = selection.map(item => item.projectId);
        this.projectCodes = selection.map(item => item.projectCode);
        this.projectNames = selection.map(item => item.projectName);
        this.single = selection.length !== 1;
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加项目列表";
        this.add = true;
        //新增时站点默认全选
        this.form.projectMsIdsList = this.mixingStationList.map(item => {
          return item.msId
        });
        this.center = {lng: 0, lat: 0};
      },
      /** 查看按钮操作 */
      handleSearch(row) {
        this.reset();
        const projectId = row.projectId || this.ids;
        getProject(projectId).then(response => {
          this.form = response.data;
          this.form.projectSignDataList = JSON.parse(this.form.projectSignData);
          if (this.form.projectMsIds) {
            this.form.projectMsIdsList = this.form.projectMsIds.split(',').map(item => Number(item));
          } else {
            this.form.projectMsIdsList = [];
          }
          this.center = {lng: this.form.projectConstructionLng, lat: this.form.projectConstructionLat};
          this.add = false;
          this.open = true;
          this.title = "修改项目列表";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const projectId = row.projectId || this.ids;
        getProject(projectId).then(response => {
          this.form = response.data;
          this.form.projectSignDataList = JSON.parse(this.form.projectSignData);
          if (this.form.projectMsIds) {
            this.form.projectMsIdsList = this.form.projectMsIds.split(',').map(item => Number(item));
          } else {
            this.form.projectMsIdsList = [];
          }
          this.center = {lng: this.form.projectConstructionLng, lat: this.form.projectConstructionLat};
          this.add = true;
          this.open = true;
          this.title = "修改项目列表";
          this.$forceUpdate();
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.projectSignData = JSON.stringify(this.form.projectSignDataList);
            this.form.projectMsIds = this.form.projectMsIdsList.join(',');
            if (this.form.projectId != null) {
              updateProject(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addProject(this.form).then(response => {
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
        const projectIds = row.projectId || this.ids;
        this.$confirm('是否确认删除项目列表编号为"' + projectIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delProject(projectIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 合并项目 */
      mergeProject() {
        if (!this.ids || this.ids.length === 0) {
          this.msgError("请选择需要合并的项目");
          return;
        }
        this.mergeProjectOpen = true;
        this.mergeProjectForm.ids = this.ids.join(",");
        this.mergeProjectForm.projectName = this.projectNames[0];
        this.mergeProjectForm.projectCode = this.projectCodes[0];
        this.$forceUpdate();
      },
      /** 项目合并提交 */
      submitMergeProjectForm(){
        mergeProject(this.mergeProjectForm).then(response => {
          this.msgSuccess("合并成功");
          this.mergeProjectOpen = false;
          this.getList();
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有项目列表数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportProject(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
<style scoped>
  .bm-view {
    width: 100%;
    height: 400px;
  }
</style>
