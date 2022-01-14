<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="18">
          <el-col>
            <el-form-item label="申请类型" prop="saType">
              <el-select  disabled v-model="form.saType" placeholder="请选择申请类型">
                <el-option
                  v-for="dict in saTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="申请人" prop="saUserName">
              <el-select allow-create  filterable disabled  v-model="form.saUserName"  placeholder="请选择申请人" >
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.nickName"
                  :value="dict.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="作业班组/人" prop="saGroupUserName">
              <el-select allow-create disabled  filterable  v-model="form.saGroupUserId"  placeholder="请选择班组/人名字" >
                <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.nickName"
                  :value="dict.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="作业部位" prop="saPosition">
              <el-input
                v-model="form.saPosition"
                readonly
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="安全作业级别/种类" prop="saLevel">
              <el-select allow-create disabled  filterable  v-model="form.saLevel"  placeholder="安全作业级别/种类" >
                <el-option
                  v-for="dict in saLevelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col></el-col>
          <el-col :span="10">
            <el-form-item label="作业开始时间" prop="saStartTime">
              <el-date-picker
                clearable
                readonly
                size="small"
                v-model="form.saStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择作业开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="作业结束时间" prop="saEndTime">
              <el-date-picker
                clearable
                readonly
                size="small"
                v-model="form.saEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择作业结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="作业原因" prop="saRemark">
              <el-input
                readonly
                v-model="form.saRemark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="安全措施" prop="saMeasures">
              <el-input
                readonly
                v-model="form.saMeasures"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="附件" prop="saFileData">
              <el-upload
                readonly
                class="upload-demo"
                ref="upload"
                :on-preview="handlePreview"
                :file-list="fileList"
                :auto-upload="false"
              >>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="24">
            <el-divider content-position="left">审核进度</el-divider>
          </el-col>
          <el-col :span="24">
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
          </el-col>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>

  import {historyFromData} from '@/api/activiti/historyFormdata';
  import {  getSecurityApprove} from "@/api/erp/securityApprove";
  import { listUser } from "@/api/system/user";

  export default {
    name: "taskPlantHistoryForm",
    props: {
      saId: {
        type: String
      }
    },
    data() {
      return {
        // 表单参数
        form: {},
        fileList: [],
        userList: [],
        // 申请类型字典
        saTypeOptions: [],
        // 安全作业级别/种类字典
        saLevelOptions: [],
        // 安全审核状态
        saStatusOptions: [],
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
      }
    },
    created() {
      this.getTaskPlanInfo();
      this.getUserList();
      this.getDicts("erp_security_approve_type").then((response) => {
        this.saTypeOptions = response.data;
      });
      this.getDicts("erp_security_approve_level").then((response) => {
        this.saLevelOptions = response.data;
      });
      this.getDicts("erp_security_approve_status").then((response) => {
        this.saStatusOptions = response.data;
      });
    },
    methods: {
      getTaskPlanInfo() {
        if (!this.saId) {
          return;
        }
        getSecurityApprove(this.saId).then(response => {
          this.form = response.data;
          if (this.form.saFileData) {
            this.fileList = JSON.parse(this.form.saFileData);
          }
          let ac = {
            content: '审核提交',
            timestamp: this.form.createTime,
            user: this.form.createBy,
            size: 'large',
            type: 'primary',
            icon: 'el-icon-more'
          };
          this.activities = [];
          this.activities.push(ac);
          this.historyFromData();
        });
      },
      historyFromData() {
        historyFromData(this.saId).then(response => {
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
        })
      },

      /** 查询系统用户 */
      getUserList() {
        listUser({ pageNum: 1, pageSize: 999 }).then((response) => {
          this.userList = response.rows.filter((user) => user.admin !== true);
        });
      },
    }

  }
</script>

<style scoped>

</style>
