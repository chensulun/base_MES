<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="日期">
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
      <el-form-item label="项目" prop="taskPlanProjectName">
        <el-input
          v-model="queryParams.taskPlanProjectName"
          placeholder="请输入项目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划状态" prop="taskPlanStatus">
        <el-select v-model="queryParams.taskPlanStatus" placeholder="请选择计划状态" clearable size="small">
          <el-option
            v-for="dict in taskPlanStatusOptions"
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
          v-hasPermi="['manage:taskPlan:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" style="top: 30px" :data="taskPlanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="项目名称" align="center" prop="taskPlanProjectName"/>
      <el-table-column label="生产类型" align="center" prop="taskPlanProductionType"/>
      <el-table-column label="总计划量" align="center" prop="taskPlanQuantity"/>
      <el-table-column label="生产计划状态" align="center" prop="taskPlanStatus" :formatter="taskPlanStatusFormat"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:taskPlan:edit']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="show(scope.row)"
          >查看审核进度
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleDelete(scope.row)"
            v-if="scope.row.canDelete === 1"
            v-hasPermi="['manage:taskPlan:edit']"
          >取消排程
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

    <!-- 添加或修改生产计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body :close-on-click-modal="false">
      <el-table v-loading="loading" :data="addTaskList">
        <el-table-column label="任务编号" align="center" width="130" prop="taskCode"/>
        <el-table-column label="项目" align="center" show-tooltip-when-overflow="true" prop="projectName"/>
        <el-table-column label="生产类型" align="center" prop="taskProductionType"/>
        <el-table-column label="计划量" align="center" width="100" prop="taskPlannedQuantity">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.taskPlannedQuantity"
              placeholder="计划量"
              clearable
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="供货时间" align="center" prop="taskSupplyTime" width="180">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.taskSupplyTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center" prop="taskAddress"/>
        <el-table-column label="联系人" align="center" prop="taskContacts"/>
        <el-table-column label="联系电话" align="center" width="120" prop="taskPhone"/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="showButton" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, addTaskList)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        v-show="showButton"
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        :style="{width: '100%'}"
        @click="select"
      >新增
      </el-button>
      <div slot="footer" v-show="showButton" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定 排 程</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择任务框 -->
    <el-dialog title="选择任务" :visible.sync="selectOpen" width="1200px" append-to-body :close-on-click-modal="false">
      <el-form :model="taskQueryParams" ref="taskQueryForm" :inline="true" label-width="68px">
        <el-form-item label="项目" prop="projectId">
          <el-input
            v-model="taskQueryParams.projectName"
            placeholder="请输入项目"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="taskHandleQuery">搜索</el-button>
          <el-button size="mini" @click="addTask">确定选择</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="taskList" @selection-change="taskHandleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="任务编号" align="center" width="130" prop="taskCode"/>
        <el-table-column label="项目" align="center" show-tooltip-when-overflow="true" prop="projectName"/>
        <el-table-column label="生产类型" align="center" prop="taskProductionType"/>
        <el-table-column label="计划量" align="center" prop="taskPlannedQuantity"/>
        <el-table-column label="供货时间" align="center" prop="taskSupplyTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.taskSupplyTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center" prop="taskAddress"/>
        <el-table-column label="联系人" align="center" prop="taskContacts"/>
        <el-table-column label="联系电话" align="center" width="120" prop="taskPhone"/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="taskTotal>0"
        :total="taskTotal"
        :page.sync="taskQueryParams.pageNum"
        :limit.sync="taskQueryParams.pageSize"
        @pagination="getList"
      />
    </el-dialog>

    <!-- 选择任务框 -->
    <el-dialog title="审核进度" :visible.sync="open1" width="1200px" append-to-body :close-on-click-modal="false">
      <taskPlanHistoryForm :taskPlanId="taskPlanId"/>
    </el-dialog>

  </div>
</template>

<script>
  import {addTaskPlan, delTaskPlan, exportTaskPlan, getTaskPlan, listTaskPlan,} from "@/api/manage/taskPlan";
  import {listTask} from "@/api/manage/task";
  import {getMSId} from '@/utils/station';
  import taskPlanHistoryForm from "@/views/manage/taskPlan/taskPlanHistoryForm";


  export default {
    name: "TaskPlan",
    components: {taskPlanHistoryForm},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 任务选中数组
        taskIds: [],
        // 非单个禁用
        single: true,
        // 任务非单个禁用
        taskSingle: true,
        // 非多个禁用
        multiple: true,
        // 任务非多个禁用
        taskMultiple: true,
        // 显示搜索条件
        showSearch: true,
        // 显示按钮
        showButton: true,
        // 总条数
        total: 0,
        //任务总条数
        taskTotal: 0,
        // 生产计划表格数据
        taskPlanList: [],
        //需要增加的数据列表
        addTaskList: [],
        //任务列表
        taskList: [],
        //选择框数据
        taskSelection: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 审核显示弹出层
        open1: false,
        taskPlanId: null,
        //selectOpen
        selectOpen: false,
        // 生产计划状态( 待供 正供 供毕 审核中 审核未通过)字典
        taskPlanStatusOptions: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        //站点id
        msId: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          taskPlanProjectName: null,
          taskPlanStatus: null,
          msId: null
        },
        // 任务查询参数
        taskQueryParams: {
          pageNum: 1,
          pageSize: 10,
          projectName: null,
          taskStatus: "0",
          msId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      //获取站点id
      this.msId = getMSId();
      this.getList();
      this.getDicts("task_plan_status").then(response => {
        this.taskPlanStatusOptions = response.data;
      });
    },
    methods: {
      /**添加任务中间数据*/
      addTask() {
        this.addTaskList.push(...this.taskSelection);
        this.taskSelection = [];
        this.selectOpen = false;
      },
      /**弹出选择框*/
      select() {
        this.selectOpen = true;
        this.getTaskList();
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      /** 查询任务列表 */
      getTaskList(taskIds) {
        if(!this.msId){
          return;
        }
        this.taskQueryParams.msId = this.msId;
        this.taskQueryParams.params = {};
        if (taskIds) {
          this.taskQueryParams.params["contain"] = taskIds;
          this.taskQueryParams.taskStatus = null;
          listTask(this.taskQueryParams).then(response => {
            this.addTaskList = response.rows;
          });
        } else {
          this.loading = true;
          this.taskQueryParams.taskStatus = 0;
          let ids = this.addTaskList.map(item => item.taskId);
          if (ids && ids.length > 0) {
            this.taskQueryParams.params["unContain"] = ids.join(",");
          }
          listTask(this.taskQueryParams).then(response => {
            this.taskList = response.rows;
            this.taskTotal = response.total;
            this.loading = false;
          });
        }
      },
      /** 查询生产计划列表 */
      getList() {
        if(!this.msId){
          return;
        }
        this.queryParams.msId = this.msId;
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listTaskPlan(this.queryParams).then(response => {
          this.taskPlanList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 生产计划状态( 待供 正供 供毕)字典翻译
      taskPlanStatusFormat(row, column) {
        return this.selectDictLabel(this.taskPlanStatusOptions, row.taskPlanStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          msId: null,
          taskPlanId: null,
          taskIds: null,
          taskData: null,
          taskPlanProjectIds: null,
          taskPlanProjectName: null,
          taskPlanProductionType: null,
          taskPlanQuantity: null,
          taskPlanAddQuantity: null,
          taskPlanStatus: "0",
          taskPlanSupplyTime: null,
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
      /** 搜索按钮操作 */
      taskHandleQuery() {
        this.taskQueryParams.pageNum = 1;
        this.getTaskList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.daterangeCreateTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.taskPlanId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      // 多选框选中数据
      taskHandleSelectionChange(selection) {
        this.taskSelection = selection;
        this.taskIds = selection.map(item => item.taskId)
        this.taskSingle = selection.length !== 1
        this.taskMultiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.showButton = true;
        this.addTaskList = [];
        this.title = "添加生产计划";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const taskPlanId = row.taskPlanId || this.ids;
        getTaskPlan(taskPlanId).then(response => {
          this.form = response.data;
          //this.getTaskList(this.form.taskIds);
          this.addTaskList = JSON.parse(this.form.taskData);
          this.showButton =false;
          this.open = true;
          this.title = "修改生产计划";
        });
      },
      /** 修改按钮操作 */
      show(row) {
        const taskPlanId = row.taskPlanId || this.ids;
        this.taskPlanId = taskPlanId;
        this.open1 = true;
      },
      /** 提交按钮 */
      submitForm() {
        if (!this.msId) {
          this.msgError('站点未选择');
          this.open = false;
          return;
        }
        let quantity = 0, addQuantity = 0;
        this.addTaskList.forEach(item => {
          quantity += Number(item.taskPlannedQuantity);
          addQuantity += Number(item.taskAddQuantity);
        });
        this.form.taskIds = Array.from(new Set(this.addTaskList.map(item => item.taskId))).join(',');
        this.form.taskPlanProjectIds = Array.from(new Set(this.addTaskList.map(item => item.projectId))).join(',');
        this.form.taskPlanProjectName = Array.from(new Set(this.addTaskList.map(item => item.projectName))).join(',');
        this.form.taskPlanProductionType = Array.from(new Set(this.addTaskList.map(item => item.taskProductionType))).join(',');
        this.form.taskPlanQuantity = quantity;
        this.form.taskPlanAddQuantity = addQuantity;
        this.form.taskData = JSON.stringify(this.addTaskList);
        this.form.msId = this.msId;
        addTaskPlan(this.form).then(response => {
          this.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const taskPlanIds = row.taskPlanId || this.ids;
        this.$confirm('确定取消此次生产计划?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delTaskPlan(taskPlanIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有生产计划数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTaskPlan(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
