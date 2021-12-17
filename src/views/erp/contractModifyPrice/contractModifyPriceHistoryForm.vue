<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="form" :model="cdpForm" label-width="80px">
        <el-col :span="18">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="contractProjectName">
              <el-input readonly v-model="cdpForm.contractProjectName" placeholder="项目名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input readonly v-model="cdpForm.contractCode" placeholder="请输入合同编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户名称" prop="contractCustomerName">
              <el-input readonly v-model="cdpForm.contractCustomerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contractContacts">
              <el-input readonly v-model="cdpForm.contractContacts" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contractPhone">
              <el-input readonly v-model="cdpForm.contractPhone" placeholder="请输入联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-table border
                      :data="cdpForm.cdpProductDataList"
                      style="width: 100%">
              <el-table-column prop="name" align="center" label="产品名称">
                <template slot-scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="签订价">
                <template slot-scope="scope">
                  {{scope.row.price}}
                </template>
              </el-table-column>
              <el-table-column prop="price" align="center" label="调后价">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.newPrice" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调价事由" prop="contractPhone">
              <el-input type="textarea" v-model="cdpForm.cdpRemark" placeholder="请输入调价事由"/>
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

  import {getContractModifyPrice} from "@/api/erp/contractModifyPrice";
  import {historyFromData} from '@/api/activiti/historyFormdata'

  export default {
    name: "contractModifyPriceHistoryForm",
    props: {
      contractModifyPriceId: {
        type: String
      }
    },
    data() {
      return {
        // 表单参数
        cdpForm: {},
        fromData: [],
        fileList: [],
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
      this.getContractInfo();
    },
    methods: {

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
      getContractInfo() {
        if (!this.contractModifyPriceId) {
          return;
        }
        getContractModifyPrice(this.contractModifyPriceId).then(response => {
          this.cdpForm = response.data;
          this.cdpForm.cdpProductDataList = JSON.parse(this.cdpForm.cdpProductData);
          let ac = {
            content: '调剂单创建',
            timestamp: this.cdpForm.createTime,
            user: this.cdpForm.createBy,
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
        historyFromData(this.contractModifyPriceId).then(response => {
          this.fromData = response.data;
          for (let i = 0; i < this.fromData.length; i++) {
            let data = this.fromData[i];
            let ac = {
              content: data.taskNodeName,
              timestamp:  data.createdDate,
              user: data.createName,
              color: '#0bbd87',
              hisData:data.formHistoryDataDTO
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
