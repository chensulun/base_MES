<template>
  <div class="app-container">
    <el-row>
      <el-row>
        <el-col :span="24"></el-col>
      </el-row>
      <!--顶部-->
      <el-row :gutter="20" class="panel-group">
        <el-col :span="6">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <!--<svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
              <img
                src="../../../assets/images/icon_type.png"
                class-name="card-panel-icon"
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ productName || "--" }}
              </div>
              <span class="card-panel-num card-panel-type">生产类型</span>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <!--<svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
              <img
                src="../../../assets/images/icon_temp.png"
                class-name="card-panel-icon"
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ guliaoTemp || "--" }}℃</div>
              <span class="card-panel-num card-panel-temp">骨料温度</span>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ outTemp || "--" }}℃</div>
              <span class="card-panel-num card-panel-temp">出料温度</span>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ weiqiTemp || "--" }}℃</div>
              <span class="card-panel-num card-panel-temp">再生温度</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <!--<svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
              <img
                src="../../../assets/images/icon_num.png"
                class-name="card-panel-icon"
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ productTotal || "--" }} 吨</div>
              <span class="card-panel-num card-panel-n">总产量</span>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ curTotal || "--" }} 吨</div>
              <span class="card-panel-num card-panel-n">当前产量</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <!--中间-->
      <el-row :gutter="20">
        <el-col :span="18">
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="ysb">
                <div class="one">油石比</div>
                <p class="ratiopb">{{ ysb || "--" }}%</p>
                <!--<p class="ratio">{{ysb || "&#45;&#45;"}}%</p>-->
              </div>
            </el-col>
            <el-col :span="20">
              <el-divider content-position="center">设计配比</el-divider>
              <el-table
                v-if="dataShowType === 0"
                :data="lastItemPB"
                border
                style="width: 100%"
              >
                <el-table-column
                  align="center"
                  prop="guanci"
                  label=""
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="one_S"
                  label="仓1"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="two_S"
                  label="仓2"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="three_S"
                  label="仓3"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="four_S"
                  label="仓4"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="five_S"
                  label="仓5"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_S"
                  label="仓6"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="seven_S"
                  label="粉料1"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_1_S"
                  label="粉料2"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="zsl_S"
                  label="再生料"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="eight_S"
                  label="沥青"
                ></el-table-column>
              </el-table>
              <!--任丘-->
              <el-table
                v-if="dataShowType === 1"
                :data="lastItemPB"
                border
                style="width: 100%"
              >
                <el-table-column
                  align="center"
                  prop="guanci"
                  label=""
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="one_S_B"
                  label="仓1"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="two_S_B"
                  label="仓2"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="three_S_B"
                  label="仓3"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="four_S_B"
                  label="仓4"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="five_S_B"
                  label="仓5"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_S_B"
                  label="仓6"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="seven_S_B"
                  label="粉料1"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_1_S_B"
                  label="粉料2"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="zsl_S"
                  label="再生料"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="eight_S"
                  label="沥青"
                ></el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-divider content-position="center">生产看板</el-divider>
              <el-table
                v-if="dataShowType === 0"
                :data="arr"
                border
                height="280"
                style="width: 100%"
              >
                <el-table-column
                  align="center"
                  fixed
                  prop="dateTime"
                  label="时间"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="guanci"
                  label="盘次"
                ></el-table-column>
                <el-table-column align="center" prop="one_S" label="仓1">
                  <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.one_S,
                          'one_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="two_S"
                  label="仓2"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.two_S,
                          'two_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="three_S"
                  label="仓3"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.three_S,
                          'three_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="four_S"
                  label="仓4"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.four_S,
                          'four_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="five_S"
                  label="仓5"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.five_S,
                          'five_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_S"
                  label="仓6"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.six_S,
                          'six_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="seven_S"
                  label="粉料1"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.seven_S,
                          'seven_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_1_S"
                  label="粉料2"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.six_1_S,
                          'six_1_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="zsl_S"
                  label="再生料"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.zsl_S,
                          'zsl_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="eight_S"
                  label="沥青"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.eight_S,
                          'eight_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="ysb"
                  label="油石比"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.ysb,
                          'ysb',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
              </el-table>
              <!--任丘-->
              <el-table
                v-if="dataShowType === 1"
                :data="arr"
                border
                height="280"
                style="width: 100%"
              >
                <el-table-column
                  align="center"
                  fixed
                  prop="dateTime"
                  label="时间"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="guanci"
                  label="盘次"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="one_S_B"
                  label="仓1"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.one_S_B,
                          'one_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="two_S_B"
                  label="仓2"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.two_S_B,
                          'two_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="three_S_B"
                  label="仓3"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.three_S_B,
                          'three_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="four_S_B"
                  label="仓4"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.four_S_B,
                          'four_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="five_S_B"
                  label="仓5"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.five_S_B,
                          'five_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_S_B"
                  label="仓6"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.six_S_B,
                          'six_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="seven_S_B"
                  label="粉料1"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.seven_S_B,
                          'seven_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="six_1_S_B"
                  label="粉料2"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.six_1_S_B,
                          'six_1_S_B',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="zsl_S"
                  label="再生料"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.zsl_S,
                          'zsl_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="eight_S"
                  label="沥青"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.eight_S,
                          'eight_S',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="ysb"
                  label="油石比"
                >
                 <template slot-scope="scope">
                    <div
                      v-html="
                        createHtml(
                          scope.row.ysb,
                          'ysb',
                          scope.row.oneMin,
                          scope.row.oneMax
                        )
                      "
                    /> </template
                ></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div style="overflow: hidden" class="video">
            <h2 style="text-align: center">出料口视频</h2>
            <video
              v-if="videoShow"
              class="video1"
              ref="hlsVideo"
              controls
              preload="true"
            ></video>
            <div
              style="
                width: 100%;
                height: 1.5rem;
                background: #000000;
                position: absolute;
                bottom: 0;
              "
            ></div>
          </div>
        </el-col>
      </el-row>
      <!--尾部-->
      <el-row :gutter="20">
        <el-col :span="8">
          <h2 style="color: #5bc450">油石比（%）</h2>
          <line-chart ref="oneChart" :chart-data="ysbChartData" />
        </el-col>
        <el-col :span="8">
          <h2 style="color: #5bc450">温度（%）</h2>
          <line-chart ref="twoChart" :chart-data="tempChartData" />
        </el-col>
        <el-col :span="8">
          <h2 style="color: #5bc450">仓1配比（%）</h2>
          <line-chart ref="threeChart" :chart-data="c1ChartData" />
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Hls from "hls.js";
import LineChart from "../../dashboard/LineChart";
import { getEquipment, getEquipmentWS, getMS, getPeId } from "@/utils/station";
import { modelList } from "@/api/production/dynamicTable";

export default {
  name: "index",
  components: { LineChart },
  comments: {
    LineChart,
  },
  data() {
    return {
      videoShow: true,
      hls: "",
      socketPath: null,
      socket: null,
      //生产类型
      productName: null,
      //骨料温度
      guliaoTemp: null,
      //出料温度
      outTemp: null,
      //尾气温度
      weiqiTemp: null,
      //总产量
      productTotal: null,
      //当前产量
      curTotal: null,
      //配比
      lastItemPB: [],
      //油石比
      ysb: null,
      rate: null,
      //生产看板
      productList: [],
      //油石比
      ysbChartData: {
        name: "油石比",
        xData: [],
        yData: [],
      },
      //温度
      tempChartData: {
        name: "温度",
        xData: [],
        yData: [],
      },
      //仓1
      c1ChartData: {
        name: "仓1配比",
        xData: [],
        yData: [],
      },
      //数据展示类型 1:任丘
      dataShowType: 0,
      //质量参数表
      modelList: [],
      //动态表数据处理后
      arr: [],
    };
  },
  methods: {
    //数据展示类型
    initDataShowType() {
      let msName = getMS();
      let equipmentName = getEquipment();
      if (msName.indexOf("任丘") !== -1) {
        this.dataShowType = 1;
      }
    },
    /** WebSocket*/
    init: function () {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        if (!this.socketPath) {
          this.msgSuccess("ws地址为空");
          return;
        }
        // 实例化socket
        this.socket = new WebSocket(this.socketPath);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open: function () {
      console.log("socket连接成功");
    },
    error: function () {
      console.log("连接错误");
    },
    getMessage: function (msg) {
      console.log("接收数据---------------------------------------");
      let data = JSON.parse(msg.data);
      if (data.productName) {
        this.productName = data.productName;
      }
      if (data.guliaoTemp) {
        this.guliaoTemp = data.guliaoTemp;
      }
      if (data.outTemp) {
        this.outTemp = data.outTemp;
      }
      if (data.weiqiTemp) {
        this.weiqiTemp = data.weiqiTemp;
      }
      if (data.productTotal) {
        this.productTotal = data.productTotal;
      }
      if (data.curTotal) {
        this.curTotal = data.curTotal;
      }
      if (data.lastItemPB) {
        const pbd = JSON.parse(JSON.stringify(data.lastItemPB));
        const pb = data.lastItemPB;
        this.lastItemPB = [];
        pbd.guanci = "配比单";
        this.lastItemPB.push(pbd);
        this.lastItemPB.push(pb);
        this.ysb = Number(pbd.ysb).toFixed(2);
      }
      if (data.productList) {
        this.productList = data.productList;

        //仓1配比曲线
        this.c1ChartData.xData = data.productList.map(function (index, value) {
          return index.date + "  " + index.dateTime;
        });
        this.c1ChartData.yData = data.productList.map(function (index, value) {
          return data.lastItemPB.one / index.one;
        });
        this.getModelList(data.productName);
      }
      // 油石比
      if (data.rate) {
        if (data.change) {
          this.rate = data.productList;
        } else {
          if (this.rate) {
            this.rate = data.productList.concat(this.rate);
          } else {
            this.rate = data.productList;
          }
        }
        //油石比曲线
        this.ysbChartData.xData = this.rate.map(function (index, value) {
          return index.date + "  " + index.dateTime;
        });
        this.ysbChartData.yData = this.rate.map(function (index, value) {
          return index.ysb;
        });
        this.ysbChartData.xData.sort();
        this.ysbChartData.yData.sort();
      }
      //温度曲线
      if (data.outTList && data.outTList.length > 0) {
        let initXdata1 = data.outTList.map(function (index, value) {
          return index.outDate;
        });

        let initYdata1 = data.outTList.map(function (index, value) {
          return index.out;
        });
        this.tempChartData.xData = this.tempChartData.xData.concat(initXdata1);
        this.tempChartData.yData = this.tempChartData.yData.concat(initYdata1);
      } else if (data.outTemp) {
        // 温度曲线
        if (this.tempChartData.xData.length > 80) {
          this.tempChartData.xData.shift();
          this.tempChartData.yData.shift();
        }
        this.tempChartData.xData.push(data.date);
        this.tempChartData.yData.push(data.outTemp);
      }
    },
    /*参数列表*/
    getModelList(productName) {
      var that = this;
      let peId = getPeId();
      // var data = { qpType: 0, peProductionType: 'AC-16' }
      var data = { qpType: 0, peId: peId, peProductionType: productName };
      modelList(data).then((response) => {
        that.modelList = response.rows;
        if (that.modelList.length > 0) {
          for (let j = 0; j < that.productList.length; j++) {
            var c = { ...that.productList[j], ...that.modelList[0] };
            that.productList[j] = c;
          }
        }
        that.arr = that.productList;
      });
    },
    /*变色*/
    createHtml(value, name, min, max) {
      console.log(value, num, min, max);
      var num = this.lastItemPB[0][name];
      var item = value - num;
      if (min && max) {
        if (item > max) {
          return `<div style="color:red">${value}</div>`;
        } else if (item < min) {
          return `<div style="color:blue">${value}</div>`;
        } else {
          return `<div>${value}</div>`;
        }
      } else {
        return `<div>${value}</div>`;
      }
    },
    send: function () {
      this.socket.send("");
    },
    close: function () {
      console.log("socket已经关闭");
    },
    destroyHls: function () {
      if (this.hls) {
        this.$refs.hlsVideo.pause();
        this.hls.destroy();
        this.hls = null;
      }
    },
    loadVideoFn: function () {
      if (Hls.isSupported()) {
        this.hls = new Hls();
        this.hls.loadSource(
          "http://aldirect.hls.huya.com/huyalive/28466698-2689656864-11551988268341919744-2847699194-10057-A-0-1_1200.m3u8"
        ); // CCTV1直播源
        this.hls.attachMedia(this.$refs.hlsVideo);
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("加载成功");
          this.$refs.hlsVideo.play();
        });
        this.hls.on(Hls.Events.ERROR, (event, data) => {
          // console.log(event, data);
          // 监听出错事件
          this.videoShow = false;
          console.log("加载失败");
        });
      }
    },
  },
  created: function () {
    let ws = getEquipmentWS();
    let _this = this;
    this.socketPath = ws + "/product";
    _this.$once("hook:beforeDestroy", () => {
      _this.destroyHls();
    });
    this.initDataShowType();
  },

  mounted() {
    let _this = this;
    //加载视频
    _this.loadVideoFn();
    _this.init();
    // window.setTimeout(function(){
    //   this.yData = _this.lineChartData.actualData;
    // }, 5000);
    /*      setInterval(function () {
              _this.chartData.yData.push(Math.ceil(Math.random() * 100));
              _this.chartData.yData.shift();
              console.log(_this.chartData.yData);
            }, 5000);*/
  },
  destroyed() {
    // 销毁监听
    this.socket.close();
    this.socket.onclose = this.close;
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 150px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;

      margin: 30px;
      margin-left: 30px;

      .card-panel-text {
        line-height: 50px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
        font-weight: bold;
      }

      .card-panel-num {
        font-size: 18px;
      }

      .card-panel-type {
        color: #ffba00;
      }

      .card-panel-temp {
        color: #00afff;
      }

      .card-panel-n {
        color: #f4516c;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.el-divider__text {
  color: #37c375 !important;
  font-size: 25px !important;
}

.ysb {
  /*line-height: 10px;*/
  /*float: left;*/
  /*margin: 0 0 0 30%;*/
  /*width: 70%;*/
  /*text-align: center;*/
  /*font-size: 20px;*/
  /*background-color: #F2F6FC;*/
  /*.one {*/
  /*  line-height: 100px;*/
  /*  height: 100px;*/
  /*  background-color: #67C23A;*/
  /*  color: #ffffff;*/
  /*}*/
  height: 11.5rem !important;
  width: 8.7rem;
  border: 0.05rem solid #eff2f5;
  border-radius: 0.2rem;
  overflow: hidden;
  background: #fff;
  float: right;

  .one {
    height: 6.3rem;
    line-height: 6.3rem;
    font-size: 1.3rem;
    background: #5bc450;
    text-align: center;
    color: #fff;
  }

  .ratiopb {
    height: 0.1rem;
    font-size: 1.5rem;
    line-height: 2.8rem;
    color: #202b3d;
    text-align: center;
  }

  .ratio {
    height: 0.1rem;
    line-height: 3.8rem;
    border-top: 1px solid #f2f2f2;
    font-size: 1.5rem;
    color: #202b3d;
    text-align: center;
  }
}

.video1 {
  /*overflow: hidden;
    position: relative;*/
  width: 100%;
  height: 100%;
  border: none;
}

.video h2 {
  width: 100%;
  height: 4rem;
  border-radius: 0.5rem 0.5rem 0 0;
  background: #202b3d;
  color: #00cab0;
  font-size: 0.8rem;
  line-height: 4rem;
  text-align: center;
}
</style>
