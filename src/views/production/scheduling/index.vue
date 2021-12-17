<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="20px">
        <el-col :span="18" class="form-left">
          <el-form-item label=" ">
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
          <el-form-item label="" prop="contractSupplierRepresentative">
            <el-input
              v-model="queryParams.taskPlanProjectName"
              placeholder="请输入关键字"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" round @click="query">查询</el-button>
            <el-button type="primary" @click="handleAdd('待供任务单列表',1)" round>待供任务单</el-button>
            <el-button type="primary" @click="handleAdd('供毕任务单列表',3)" round>供毕任务单</el-button>

          </el-form-item>
        </el-col>
        <el-col :span="0.5">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="5">
          <el-col :span="12" class="form-right">
            <span class="value" style="color: red">{{countVo.taskCount || 0}}</span>
            <div class="icon">
              <i class="el-icon-tickets"></i>
              <span> 任务单数</span>
            </div>
          </el-col>
          <el-col :span="12" class="form-right">
            <span class="value">{{countVo.planCount || 0}}</span>
            <div class="icon">
              <i class="el-icon-document"></i>
              <span> 总计划量</span>
            </div>
          </el-col>
          <el-col :span="12" class="form-right">
            <span class="value">{{countVo.shipCount || 0}}</span>
            <div class="icon">
              <i class="el-icon-tickets"></i>
              <span> 总发货量</span>
            </div>
          </el-col>
          <el-col :span="12" class="form-right">
            <span class="value">{{countVo.startCount || 0}}</span>
            <div class="icon">
              <i class="el-icon-shopping-cart-full"></i>
              <span> 总发货次数</span>
            </div>
          </el-col>
        </el-col>
      </el-form>

      <el-col :span="24">
        <el-col :span="18">
          <el-col v-for="(item,index) in supplyList" :span="12">
            <div class="dispatch-item-container" @dblclick="showInfo(item)" @click="closeMenu"
                 @contextmenu.prevent.stop="menuShow($event,item)">
              <div class="dispatch-item-header">
                <div class="pull-left" style="color: rgba(26, 185, 155, 1);">{{item.taskCode}}</div>
                <div class="pull-right">【序号: {{index+1}}】</div>
              </div>
              <div style="margin: 6px 0 0 7px;padding: 0 6px;">
                <span class="dispatch-title">工程名称:</span>{{item.projectName}}
              </div>
              <div style="margin: 6px 0 0 7px;padding: 0 6px;">
                <span class="dispatch-title">施工部位:</span>{{item.taskPosition}}
              </div>
              <div style="margin: 6px 0 0 7px;padding: 0 6px;color: rgba(255, 0, 0, 1);">
                <span class="dispatch-title">砼类型:</span>{{item.taskProductionType}}
              </div>
              <el-col :span="24" style="margin-top: 6px;padding: 0 6px;">
                <el-col :span="12" style="color: orange">
                  <span class="dispatch-title">运输方式:</span>{{item.taskShipping}}
                </el-col>
                <el-col :span="12" style="color: green">
                  <span class="dispatch-title">出厂温度:</span>
                </el-col>
              </el-col>
              <el-col :span="24" style="margin-top: 6px;padding: 0 6px;">
                <el-col :span="12" style="color: blue">
                  <span class="dispatch-title">已发量:</span>{{item.sum || 0}}
                </el-col>
                <el-col :span="12" style="color: red">
                  <span class="dispatch-title">计划量:</span>{{item.taskPlannedQuantity}}
                </el-col>
              </el-col>
            </div>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-col>
        <el-col :span="6" style="float: right">
          <el-col :span="24">
            <div class="dispatch-right-top">
              <div class="dispatch-right-top-title">任务单明细信息</div>
              <div class="item">
                <label class="label">项目编号:</label>
                <div class="block" v-if="showData">{{showData.taskCode}}</div>
              </div>
              <div class="item">
                <label class="label">工程名称:</label>
                <div class="block" v-if="showData">{{showData.taskPlanProjectName}}</div>
              </div>
              <div class="item">
                <label class="label">施工单位:</label>
                <div class="block"></div>
              </div>
              <div class="item">
                <label class="label">工地地址:</label>
                <div class="block"></div>
              </div>
              <div class="item">
                <label class="label">工地联系人:</label>
                <div class="block"></div>
              </div>
              <div class="item">
                <label class="label">联系电话:</label>
                <div class="block"></div>
              </div>
              <div class="item">
                <label class="label">计划开盘时间:</label>
                <div class="block"></div>
              </div>
              <div class="item">
                <label class="label">实际开盘时间:</label>
                <div class="block"></div>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <el-tabs value="first">
              <el-tab-pane label="车辆排队" name="first">
                <el-table :data="queueList" style="width: 100%">
                  <el-table-column type="index" label="排号" width="50" align="center"></el-table-column>
                  <el-table-column prop="busNumber" label="车牌号" align="center"></el-table-column>
                  <el-table-column prop="weight" label="载重" align="center"></el-table-column>
                  <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                        v-show="scope.$index !== 0"
                        type="text"
                        @click="changeQueueOrder(1,scope.row)"
                        size="small">
                        ↑
                      </el-button>
                      <el-button
                        v-show="scope.$index + 1 < queueList.length"
                        type="text"
                        @click="changeQueueOrder(2,scope.row)"
                        size="small">
                        ↓
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="发货明细" name="second">
                <el-table :data="weighRecordList" style="width: 100%">
                  <el-table-column type="index" label="排号" width="50" align="center"></el-table-column>
                  <el-table-column prop="weighLicensePlate" width="60" show-tooltip-when-overflow label="车牌号"
                                   align="center"></el-table-column>
                  <el-table-column prop="weighMaterialType" width="60" label="砼类型" align="center"></el-table-column>
                  <el-table-column prop="weighNetWeight" width="60" label="发货量" align="center"></el-table-column>
                  <el-table-column prop="weighOutTime" show-tooltip-when-overflow label="出场时间"
                                   align="center"></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="24"></el-col>
      <ul v-show="menuVisible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li @click="dataShow">查看</li>
        <li @click="menuClick(1)">待供</li>
        <li @click="menuClick(3)">供毕</li>
      </ul>
    </el-row>

    <!-- 任务单弹出框 -->
    <el-dialog :title="tableTile" :visible.sync="tableOpen" width="1200px" append-to-body :close-on-click-modal="false">
      <div class="app-container">
        <el-form :model="taskQueryParams" ref="tableQueryForm" :inline="true" label-width="68px">
          <el-form-item label="日期">
            <el-date-picker
              v-model="taskDaterangeCreateTime"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="contractSupplierRepresentative">
            <el-input
              v-model="taskQueryParams.taskPlanProjectName"
              placeholder="请输入关键词"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" round @click="handleQuery">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" round @click="updateStatusTask">转正供任务单</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="任务单编号" align="center" width="150px" prop="taskCode"/>
          <el-table-column label="工程名称" align="center" prop="projectName"/>
          <el-table-column label="施工部位" align="center" prop="taskPosition"/>
          <el-table-column label="砼类型" align="center" width="150px" prop="taskProductionType"/>
          <el-table-column label="计划量" align="center" prop="taskPlannedQuantity"/>
          <el-table-column label="运输方式" align="center" prop="taskShipping"/>
          <el-table-column label="出厂温度" align="center" prop=""/>
          <el-table-column label="工地需求供应时间" align="center" prop="task_supply_time" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="tableTotal>0"
          :total="tableTotal"
          :page.sync="taskQueryParams.pageNum"
          :limit.sync="taskQueryParams.pageSize"
          @pagination="getTaskList(status)"
        />
      </div>
    </el-dialog>


    <!-- 详情弹出框 -->
    <el-dialog title="详情信息" :visible.sync="infoOpen" width="800px" append-to-body :close-on-click-modal="false">
      <el-row :gutter="15">
        <el-form ref="form" label-width="120px">
          <el-col :span="12">
            <el-form-item label="配级编号" prop="contractSupplierName">
              <el-input readonly v-model="infoData.psCode" placeholder="请输入供应商简称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="混合科类型" prop="contractCarrier">
              <el-input v-model="infoData.taskProductionType" placeholder="请输入承运单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="沥青标号" prop="contractSupplierRepresentative">
              <el-input readonly v-model="infoData.psAsphaltGrade" placeholder="请输入授权代表"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区间温度" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psTemperatureRange" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班次" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psClasses" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="天气" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psWeather" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="石料加热温度(℃)" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psHeatingTemperatureOfStone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品出厂温度(℃)" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psFactoryTemperature" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机号" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psMachineNumber" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="沥青加热温度(℃)" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psHeatingTemperatureOfAsphalt" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psDate" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="干拌时间(s)" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psMixingTime" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="混拌时间(s)" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psWetMixingTime" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="contractSupplierPhone">
              <el-input readonly v-model="infoData.psRemark" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-col :span="24"><span>原材料配比</span></el-col>
              <el-table :data="infoData.psColdMaterialDataList" style="width: 100%">
                <el-table-column prop="warehouse" label="冷料仓" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="原材料厂商" width="100px" align="center"></el-table-column>
                <el-table-column prop="materialName" label="原材料规格" width="100px" align="center"></el-table-column>
                <el-table-column prop="value" label="重量" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <el-col :span="24"><span>热料仓配比</span></el-col>
              <el-table :data="infoData.psHotMaterialDataList" style="width: 100%">
                <el-table-column prop="warehouse" label="热料仓规格" align="center"></el-table-column>
                <el-table-column prop="value" label="重量" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
              </el-table>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

  import {listTask} from "@/api/manage/task";
  import {updateTaskStatus, countValue,queue,changeQueue} from "@/api/production/scheduling";
  import {getMSId, getPrId} from '@/utils/station';
  import {listWeighRecord} from "@/api/manage/weighRecord";
  import {listProportioningSheet} from "@/api/manage/proportioningSheet";

  export default {
    name: "index",
    data() {
      return {
        // 遮罩层
        loading: false,
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 任务创建时间时间范围
        taskDaterangeCreateTime: [],
        menuVisible: false,
        tableOpen: false,
        tableTile: null,
        //当前选中的正供
        select: null,
        // 总条数
        tableTotal: 0,
        //详情弹出
        infoOpen: false,
        infoData: {},
        top: 0,
        left: 0,
        // 数据参数
        tableData: [],
        //正供列表
        supplyList: [],
        showData: null,
        //选择框数据
        taskPlanSelection: [],
        // 选中数组
        ids: [],
        // 任务非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //站点id
        msId: null,
        //磅房id
        prId: null,
        proportioningSheet: null,
        //当前状态
        status: null,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          taskPlanProjectName: null,
          msId: null,
          taskPlanStatus: null,
        },
        taskQueryParams: {
          pageNum: 1,
          pageSize: 10,
          taskPlanProjectName: null,
          msId: null,
          taskPlanStatus: null,
        },
        countVo: {
          taskCount: 0,
          planCount: 0,
          shipCount: 0,
          startCount: 0
        },
        //榜单数据
        weighRecordList: [],
        //排队信息
        queueList: []
      }
    },
    created() {
      this.msId = getMSId();
      this.prId = getPrId();
      this.getSupplyList();
      this.getCountValue();
      this.getWeighRecordList();
      this.getQueueList();
    },
    methods: {
      testInfo(data) {
        console.log(data)
      },
      changeQueueOrder(type,row) {
        let params = {type:type,id:row.id,orderId:row.orderId,prId:this.prId};
        changeQueue(params).then(response => {
          console.log(response);
          if (response.code === 200) {
            this.getQueueList();
          }
          this.msgSuccess(response.msg);
        });
      },
      /** 查询排队信息 */
      getQueueList() {
        queue(this.prId).then(response => {
          this.queueList = response.rows;
        });
      },
      /** 查询配比单 */
      getProportioningSheet(taskId) {
        let queryParams = {taskId: taskId};
        listProportioningSheet(queryParams).then(response => {
          let rows = response.rows;
          if (rows && rows.length > 0) {
            this.infoData = rows[0];
            this.infoData.psColdMaterialDataList = JSON.parse(this.infoData.psColdMaterialData);
            this.infoData.psHotMaterialDataList = JSON.parse(this.infoData.psHotMaterialData);
          }
        });
      },
      /** 查询称重记录列表 */
      getWeighRecordList() {
        let queryParams = {msId: this.msId, weighShipmentStatus: '销售发货', pageNum: 1, pageSize: 10};
        listWeighRecord(queryParams).then(response => {
          this.weighRecordList = response.rows;
        });
      },
      //获取统计值
      getCountValue() {
        countValue(this.msId).then(response => {
          this.countVo = response.data;
        });
      },
      //获取正供列表
      getSupplyList() {
        if (!this.msId) {
          this.msgSuccess("请选择站点");
        }
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        this.queryParams.msId = this.msId;
        this.queryParams.taskStatus = 2;
        listTask(this.queryParams).then(response => {
          this.supplyList = response.rows;
          if (this.supplyList.length > 0) {
            this.showData = this.supplyList[0];
          } else {
            this.showData = null;
          }
          this.loading = false;
        });
      },
      /** 查询生产计划列表 */
      getTaskList(status) {
        if (!this.msId) {
          this.msgSuccess("请选择站点");
        }
        this.loading = true;
        this.taskQueryParams.params = {};
        if (null != this.taskDaterangeCreateTime && '' != this.taskDaterangeCreateTime) {
          this.taskQueryParams.params["beginCreateTime"] = this.taskDaterangeCreateTime[0];
          this.taskQueryParams.params["endCreateTime"] = this.taskDaterangeCreateTime[1];
        }
        this.taskQueryParams.msId = this.msId;
        this.taskQueryParams.taskStatus = status;
        listTask(this.taskQueryParams).then(response => {
          this.tableData = response.rows;
          this.tableTotal = response.total;
          this.loading = false;
        });
      },
      menuShow(e, item) {
        this.top = e.layerY;
        this.left = e.layerX;
        this.menuVisible = true;
        this.select = item;
      },
      dataShow() {
        this.showData = this.select;
        this.closeMenu();
      },
      closeMenu() {
        this.menuVisible = false;
        this.select = null;
      },
      menuClick(type) {
        let msg = type === 0 ? '待供' : '供毕';
        let select = this.select;
        this.closeMenu();
        this.$confirm('是否将任务单  ' + select.taskCode + '  转为' + msg + '?', "注意", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let data = {};
          data.taskId = select.taskId;
          data.status = type;
          data.prId = this.prId;
          updateTaskStatus(data).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.getSupplyList();
            } else {
              this.msgSuccess("操作失败");
            }
          });
        }).catch(() => {
        });
      },
      showInfo(item) {
        this.closeMenu();
        this.infoOpen = true;
        this.getProportioningSheet(item.taskId);
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.taskPlanSelection = selection;
        this.ids = selection.map(item => item.taskId);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd(title, status) {
        this.tableOpen = true;
        this.tableTile = title;
        this.status = status;
        this.getTaskList(status);
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.taskQueryParams.pageNum = 1;
        this.getTaskList(this.status);
      },

      /** 搜索按钮操作 */
      query() {
        this.queryParams.pageNum = 1;
        this.getSupplyList();
      },

      /**转正供*/
      updateStatusTask() {
        this.tableOpen = false;
        if (this.ids.length > 0) {
          let data = {};
          data.taskId = this.ids.join(",");
          data.status = 2;
          data.prId = this.prId;
          updateTaskStatus(data).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.getSupplyList();
            } else {
              this.msgSuccess("操作失败");
            }
          });
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-divider--vertical {
    display: inline-block;
    width: 1px;
    height: 8em;
    margin: 0 8px;
    vertical-align: middle;
    position: relative;
  }

  .form-left {
    margin-top: 2em;
  }

  .form-right {
    margin-top: 1rem;
    text-align: center;

    .value {
      font-size: 23px;
    }

    .icon {
      font-size: 14px;
      color: #8492a6;
    }
  }

  .dispatch-right-top {
    background-color: #f9f9f9;
    font-size: 13px;
    padding: 20px 10px;

    .dispatch-right-top-title {
      color: rgba(85, 101, 126, 1);
      line-height: 22px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .item {
      margin-bottom: 15px;
      clear: both;
      *zoom: 1;

      .label {
        float: left;
        display: block;
        font-weight: 400;
        line-height: 20px;
        text-align: right;
        width: 90px;
        padding: 4px;
        color: rgba(56, 56, 56, 1);
      }

      .block {
        padding: 4px;
        line-height: 20px;
        box-sizing: border-box;
        min-height: 20px;
        margin-left: 100px;
        color: rgba(102, 102, 102, 1);
      }
    }
  }

  .dispatch-item-container {
    height: 192px;
    background-color: rgb(246, 246, 246);
    font-size: 15px;
    color: rgba(102, 102, 102, 1);

    .dispatch-item-header {
      height: 28px;
      line-height: 28px;
      font-size: 18px;
      background-color: rgba(233, 245, 242, 1);
      padding: 0 8px;
      zoom: 1;

      .pull-left {
        float: left;
      }

      .pull-right {
        float: right;
      }
    }

    .dispatch-title {
      color: rgba(56, 56, 56, 1);
      font-size: 15px;
      margin-right: 8px;
    }

  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  }

  .contextmenu li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  }

  .contextmenu li:hover {
    background: #eee;
  }


  .test1 {
    width: 100%;
    height: 500px;
    background-color: #37c375;
    margin-top: 1rem;
  }

  .test2 {
    width: 100%;
    height: 200px;
    margin-top: 1rem;
    background-color: #f4516c;
  }
</style>
