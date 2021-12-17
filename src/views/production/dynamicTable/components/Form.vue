<template>
  <div>
    <!-- 上侧部分 -->
    <div class="f1">
      <span>通过余量</span>
      <el-table
        :data="list"
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6' }"
        :stripe="true"
      >
        <el-table-column prop="pdName" label="指标"> </el-table-column>
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
      </el-table>
    </div>
    <!-- 下侧部分 -->
    <div>
      <EchartsOne :list='list'></EchartsOne>
    </div>
  </div>
</template>

<script>
import EchartsOne from "./EchartsOne";
export default {
  components: {
    EchartsOne,
  },
  data() {
    return {};
  },
  props: {
    list: { type: Array },
  },

  computed: {},

  methods: {},
  watch:{
    list(){
      console.log(this.list);
    }
  }
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.f1 {
  margin-bottom: 20px;
}
p,
span {
  display: block;
  font-weight: bold;
  color: black;
  font-size: 18px;
  margin: 0;
  margin-bottom: 10px;
}
</style>