<!--  -->
<template>
  <div>
    <!-- Form表单 -->
    <div class="my-form">
      <el-table
        :data="dataList"
        style="width: 100%"
        :cell-style="rowClass"
        :header-cell-style="headClass"
      >
        <el-table-column prop="mwWarehouseName" label="料仓名称"></el-table-column>
        <el-table-column prop="materialId" label="材料名称">
          <template slot-scope="scope">
            <el-select filterable v-model="scope.row.materialId" @change="materialSelectChange(scope.row)" placeholder="请选择">
              <el-option-group
                v-for="material in materialList"
                :key="material.materialId"
                :label="material.materialName">
                <el-option
                  v-for="children in material.children"
                  :key="children.materialId"
                  :label="children.materialName"
                  :value="children.materialId">
                </el-option>
              </el-option-group>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="mwWarehouseQuantity" label="额定量">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.mwWarehouseQuantity"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="updateInfo(scope.row)"
              size="small"
              type="danger"
            >
              确定
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {
    listMaterialWarehouse,
    getMaterialWarehouse,
    delMaterialWarehouse,
    addMaterialWarehouse,
    updateMaterialWarehouse,
    exportMaterialWarehouse
  } from "@/api/manage/materialWarehouse";
  import {listMaterial} from "@/api/manage/material";

  export default {
    data() {
      return {
        dataRange: "",
        checkItem: 1,
        dataList: [],
        //原材数据
        materialList: [],
        materialList1: [],
      };
    },

    components: {},

    computed: {},
    created() {
      this.getList();
      this.getMaterialList();
    },
    methods: {
      updateInfo(row) {
        updateMaterialWarehouse(row).then(response => {
          this.msgSuccess("修改成功");
          this.getList();
        });
      },
      /** 原材下拉事件*/
      materialSelectChange(row) {
        let material = this.materialList1.find((item) => {
          return item.materialId === row.materialId;
        });
        row.materialName = material.materialName;
        this.$forceUpdate();
      },
      /** 获取原材数据 */
      getMaterialList() {
        this.loading = true;
        listMaterial(this.queryParams).then(response => {
          this.materialList1 = response.data;
          this.materialList = this.handleTree(response.data, "materialId", "parentId");
        });
      },
      /** 查询料仓管理列表 */
      getList() {
        listMaterialWarehouse(null).then(response => {
          this.dataList = response.rows;
        });
      },

      // 表头样式设置
      headClass() {
        return "text-align: center;";
      },
      // 表格样式设置
      rowClass() {
        return "text-align: center;";
      },
    },
  };
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
  .my-form {
    padding: 20px 30px;
    display: flex;
  flex-wrap: wrap;

    .my-btnGroup {
      position: relative;

      .my-btnGroupItem {
        position: absolute;
        margin-top: 10px;
        right: 0;
      }
    }
  }
</style>
