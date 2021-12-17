<template>
  <div class="Echarts">
    <div id="EchartsThree"></div>
  </div>
</template>
<script>
export default {
  name: "EchartsThree",
  props: {
    temp: {
      type: Object,
    },
  },
  data() {
    return {
      // 指定图表的配置项和数据
      option: {
        color: ["#1155ff"],
        title: {
          text: "出料温度波动分析",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["温度"],
          right: "10%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "温度",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 2,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 0, 255)",
                },
                {
                  offset: 1,
                  color: "rgba(0, 0, 255,0)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("EchartsThree"));

      // 使用刚指定的配置项和数据显示图表。
      if (this.option && typeof this.option === "object") {
        myChart.setOption(this.option);
      }
    },
    cleanItems() {
      this.option.series[0].data = [];
      this.option.xAxis[0].data = [];
    },
  },
  watch: {
    temp() {
      if (this.temp[9].temp) {
        this.cleanItems();
        this.temp[9].temp.forEach((element) => {
          this.option.series[0].data.push(element.information);
          this.option.xAxis[0].data.push(element.dateTime);
          this.myEcharts();
        });
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
  #EchartsThree {
    width: 100%;
    height: 100%;
  }
}
</style>
