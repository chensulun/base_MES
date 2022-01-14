<template>
  <div class="Echarts">
    <div id="EchartsOne"></div>
  </div>
</template>
<script>
export default {
  name: "EchartsOne",
  props: {
    tableData: {
      type: Array,
    },
  },
  data() {
    return {
      // 指定图表的配置项和数据
      option: {
        title: {
          text: "骨料波动分析",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [],
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
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
    };
  },
  methods: {
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("EchartsOne"));

      // 使用刚指定的配置项和数据显示图表。
      if (this.option && typeof this.option === "object") {
        myChart.setOption(this.option);
      }
    },
    cleanItems() {
      this.option.legend.data = [];
      this.option.series = [];
      this.option.xAxis.data = [];
    },
  },
  watch: {
    tableData() {
      if (this.tableData) {
        this.cleanItems();
        var arr = this.tableData.slice(0, -2);
        arr.forEach((i) => {
          //整理数据开始
          let name = Object.keys(i)[0];
          let nameCN=''
          name.indexOf("ONE") > -1 ? (nameCN = "仓1") : null;
          name.indexOf("TWO") > -1 ? (nameCN = "仓2") : null;
          name.indexOf("THREE") > -1 ? (nameCN = "仓3") : null;
          name.indexOf("FOUR") > -1 ? (nameCN = "仓4") : null;
          name.indexOf("FIVE") > -1 ? (nameCN = "仓5") : null;
          name.indexOf("SIX") > -1 ? (nameCN= "粉料1") : null;
          name.indexOf("SIX1") > -1 ? (nameCN = "仓6") : null;
          name.indexOf("SEVEN") > -1 ? (nameCN = "粉料2") : null;
          name.indexOf("SEVEN_1") > -1 ? (nameCN = "粉料3") : null;
          i.name = nameCN;
          i.type = "line";
          i.smooth = true;
          i.data = [];
          i[name].forEach((j) => {
            if (j) {
              i.data.push(j.information);
            }
          });
          //整理数据结束
          this.option.legend.data.push(nameCN); //图例
          this.option.series.push(i); //y轴
        });
        var dateObj = this.tableData[this.tableData.length - 1];
        var key = Object.keys(dateObj)[0];
        var items = dateObj[key];
        items.forEach((k) => {
          this.option.xAxis.data.push(k.dateTime); //x轴
        });
        this.myEcharts();
      }
    },
  },
  mounted() {
    this.myEcharts();
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
