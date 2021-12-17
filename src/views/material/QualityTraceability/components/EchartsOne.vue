<template>
  <div class="Echarts">
    <div id="EchartsOne"></div>
  </div>
</template>

<script>
export default {
  name: "EchartsOne",
  props: {
    tableDataItem: {
      type: Array,
    },
  },
  data() {
    return {
      // 指定图表的配置项和数据
      option: {
        title: {
          text: "合成级配曲线图",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["上限值", "下限值", "中间值", "实际值"],
          right: "10%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "0.07",
            "0.15",
            "0.3",
            "0.6",
            "1.18",
            "2.36",
            "4.75",
            "9.5",
            "13.2",
            "16",
            "19",
            "26.5",
            "31.5",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "上限值",
            type: "line",
            data: [],
            smooth: true,
          },
          {
            name: "下限值",
            type: "line",
            data: [],
            smooth: true,
          },
          {
            name: "中间值",
            type: "line",
            data: [],
            smooth: true,
          },
          {
            name: "实际值",
            type: "line",
            data: [],
            smooth: true,
          },
        ],
      },
    };
  },
  methods: {
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("EchartsOne"));
      // 使用刚指定的配置项和数据显示图表。
      // 使用刚指定的配置项和数据显示图表。
      if (this.option && typeof this.option === "object") {
        myChart.setOption(this.option);
      }
    },
    cleanItems() {
      this.option.series[0].data = [];
      this.option.series[1].data = [];
      this.option.series[2].data = [];
      this.option.series[3].data = [];
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.myEcharts();
    });
  },
  watch: {
    tableDataItem() {
      if (this.tableDataItem) {
        this.cleanItems();
        for (let i = 0; i < this.tableDataItem.length; i++) {
          this.option.series[i].data[0] = this.tableDataItem[i].one;
          this.option.series[i].data[1] = this.tableDataItem[i].thirteen;
          this.option.series[i].data[2] = this.tableDataItem[i].two;
          this.option.series[i].data[3] = this.tableDataItem[i].three;
          this.option.series[i].data[4] = this.tableDataItem[i].four;
          this.option.series[i].data[5] = this.tableDataItem[i].five;
          this.option.series[i].data[6] = this.tableDataItem[i].six;
          this.option.series[i].data[7] = this.tableDataItem[i].seven;
          this.option.series[i].data[8] = this.tableDataItem[i].eight;
          this.option.series[i].data[9] = this.tableDataItem[i].nine;
          this.option.series[i].data[10] = this.tableDataItem[i].ten;
          this.option.series[i].data[11] = this.tableDataItem[i].eleven;
          this.option.series[i].data[12] = this.tableDataItem[i].twelve;
        }
        this.myEcharts();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.Echarts {
  width: 100%;
  height: 500px;
  #EchartsOne {
    width: 100%;
    height: 100%;
  }
}
</style>
