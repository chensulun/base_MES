<!--  -->
<template>
  <div class="app-container">
    <div class="boxs">
      <div class="boxItem">
        <h1>入口道闸</h1>
        <div>
          <div class="img">
            <img src="../../../assets/images/RC.jpeg" />
          </div>
          <div class="switch">
            <span>开关</span>
            <el-switch v-model="state[0]"> </el-switch>
          </div>
        </div>
      </div>
      <div class="boxItem">
        <h1>厂门道闸</h1>
        <div>
          <div class="img">
            <img src="../../../assets/images/RCC.png" />
          </div>
          <div class="switch">
            <span>开关</span>
            <el-switch v-model="state[1]"> </el-switch>
          </div>
        </div>
      </div>
    </div>
    <div class="boxs">
      <div class="boxItem">
        <h1>集控中心门禁</h1>
        <div>
          <div class="img">
            <img src="../../../assets/images/RCCC.jpeg" />
          </div>
          <div class="switch">
            <span>开关</span>
            <el-switch v-model="state[2]"> </el-switch>
          </div>
        </div>
      </div>
      <div class="boxItem">
        <h1>平台门禁</h1>
        <div>
          <div class="img">
            <img src="../../../assets/images/RCCCC.jpeg" />
          </div>
          <div class="switch">
            <span>开关</span>
            <el-switch v-model="state[3]"> </el-switch>
          </div>
        </div>
      </div>
      <div class="boxItem">
        <h1>办公区门禁</h1>
        <div>
          <div class="img">
            <img src="../../../assets/images/RCCCCC.jpeg" />
          </div>
          <div class="switch">
            <span>开关</span>
            <el-switch v-model="state[4]"> </el-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: [true, true, true, true, true],
    };
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.boxs {
  display: flex;
  flex-wrap: wrap;
  .boxItem {
    position: relative;
    width: 30%;
    height: 400px;
    margin-right: 20px;
    margin-bottom: 20px;
    border: 1px solid black;
    overflow: hidden;
    h1 {
      font-size: 2em;
      margin: 0.67em 0;
      margin-left: 20px;
    }
    .img {
      img {
        width: 100%;
      }
    }
    .switch {
      position: absolute;
      top: 20px;
      right: 10px;
      width: 100px;
      height: 50px;
      font-size: 20px;
    }
  }
}
</style>
