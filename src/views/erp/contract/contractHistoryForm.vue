<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="18">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="contractProjectName">
              <el-input readonly v-model="form.contractProjectName" placeholder="项目名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input readonly v-model="form.contractCode" placeholder="请输入合同编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户名称" prop="contractCustomerName">
              <el-input readonly v-model="form.contractCustomerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contractContacts">
              <el-input readonly v-model="form.contractContacts" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contractPhone">
              <el-input readonly v-model="form.contractPhone" placeholder="请输入联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-table border show-summary
                      :data="form.contractProductDataList"
                      style="width: 100%">
              <el-table-column prop="name" align="center" label="产品名称">
                <template slot-scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="需求量">
                <template slot-scope="scope">
                  {{scope.row.num}}
                </template>
              </el-table-column>
              <el-table-column prop="price" align="center" label="单价">
                <template slot-scope="scope">
                  {{scope.row.price}}
                </template>
              </el-table-column>
              <el-table-column prop="total" align="center" label="总金额">
                <template slot-scope="scope">
                  {{scope.row.total = scope.row.num * scope.row.price}}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-form-item label="支付条件" prop="contractTaxRate">
              <el-col :span="8" v-for="(item,index) in form.contractPaymentDataList">
                <el-col :span="20">
                  <el-form-item :label="'阶段'+(index + 1)" :prop="'stage'+index">
                    <el-input v-model="item.stage" type="number" placeholder=""/>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="contractEnclosureData">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="#"
                :on-preview="handlePreview"
                :file-list="fileList"
                :auto-upload="false">
                <div slot="tip" class="el-upload__tip">点击下载文件</div>
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

  import {getContract} from "@/api/erp/contract";
  import {historyFromData} from '@/api/activiti/historyFormdata'

  export default {
    name: "contractHistoryForm",
    props: {
      contractId: {
        type: String
      }
    },
    data() {
      return {
        // 表单参数
        form: {},
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
        if (!this.contractId) {
          return;
        }
        getContract(this.contractId).then(response => {
          this.form = response.data;
          this.form.contractProductDataList = JSON.parse(this.form.contractProductData);
          this.form.contractPaymentDataList = JSON.parse(this.form.contractPaymentData);
          if (this.form.contractEnclosureData) {
            this.fileList = JSON.parse(this.form.contractEnclosureData);
          }
          let ac = {
            content: '合同创建',
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
        historyFromData(this.contractId).then(response => {
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
