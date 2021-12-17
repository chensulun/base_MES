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
      <el-form-item label="项目" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStatus">
        <el-select v-model="queryParams.taskStatus" placeholder="请选择任务状态" clearable size="small">
          <el-option
            v-for="dict in taskStatusOptions"
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
          v-hasPermi="['manage:task:add']"
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
          v-hasPermi="['manage:task:edit']"
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
                v-hasPermi="['manage:task:remove']"
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
          v-hasPermi="['manage:task:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" style="top: 30px" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="任务编号" align="center" width="130" prop="taskCode"/>
      <el-table-column label="项目" show-overflow-tooltip="true" align="center" prop="projectName"/>
      <el-table-column label="生产类型" align="center" prop="taskProductionType"/>
      <el-table-column label="计划量" align="center" prop="taskPlannedQuantity"/>
      <el-table-column label="供货时间" align="center" prop="taskSupplyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.taskSupplyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="taskAddress"/>
      <el-table-column label="联系人" align="center" prop="taskContacts"/>
      <el-table-column label="联系电话" align="center" width="120" prop="taskPhone"/>
      <el-table-column label="任务状态" align="center" prop="taskStatus" :formatter="taskStatusFormat"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="push(scope.row)"
            v-if="!scope.row.orderId"
            v-hasPermi="['manage:project:edit']"
          >推送
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleSearch(scope.row)"
            v-hasPermi="['manage:task:query']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:task:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.canDelete === 1"
            v-hasPermi="['manage:task:remove']"
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

    <!-- 添加或修改任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="12">
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="form.projectId" placeholder="请选择项目" @change="projectSelectChange" style="width: 100%">
                <el-option
                  v-for="dict in projectList"
                  :key="dict.projectId"
                  :label="dict.projectName"
                  :value="dict.projectId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产类型" prop="taskProductionType">
              <el-select v-model="form.taskProductionType" @change="projectSignDataSelectChange" placeholder="请选择生产类型"
                         style="width: 100%">
                <el-option
                  v-for="dict in projectSignDataList"
                  :key="dict.type"
                  :label="dict.type"
                  :value="dict.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工部位" prop="taskPosition">
              <el-input v-model="form.taskPosition" placeholder="请输入施工部位"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输方式" prop="taskShipping">
              <el-input v-model="form.taskShipping" placeholder="请输入运输方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划量" prop="taskPlannedQuantity">
              <el-input v-model="form.taskPlannedQuantity" type="number" placeholder="请输入计划量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="追加量" prop="taskAddQuantity">
              <el-input v-model="form.taskAddQuantity" type="number" placeholder="请输入追加量"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发车间隔时间" prop="taskDepartureInterval">
              <el-input v-model="form.taskDepartureInterval" placeholder="请输入发车间隔时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="taskAddress">
              <el-input v-model="form.taskAddress" placeholder="请输入地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="taskContacts">
              <el-input v-model="form.taskContacts" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="taskPhone">
              <el-input v-model="form.taskPhone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供货时间" prop="taskSupplyTime">
              <el-date-picker clearable size="small"
                              v-model="form.taskSupplyTime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              style="width: 100%"
                              placeholder="选择供货时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" v-if="add" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="推送数据"
      :visible.sync="pushOpen"
      width="30%">
      <div style="margin-left: 30px">
        <span style="font-size: 15px">选择要推送相关的任务:</span>
      </div>
      <el-form style="margin-top: 10px" :model="pushForm" label-width="100px">
        <el-col :span="12">
          <el-form-item label="推送项目" prop="projectId">
            <el-select v-model="pushForm.projectId" placeholder="请选择项目" @change="projectSelectChange" style="width: 100%">
              <el-option
                v-for="dict in projectList"
                :key="dict.projectId"
                :label="dict.projectName"
                :value="dict.projectId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pushOpen = false">取 消</el-button>
        <el-button type="primary" @click="pushOpen = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {listTask, getTask, delTask, addTask, updateTask, exportTask} from "@/api/manage/task";
  import {getMSId} from '@/utils/station';
  import {listProjectByMsId} from "../../../api/manage/project";

  export default {
    name: "Task",
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
        // 任务表格数据
        taskList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 任务状态字典
        taskStatusOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        //项目列表
        projectList: [],
        //项目签订数据
        projectSignDataList: [],
        //站点id
        msId: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          projectName: null,
          createTime: null,
          taskStatus: null,
          msId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //新增修改显示
        add: true,
        // 推送表单
        pushForm: {},
        //知行中间库数据
        zxTaskList: [],
        pushOpen: false,
      };
    },
    created() {
      //获取站点id
      this.msId = getMSId();
      this.getList();
      this.getDicts("m_task_status").then(response => {
        this.taskStatusOptions = response.data;
      });
      this.getProjectList();
    },
    methods: {

      /**项目签订量下拉事件*/
      projectSignDataSelectChange(type) {
        let signData = this.projectSignDataList.find((item) => {
          return item.type === type;
        });
        this.form.taskPlannedQuantity = signData.num;
      },

      /**项目下拉事件*/
      projectSelectChange(projectId) {
        this.projectSignDataList = [];
        let project = this.projectList.find((item) => {
          return item.projectId === projectId;
        });
        this.projectSignDataList = JSON.parse(project.projectSignData);
      },
      /** 查询项目列表 */
      getProjectList() {
        if (!this.msId) {
          return;
        }
        listProjectByMsId({msId: this.msId}).then(response => {
          this.projectList = response.rows;
        });
      },
      /** 查询任务列表 */
      getList() {
        if (!this.msId) {
          return;
        }
        this.queryParams.msId = this.msId;
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listTask(this.queryParams).then(response => {
          this.taskList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 任务状态字典翻译
      taskStatusFormat(row, column) {
        return this.selectDictLabel(this.taskStatusOptions, row.taskStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          taskId: null,
          taskCode: null,
          projectId: null,
          taskProductionType: null,
          taskPosition: null,
          taskShipping: null,
          taskPlannedQuantity: null,
          taskAddQuantity: null,
          taskSupplyTime: null,
          taskDepartureInterval: null,
          taskAddress: null,
          taskContacts: null,
          taskPhone: null,
          taskStatus: null,
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
        this.daterangeCreateTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.taskId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.add = true;
        this.projectSignDataList = [];
        this.title = "添加任务";
      },
      /** 查看按钮操作 */
      handleSearch(row) {
        this.reset();
        const taskId = row.taskId || this.ids
        getTask(taskId).then(response => {
          this.form = response.data;
          this.projectSelectChange(this.form.projectId);
          this.add = false;
          this.open = true;
          this.title = "查看任务";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const taskId = row.taskId || this.ids
        getTask(taskId).then(response => {
          this.form = response.data;
          this.projectSelectChange(this.form.projectId);
          this.add = true;
          this.open = true;
          this.title = "修改任务";
        });
      },
      /**合并任务数据(成都知行)*/
      push() {
        this.pushOpen = true;
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.taskId != null) {
              updateTask(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              if (!this.msId) {
                return;
              }
              this.form.msId = this.msId;
              addTask(this.form).then(response => {
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
        const taskIds = row.taskId || this.ids;
        this.$confirm('是否确认删除任务编号为"' + taskIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delTask(taskIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有任务数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTask(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
