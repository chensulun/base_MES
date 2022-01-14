<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="站点" prop="msId">
        <el-select
          v-model="queryParams.msId"
          placeholder="请选择站点"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in mixingStationList"
            :key="dict.msId"
            :label="dict.msName"
            :value="dict.msId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="peId">
        <el-select
          v-model="queryParams.peId"
          placeholder="请选择设备"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in productionEquipmentList"
            :key="dict.peId"
            :label="dict.peName"
            :value="dict.peId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产类型" prop="peProductionType">
        <el-input
          v-model="queryParams.peProductionType"
          placeholder="请输入生产类型"
        />
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

      <el-form-item>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['manage:qualityParameters:add']"
              >新增质量参数
            </el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd2"
              v-hasPermi="['manage:qualityParameters:add']"
              >新增合成级配参数
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
              v-hasPermi="['manage:qualityParameters:edit']"
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
              v-hasPermi="['manage:qualityParameters:remove']"
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
              v-hasPermi="['manage:qualityParameters:export']"
              >导出
            </el-button>
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
      </el-form-item>
    </el-form>

    <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="质量参数设置" name="first"></el-tab-pane>
        <el-tab-pane label="合成级配设置" name="second"></el-tab-pane>
      </el-tabs>
    </div>

    <div v-show="showName == '质量参数设置'">
      <el-table
        v-loading="loading"
        :data="qualityParametersList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="站点名称" align="center" prop="msName" />
        <el-table-column label="设备名称" align="center" prop="peName" />
        <el-table-column
          label="生产类型"
          align="center"
          prop="peProductionType"
        />
        <el-table-column
          label="是否报警"
          align="center"
          prop="isAlarm"
          :formatter="isAlarmFormat"
        />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleShow(scope.row)"
              v-hasPermi="['manage:qualityParameters:query']"
              >查看
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['manage:qualityParameters:edit']"
              >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['manage:qualityParameters:remove']"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加或修改质量参数设置对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="1200px"
        append-to-body
        :close-on-click-modal="false"
        @close="closeDialog"
      >
        <el-row :gutter="15">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-col :span="24">
              <el-divider content-position="left">参数信息</el-divider>
            </el-col>
            <el-col :span="6">
              <el-form-item label="站点">
                <el-select
                  v-model="form.msId"
                  placeholder="请选择站点"
                  @change="mixingStationSelectChange"
                >
                  <el-option
                    v-for="dict in mixingStationList"
                    :key="dict.msId"
                    :label="dict.msName"
                    :value="dict.msId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备">
                <el-select
                  v-model="form.peId"
                  placeholder="请选择设备"
                  @change="productionEquipmentSelectChange"
                >
                  <el-option
                    v-for="dict in productionEquipmentListShow"
                    :key="dict.peId"
                    :label="dict.peName"
                    :value="dict.peId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生产类型" prop="peProductionType">
                <el-input
                  v-model="form.peProductionType"
                  placeholder="请输入生产类型"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="严重程度">
                <el-select v-model="form.qpType" placeholder="请选择严重程度">
                  <el-option
                    v-for="dict in qpTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">报警类型配比</el-divider>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓1" prop="oneMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.oneMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.oneMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.oneType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓2" prop="twoMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.twoMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.twoMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.twoType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓3" prop="threeMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.threeMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.threeMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.threeType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓4" prop="fourMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.fourMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.fourMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.fourType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓5" prop="fiveMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.fiveMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.fiveMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.fiveType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓6" prop="sixMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.sixMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.sixMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.sixType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="粉料1" prop="sevenMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.sevenMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.sevenMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.sevenType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="粉料2" prop="eightMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.eightMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.eightMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.eightType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="粉料3" prop="eightMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.eightMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.eightMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.eightType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="再生料" prop="nineMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.nineMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.nineMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.nineType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="沥青" prop="asphaltMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.asphaltMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.asphaltMax"
                  placeholder="请输入"
                />&nbsp;
                <el-select
                  class="input-width"
                  v-model="form.asphaltType"
                  placeholder="类型"
                >
                  <el-option
                    v-for="dict in oneTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">油石比</el-divider>
            </el-col>
            <el-col :span="8">
              <el-form-item label="油石比" prop="oilStoneRatioMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.oilStoneRatioMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.oilStoneRatioMax"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">温度</el-divider>
            </el-col>
            <el-col :span="8">
              <el-form-item label="骨料温" prop="temperatureOneMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.temperatureOneMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.temperatureOneMax"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="rap" prop="temperatureTwoMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.temperatureTwoMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.temperatureTwoMax"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出料温度" prop="temperatureThreeMin">
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.temperatureThreeMin"
                  placeholder="请输入"
                />
                -
                <el-input
                  class="input-width"
                  type="number"
                  v-model="form.temperatureThreeMax"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否语音播报">
                <el-radio-group v-model="form.isAlarm">
                  <el-radio
                    v-for="dict in isAlarmOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                    >{{ dict.dictLabel }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer" v-show="readOnly">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <div v-show="showName == '合成级配设置'">
      <el-table
        v-loading="loading2"
        :data="parametersList2"
        @selection-change="handleSelectionChange2"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="站点名称" align="center" prop="msName" />
        <el-table-column label="设备名称" align="center" prop="peName" />
        <el-table-column
          label="生产类型"
          align="center"
          prop="peProductionType"
        />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleShow2(scope.row)"
              v-hasPermi="['manage:parameters:query']"
              >查看
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate2(scope.row)"
              v-hasPermi="['manage:parameters:edit']"
              >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete2(scope.row)"
              v-hasPermi="['manage:parameters:remove']"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total2 > 0"
        :total="total2"
        :page.sync="queryParams2.pageNum"
        :limit.sync="queryParams2.pageSize"
        @pagination="getList2"
      />

      <!-- 添加或修改质量参数对话框 -->
      <el-dialog
        :title="title2"
        :visible.sync="open2"
        width="1300px"
        append-to-body
        @close="closeDialog2"
      >
        <el-row :gutter="15">
          <el-form
            ref="form2"
            :model="form2"
            :rules="rules2"
            label-width="80px"
          >
            <el-col :span="24">
              <el-divider content-position="left">参数信息</el-divider>
            </el-col>
            <el-col :span="6">
              <el-form-item label="站点" prop="msId">
                <el-select
                  v-model="form2.msId"
                  placeholder="请选择站点"
                  @change="mixingStationSelectChange2"
                >
                  <el-option
                    v-for="dict in mixingStationList2"
                    :key="dict.msId"
                    :label="dict.msName"
                    :value="dict.msId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备" prop="peId">
                <el-select
                  v-model="form2.peId"
                  placeholder="请选择设备"
                  @change="productionEquipmentSelectChange2"
                >
                  <el-option
                    v-for="dict in productionEquipmentListShow2"
                    :key="dict.peId"
                    :label="dict.peName"
                    :value="dict.peId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生产类型" prop="peProductionType">
                <el-input
                  v-model="form2.peProductionType"
                  placeholder="请输入生产类型"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生效时间" prop="peProductionType">
                <el-date-picker
                  v-model="form2.time"
                  type="datetime"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">标准值</el-divider>
            </el-col>
            <el-col :span="24">
              <el-table :data="form2.pdData0" style="width: 100%">
                <el-table-column prop="pdName" label="指标"></el-table-column>
                <el-table-column prop="one" label="0.075">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.one"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="thirteen" label="0.15">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.thirteen"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="two" label="0.3">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.two"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="three" label="0.6">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.three"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="four" label="1.18">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.four"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="five" label="2.36">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.five"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="six" label="4.75">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.six"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="seven" label="9.5">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.seven"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="eight" label="13.2">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.eight"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="nine" label="16">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.nine"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="ten" label="19">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.ten"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="eleven" label="26.5">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.eleven"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="twelve" label="31.5">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.twelve"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">设定值</el-divider>
            </el-col>
            <el-col :span="24">
              <el-table :data="form2.pdData1" style="width: 100%">
                <el-table-column prop="pdName" label="仓名">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.pdName"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="one" label="0.075">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.one"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="thirteen" label="0.15">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.thirteen"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="two" label="0.3">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.two"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="three" label="0.6">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.three"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="four" label="1.18">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.four"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="five" label="2.36">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.five"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="six" label="4.75">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.six"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="seven" label="9.5">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.seven"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="eight" label="13.2">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.eight"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="nine" label="16">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.nine"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="ten" label="19">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.ten"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="eleven" label="26.5">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.eleven"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="twelve" label="31.5">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.twelve"
                      placeholder="请输入"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" align="center">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="
                        deleteRow(scope.$index, form2.pdData1)
                      "
                      type="text"
                      size="small"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="24">
              <el-button
                plain
                icon="el-icon-plus"
                size="mini"
                style="margin-left: 20px; margin-top: 10px"
                @click="addRow2"
                >新增仓信息
              </el-button>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer" v-show="readOnly">
          <el-button type="primary" @click="submitForm2">确 定</el-button>
          <el-button @click="cancel2">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listQualityParameters,
  getQualityParameters,
  delQualityParameters,
  addQualityParameters,
  updateQualityParameters,
  exportQualityParameters,
} from "@/api/manage/qualityParameters";
import { listMixingStation } from "@/api/manage/mixingStation";
import { listProductionEquipment } from "@/api/manage/productionEquipment";

import {
  addParameters,
  delParameters,
  exportParameters,
  getParameters,
  listParameters,
  updateParameters,
} from "@/api/manage/parameters";

export default {
  name: "QualityParameters",
  data() {
    return {
      readOnly: true, //只读
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
      // 质量参数设置表格数据
      qualityParametersList: [],
      //站点信息
      mixingStationList: [],
      //设备信息
      productionEquipmentList: [],
      productionEquipmentListShow: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否报警(0:否 1:是)字典
      isAlarmOptions: [],
      // 显示类型(0:重量 1:比例)字典
      oneTypeOptions: [],
      //生产参数类型 一般 严重
      qpTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        msId: null,
        peId: null,
        peProductionType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      activeName: "first",
      showName: "质量参数设置",
      /*
       *以下是新增质量参数的操作
       */
      // 遮罩层
      loading2: true,
      // 导出遮罩层
      exportLoading2: false,
      // 选中数组
      ids2: [],
      // 非单个禁用
      single2: true,
      // 非多个禁用
      multiple2: true,
      // 显示搜索条件
      showSearch2: true,
      // 总条数
      total2: 0,
      // 质量参数表格数据
      parametersList2: [],
      //站点信息
      mixingStationList2: [],
      //设备信息
      productionEquipmentList2: [],
      productionEquipmentListShow2: [],
      // 弹出层标题
      title2: "",
      // 是否显示弹出层
      open2: false,
      // 查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        msId: null,
        peId: null,
        peProductionType: null,
      },
      // 表单参数
      form2: {},
      // 表单校验
      rules2: {},
      //初始化数据0
      initData0: [
        {
          pdType: 0,
          pdName: "上限值",
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
          seven: null,
          eight: null,
          nine: null,
          ten: null,
          eleven: null,
          twelve: null,
          thirteen: null,
        },
        {
          pdType: 0,
          pdName: "下限值",
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
          seven: null,
          eight: null,
          nine: null,
          ten: null,
          eleven: null,
          twelve: null,
          thirteen: null,
        },
      ],
      //初始化数据1
      initData1: [
        {
          pdType: 1,
          pdName: "1号仓",
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
          seven: null,
          eight: null,
          nine: null,
          ten: null,
          eleven: null,
          twelve: null,
          thirteen: null,
        },
        {
          pdType: 1,
          pdName: "2号仓",
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
          seven: null,
          eight: null,
          nine: null,
          ten: null,
          eleven: null,
          twelve: null,
          thirteen: null,
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getDicts("m_quality_parameters_alarm").then((response) => {
      this.isAlarmOptions = response.data;
    });
    this.getDicts("m_quality_parameters_type").then((response) => {
      this.oneTypeOptions = response.data;
    });
    this.getDicts("m_quality_parameters_qp_type").then((response) => {
      this.qpTypeOptions = response.data;
    });
    this.getMixingStationList();
    this.getProductionEquipmentList();
    this.getList2();
    this.getMixingStationList2();
    this.getProductionEquipmentList2();
  },
  methods: {
    /** 设备下拉事件*/
    productionEquipmentSelectChange(peId) {
      let pe = this.productionEquipmentListShow.find((item) => {
        return item.peId === peId;
      });
      this.form.peName = pe.peName;
    },
    /** 站点下拉事件*/
    mixingStationSelectChange(msId) {
      let ms = this.mixingStationList.find((item) => {
        return item.msId === msId;
      });
      this.form.msName = ms.msName;
      this.productionEquipmentListShow = [];
      this.productionEquipmentList.forEach((item) => {
        if (item.msId === msId) {
          this.productionEquipmentListShow.push(item);
        }
      });
      this.form.peId = null;
      this.form.peName = null;
    },
    /** 查询站点信息列表 */
    getProductionEquipmentList() {
      listProductionEquipment(null).then((response) => {
        this.productionEquipmentList = response.rows;
      });
    },
    /** 查询站点信息列表 */
    getMixingStationList() {
      listMixingStation(null).then((response) => {
        this.mixingStationList = response.rows;
      });
    },
    /** 查询质量参数设置列表 */
    getList() {
      this.loading = true;
      listQualityParameters(this.queryParams).then((response) => {
        this.qualityParametersList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否报警(0:否 1:是)字典翻译
    isAlarmFormat(row, column) {
      return this.selectDictLabel(this.isAlarmOptions, row.isAlarm);
    },
    // 显示类型(0:重量 1:比例)字典翻译
    oneTypeFormat(row, column) {
      return this.selectDictLabel(this.oneTypeOptions, row.oneType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        qpId: null,
        qpType: "0",
        msId: null,
        msName: null,
        peId: null,
        peName: null,
        peProductionType: null,
        isAlarm: "0",
        oneMin: null,
        oneMax: null,
        oneType: "0",
        twoMin: null,
        twoMax: null,
        twoType: "0",
        threeMin: null,
        threeMax: null,
        threeType: "0",
        fourMin: null,
        fourMax: null,
        fourType: "0",
        fiveMin: null,
        fiveMax: null,
        fiveType: "0",
        sixMin: null,
        sixMax: null,
        sixType: "0",
        sevenMin: null,
        sevenMax: null,
        sevenType: "0",
        eightMin: null,
        eightMax: null,
        eightType: "0",
        nineMin: null,
        nineMax: null,
        nineType: "0",
        asphaltMin: null,
        asphaltMax: null,
        asphaltType: "0",
        oilStoneRatioMin: null,
        oilStoneRatioMax: null,
        temperatureOneMin: null,
        temperatureOneMax: null,
        temperatureTwoMin: null,
        temperatureTwoMax: null,
        temperatureThreeMin: null,
        temperatureThreeMax: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.ids = selection.map((item) => item.qpId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增质量参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const qpId = row.qpId || this.ids;
      getQualityParameters(qpId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改质量参数设置";
      });
    },
    /** 查看按钮操作 */
    handleShow(row) {
      this.reset();
      const qpId = row.qpId || this.ids;
      getQualityParameters(qpId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改质量参数设置";
        this.readOnly = false;
      });
    },
    closeDialog() {
      this.readOnly = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.qpId != null) {
            updateQualityParameters(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQualityParameters(this.form).then((response) => {
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
      const qpIds = row.qpId || this.ids;
      this.$confirm(
        '是否确认删除质量参数设置编号为"' + qpIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delQualityParameters(qpIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有质量参数设置数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportQualityParameters(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 新增合成级配按钮操作 */
    handleAddGradation() {
      this.reset();
      this.open = true;
      this.title = "新增质量参数";
    },
    /*切换选项卡*/
    handleClick(tab, event) {
      this.showName = tab.label;
    },
    /*
     *以下是新增质量参数的操作
     */

    /**表格删除行*/
    deleteRow2(index, rows) {
      rows.splice(index, 1);
    },
    addRow2() {
      let row = {
        pdType: 1,
        pdName: null,
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
        ten: null,
        eleven: null,
        twelve: null,
        thirteen: null,
      };
      this.form2.pdData1.push(row);
    },
    /** 设备下拉事件*/
    productionEquipmentSelectChange2(peId) {
      let pe = this.productionEquipmentListShow2.find((item) => {
        return item.peId === peId;
      });
      this.form2.peName = pe.peName;
    },
    /** 站点下拉事件*/
    mixingStationSelectChange2(msId) {
      let ms = this.mixingStationList2.find((item) => {
        return item.msId === msId;
      });
      this.form2.msName = ms.msName;
      this.productionEquipmentListShow2 = [];
      this.productionEquipmentList2.forEach((item) => {
        if (item.msId === msId) {
          this.productionEquipmentListShow2.push(item);
        }
      });
      this.form2.peId = null;
      this.form2.peName = null;
    },
    /** 查询站点信息列表 */
    getProductionEquipmentList2() {
      listProductionEquipment(null).then((response) => {
        this.productionEquipmentList2 = response.rows;
      });
    },
    /** 查询站点信息列表 */
    getMixingStationList2() {
      listMixingStation(null).then((response) => {
        this.mixingStationList2 = response.rows;
      });
    },
    /** 查询质量参数列表 */
    getList2() {
      this.loading2 = true;
      listParameters(this.queryParams).then((response) => {
        this.parametersList2 = response.rows;
        this.total2 = response.total;
        this.loading2 = false;
      });
    },
    // 取消按钮
    cancel2() {
      this.open2 = false;
      this.reset2();
    },
    // 表单重置
    reset2() {
      this.form2 = {
        pId: null,
        msId: null,
        msName: null,
        peId: null,
        peName: null,
        peProductionType: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        pdData0: [],
        pdData1: [],
        pdData: null,
        time: null,
      };
      this.resetForm("form2");
    },
    /** 搜索按钮操作 */
    handleQuery2() {
      this.queryParams2.pageNum = 1;
      this.getList2();
    },
    /** 重置按钮操作 */
    resetQuery2() {
      this.resetForm("queryForm2");
      this.handleQuery2();
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      this.ids2 = selection.map((item) => item.pId);
      this.single2 = selection.length !== 1;
      this.multiple2 = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd2() {
      this.reset2();
      this.open2 = true;
      this.title2 = "新增合成级配参数";
      this.form2.pdData0 = JSON.parse(JSON.stringify(this.initData0));
      this.form2.pdData1 = JSON.parse(JSON.stringify(this.initData1));
    },
    /** 修改按钮操作 */
    handleUpdate2(row) {
      this.reset2();
      const pId = row.pId || this.ids2;
      getParameters(pId).then((response) => {
        this.form2 = response.data;
        this.form2.pdData0 = [];
        this.form2.pdData1 = [];
        if (this.form2.pdData) {
          let pdData = JSON.parse(this.form2.pdData);
          for (let i = 0; i < pdData.length; i++) {
            let d = pdData[i];
            if (d.pdType === "0") {
              this.form2.pdData0.push(d);
            }
            if (d.pdType === "1") {
              this.form2.pdData1.push(d);
            }
          }
        }
        this.productionEquipmentList2.forEach((item) => {
          if (item.msId === this.form2.msId) {
            this.productionEquipmentListShow2.push(item);
          }
        });
        this.open2 = true;
        this.title2 = "修改质量参数";
      });
    },
    /** 查看按钮操作 */
    handleShow2(row) {
      this.reset2();
      const pId = row.pId || this.ids2;
      getParameters(pId).then((response) => {
        this.form2 = response.data;
        this.form2.pdData0 = [];
        this.form2.pdData1 = [];
        if (this.form2.pdData) {
          let pdData = JSON.parse(this.form2.pdData);
          for (let i = 0; i < pdData.length; i++) {
            let d = pdData[i];
            if (d.pdType === "0") {
              this.form2.pdData0.push(d);
            }
            if (d.pdType === "1") {
              this.form2.pdData1.push(d);
            }
          }
        }
        this.productionEquipmentList2.forEach((item) => {
          if (item.msId === this.form2.msId) {
            this.productionEquipmentListShow2.push(item);
          }
        });
        this.open2 = true;
        this.title2 = "修改质量参数";
        this.readOnly = false;
      });
    },
    closeDialog2() {
      this.readOnly = true;
    },
    /** 提交按钮 */
    submitForm2() {
      this.$refs["form2"].validate((valid) => {
        if (valid) {
          let data = [];
          data.push(...this.form2.pdData0);
          data.push(...this.form2.pdData1);
          this.form2.pdData = JSON.stringify(data);
          if (this.form2.pId != null) {
            updateParameters(this.form2).then((response) => {
              this.msgSuccess("修改成功");
              this.open2 = false;
              this.getList2();
            });
          } else {
            addParameters(this.form2).then((response) => {
              this.msgSuccess("新增成功");
              this.open2 = false;
              this.getList2();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete2(row) {
      const pIds = row.pId || this.ids2;
      this.$confirm(
        '是否确认删除质量参数编号为"' + pIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delParameters(pIds);
        })
        .then(() => {
          this.getList2();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport2() {
      const queryParams = this.queryParams2;
      this.$confirm("是否确认导出所有质量参数数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading2 = true;
          return exportParameters(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading2 = false;
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped>
.input-width {
  width: 86px;
}
</style>
