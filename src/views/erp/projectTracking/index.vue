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
      <el-form-item label="客户名称" prop="ptCustomerName">
        <el-input
          v-model="queryParams.ptCustomerName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="跟进状态" prop="ptStatus">
        <el-select v-model="queryParams.ptStatus" placeholder="请选择跟进状态" clearable size="small">
          <el-option
            v-for="dict in ptStatusOptions"
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
          v-hasPermi="['erp:projectTracking:add']"
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
          v-hasPermi="['erp:projectTracking:edit']"
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
          v-hasPermi="['erp:projectTracking:remove']"
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
          v-hasPermi="['erp:projectTracking:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectTrackingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="项目编号" align="center" prop="ptCode"/>
      <el-table-column label="项目名称" align="center" prop="ptName"/>
      <el-table-column label="产品名称" align="center" prop="ptProductData">
        <template slot-scope="scope">
          <p v-for="item in JSON.parse(scope.row.ptProductData)">{{item.name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="需求量" align="center" prop="ptProductData">
        <template slot-scope="scope">
          <p v-for="item in JSON.parse(scope.row.ptProductData)">{{item.num}}</p>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center" prop="ptProductData">
        <template slot-scope="scope">
          <p v-for="item in JSON.parse(scope.row.ptProductData)">{{item.price}}</p>
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center">
        <template slot-scope="scope">
          <span>{{ getTotal(scope.row.ptProductData) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计下单时间" align="center" prop="ptEstimatedOrderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ptEstimatedOrderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计供货时间" align="center" prop="ptEstimatedDeliveryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ptEstimatedDeliveryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟进状态" align="center" prop="ptStatus" :formatter="ptStatusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="projectTracking(scope.row)"
            v-hasPermi="['erp:projectTracking:edit']"
          >跟踪
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['erp:projectTracking:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['erp:projectTracking:remove']"
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

    <!-- 添加或修改项目追踪对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="ptName">
              <el-input v-model="form.ptName" placeholder="请输入项目名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编号" prop="ptCode">
              <el-input readonly v-model="form.ptCode" placeholder="无需填写"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="ptCustomerId">
              <el-select v-model="form.ptCustomerId" @change="customerLSelectChange" placeholder="请选择客户">
                <el-option
                  v-for="item in customerList"
                  :key="item.customerId"
                  :value="item.customerId"
                  :label="item.customerName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="ptCustomerRepresentative">
              <el-select v-model="form.ptCustomerRepresentative" @change="contactsSelectChange" placeholder="联系人">
                <el-option
                  v-for="item in contactsList"
                  :key="item.name"
                  :value="item.name"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="ptCustomerPhone">
              <el-input readonly v-model="form.ptCustomerPhone" placeholder="客户电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="项目地址" prop="ptAddress">
              <el-input type="textarea" v-model="form.ptAddress" placeholder="请输入项目地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              size="mini"
              @click="openLocation"
            >坐标拾取
            </el-button>
          </el-col>
          <el-col :span="24">
            <el-form-item label="跟进状态" prop="ptStatus">
              <el-select v-model="form.ptStatus" placeholder="请选择跟进状态">
                <el-option
                  v-for="dict in ptStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="预计下单时间" prop="ptCustomerPhone">
                <el-date-picker
                  v-model="form.ptEstimatedOrderTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计供货时间" prop="ptCustomerPhone">
                <el-date-picker
                  v-model="form.ptEstimatedDeliveryTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-table border show-summary
                      :data="form.ptProductDataList"
                      :summary-method="getSummaries"
                      style="width: 100%">
              <el-table-column prop="name" align="center" label="产品名称">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.name" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="num" align="center" label="需求量">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.num" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="price" align="center" label="单价">
                <template slot-scope="scope">
                  <el-input size="small" type="number" v-model="scope.row.price" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="total" align="center" label="总金额">
                <template slot-scope="scope">
                  {{scope.row.total = (scope.row.num * scope.row.price).toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column prop="remark" align="center" label="备注">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.remark" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.ptProductDataList)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              :style="{width: '100%'}"
              @click="addRow"
            >新增
            </el-button>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改项目根据状态 -->
    <el-dialog title="项目跟踪" :visible.sync="open1" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-col :span="24">
            <el-form-item label="跟进状态" prop="ptStatus">
              <el-select v-model="form.ptStatus" placeholder="请选择跟进状态">
                <el-option
                  v-for="dict in ptStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
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


    <!-- 地图弹框 -->
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
          <!--<bm-label content="搅拌站" :labelStyle="{color: 'red', fontSize : '16px'}" :offset="{width: -35, height: 20}"/>-->
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
    addProjectTracking,
    delProjectTracking,
    exportProjectTracking,
    getProjectTracking,
    listProjectTracking,
    updateProjectTracking
  } from "@/api/erp/projectTracking";

  import {listCustomer} from "@/api/erp/customer";

  export default {
    name: "ProjectTracking",
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
        // 项目追踪表格数据
        projectTrackingList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否显示项目跟踪弹出层
        open1: false,
        //坐标弹框
        locationOpen: false,
        //关键词
        keyword: null,
        //地图属性
        center: {lng: 0, lat: 0},
        // 跟进状态字典
        ptStatusOptions: [],
        //客户列表
        customerList: [],
        //客户经理列表
        contactsList: [],
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          ptCustomerName: null,
          ptStatus: null,
          createTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("erp_project_tracking_status").then(response => {
        this.ptStatusOptions = response.data;
      });
      this.getCustomerList();
    },
    methods: {
      //打开坐标选择弹框
      openLocation() {
        this.locationOpen = true;
      },
      /** *
       * 获取经纬度。
       */
      getLngLat() {
        this.form.ptLng = this.center.lng;
        this.form.ptLat = this.center.lat;
        let _this = this;
        let gc = new BMap.Geocoder();
        let point = new BMap.Point(this.center.lng, this.center.lat);
        gc.getLocation(point, function (res) {
          _this.form.ptAddress = res.address;
        });
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
      //获取总金额
      getTotal(data) {
        let _data = JSON.parse(data);
        return _data.map(item => item.num * item.price).reduce((prev, curr) => {
          return prev + curr;
        }, 0);

      },
      /** 客户下拉事件*/
      customerLSelectChange(customerId) {
        let customer = this.customerList.find((item) => {
          return item.customerId === customerId;
        });
        this.form.ptCustomerName = customer.customerName;
        this.contactsList = JSON.parse(customer.customerSituationData);
      },
      /** 联系人下拉事件*/
      contactsSelectChange(contactsName) {
        let contacts = this.contactsList.find((item) => {
          return item.name === contactsName;
        });

        this.form.ptCustomerPhone = contacts.phone;
      },
      /** 查询站点信息列表 */
      getCustomerList() {
        listCustomer(null).then(response => {
          this.customerList = response.rows;
        });
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if (index === 1 || index === 3) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            } else {
              sums[index] = 'N/A';
            }
          }
        });

        return sums;
      },
      /** 添加材料行*/
      addRow() {
        let material = {name: '', num: 0, price: 0, total: 0, remark: ''};
        if (!this.form.ptProductDataList) {
          this.form.ptProductDataList = [];
        }
        this.form.ptProductDataList.push(material);
      },
      /**表格删除行*/
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      /** 查询项目追踪列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        listProjectTracking(this.queryParams).then(response => {
          this.projectTrackingList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 跟进状态字典翻译
      ptStatusFormat(row, column) {
        return this.selectDictLabel(this.ptStatusOptions, row.ptStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          ptId: null,
          ptCode: null,
          ptName: null,
          ptProductData: null,
          ptProductDataList: [],
          ptCustomerId: null,
          ptCustomerName: null,
          ptCustomerRepresentative: null,
          ptCustomerPhone: null,
          ptAddress: null,
          ptLng: null,
          ptLat: null,
          ptEstimatedOrderTime: null,
          ptEstimatedDeliveryTime: null,
          ptStatus: null,
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
        this.daterangeCreateTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ptId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加项目追踪";
        if (this.customerList && this.customerList.length > 0) {
          let customer = this.customerList[0];
          this.form.ptCustomerName = customer.customerName;
          this.contactsList = JSON.parse(customer.customerSituationData);
          //this.form.ptCustomerRepresentative = customer.customerRepresentative;
          //this.form.ptCustomerPhone = customer.customerPhone;
          this.form.ptCustomerId = customer.customerId;
          if (this.contactsList && this.contactsList.length > 0) {
            let contacts = this.contactsList[0];
            this.form.ptCustomerRepresentative = contacts.name;
            this.form.ptCustomerPhone = contacts.phone;
          }
        }
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const ptId = row.ptId || this.ids
        getProjectTracking(ptId).then(response => {
          this.form = response.data;
          this.form.ptProductDataList = JSON.parse(this.form.ptProductData);
          this.open = true;
          this.title = "修改项目追踪";
          if (this.form.ptCustomerId) {
            this.customerLSelectChange(this.form.ptCustomerId);
          }
        });
      },
      /** 项目跟踪按钮操作 */
      projectTracking(row) {
        this.reset();
        const ptId = row.ptId || this.ids
        getProjectTracking(ptId).then(response => {
          this.form = response.data;
          this.form.ptProductDataList = JSON.parse(this.form.ptProductData);
          this.open1 = true;
          console.log(this.form);
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.ptProductData = JSON.stringify(this.form.ptProductDataList);
            if (this.form.ptId != null) {
              updateProjectTracking(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.open1 = false;
                this.getList();
              });
            } else {
              addProjectTracking(this.form).then(response => {
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
        const ptIds = row.ptId || this.ids;
        this.$confirm('是否确认删除项目追踪编号为"' + ptIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delProjectTracking(ptIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有项目追踪数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportProjectTracking(queryParams);
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
