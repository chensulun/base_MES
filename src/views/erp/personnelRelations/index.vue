<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请时间">
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
      <el-form-item label="申请人" prop="prApplicantId">
        <el-input
          v-model="queryParams.prApplicantId"
          placeholder="请输入申请人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="经办人" prop="prHandlerId">
              <el-input
                v-model="queryParams.prHandlerId"
                placeholder="请输入经办人"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>-->
      <el-form-item label="申请类型" prop="prType">
        <el-select v-model="queryParams.prType" placeholder="请选择申请类型" clearable size="small">
          <el-option
            v-for="dict in prTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="申请状态" prop="prStatus">
        <el-select v-model="queryParams.prStatus" placeholder="请选择申请状态" clearable size="small">
          <el-option
            v-for="dict in prStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->

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
          v-hasPermi="['erp:personnelRelations:add']"
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
          v-hasPermi="['erp:personnelRelations:edit']"
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
          v-hasPermi="['erp:personnelRelations:remove']"
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
          v-hasPermi="['erp:personnelRelations:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="personnelRelationsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="prApplicant"/>
      <el-table-column label="经办人" align="center" prop="prHandler"/>
      <el-table-column label="申请类型" align="center" prop="prType" :formatter="prTypeFormat"/>
      <el-table-column label="申请说明" align="center" prop="prRemark"/>
      <el-table-column label="申请状态" align="center" prop="prStatus" :formatter="prStatusFormat"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="downloadFile(scope.row)"
          >附件下载
          </el-button>
          <!--          <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="handleUpdate(scope.row)"
                      v-hasPermi="['erp:personnelRelations:edit']"
                    >修改
                    </el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="historyFromData(scope.row)"
          >查看审核进度
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.prStatus !== 0"
            v-hasPermi="['erp:personnelRelations:remove']"
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

    <!-- 添加或修改erp-人事关系对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="24">
            <el-form-item label="申请类型" prop="prType">
              <el-select v-model="form.prType" placeholder="请选择申请类型">
                <el-option
                  v-for="dict in prTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="prApplicantId">
              <el-select allow-create filterable v-model="form.prApplicantId" placeholder="请选择申请人"
                         @change="prApplicantSelectChange">
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.nickName"
                  :value="dict.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人" prop="prHandlerId">
              <el-select allow-create filterable v-model="form.prHandlerId" placeholder="请选择经办人"
                         @change="prHandlerSelectChange">
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.nickName"
                  :value="dict.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请说明" prop="prRemark">
              <el-input v-model="form.prRemark" type="textarea" rows="4" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="contractEnclosureData">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadFileUrl"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">点击上传文件</div>
              </el-upload>
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
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <el-divider content-position="left">审核进度</el-divider>
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.timestamp">
            <p>{{activity.content}}</p>
            <p>操作人:{{activity.user}}</p>
            <p v-if="activity.hisData" v-for="item in activity.hisData">{{item.title}}:{{item.value}}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addPersonnelRelations,
    delPersonnelRelations,
    exportPersonnelRelations,
    getPersonnelRelations,
    listPersonnelRelations,
    updatePersonnelRelations
  } from "@/api/erp/personnelRelations";

  import {listUser} from "@/api/system/user";

  import {getToken} from "@/utils/auth";

  import {historyFromData} from '@/api/activiti/historyFormdata'

  export default {
    name: "PersonnelRelations",
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
        // erp-人事关系表格数据
        personnelRelationsList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 申请类型字典
        prTypeOptions: [],
        // 申请状态字典
        prStatusOptions: [],
        // 申请时间时间范围
        daterangeCreateTime: [],

        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          prApplicantId: null,
          prHandlerId: null,
          prType: null,
          prStatus: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //系统用户类别
        userList: [],
        // 上传的图片服务器地址
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        //文件数据
        fileList: [],
        //审核进度弹框显示
        dialogVisible: false,
        //显示列表
        activities: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }]
      };
    },
    created() {
      this.getList();
      this.getDicts("erp_personnel_relations_type").then(response => {
        this.prTypeOptions = response.data;
      });
      this.getDicts("erp_personnel_relations_status").then(response => {
        this.prStatusOptions = response.data;
      });
      this.getUserList();
    },
    methods: {
      /** 上传文件*/
      submitUpload() {
        this.$refs.upload.submit();
      },
      /** 上传成功*/
      uploadSuccess(response, file, fileList) {
        if (response.code === 200) {
          file.url = response.fileName;
          this.fileList = [];
          fileList.forEach(item => {
            let file = {name: item.name, url: item.url};
            this.fileList.push(file);
          });
        }
      },
      handleRemove(file, fileList) {
        this.fileList = [];
        fileList.forEach(item => {
          let file = {name: item.name, url: item.url};
          this.fileList.push(file);
        });
      },
      /** 点击文件列表*/
      handlePreview(file) {
        if (file.status === 'success') {
          let ele = document.createElement('a');// 创建下载链接
          ele.download = file.name;
          ele.style.display = 'none';
          ele.href = process.env.VUE_APP_BASE_API + file.url;
          document.body.appendChild(ele);
          ele.click();
          document.body.removeChild(ele);
        }
      },
      /** 下载文件*/
      downloadFile(row) {
        if (row.prFileData) {
          let fileList = JSON.parse(row.prFileData);
          if (fileList && fileList.length > 0) {
            let file = fileList[0];
            let ele = document.createElement('a');// 创建下载链接
            ele.download = file.name;
            ele.style.display = 'none';
            ele.href = process.env.VUE_APP_BASE_API + file.url;
            document.body.appendChild(ele);
            ele.click();
            document.body.removeChild(ele);
          }
        }
      },
      prApplicantSelectChange(userId) {
        let user = this.userList.find((item) => {
          return item.userId === userId;
        });
        this.form.prApplicant = user.nickName;
      },
      prHandlerSelectChange(userId) {
        let user = this.userList.find((item) => {
          return item.userId === userId;
        });
        this.form.prHandler = user.nickName;
        this.form.userName = user.userName;
      },
      /** 查询系统用户 */
      getUserList() {
        listUser({pageNum: 1, pageSize: 999}).then(response => {
          this.userList = response.rows;
          this.userList = this.userList.filter(user => user.admin !== true);
        });
      },
      /** 查询erp-人事关系列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listPersonnelRelations(this.queryParams).then(response => {
          this.personnelRelationsList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 申请类型字典翻译
      prTypeFormat(row, column) {
        return this.selectDictLabel(this.prTypeOptions, row.prType);
      },
      // 申请状态字典翻译
      prStatusFormat(row, column) {
        return this.selectDictLabel(this.prStatusOptions, row.prStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          prId: null,
          prApplicant: null,
          prApplicantId: null,
          prHandler: null,
          prHandlerId: null,
          prType: null,
          prRemark: null,
          prStatus: "0",
          prFileData: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          userName: null
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
        this.ids = selection.map(item => item.prId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      //查看审核记录
      historyFromData(row) {
        let ac = {
          content: '计划创建',
          timestamp: row.createTime,
          user: row.createBy,
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        };
        this.activities = [];
        this.activities.push(ac);
        historyFromData(row.prId).then(response => {
          this.fromData = response.data;
          for (let i = 0; i < this.fromData.length; i++) {
            let data = this.fromData[i];
            let ac = {
              content: data.taskNodeName,
              timestamp: data.createdDate,
              user: data.createName,
              color: '#0bbd87',
              hisData: data.formHistoryDataDTO
            };
            this.activities.push(ac);
          }
        });
        this.dialogVisible = true;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加人事关系";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const prId = row.prId || this.ids
        getPersonnelRelations(prId).then(response => {
          this.form = response.data;
          if (this.form.cdpFileData) {
            this.fileList = JSON.parse(this.form.prFileData);
          }
          this.open = true;
          this.title = "修改人事关系";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.prFileData = JSON.stringify(this.fileList);
            console.log(this.form);
            if (this.form.prId != null) {
              updatePersonnelRelations(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addPersonnelRelations(this.form).then(response => {
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
        const prIds = row.prId || this.ids;
        this.$confirm('是否确认删除人事关系编号为"' + prIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delPersonnelRelations(prIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有人事关系数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportPersonnelRelations(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
