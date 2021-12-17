<template>
  <div class="echart" :style="{height:'280px',width:'100%'}" />
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el);
      this.setOptions(this.chartData);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
    setOptions({ name, xData,yData } = {}) {
      this.chart.setOption({
        grid: {
          top: 30,
          left: 40,
          right:0,
          bottom:'20%'
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data:xData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#148976'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#fff'
            }
          },
					axisLabel: {
						show:false
					},   //隐藏x轴的刻度lable
          tooltip: {
            trigger: 'axis',
          }
        },
        yAxis: {
          name:name,
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#148976'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#fff'
            }
          },
        },
        series: [{
          name:name,
          type: 'line',
          data: yData,
          smooth: true,
          itemStyle: {
            color: '#00CAB0'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#5BC450'
              }, {
                offset: 1,
                color: '#ffe'
              }])
            }
          }
        }]
      })
    }
  }
}
</script>
