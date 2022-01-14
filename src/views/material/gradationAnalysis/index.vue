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
        <el-select v-model="queryParams.pbh" size="mini" placeholder="请选择" @change="getData">
          <el-option v-for="(i, p) in pbh" :key="p" :label="i" :value="i">
          </el-option>
        </el-select>
      </div>
      <div>
        <span>仓名：</span>
        <el-select
          v-model="queryParams.shippingSpace"
          @change="getData"
          size="mini"
          placeholder="请选择"
          clearable
          @clear="delValue"
        >
          <el-option
            v-for="item in shippingSpace"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="f2">
      <!--骨料波动分析-->
      <div>
        <EchartsOne :tableData="tableData" />
      </div>
      <!--油石比波动分析-->
      <div>
        <EchartsTwo :ysb="tableData" />
      </div>
      <!--出料温度波动分析-->
      <div>
        <EchartsThree :temp="tableData" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import EchartsOne from "./components/EchartsOne";
import EchartsTwo from "./components/EchartsTwo";
import EchartsThree from "./components/EchartsThree";
var moment = require("moment");
export default {
  components: {
    EchartsOne,
    EchartsTwo,
    EchartsThree,
  },
  data() {
    return {
      date: [], //时间控件的值
      command: "", //下拉框的值
      total: 0,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        beginDate: null,
        endDate: null,
        pbh: null,
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
      shippingSpace: [
        {
          value: "ONE",
          label: "仓1",
        },
        {
          value: "TWO",
          label: "仓2",
        },
        {
          value: "THREE",
          label: "仓3",
        },
        {
          value: "FOUR",
          label: "仓4",
        },
        {
          value: "FIVE",
          label: "仓5",
        },
        {
          value: "SIX1",
          label: "仓6",
        },
        {
          value: "SIX",
          label: "粉料1",
        },
        {
          value: "SEVEN",
          label: "粉料2",
        },
        {
          value: "SEVEN_1",
          label: "粉料3",
        },
      ],
      pbh: [], //返回的数据--材料类型
      tableData: [], //返回的数据--通过余量
    };
  },
  methods: {
    getProject() {
      this.queryParams.pbh = null;
      this.queryParams.shippingSpace = null;
      //project
      this.getPbh();
    },
    getPbh() {
      this.queryParams.pbh = null;
      this.queryParams.shippingSpace = null;
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
    delValue() {
      this.queryParams.shippingSpace = null;
      this.getData();
    },
    getData() {
      axios({
        method: "get",
        url: "https://test.zgdrkj.cn:8443/cs/api/data/getJp",
        params: this.queryParams,
      })
        .then((res) => {
          this.tableData = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cleanForm() {
      this.queryParams.project = null;
      this.queryParams.pbh = null;
      this.queryParams.shippingSpace = null;
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
  }
}
</style>
