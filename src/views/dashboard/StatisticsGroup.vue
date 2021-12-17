<template>
  <el-row id="consoleLink">
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="console-link-block">
        <div class="console-pandding">
          <div class="console-name">生产量<span>单位：吨</span></div>
          <div class="console-link-block-band" id="produceTotal">{{produceTotal}}</div>
          <div class=" console-nam2">排名：1<a class="console-color">查看</a></div>
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="console-link-block">
        <div class="console-pandding">
          <div class="console-name">发货量<span>单位：吨</span></div>
          <div class="console-link-block-band" id="shipmentTotal">{{shipmentTotal}}</div>
          <div class=" console-nam2">排名：1<a class="console-color1">查看</a></div>
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="console-link-block">
        <div class="console-pandding">
          <div class="console-name">异常量<span>单位：个</span></div>
          <div class="console-link-block-band">{{errorTotal}}</div>
          <div class=" console-nam2">排名：1<a class="console-color2">查看</a></div>
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="console-link-block">
        <div class="console-pandding">
          <div class="console-name">站点<!--<span  >更多</span>--></div>
          <div class="console-link-block-band layui-clear" style="font-size: 1.05vw;">
            <el-row :gutter="3">
              <el-col v-for="(item,index) in mixingStationList" :span="8"><span>{{item.msName}}</span></el-col>
            </el-row>
          </div>
          <div class="console-nam2" style="margin: 0">
            <el-date-picker
              style="width:100%"
              v-model="value2"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {indexData} from "@/api/production/statisticsGroup";
  import {listMixingStationByRole} from "@/api/manage/mixingStation";
  import {getEquipmentUrl} from '@/utils/station'

  export default {
    comments: {
      CountTo
    },
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value2: '',
        errorTotal: 0,
        produceTotal: 0,
        shipmentTotal: 0,
        mixingStationList: []
      }
    },
    created() {
      this.getMixingStationList();
      this.indexData();
    },
    methods: {
      indexData() {
        let _this = this;
        let url = getEquipmentUrl();
        if (!url) {
          setTimeout(function () {
            _this.indexData();
          }, 1000);
          return;
        }
        indexData(null).then(response => {
          if (response.obj) {
            this.errorTotal = response.obj.errorTotal;
            this.produceTotal = response.obj.produceTotal;
            this.shipmentTotal = response.obj.shipmentTotal;
          }
        });
      },
      /** 查询站点信息列表 */
      getMixingStationList() {
        listMixingStationByRole(null).then(response => {
          this.mixingStationList = response.rows;
        });
      }
    }
  }
</script>

<style scoped>


  /** 统计快捷方式样式 */
  html {
    font-size: 62.5%;
  }

  .console-link-block {
    display: block;
    position: relative;
    color: #fff;
    font-size: 18px;
    /*padding: 25px 20px;*/
    border-radius: 4px;
    overflow: hidden;
    /*box-shadow: 0px 3px 5px rgba(0, 0, 0, .1);*/
    /*background-color: rgb(155, 197, 57);*/
  }

  .console-link-block .console-name {
    font-size: 16px;
    margin-bottom: 10px;
    padding: 16px 0;
    position: relative;
  }

  .console-link-block .console-name span {
    position: absolute;
    right: 20px;
  }

  .console-link-block-band {
    /*font-size: 3.6rem;*/
    font-size: 1.875vw;
    font-weight: bold;

  }

  .console-link-block .console-link-block-icon {
    height: 70px;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }


  /** //统计快捷方式样式end */

  /** 小屏幕下样式 */
  @media screen and (max-width: 992px) {
    .console-pandding {
      padding: 20px 53px !important;
    }

  }

  /** 设置每个快捷块的颜色 */
  #consoleLink > div:first-child .console-link-block {
    background: url("../../assets/images/in.png") no-repeat center;
    background-size: 100% 100%;
  }

  #consoleLink > div:nth-child(2) .console-link-block {
    background: url("../../assets/images/in2.png") no-repeat center;
    background-size: 100% 100%;
  }

  #consoleLink > div:nth-child(3) .console-link-block {
    background: url("../../assets/images/in3.png") no-repeat center;
    background-size: 100% 100%;
  }

  #consoleLink > div:nth-child(4) .console-link-block {
    background: url("../../assets/images/in4.png") no-repeat center;
    background-size: 100% 100%;
  }

  .console-pandding {
    padding: 11px 2.083vw;
  }

  .console-nam2 a {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 76px;
    height: 26px;
    background: rgba(255, 255, 255, 1);
    border-radius: 13px;
    display: block;
    text-align: center;
    line-height: 26px;
    font-size: 14px;
  }

  .console-color {
    color: #5974F7
  }

  .console-nam2 {
    font-size: 16px;
    margin-bottom: 10px;
    padding: 25px 0;
    position: relative;
  }

  .console-color1 {
    color: #208CFB;
  }

  .console-color2 {
    color: #E65258;
  }

  th {
    color: #333;
    font-size: 16px !important;
  }


  input::-webkit-input-placeholder {
    color: #aab2bd;
    font-size: 0.9375vw;
  }

  input::placeholder {
    color: #25BF7C !important;
    font-size: 1vw;
  }

</style>
