<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="18">
          <el-table v-loading="loading" :data="taskList">
            <el-table-column label="任务编号" align="center" width="130" prop="taskCode"/>
            <el-table-column label="项目" align="center" show-tooltip-when-overflow="true" prop="projectName"/>
            <el-table-column label="生产类型" align="center" prop="taskProductionType"/>
            <el-table-column label="计划量" align="center" width="100" prop="taskPlannedQuantity"/>
            <el-table-column label="供货时间" align="center" prop="taskSupplyTime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.taskSupplyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
          </el-table>
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

  import {getTaskPlan} from "@/api/manage/taskPlan";
  import {historyFromData} from '@/api/activiti/historyFormdata'

  export default {
    name: "taskPlantHistoryForm",
    props: {
      taskPlanId: {
        type: String
      }
    },
    data() {
      return {
        // 表单参数
        form: {},
        taskList: [],
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
    },
    methods: {
      getTaskPlanInfo() {
        if (!this.taskPlanId) {
          return;
        }
        getTaskPlan(this.taskPlanId).then(response => {
          this.form = response.data;
          this.taskList = JSON.parse(this.form.taskData);
          console.log(response)
          let ac = {
            content: '计划创建',
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
        historyFromData(this.taskPlanId).then(response => {
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
    }

  }
</script>

<style scoped>

</style>
