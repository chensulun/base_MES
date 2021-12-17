<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="日期">
        <el-date-picker
          v-model="daterangeCreateTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getProjectList"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="选择项目" prop="project">
        <el-select
          v-model="queryParams.project"
          style="width: 120px"
          @change="getLocationList"
          placeholder="选择项目"
        >
          <el-option
            v-for="item in projectList"
            :key="item.projectName"
            :value="item.projectName"
            :label="item.projectName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号" prop="">
        <el-select
          v-model="queryParams.carno"
          style="width: 120px"
          placeholder="选择类型"
        >
          <el-option
            v-for="item in locationList"
            :key="item.carNo"
            :value="item.carNo"
            :label="item.carNo"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableList">
      <el-table-column label="车牌" align="center" prop="carNo" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column
        label="运输类型"
        align="center"
        prop="CompressiveStrength"
      />
      <el-table-column label="运距(米)" align="center" prop="total" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="info" @click="showLocation(scope.row)" plain
            >查看轨迹</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改站点信息对话框 -->
    <el-dialog
      title="轨迹回放"
      :visible.sync="locationOpen"
      width="800px"
      append-to-body
       :close-on-click-modal="false"
    >
      <baidu-map
        :center="center"
        :zoom="14"
        class="bm-view"
        :scroll-wheel-zoom="true"
      >
        <!--比例尺控件-->
        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
        <!--缩放控件-->
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
        <!--轨迹插件-->
        <bm-polyline
          :path="locationPath"
          stroke-color="blue"
          :stroke-opacity="0.5"
          :stroke-weight="2"
          :editing="false"
        ></bm-polyline>
      </baidu-map>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  projectList,
  locationList,
} from "@/api/production/transportationDistance";
import moment from "moment";

export default {
  //运距管理
  name: "index",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 时间范围
      daterangeCreateTime: [
        moment(new Date()).format("YYYY-MM-DD"),
        moment(new Date()).format("YYYY-MM-DD"),
      ],
      // 总条数
      total: 0,
      // 动态表数据
      tableList: [],
      //项目列表
      projectList: [],
      //定位数据
      locationList: [],
      //生产类型列表
      //坐标弹框
      locationOpen: false,
      //回放轨迹
      locationPath: [],
      center: { lat: 0, lng: 0 },
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        startTime: null,
        endTime: null,
        project: null,
        carno: null,
        token:
          "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbmlzdHJhdG9yIiwicGhvbmVudW1iZXIiOiIxODYwMjM5ODM4NSIsInVzZXJpZCI6IjEiLCJpYXQiOjE2Mjk3MDI2ODcsImp0aSI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIn0.v5fsAt05Ky18hCXBhMxrkpRCp6HbjuQQVIzclLvpR5o",
      },
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    showLocation(row) {
      console.log(row)
      this.locationOpen = true;
      this.locationPath = row.locations;
      if (this.locationPath.length > 0) {
        this.center =
          // this.locationPath[Math.ceil(this.locationPath.length / 2)];
          this.locationPath[Math.ceil(this.locationPath.length/2)];
      }
    },
    /**车牌数据*/
    getLocationList() {
      let query = {
        beginDate: "",
        endDate: "",
        project: this.queryParams.project,
        last48h: 1,
      };
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        query.beginDate = this.daterangeCreateTime[0];
        query.endDate = this.daterangeCreateTime[1];
      }
      console.log(query);
      locationList(query).then((response) => {
        this.locationList = response.list;
      });
    },
    /**查询项目列表*/
    getProjectList() {
      let query = { beginDate: "", endDate: "" };
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        query.beginDate = this.daterangeCreateTime[0];
        query.endDate = this.daterangeCreateTime[1];
      }
      projectList(query).then((response) => {
        this.projectList = response.list;
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      console.log(this.daterangeCreateTime);
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.startTime = this.daterangeCreateTime[0];
        this.queryParams.endTime = this.daterangeCreateTime[1];
      }
      list(this.queryParams).then((response) => {
        response.list.forEach((item) => {
          // item.locations.forEach((e) => {
          //   e.lat /= 600000;
          //   e.lng /= 600000;
          // });
        });
        this.tableList = response.list;
        this.total = response.num;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.bm-view {
  width: 100%;
  height: 600px;
}
</style>
