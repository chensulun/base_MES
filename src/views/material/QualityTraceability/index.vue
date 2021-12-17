<template>
  <div class="container">
    <div class="f1">
      <div>
        <span>日期：</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="cleanForm"
        >
        </el-date-picker>
        <el-button type="success" class="mybtn" @click="getProject"
          >查询</el-button
        >
      </div>
      <div>
        <span>项目：</span>
        <el-select
          v-model="queryParams.project"
          @change="getPbh"
          size="mini"
          placeholder="请选择"
        >
          <el-option
            v-for="item in project"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <span>类型：</span>
        <el-select
          v-model="queryParams.pbh"
          @change="getData"
          size="mini"
          placeholder="请选择"
        >
          <el-option v-for="(i, p) in pbh" :key="p" :label="i" :value="i">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="f2">
      <!--合成级配曲线图-->
      <div>
        <EchartsOne :tableDataItem="tableDataItem" />
      </div>
      <!--通过余量-->
      <div>
        <div><span>通过余量</span></div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#eef1f6' }"
          :stripe="true"
        >
          <el-table-column prop="createTime" label="时间"> </el-table-column>
          <el-table-column prop="one" label="0.075"> </el-table-column>
          <el-table-column prop="thirteen" label="0.15"> </el-table-column>
          <el-table-column prop="two" label="0.3"> </el-table-column>
          <el-table-column prop="three" label="0.6"> </el-table-column>
          <el-table-column prop="four" label="1.18"> </el-table-column>
          <el-table-column prop="five" label="2.36"> </el-table-column>
          <el-table-column prop="six" label="4.75"> </el-table-column>
          <el-table-column prop="seven" label="9.5"> </el-table-column>
          <el-table-column prop="eight" label="13.2"> </el-table-column>
          <el-table-column prop="nine" label="16"> </el-table-column>
          <el-table-column prop="ten" label="19"> </el-table-column>
          <el-table-column prop="eleven" label="26.5"> </el-table-column>
          <el-table-column prop="twelve" label="31.5"> </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button
                @click="doEcharts(scope)"
                type="text"
                size="small"
                icon="el-icon-search"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页按钮 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import EchartsOne from "./components/EchartsOne";
var moment = require("moment");

export default {
  components: {
    EchartsOne,
  },
  data() {
    return {
      date: [], //时间控件的值
      total: 0,
      // 查询参数
      queryParams: {
        beginDate: null,
        endDate: null,
        pbh: null, //材料类型
        page: 1,
        pageSize: 10,
        project: null,
      },
      project: [
        {
          value: "project0",
          label: "project0",
        },
        {
          value: "project1",
          label: "project1",
        },
        {
          value: "project2",
          label: "project2",
        },
      ],
      pbh: [], //返回的数据--材料类型
      tableData: [], //返回的数据--通过余量--form数据
      tableDataItem: [], //echarts数据
      tableDataAllInfo: [], //返回的数据--通过余量--拷贝所有list
    };
  },
  methods: {
    getProject() {
      //project
      this.getPbh();
    },
    getPbh() {
      this.queryParams.beginDate = moment(this.date[0]).format("YYYY-MM-DD");
      this.queryParams.endDate = moment(this.date[1]).format("YYYY-MM-DD");
      var params = {
        beginDate: this.queryParams.beginDate,
        endDate: this.queryParams.endDate,
      };
      axios({
        method: "get",
        url: "https://test.zgdrkj.cn:8443/cs/api/data/getDateTimeByPBH",
        params: params,
      })
        .then((res) => {
          this.pbh = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getData() {
      axios({
        method: "post",
        url: "https://test.zgdrkj.cn:8443/cs/api/data/getQualityChase",
        data: this.queryParams,
        dataType: "json",
      })
        .then((res) => {
          this.tableData = [];
          this.tableDataAllInfo = res.data.list;
          res.data.list.forEach((ele) => {
            this.tableData.push(ele[3]);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    doEcharts(tab) {
      this.tableDataItem = this.tableDataAllInfo[tab.$index];
    },
    cleanForm() {
      // this.queryParams.project=null
      this.queryParams.pbh = null;
      // this.tableData=[]
      //this.tableDataItem={}
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  background-color: #eee;

  &:before {
    content: " ";
    display: table;
  }

  .f1 {
    margin: 20px 40px;
    display: flex;
    flex-wrap: nowrap;
    height: 100px;
    align-items: center;
    justify-content: space-around;
    background-color: white;
    .mybtn {
      margin-left: 20px;
    }
  }

  .f2 {
    margin: 20px 40px;
    background-color: white;

    &:before {
      content: " ";
      display: table;
    }

    > div {
      margin: 20px;
    }
    span {
      display: inline-block;
      font-weight: bold;
      margin: 20px 0;
    }
  }
}
</style>
