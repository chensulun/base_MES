<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="通知/公告" name="first">
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column prop="date" label="日期" width="180"/>
        <el-table-column prop="name" label="标题" width="180"/>
        <el-table-column prop="address" label="程度"/>
        <el-table-column prop="address" label="摘要"/>
        <el-table-column prop="address" label="发布者"/>
        <el-table-column prop="address" label="状态"/>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="我的待办" name="second">
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column prop="date" label="日期" width="180"/>
        <el-table-column prop="name" label="标题" width="180"/>
        <el-table-column prop="address" label="程度"/>
        <el-table-column prop="address" label="摘要"/>
        <el-table-column prop="address" label="上一级"/>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'first',
        tableData: []
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    }
  };
</script>

<style scoped>

  /deep/ .el-tabs__item {
    font-size: 22px !important;
  }
</style>
