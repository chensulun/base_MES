<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="19">
        <baidu-map
          :center="center"
          @click="getClickInfo"
          :zoom="17"
          class="bm-view"
          :scroll-wheel-zoom="true"
        >
          <!--比例尺控件-->
          <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
          <!--缩放控件-->
          <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
          <!--内容-->
          <bm-control :offset="{ width: '10px', height: '10px' }">
            <bm-auto-complete v-model="keyword" :sug-style="{ zIndex: 999999 }">
              <el-input
                v-model="keyword"
                type="text"
                placeholder="请输入地名关键字"
                clearable
              >
                <i slot="prefix" class="el-input__icon el-icon-search" />
              </el-input>
            </bm-auto-complete>
          </bm-control>
          <!--搜索插件-->
          <bm-local-search
            :keyword="keyword"
            :auto-viewport="true"
            :panel="false"
          />
          <!--标点-->
          <bm-marker
            :position="msCenter"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
          >
            <bm-label
              content="搅拌站"
              :labelStyle="{ color: 'red', fontSize: '16px' }"
              :offset="{ width: -18, height: 20 }"
            />
          </bm-marker>
          <!--车辆标点-->
          <div v-for="(marker, index) in vehicleList" :key="index">
            <bm-marker
              :position="{ lng: marker.location.lng, lat: marker.location.lat }"
              :dragging="false"
              :icon="{ url: carIcon, size: { width: 33, height: 21 } }"
              @click="infoWindowOpen(marker)"
            >
              <bm-label
                :content="marker.carNo"
                :labelStyle="{ color: 'red', fontSize: '13px' }"
                :offset="{ width: 32, height: -1 }"
              />

              <bm-info-window
                style="font-size: 12px"
                @close="infoWindowClose(marker)"
                :show="marker.showFlag"
              >
                <!-- @open="infoWindowOpen(marker)" -->
                <p style="font-weight: bold">车辆号码:{{ marker.carNo }}</p>
                <p>运输项目:{{ marker.projectName }}</p>
                <p>运输类型:{{ marker.CompressiveStrength }}</p>
                <p>
                  运输状态:<span v-if="marker.transport === 1">运输中</span
                  ><span v-if="marker.transport !== 1">已停止</span>
                </p>
                <p>电量:{{ marker.power }}</p>
                <p>车辆位置:{{ marker.address }}</p>
              </bm-info-window>
            </bm-marker>
          </div>
        </baidu-map>
      </el-col>
      <el-col :span="5">
        <el-form ref="form" label-width="80px" size="mini">
          <el-form-item label="站点">
            <el-select
              v-model="msId"
              disabled
              placeholder="请选择站点"
              clearable
              size="small"
            >
              <el-option
                v-for="item in mixingStationList"
                :key="item.msId"
                :value="item.msId"
                :label="item.msName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目">
            <el-select
              v-model="queryParams.project"
              filterable
              placeholder="请选择项"
              @change="getList"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in projectList"
                :key="dict.projectName"
                :label="dict.projectName"
                :value="dict.projectName"
              />
            </el-select>
          </el-form-item>
          <el-input
            size="mini"
            v-model="address"
            style="width: 51%; margin-left: 40px"
          ></el-input
          >&nbsp;
          <el-button size="mini" @click="bindProject" type="success"
            >确定
          </el-button>

          <ul class="car-list" style="min-height: 583px">
            <li
              v-for="(item, index) in vehicleList"
              :key="index"
              @click="carListClick(item)"
              :class="{ active: active == item.carNo }"
            >
              {{ item.carNo }}
            </li>
          </ul>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  list,
  projectList,
  pushProject,
} from "@/api/production/vehicleAllocation";
import { locationList } from "@/api/production/transportationDistance";
import { listMixingStation } from "@/api/manage/mixingStation";
import { getMSId } from "@/utils/station";
import carIcon from "@/assets/images/icon_car.png";
import Cookies from "js-cookie";

export default {
  name: "index",
  data() {
    return {
      //地图属性
      center: { lng: 0, lat: 0 },
      msCenter: { lng: 0, lat: 0 },
      pushCenter: { lng: 0, lat: 0 },
      //关键词
      keyword: null,
      //项目列表
      projectList: [],
      //车料列表
      vehicleList: [],
      //站点列表
      mixingStationList: [],
      //站点id
      msId: null,
      carIcon: carIcon,
      //地址
      address: null,
      // 查询参数
      queryParams: {
        project: null,
      },
      //ui-li选中
      active: "",
    };
  },
  mounted() {
    this.msId = Number(getMSId());
    this.getMixingStationList();
    this.geProjectList();
    this.getList();
  },
  methods: {
    bindProject() {
      this.$confirm("只有一次设置终点机会，确定要设置吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let pushData = {
          projectname: this.queryParams.project,
          end: this.address,
          jingdu: this.pushCenter.lng,
          weidu: this.pushCenter.lat,
        };
        pushProject(pushData).then((response) => {
          this.msgSuccess("操作成功");
        });
      });
    },
    //车辆列表点击
    carListClick(car) {
      console.log(car);
      this.active = car.carNo;
      this.center.lng = car.location.lng;
      this.center.lat = car.location.lat;
    },
    infoWindowClose(marker) {
      marker.showFlag = false;
      console.log("关闭bm-info-window", marker);
    },
    infoWindowOpen(marker) {
      marker.showFlag = true;
      console.log("开启bm-info-window", marker);
    },
    /** 查询站点信息列表 */
    getMixingStationList() {
      listMixingStation(null).then((response) => {
        this.mixingStationList = response.rows;
        this.mixingStationList.forEach((item) => {
          if (this.msId === item.msId) {
            this.center.lat = item.msLat;
            this.center.lng = item.msLng;
            this.msCenter.lat = item.msLat;
            this.msCenter.lng = item.msLng;
          }
        });
      });
    },
    /** 查询项目列表 */
    geProjectList() {
      let q = { last48h: 1 };
      projectList(q).then((response) => {
        this.projectList = response.list;
      });
    },
    /** 查询车辆列表 */
    getList() {
      if (this.queryParams.project) {
        this.queryParams.last48h = 1;
      }
      locationList(this.queryParams).then((response) => {
        var station = Cookies.get("mixingStation");
        this.vehicleList = response.list;
        this.vehicleList.forEach((item) => {
          if (station == "彭山站" || station == "金堂站") {
            item.location.lng /= 600000;
            item.location.lat /= 600000;
          }
          item.showFlag = false;
        });
        console.log(this.vehicleList);
      });
    },
    /** *
     * 地图点击事件。
     */
    getClickInfo(e) {
      let _this = this;
      this.pushCenter.lng = e.point.lng;
      this.pushCenter.lat = e.point.lat;
      let gc = new BMap.Geocoder();
      let point = new BMap.Point(e.point.lng, e.point.lat);
      gc.getLocation(point, function (res) {
        _this.address = res.address;
      });
    },
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style lang="scss" scoped>
.bm-view {
  width: 100%;
  height: 720px;
}

.car-list {
  margin-left: 38px;
  overflow: auto;
  background: #f7f7f7;
  border: 1px solid #dddddd;
  max-height: 356px !important;
  width: 70%;
  position: relative;
  top: 16px;
  margin-top: auto !important;
  list-style-type: none;
  padding: 0;
}

.car-list li {
  height: 2.15rem;
  line-height: 2.15rem;
  font-size: 0.7rem;
  text-align: center;
  border-bottom: 0.05rem solid #e4e5e7;
}

.car-list li:hover {
  background: #25ffbe;
}

.active {
  background-color: #25ffbe;
}
</style>
