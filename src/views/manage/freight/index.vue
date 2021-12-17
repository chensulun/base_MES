<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manage:freight:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:freight:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:freight:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['manage:freight:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" style="top: 30px" :data="freightList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="freightId"/>
      <el-table-column label="项目名称" align="center" prop="projectName"/>
      <el-table-column label="目标经度" align="center" prop="freightLng"/>
      <el-table-column label="目标纬度" align="center" prop="freightLat"/>
      <el-table-column label="车队" align="center" prop="fleetName"/>
      <el-table-column label="车队联系人" align="center" prop="fleetContacts"/>
      <el-table-column label="车队联系电话" align="center" prop="fleetPhone"/>
      <el-table-column label="运输单价" align="center" prop="freightUnitPrice"/>
      <el-table-column label="规划运距" align="center" prop="freightTransportationDistanceOne"/>
      <el-table-column label="约定运距" align="center" prop="freightTransportationDistanceTwo"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:freight:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:freight:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改运费对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="24">
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="form.projectId" placeholder="请选择" @change="projectSelectChange" style="width: 100%">
                <el-option
                  v-for="item in projectList"
                  :key="item.projectId"
                  :value="item.projectId"
                  :label="item.projectName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目位置" prop="freightLng">
              <el-button type="success" icon="el-icon-s-tools" size="mini" @click="openLocation" round>位置查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="经度" prop="freightLng">
              <el-input readonly v-model="form.freightLng" placeholder="请输入经度"/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="纬度" prop="freightLat">
              <el-input readonly v-model="form.freightLat" placeholder="请输入纬度"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划运距" prop="freightTransportationDistanceOne">
              <el-input readonly v-model="form.freightTransportationDistanceOne" placeholder="请输入规划运距"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="约定运距" prop="freightTransportationDistanceTwo">
              <el-input v-model="form.freightTransportationDistanceTwo" placeholder="请输入约定运距"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车队" prop="fleetId">
              <el-select v-model="form.fleetId" placeholder="请选择" @change="fleetSelectChange" style="width: 100%">
                <el-option
                  v-for="item in fleetList"
                  :key="item.fleetId"
                  :value="item.fleetId"
                  :label="item.fleetName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="fleetContacts">
              <el-input readonly v-model="form.fleetContacts" placeholder="请输入车队联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="fleetPhone">
              <el-input readonly v-model="form.fleetPhone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输单价" prop="freightUnitPrice">
              <el-input v-model="form.freightUnitPrice" placeholder="请输入运输单价"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改站点信息对话框 -->
    <el-dialog title="坐标拾取" :visible.sync="locationOpen" width="800px" append-to-body :close-on-click-modal="false">
      <baidu-map :center="center" @click="getClickInfo" :zoom="17" class="bm-view" :scroll-wheel-zoom="true">
        <!--比例尺控件-->
        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
        <!--缩放控件-->
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
        <!--内容-->
        <bm-control :offset="{ width: '10px', height: '10px' }">
          <bm-auto-complete v-model="keyword" :sug-style="{ zIndex: 999999 }">
            <el-input v-model="keyword" type="text" placeholder="请输入地名关键字" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search"/>
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
        <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker>
      </baidu-map>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getLngLat">确 定</el-button>
        <el-button @click="locationOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addFreight, delFreight, exportFreight, getFreight, listFreight, updateFreight} from "@/api/manage/freight";
  import {listProject} from "@/api/manage/project";
  import {listFleet} from "@/api/manage/fleet";
  import {getMSId} from '@/utils/station';
  import {listMixingStation} from "@/api/manage/mixingStation";

  export default {
    name: "Freight",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 运费表格数据
        freightList: [],
        //项目数据
        projectList: [],
        //车队数据
        fleetList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 创建时间时间范围
        daterangeCreateTime: [],
        //坐标弹框
        locationOpen: false,
        //关键词
        keyword: null,
        //地图属性
        center: {lng: 0, lat: 0},
        //站点列表
        mixingStationList: [],
        //站点id
        msId: null,
        //站点坐标
        msCenter: {lng: 0, lat: 0},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          projectName: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.msId = Number(getMSId());
      this.getMixingStationList();
      this.getList();
      this.getProjectList();
      this.getFleetList();
    },
    methods: {
      openLocation() {
        this.locationOpen = true;
        if (this.form.freightLng && this.form.freightLat) {
          this.center.lng = this.form.freightLng;
          this.center.lat = this.form.freightLat;
        }else{
          this.center.lng = this.msCenter.lng;
          this.center.lat = this.msCenter.lat;
        }
      },
      getLngLat() {

        this.form.freightLng = this.center.lng;
        this.form.freightLat = this.center.lat;
        this.locationOpen = false;
        let point = new BMap.Point(this.center.lng, this.center.lat);
        let msPoint = new BMap.Point(this.msCenter.lng, this.msCenter.lat);
        let map = new BMap.Map();
        this.form.freightTransportationDistanceOne = (map.getDistance(point, msPoint) / 1000).toFixed(2);
      },
      /** *
       * 地图点击事件。
       */
      getClickInfo(e) {
        // 调整地图中心位置
        this.center.lng = e.point.lng;
        this.center.lat = e.point.lat;
      },
      /**车队下拉事件*/
      fleetSelectChange(fleetId) {
        let fleet = this.fleetList.find((item) => {
          return item.fleetId === fleetId;
        });
        this.form.fleetName = fleet.fleetName;
        this.form.fleetContacts = fleet.fleetContacts;
        this.form.fleetPhone = fleet.fleetPhone;
      },
      /**项目下拉事件*/
      projectSelectChange(projectId) {
        let project = this.projectList.find((item) => {
          return item.projectId === projectId;
        });
        this.form.projectName = project.projectName;
      },
      /** 查询站点信息列表 */
      getMixingStationList() {
        listMixingStation(null).then(response => {
          this.mixingStationList = response.rows;
          this.mixingStationList.forEach(item => {
            if (this.msId === item.msId) {
              this.msCenter.lat = item.msLat;
              this.msCenter.lng = item.msLng;
            }
          })
        });
      },
      //获取车队数据
      getFleetList() {
        listFleet(null).then(response => {
          this.fleetList = response.rows;
        });
      },
      //获取项目列表
      getProjectList() {
        listProject(null).then(response => {
          this.projectList = response.rows;
        });
      },
      /** 查询运费列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listFreight(this.queryParams).then(response => {
          this.freightList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          freightId: null,
          projectId: null,
          projectName: null,
          freightLng: null,
          freightLat: null,
          delFlag: null,
          fleetId: null,
          fleetName: null,
          fleetContacts: null,
          fleetPhone: null,
          freightUnitPrice: null,
          freightTransportationDistanceOne: null,
          freightTransportationDistanceTwo: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.daterangeCreateTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.freightId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加运费";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const freightId = row.freightId || this.ids
        getFreight(freightId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改运费";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.freightId != null) {
              updateFreight(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addFreight(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const freightIds = row.freightId || this.ids;
        this.$confirm('是否确认删除运费编号为"' + freightIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delFreight(freightIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有运费数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportFreight(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .bm-view {
    width: 100%;
    height: 600px;
  }
</style>
