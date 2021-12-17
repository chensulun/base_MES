<template>
  <div class="container">
    <div class="f1">
      <div>
        <div>
          <span>展示模式：</span>
          <el-select v-model="viewItem" size="mini" placeholder="请选择">
            <el-option
              v-for="item in viewItems"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <span>日期段：</span>
          <el-date-picker
            v-model="queryParams.date"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="cleanForm"
          >
          </el-date-picker>
        </div>
        <div>
          <span>工程项目名称：</span>
          <el-select
            v-model="queryParams.project"
            size="mini"
            placeholder="请选择"
            @change="getEquipment"
          >
            <el-option
              v-for="item in project"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <!-- <div>
          <span>设备：</span>
          <el-select
            v-model="queryParams.equipment"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div> -->
      </div>
      <div>
        <div>
          <span>运动模式：</span>
          <el-select v-model="info.ids" size="mini" placeholder="请选择">
            <el-option
              v-for="item in draw"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <span>车辆模式：</span>
          <el-select v-model="info.lei" size="mini" placeholder="请选择">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button type="success" class="mybtn" @click="doSomething"
          >绘制</el-button
        >
      </div>
    </div>

    <div class="f2">
      <!--3D-->
      <div class="f2-1">
        <div class="myiframe">
          <iframe
            id="iframe3D"
            width="100%"
            height="100%"
            src="https://www.kantu3d.com/demo/2110/ylj/"
            frameborder="0"
          ></iframe>
          <div class="pic">
            <div>
              <p>图例</p>
              <ul>
                <li class="li1">
                  <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                    <li>7</li>
                    <li>8</li>
                    <li>9</li>
                    <li>10</li>
                  </ul>
                </li>
                <li class="li2">
                  <ul>
                    <li style="background-color: #f2e1c3; color: #f2e1c3">1</li>
                    <li style="background-color: #f0d6c7; color: #f0d6c7">1</li>
                    <li style="background-color: #ffeb3c; color: #ffeb3c">1</li>
                    <li style="background-color: #ffd507; color: #ffd507">1</li>
                    <li style="background-color: #ff9801; color: #ff9801">1</li>
                    <li style="background-color: #ff5821; color: #ff5821">1</li>
                    <li style="background-color: #d12324; color: #d12324">1</li>
                    <li style="background-color: #8e1f01; color: #8e1f01">1</li>
                    <li style="background-color: #516601; color: #516601">1</li>
                    <li style="background-color: #006634; color: #006634">1</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <p>桩号</p>
              <el-switch v-model="state" @change="spriteOrHiden"> </el-switch>
            </div>
          </div>
        </div>
        <div class="otherInfo">
          <div class="otherInfo-1">
            <h1>气象信息</h1>
            <p>温度：{{ weather.hj_wendu || "--" }}</p>
            <p>湿度：{{ weather.hj_shidu || "--" }}</p>
            <p>风速：{{ weather.hj_fengsu || "--" }}</p>
          </div>
          <div class="otherInfo-2">
            <h1>作业设备</h1>
            <div class="otherInfo-2-1">
              <div v-for="(i, p) of equipment" :key="p">
                <img
                  src="../../../assets/images/shebei.png"
                  alt=""
                  v-show="i.type == '压路机'"
                />
                <img
                  src="../../../assets/images/shebei2.png"
                  alt=""
                  v-show="i.type == '摊铺机'"
                />
                <p>名称：{{ i.name }}</p>
                <p>设备编号：{{ i.code }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
var moment = require("moment");
export default {
  data() {
    return {
      queryParams: {
        date: [],
        project: null,
        // equipment: null,
      },
      project: [],
      type: [
        {
          value: "摊铺机",
          label: "摊铺机",
        },
        {
          value: "压路机",
          label: "压路机",
        },
      ],
      draw: [
        {
          value: "fast",
          label: "正常历史回顾",
        },
        {
          value: "speed",
          label: "速度模式",
        },
        {
          value: "shake",
          label: "震动模式",
        },
        {
          value: "temperature",
          label: "温度模式",
        },
      ],
      equipment: [],
      weather: {
        hj_wendu: null,
        hj_shidu: null,
        hj_fengsu: null,
      },
      state: true,
      info: {
        data: [],
        ids: "",
        times: 20,
        lei: "",
      },
      viewItem: "实时展示",
      viewItems: [
        { label: "实时展示", value: "实时展示" },
        { label: "施工回看", value: "施工回看" },
      ],
    };
  },
  mounted() {
    this.getProject();
    window.addEventListener("message", function (event) {
      if (event.data.sceneDone) {
        console.log("场景加载完成");
      }
    });
  },
  methods: {
    cleanForm() {
      this.queryParams.project = null;
      // this.queryParams.equipment = null;
    },
    getProject() {
      axios({
        method: "get",
        url: "https://test.zgdrkj.cn:9443/CjManager//sysConstruction/getProjectList1?zhandianId=5",
      })
        .then((res) => {
          this.project = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getEquipment() {
      axios({
        method: "get",
        url:
          "https://test.zgdrkj.cn:9443/CjManager//sysConstruction/getSbList?projectId=" +
          this.queryParams.project,
      })
        .then((res) => {
          this.equipment = res.data.data;
          this.getWeather();
          this.getData();
          console.log(this.equipment);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getWeather() {
      axios({
        method: "get",
        url:
          "https://test.zgdrkj.cn:9443/CjManager//sysConstruction/getWeather?projectId=" +
          this.queryParams.project,
      })
        .then((res) => {
          this.weather = {
            hj_wendu: null,
            hj_shidu: null,
            hj_fengsu: null,
          };
          if (res.data.data) {
            this.weather = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getData() {
      var startTime = moment(this.queryParams.date[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      var endTime = moment(this.queryParams.date[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      var sbCodes = "";
      var arr = [];
      for (let i = 0; i < this.equipment.length; i++) {
        arr.push(this.equipment[i].code);
      }
      sbCodes = arr.join("&sbCodes[]=");
      console.log(sbCodes);

      var url =
        "https://test.zgdrkj.cn:9443/CjManager//sysConstruction/getLocation2?sbCodes[]=" +
        sbCodes +
        "&projectId=" +
        this.queryParams.project +
        "&startTime=" +
        startTime +
        "&endTime=" +
        endTime;
      console.log(url);
      axios({
        method: "get",
        url: encodeURI(url),
      })
        .then((res) => {
          this.info.data = [];
          this.info.data = res.data.data;
          console.log(this.info.data[0].type);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //清空场景
    claerView() {
      console.log("清空场景");
      document
        .getElementById("iframe3D")
        .contentWindow.postMessage({ claerView: true }, "*");
    },
    //历史数据回顾
    feedAjax() {
      if (document.getElementById("iframe3D")) {
        console.log("历史数据接口");
        if (this.info.data.length > 0) {
          alert("绘制中, 请稍后");
          document.getElementById("iframe3D").contentWindow.postMessage(
            {
              feedAjax: {
                data: this.info.data,
                rts: this.info.ids,
                type: this.info.data[0].type,
                index: 0,
                times: 20,
                lei: this.info.lei,
              },
            },
            "*"
          );
        } else {
          alert("数据加载中或暂无数据, 请稍后重试");
        }
      }
    },
    //实时接口对接
    newDataFun() {
      if (document.getElementById("iframe3D")) {
        console.log("实时数据接口");
        if (this.info.data.length > 0) {
          alert("绘制中, 请稍后");
          document.getElementById("iframe3D").contentWindow.postMessage(
            {
              newDataFun: {
                data: this.info.data,
                ids: this.info.ids,
                times: 20,
                lei: this.info.lei,
              },
            },
            "*"
          );
        } else {
          alert("数据加载中或暂无数据, 请稍后重试");
        }
      }
    },
    //桩号显示隐藏
    spriteOrHiden() {
      if (document.getElementById("iframe3D")) {
        console.log("桩号--" + typeof this.state + this.state);
        document.getElementById("iframe3D").contentWindow.postMessage(
          {
            spriteOrHiden: {
              type: this.state,
            },
          },
          "*"
        );
      }
    },

    //doSomething
    doSomething() {
      this.claerView();
      setTimeout(() => {
        this.feedAjax();
      }, 2000);
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

    > div {
      display: flex;
      flex-wrap: nowrap;
      // justify-content: space-around;
      align-items: center;
      height: 60px;
      margin: 20px;
      > div {
        margin-right: 50px;
      }
    }

    align-items: center;
    background-color: white;

    .mybtn {
      margin-left: 20px;
    }
  }

  .f2 {
    margin-top: 20px;
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 40px;
    background-color: white;

    &:before {
      content: " ";
      display: table;
    }

    > div {
      margin: 20px;
    }

    .f2-1 {
      width: 100%;
      display: flex;
      .myiframe {
        display: inline-block;
        height: 800px;
        width: 80%;
        position: relative;
        .pic {
          p {
            margin: 0;
            margin-bottom: 10px;
            border-bottom: 2px solid #eee;
            line-height: 30px;
          }
          display: flex;
          text-align: center;
          position: absolute;
          top: 20px;
          right: 50px;
          background-color: white;
          border-radius: 5px;
          padding: 10px;
          > div {
            margin-left: 20px;
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
              .li1,
              .li2 {
                ul li {
                  display: inline-block;
                  width: 20px;
                }
              }
            }
          }
        }
      }
      .otherInfo {
        margin-left: 20px;
        width: 16%;
        // height: 800px;
        display: inline-block;
        h1{
          font-weight: bold;
          font-size: 24px;
        }
        // flex: 1;
        .otherInfo-2 {
          .otherInfo-2-1 {
            height: 600px;
            overflow: hidden;
            overflow-y: visible;
            img {
              width: 200px;
            }
          }
        }
      }
    }
  }
}
</style>
