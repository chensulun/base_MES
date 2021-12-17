<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="站点名称" prop="msName">
        <el-input
          v-model="queryParams.msName"
          placeholder="请输入站点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站点地址" prop="msAddress">
        <el-input
          v-model="queryParams.msAddress"
          placeholder="请输入站点地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站点经度" prop="msLon">
        <el-input
          v-model="queryParams.msLon"
          placeholder="请输入站点经度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站点纬度" prop="msLat">
        <el-input
          v-model="queryParams.msLat"
          placeholder="请输入站点纬度"
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
          v-hasPermi="['manage:mixingStation:add']"
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
          v-hasPermi="['manage:mixingStation:edit']"
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
          v-hasPermi="['manage:mixingStation:remove']"
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
          v-hasPermi="['manage:mixingStation:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mixingStationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="msId"/>
      <el-table-column label="站点名称" align="center" prop="msName"/>
      <el-table-column label="站点地址" align="center" prop="msAddress"/>
      <el-table-column label="站点经度" align="center" prop="msLng"/>
      <el-table-column label="站点纬度" align="center" prop="msLat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:mixingStation:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:mixingStation:remove']"
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

    <!-- 添加或修改站点信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="站点名称" prop="msName">
          <el-input v-model="form.msName" placeholder="请输入站点名称"/>
        </el-form-item>
        <el-form-item label="站点地址" prop="msAddress">
          <el-input v-model="form.msAddress" placeholder="请输入站点地址"/>
        </el-form-item>
        <el-form-item label="站点经度" prop="msLon">
          <el-input v-model="form.msLng" placeholder="请输入站点经度"/>
        </el-form-item>
        <el-form-item label="站点纬度" prop="msLat">
          <el-input v-model="form.msLat" placeholder="请输入站点纬度"/>
        </el-form-item>
        <el-button type="primary" icon="el-icon-location-outline" @click="openLocation" plain>拾取坐标</el-button>
      </el-form>
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
          <bm-label content="搅拌站" :labelStyle="{color: 'red', fontSize : '16px'}" :offset="{width: -35, height: 20}"/>
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
  import {
    addMixingStation,
    delMixingStation,
    exportMixingStation,
    getMixingStation,
    listMixingStation,
    updateMixingStation
  } from "@/api/manage/mixingStation";

  export default {
    name: "MixingStation",
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
        // 站点信息表格数据
        mixingStationList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //坐标弹框
        locationOpen: false,
        //关键词
        keyword: null,
        //地图属性
        center: {lng: 0, lat: 0},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          msName: null,
          msAddress: null,
          msLng: null,
          msLat: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      openLocation() {
        this.locationOpen = true;
        if (this.form.msLng && this.form.msLat) {
          this.center.lng = this.form.msLng;
          this.center.lat = this.form.msLat;
        }
      },
      getLngLat() {
        this.form.msLng = this.center.lng;
        this.form.msLat = this.center.lat;
        this.locationOpen = false;
      },
      /** *
       * 地图点击事件。
       */
      getClickInfo(e) {
        // 调整地图中心位置
        this.center.lng = e.point.lng;
        this.center.lat = e.point.lat;
      },
      /** 查询站点信息列表 */
      getList() {
        this.loading = true;
        listMixingStation(this.queryParams).then(response => {
          this.mixingStationList = response.rows;
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
          msId: null,
          msName: null,
          msAddress: null,
          msLon: null,
          msLat: null,
          delFlag: null,
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
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.msId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加站点信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const msId = row.msId || this.ids
        getMixingStation(msId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改站点信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.msId != null) {
              updateMixingStation(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMixingStation(this.form).then(response => {
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
        const msIds = row.msId || this.ids;
        this.$confirm('是否确认删除站点信息编号为"' + msIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delMixingStation(msIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有站点信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportMixingStation(queryParams);
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
