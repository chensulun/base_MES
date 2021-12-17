<!--  -->
<template>
  <div>
    <div class="dataList">
      <!-- 选择日期 -->
      <el-date-picker
        class="my-dateRange"
        v-model="date"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button class="my-btn my-sureBtn" @click="sureDate">查询</el-button>
    </div>
    <!-- Form表单 -->
    <div class="my-form">
      <el-table :data="formItems" style="width: 100%">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column
          prop="recycledMaterial"
          label="回收料"
        ></el-table-column>
        <el-table-column prop="aggregate" label="骨料"></el-table-column>
        <el-table-column prop="newFan" label="新粉"></el-table-column>
        <el-table-column prop="asphalt" label="沥青"></el-table-column>
        <el-table-column prop="additive" label="添加剂"></el-table-column>
      </el-table>
      <!-- 分页按钮 -->
      <div class="my-btnGroup" v-show="this.formItems.length !== 0">
        <el-button-group class="my-btnGroupItem">
          <el-button icon="el-icon-arrow-left">上一页</el-button>
          <el-button>1</el-button>
          <el-button>2</el-button>
          <el-button
            >下一页<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: [],
      formItems: [
        /**
         * 要获取数组对象
         */
        {
          date: "日期",
          recycledMaterial: "回收料",
          aggregate: "骨料",
          newFan: "新粉",
          asphalt: "沥青",
          additive: "添加剂",
        },
      ],
    };
  },

  components: {},

  computed: {},

  methods: {
    // 确认时间
    sureDate() {
      console.log(this.date);
    },
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.dataList {
  padding: 20px 30px;
  display: flex;
  flex-wrap: wrap;

  // align-items: center;
  .my-btn {
    width: 60px;
    height: 36px;
    margin: 0 !important;
    margin-right: 20px !important;
    font-size: 14px;
    background-color: #fff;
    font-weight: 400;
    color: #888888;
    border: 1px solid #e6e6e6;
    font-weight: 400;
    text-align: center;
    padding: 0;
  }
  .my-dateRange {
    // height: 28px;
    margin-right: 14px !important;
  }
  .my-sureBtn {
    // height: 28px;
    border-radius: 17px;
    background-color: #1ab99b;
    color: white;
    margin-right: 40px !important;
  }
}
.my-form {
  padding: 0 30px;
  .my-btnGroup {
    position: relative;
    .my-btnGroupItem {
      position: absolute;
      margin-top: 10px;
      right: 0;
    }
  }
}
</style>