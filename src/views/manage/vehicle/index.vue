<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="车牌" prop="vehicleLicensePlate">
        <el-input
          v-model="queryParams.vehicleLicensePlate"
          placeholder="请输入车牌"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车型" prop="vehicleType">
        <el-select v-model="queryParams.vehicleType" placeholder="请选择车型" clearable size="small">
          <el-option
            v-for="dict in vehicleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆属性" prop="vehicleAttribute">
        <el-select v-model="queryParams.vehicleAttribute" placeholder="请选择车辆属性" clearable size="small">
          <el-option
            v-for="dict in vehicleAttributeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['manage:vehicle:add']"
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
          v-hasPermi="['manage:vehicle:edit']"
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
          v-hasPermi="['manage:vehicle:remove']"
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
          v-hasPermi="['manage:vehicle:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" style="top: 30px" :data="vehicleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="车牌" align="center" prop="vehicleLicensePlate"/>
      <el-table-column label="车型" align="center" prop="vehicleType" :formatter="vehicleTypeFormat"/>
      <el-table-column label="司机" align="center" prop="driverName"/>
      <el-table-column label="司机电话" align="center" prop="driverPhone"/>
      <el-table-column label="车辆属性" align="center" prop="vehicleAttribute" :formatter="vehicleAttributeFormat"/>
      <el-table-column label="车辆载重" align="center" prop="vehicleLoad"/>
      <el-table-column label="车辆自重" align="center" prop="vehicleWeight"/>
      <el-table-column label="车队名称" align="center" prop="fleetName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:vehicle:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:vehicle:remove']"
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

    <!-- 添加或修改车辆对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-col :span="12">
            <el-form-item label="车牌" prop="vehicleLicensePlate">
              <el-input v-model="form.vehicleLicensePlate" placeholder="请输入车牌" :style="{width: '100%'}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" prop="vehicleType">
              <el-select v-model="form.vehicleType" placeholder="请选择车型" :style="{width: '100%'}">
                <el-option
                  v-for="dict in vehicleTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机" prop="driverName">
              <el-select v-model="form.driverId" @change="driverSelectChange" placeholder="请选择司机"
                         :style="{width: '100%'}">
                <el-option
                  v-for="dict in driverList"
                  :key="dict.driverId"
                  :label="dict.driverName"
                  :value="dict.driverId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="driverPhone">
              <el-input v-model="form.driverPhone" readonly placeholder="请输入联系方式" :style="{width: '100%'}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆属性" prop="vehicleAttribute">
              <el-select v-model="form.vehicleAttribute" placeholder="请选择车辆属性" :style="{width: '100%'}">
                <el-option
                  v-for="dict in vehicleAttributeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆载重" prop="vehicleLoad">
              <el-input v-model="form.vehicleLoad" placeholder="请输入车辆载重" :style="{width: '100%'}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆自重" prop="vehicleWeight">
              <el-input v-model="form.vehicleWeight" placeholder="请输入车辆自重" :style="{width: '100%'}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车队名称" prop="fleetName">
              <el-select v-model="form.fleetId" @change="fleetSelectChange" placeholder="请选择车队名称" :style="{width: '100%'}">
                <el-option
                  v-for="dict in fleetList"
                  :key="dict.fleetId"
                  :label="dict.fleetName"
                  :value="dict.fleetId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addVehicle, delVehicle, exportVehicle, getVehicle, listVehicle, updateVehicle} from "@/api/manage/vehicle";
  import {listDriver} from "@/api/manage/driver";
  import {listFleet} from "@/api/manage/fleet";

  export default {
    name: "Vehicle",
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
        // 车辆表格数据
        vehicleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 车队信息表格数据
        fleetList: [],
        //司机列表
        driverList: [],
        // 车型字典
        vehicleTypeOptions: [],
        // 车辆属性字典
        vehicleAttributeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          vehicleLicensePlate: null,
          vehicleType: null,
          vehicleAttribute: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDriverList();
      this.getFleetList();
      this.getDicts("m_vehicle_type").then(response => {
        this.vehicleTypeOptions = response.data;
      });
      this.getDicts("m_vehicle_attribute").then(response => {
        this.vehicleAttributeOptions = response.data;
      });
    },
    methods: {
      /** 获取司机列表*/
      getFleetList() {
        listFleet(null).then(response => {
          this.fleetList = response.rows;
        });
      },      /** 获取司机列表*/
      getDriverList() {
        listDriver(null).then(response => {
          this.driverList = response.rows;
        });
      },
      /** 查询车辆列表 */
      getList() {
        this.loading = true;
        listVehicle(this.queryParams).then(response => {
          this.vehicleList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //车队下拉点击时
      fleetSelectChange(fleetId) {
        let fleet = this.fleetList.find((item) => {
          return item.fleetId === fleetId
        });
        this.form.fleetName = fleet.fleetName;
      },      //司机下拉点击时
      driverSelectChange(driverId) {
        let driver = this.driverList.find((item) => {
          return item.driverId === driverId
        });
        this.form.driverName = driver.driverName;
        this.form.driverPhone = driver.driverPhone;
      },
      // 车型字典翻译
      vehicleTypeFormat(row, column) {
        return this.selectDictLabel(this.vehicleTypeOptions, row.vehicleType);
      },
      // 车辆属性字典翻译
      vehicleAttributeFormat(row, column) {
        return this.selectDictLabel(this.vehicleAttributeOptions, row.vehicleAttribute);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          vehicleId: null,
          vehicleLicensePlate: null,
          vehicleType: null,
          driverId: null,
          driverName: null,
          driverPhone: null,
          vehicleAttribute: null,
          vehicleLoad: null,
          vehicleWeight: null,
          fleetId: null,
          fleetName: null,
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
        this.ids = selection.map(item => item.vehicleId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加车辆";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const vehicleId = row.vehicleId || this.ids
        getVehicle(vehicleId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改车辆";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.vehicleId != null) {
              updateVehicle(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addVehicle(this.form).then(response => {
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
        const vehicleIds = row.vehicleId || this.ids;
        this.$confirm('是否确认删除车辆编号为"' + vehicleIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delVehicle(vehicleIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有车辆数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportVehicle(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
