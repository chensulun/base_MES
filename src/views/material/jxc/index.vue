<!--  -->
<template>
  <div class="app-container">
    <el-container>
      <el-header class="my-header">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-one">
              <div class="icon">
                <img src="../../../assets/images/sr.png" alt="" />
              </div>
              <div class="onePxLine"></div>
              <div class="text">
                <span>当日库存量</span>
                <span>¥0.00</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8"
            ><div class="grid-content bg-two">
              <div class="icon">
                <img src="../../../assets/images/xs.png" alt="" />
              </div>
              <div class="onePxLine"></div>
              <div class="text">
                <span>当日入库量</span>
                <span>0</span>
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content bg-three">
              <div class="icon">
                <img src="../../../assets/images/sk.png" alt="" />
              </div>
              <div class="onePxLine"></div>
              <div class="text">
                <span>当日出库量</span>
                <span>0</span>
              </div>
            </div></el-col
          >
        </el-row>
      </el-header>
      <el-main class="my-main">
        <div class="btnList">
          <el-button
            class="my-btn"
            :class="{ activeBtn: checkItem == 1 }"
            @click="checkItem = 1"
            >榜单管理</el-button
          >
          <el-button
            class="my-btn"
            :class="{ activeBtn: checkItem == 2 }"
            @click="checkItem = 2"
            >入库日志</el-button
          >
          <el-button
            class="my-btn"
            :class="{ activeBtn: checkItem == 3 }"
            @click="checkItem = 3"
            >出库日志</el-button
          >
          <el-button
            class="my-btn"
            :class="{ activeBtn: checkItem == 4 }"
            @click="checkItem = 4"
            >手动盘存</el-button
          >
          <el-button
            class="my-btn"
            :class="{ activeBtn: checkItem == 5 }"
            @click="checkItem = 5"
            >原材库存</el-button
          >
          <el-button
            class="my-btn"
            :class="{ activeBtn: checkItem == 6 }"
            @click="checkItem = 6"
            >料仓管理</el-button
          >
          <el-button
            class="my-btn"
            :class="{ activeBtn: checkItem == 7 }"
            @click="checkItem = 7"
            >消耗量统计</el-button
          >
        </div>
        <div class="detailList">
          <item-one v-if="this.checkItem == 1" />
          <item-two v-if="this.checkItem == 2" />
          <item-three v-if="this.checkItem == 3" />
          <item-four v-if="this.checkItem == 4" />
          <item-five v-if="this.checkItem == 5" />
          <item-six v-if="this.checkItem == 6" />
          <item-seven v-if="this.checkItem == 7" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ItemOne from "../../../components/JXC/ItemOne";
import ItemTwo from "../../../components/JXC/ItemTwo";
import ItemThree from "../../../components/JXC/ItemThree";
import ItemFour from "../../../components/JXC/ItemFour";
import ItemFive from "../../../components/JXC/ItemFive";
import ItemSix from "../../../components/JXC/ItemSix";
import ItemSeven from "../../../components/JXC/ItemSeven";
export default {
  data() {
    return {
      checkItem: 1,
    };
  },

  components: {
    ItemOne,
    ItemTwo,
    ItemThree,
    ItemFour,
    ItemFive,
    ItemSix,
    ItemSeven,
  },

  computed: {},

  methods: {},
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.app-container {
  background-color: rgb(238, 238, 238);
  .bg-one {
    background-color: rgb(37, 206, 207);
  }
  .bg-two {
    background-color: rgb(79, 191, 232);
  }
  .bg-three {
    background-color: rgb(165, 159, 213);
  }
}
.my-header {
  height: 92px !important;
  //   margin-bottom: 20px;
  .grid-content {
    border-radius: 4px;
    height: 92px;
    display: flex;
    .icon {
      width: 80px;
      height: 100%;
      line-height: 34px;
      display: flex;
      img {
        width: 34px;
        height: 34px;
        display: inline-block;
        margin: auto;
        align-items: center;
        justify-content: center;
      }
    }
    .onePxLine {
      width: 1px;
      height: 59px;
      background-color: white;
      margin: auto 0;
    }
    .text {
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: center;
      margin-left: 20px;
      > span {
        font-size: 14px;
      }
      > span:last-child {
        font-size: 26px;
        font-weight: 100;
      }
    }
  }
}
.my-main {
  //   background-color: #fff !important;
  .btnList {
    padding: 20px 30px;
    background-color: #fff;
    > .my-btn {
      margin: 10px 38px 0 0 !important;
      color: rgb(85, 101, 126);
      background-color: rgb(237, 238, 243);
      border: 0;
      border-radius: 0;
      font-size: 16px;
      &.activeBtn {
        background-color: rgb(25, 185, 155);
        color: white;
        font-weight: 700;
      }
    }
  }
  .detailList {
    min-height: 300px;
    background-color: white;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
// 下面的是啥
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
