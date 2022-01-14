<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item prop="queryType">
            <el-select v-model="queryParams.queryType" size="small">
              <el-option
                v-for="dict in queryOptions"
                :key="dict.value"
                :label="dict.name"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="queryValue">
            <el-input
              v-show="queryParams.queryType !== 1"
              v-model="queryParams.queryValue"
              placeholder="请输入"
              size="small"
              @keyup.enter.native="handleQuery"
            />
            <el-select
              v-show="queryParams.queryType === 1"
              v-model="queryParams.queryValue"
              size="small"
            >
              <el-option
                v-for="dict in ssTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >查询
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="1.5" :offset="16">
              <el-button type="success" @click="doList" :disabled="single"
                >设置路线</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" @click="handleDelete" :disabled="single"
                >批量删除
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          v-loading="loading"
          :data="securitySettingList"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="位置" align="center" prop="ssPosition" />
          <el-table-column label="项目" align="center" prop="ssName" />
          <el-table-column
            label="类别"
            align="center"
            prop="ssType"
            :formatter="ssTypeFormat"
          />
          <el-table-column label="频率(生产量/时间)" width="130" align="center">
            <template slot-scope="scope">
              {{ scope.row.ssProductionQuantity || 0 }}/{{
                scope.row.ssDuration || 0
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="关联人"
            align="center"
            prop="ssPatrolmanName"
          />
          <el-table-column
            label="是否设置路线"
            align="center"
            prop="ssStatus"
            :formatter="ssStatusFormat"
          />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>

      <el-col :span="14" style="border-left: 10px solid #eee">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="站点" prop="msName">
            <el-col :span="6">
              <el-input v-model="this.msName" readonly="" />
            </el-col>
          </el-form-item>
          <el-form-item label="类别" prop="ssType">
            <el-col :span="20">
              <el-radio-group v-model="form.ssType">
                <el-radio
                  v-for="dict in ssTypeOptions"
                  :key="dict.dictValue"
                  :value="dict.dictValue"
                  :label="dict.dictValue"
                  @click="clickRadio(dict)"
                  >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>

          <el-form-item label="位置">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-input v-model="form.ssPosition" placeholder="请输入位置"/>
              </el-col>
              <el-col :span="1">—</el-col>
              <el-col :span="6">
                <el-input v-model="form.ssCode" placeholder="请输入位置编号"/>
              </el-col>
              <el-col :span="6">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="getQrCode"
                  >生成二维码
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="标准列表" prop="ssStandard">
            <el-row>
              <el-col :span="6" :offset="22">
                <el-button type="success" @click="addRow(form.dataList)"
                  >新增
                </el-button>
              </el-col>
              <el-col>
                <el-table :data="form.dataList" height="460px">
                  <el-table-column label="序号" align="center" type="index" />
                  <el-table-column label="项目" align="center" prop="ssName">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.ssName" />
                    </template>
                  </el-table-column>
                  <el-table-column label="标准" align="center" rop="ssStandard">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.ssStandard" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="巡逻人"
                    align="center"
                    prop="ssPatrolman"
                  >
                    <template slot-scope="scope">
                      <el-select
                        allow-create
                        filterable
                        v-model="scope.row.ssPatrolmanId"
                        @change="patrolmanSelectChange($event, scope.row)"
                        placeholder="请选择巡逻人"
                      >
                        <el-option
                          v-for="dict in userList"
                          :key="dict.userId"
                          :label="dict.nickName"
                          :value="dict.userId"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="责任人"
                    align="center"
                    prop="ssPeople"
                  >
                    <template slot-scope="scope">
                      <el-select
                        allow-create
                        filterable
                        v-model="scope.row.ssPersonLiableId"
                        @change="personLiableSelectChange($event, scope.row)"
                        placeholder="请选择责任人"
                      >
                        <el-option
                          v-for="dict in userList"
                          :key="dict.userId"
                          :label="dict.nickName"
                          :value="dict.userId"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="频率" align="center">
                    <el-table-column
                      label="生产量"
                      align="center"
                      prop="ssConst"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.ssProductionQuantity" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="时间(小时)"
                      align="center"
                      prop="ssTime"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.ssDuration" />
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="deleteList(form.dataList, scope.$index)"
                        >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="上传设置">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item label="图片" prop="ssImgNum">
                  <el-col :span="16">
                    <el-input
                      v-model="form.ssImgNum"
                      placeholder="请输入图片数量"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="音频" prop="ssAudioNum">
                  <el-col :span="16">
                    <el-input
                      v-model="form.ssAudioNum"
                      placeholder="请输入音频数量"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="视频" prop="ssVideoNum">
                  <el-col :span="16">
                    <el-input
                      v-model="form.ssVideoNum"
                      placeholder="请输入视频数量"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button type="primary" @click="update">修改</el-button>
        <el-button type="success" @click="add">新增</el-button>
      </el-col>
    </el-row>

    <el-dialog
      title="二维码"
      :visible.sync="showQrOpen"
      append-to-body
      :close-on-click-modal="false"
      width="240px"
    >
      <vue-qr :text="qrText" :size="200"></vue-qr>
    </el-dialog>

    <el-dialog
      title="路线设置"
      :visible.sync="showDoList"
      append-to-body
      :close-on-click-modal="false"
      width="1000px"
    >
      <el-table v-loading="loading" :data="doListArrCopy">
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="位置" align="center" prop="ssPosition" />
        <el-table-column label="项目" align="center" prop="ssName" />
        <el-table-column label="类别" align="center" prop="ssType" />
        <el-table-column
          label="频率(生常量/时间)"
          width="130"
          align="center"
          prop="ssType"
        >
          <template slot-scope="scope">
            {{ scope.row.ssProductionQuantity || 0 }}/{{
              scope.row.ssDuration || 0
            }}
          </template>
        </el-table-column>
        <el-table-column label="关联人" align="center" prop="ssPatrolmanName" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-show="scope.$index !== 0"
              type="text"
              @click="upMove(scope.$index, scope.row)"
              size="small"
            >
              ↑
            </el-button>
            <el-button
              v-show="scope.$index + 1 < doListArr.length"
              type="text"
              @click="upDown(scope.$index, scope.row)"
              size="small"
            >
              ↓
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col>
          <el-button type="primary" @click="setRoute">确认</el-button>
          <el-button @click="doList">重置</el-button>
          <el-button @click="showDoList = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  addSecuritySetting,
  delSecuritySetting,
  exportSecuritySetting,
  getSecuritySetting,
  listSecuritySetting,
  updateSecuritySetting,
} from "@/api/manage/securitySetting";
import { getMSId, getMS } from "@/utils/station";
import { listUser } from "@/api/system/user";
import vueQr from "vue-qr";
import { addSecuritySettingRoute } from "@/api/manage/securitySettingRoute";

export default {
  name: "SecuritySetting",
  components: { vueQr },
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
      // 安全设置表格数据
      securitySettingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 安全设置类型字典
      ssTypeOptions: [],
      // 状态(已设置路线/未设置路线)字典
      ssStatusOptions: [],
      queryOptions: [
        { name: "位置", value: 0 },
        { name: "类别", value: 1 },
        { name: "联系人", value: 2 },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        msId: null,
        ssType: null,
        ssPosition: null,
        ssPatrolmanName: null,
        queryType: 0,
        queryValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      msId: null,
      msName: null,
      qrText: "",
      showQrOpen: false,
      showDoList: false,
      userList: [],
      doListArr: [],
      doListArrCopy: [],
    };
  },
  created() {
    this.getList();
    this.msId = getMSId();
    this.msName = getMS();
    this.form.msId = this.msId;
    this.getDicts("m_security_setting_type").then((response) => {
      this.ssTypeOptions = response.data;
    });
    this.getDicts("m_security_setting_status").then((response) => {
      this.ssStatusOptions = response.data;
    });
    this.getUserList();
    this.reset();
  },
  methods: {
    /** 设置路线*/
    setRoute() {
      if (this.doListArrCopy.length === 0) {
        this.msgError("未选择数据");
        return;
      }
      let ids = this.doListArrCopy.map((item) => item.ssId).join(",");
      addSecuritySettingRoute({ ssIds: ids, msId: this.msId }).then(
        (response) => {
          this.msgSuccess("添加路线成功");
          this.showDoList = false;
          this.getList();
        }
      );
    },
    /** 巡逻人人下拉事件*/
    patrolmanSelectChange(userId, row) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      row.ssPatrolmanName = user.nickName;
    },
    /** 责任人下拉事件*/
    personLiableSelectChange(userId, row) {
      let user = this.userList.find((item) => {
        return item.userId === userId;
      });
      row.ssPersonLiableName = user.nickName;
    },
    /** 某一行被点击 */
    rowClick(row, column, event) {
      this.reset();
      const ssId = row.ssId || this.ids;
      getSecuritySetting(ssId).then((response) => {
        this.form = response.data;
        this.form.dataList = JSON.parse(this.form.data);
      });
    },
    /** 查询安全设置列表 */
    getList() {
      this.loading = true;
      listSecuritySetting(this.queryParams).then((response) => {
        this.securitySettingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 安全设置类型字典翻译
    ssTypeFormat(row, column) {
      return this.selectDictLabel(this.ssTypeOptions, row.ssType);
    },
    // 状态(已设置路线/未设置路线)字典翻译
    ssStatusFormat(row, column) {
      return this.selectDictLabel(this.ssStatusOptions, row.ssStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ssId: null,
        msId: null,
        ssType: "0",
        ssPosition: null,
        ssCode: null,
        ssName: null,
        ssStandard: null,
        ssPatrolmanId: null,
        ssPatrolmanName: null,
        ssPersonLiableId: null,
        ssPersonLiableName: null,
        ssProductionQuantity: null,
        ssDuration: null,
        ssImgNum: null,
        ssAudioNum: null,
        ssVideoNum: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        ssStatus: null,
        dataList: [
          {
            ssName: null,
            ssStandard: null,
            ssPatrolmanId: null,
            ssPatrolmanName: null,
            ssPersonLiableId: null,
            ssPersonLiableName: null,
            ssProductionQuantity: null,
            ssDuration: null,
          },
        ],
        data: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery: function () {
      this.queryParams.pageNum = 1;
      let type = this.queryParams.queryType;
      let value = this.queryParams.queryValue;
      if (type === 0) {
        this.queryParams.ssPosition = value;
      }
      if (type === 1) {
        this.queryParams.ssType = value;
      }
      if (type === 2) {
        this.queryParams.ssPatrolmanName = value;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.ssPosition = null;
      this.queryParams.ssType = null;
      this.queryParams.ssPatrolmanName = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.ssId);
      this.single = selection.length < 1;
      this.multiple = !selection.length;
      this.doListArr = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加安全设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ssId = row.ssId || this.ids;
      getSecuritySetting(ssId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改安全设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.form.msId = this.msId;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.data = JSON.stringify(this.form.dataList);
          if (this.form.ssId != null) {
            updateSecuritySetting(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.getList();
            });
          } else {
            addSecuritySetting(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.getList();
            });
          }
        }
      });
    },
    add() {
      this.form.msId = this.msId;
      this.form.ssId = null;
      this.form.data = JSON.stringify(this.form.dataList);
      addSecuritySetting(this.form).then((response) => {
        this.msgSuccess("新增成功");
        this.getList();
      });
    },
    update() {
      if (this.form.ssId == null) {
        this.msgError("请点击左边列表进行数据修改");
        return;
      }
      this.form.msId = this.msId;
      this.form.data = JSON.stringify(this.form.dataList);
      updateSecuritySetting(this.form).then((response) => {
        this.msgSuccess("修改成功");
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      const ssIds = this.ids;
      this.$confirm(
        '是否确认删除安全设置编号为"' + ssIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSecuritySetting(ssIds);
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
      this.$confirm("是否确认导出所有安全设置数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportSecuritySetting(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    clickRadio(item) {
      console.log(item);
    },
    addRow(dataList) {
      dataList.push({
        ssName: null,
        ssStandard: null,
        ssPatrolmanId: null,
        ssPatrolmanName: null,
        ssPersonLiableId: null,
        ssPersonLiableName: null,
        ssProductionQuantity: null,
        ssDuration: null,
      });
    },
    deleteList(rows, index) {
      rows.splice(index, 1);
    },
    getQrCode() {
      let qrText = {
        position: this.form.ssPosition,
        code: this.form.ssCode,
        type: "xj",
      };
      this.qrText = JSON.stringify(qrText);
      this.showQrOpen = true;
      console.log(JSON.parse(this.qrText));
    },
    /** 查询系统用户 */
    getUserList() {
      listUser({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.userList = response.rows.filter((user) => user.admin !== true);
      });
    },
    doList() {
      this.doListArrCopy = [];
      for (var i = 0; i < this.doListArr.length; i++) {
        this.doListArrCopy.push(this.doListArr[i]);
      }
      console.log(this.doListArr);
      //a 是否设置路线 b 生产量 c 时间 d 生产量临时变量 e 时间临时变量
      let a, b, c, d, e;
      for (let i = 0; i < this.doListArr.length; i++) {
        let item = this.doListArr[i];
        if (item.ssStatus === "1") {
          a = true;
        }
        if (d) {
          if (d !== item.ssProductionQuantity) {
            b = true;
          }
        }
        if (e) {
          if (e !== item.ssDuration) {
            c = true;
          }
        }
        d = item.ssProductionQuantity;
        e = item.ssDuration;
      }
      if (a) {
        this.msgError("有数据已设置路线");
        return;
      }
      if (b) {
        this.msgError("选择数据生产量检测不同");
        return;
      }
      if (c) {
        this.msgError("选择数据时长检测不同");
        return;
      }
      this.showDoList = true;
    },
    upMove(index, row) {
      if (index <= 0) {
        this.$message.error("不能继续向上移动");
      } else {
        const upData = this.doListArrCopy[index - 1];
        this.doListArrCopy.splice(index - 1, 1);
        this.doListArrCopy.splice(index, 0, upData);
      }
    },
    upDown(index, scope) {
      if (index === this.doListArrCopy.length - 1) {
        this.$message.error("不能继续向下移动");
      } else {
        const downData = this.doListArrCopy[index + 1];
        this.doListArrCopy.splice(index + 1, 1);
        this.doListArrCopy.splice(index, 0, downData);
      }
    },
  },
};
</script>
