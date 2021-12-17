<template>
  <div>
    <div class="top-title clearfix">
      <img src="../../../assets/images/top_title.png" alt="" />
      <h1>沥青搅拌站智慧生产管控系统</h1>
    </div>

    <div class="main">
      <div class="section1 fl">
        <div class="section1-top">
          <div class="section1-top-item">
            <div class="intro-text"><em></em>累计生产总量</div>
            <div class="produce-num"><span id="productTotal">0</span>吨</div>
          </div>
          <div class="section1-top-item">
            <div class="intro-text"><em></em>当日生产总量</div>
            <div class="produce-num"><span id="curdayProductTotal">0</span>吨</div>
          </div>
          <div class="section1-top-item">
            <div class="intro-text"><em></em>当日发货总量</div>
            <div class="produce-num"><span id="curdayFahuoTotal">0</span>吨</div>
          </div>
        </div>
        <div class="section1-bottom">
          <h2>拌站场区视频监控画面
            <!--<a href="http://192.168.2.222" target="_blank" class="fr">查看全部监控</a>-->
          </h2>
          <div class="video-list" id="zhanvideo">

          </div>
        </div>
      </div>

      <div class="section2 fl">
        <div class="section2-top">
          <h2>运输车辆地图</h2>
          <div id="map"></div>
        </div>
        <div class="section2-bottom">
          <div class="section2-bottom-item fl">
            <h2>生产消耗</h2>
            <div class="chuhuo-list">
              <table cellpadding="20" cellspacing="0">
                <thead>
                <tr>
                  <th>时间</th>
                  <th>集料</th>
                  <th>添加剂</th>
                  <th>矿粉</th>
                  <th>沥青</th>
                </tr>
                </thead>
                <tbody id="productList"></tbody>
              </table>
            </div>
          </div>
          <div class="section2-bottom-item fr">
            <h2>出货详情</h2>
            <div class="chuhuo-list">
              <table cellpadding="20" cellspacing="0">
                <thead>
                <tr>
                  <th>项目名称</th>
                  <th>车牌号</th>
                  <th>净重</th>
                  <th>出货时间</th>
                </tr>
                </thead>
                <tbody id="chuhuo"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="section3 fl">
        <div class="section3-top1">
          <h1 class="fl" style="margin-left: 1rem;">生产状态:&nbsp;<span id="produceState"></span></h1>
          <h1>生产材料:&nbsp;<span id="productName"></span></h1>
        </div>
        <div class="section3-top">
          <h2>生产数据</h2>
          <div class="section3-top-content">
            <div class="section3-top-item">
              <div id="guliao" style="width:120px;height:100px;margin-bottom: 0;"></div>
            </div>
            <div class="section3-top-item">
              <div id="chuliao" style="width:120px;height:100px;margin-bottom: 0;"></div>
            </div>
            <div class="section3-top-item">
              <div id="ratio" style="width:120px;height:100px;margin-bottom: 0;"></div>
            </div>
          </div>
        </div>
        <div class="section3-bottom">
          <div class="section3-chart1">
            <h2>油石比</h2>
            <div id="lineChart1"></div>
          </div>

          <div class="section3-chart2">
            <h2>温度</h2>
            <div id="lineChart2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "index",
    mounted() {
      //宽度自适应
      this.$nextTick(() => {
        let deviceWidth = document.documentElement.clientWidth;
        document.documentElement.style.fontSize = deviceWidth / 96+ 'px';
        document.querySelector('body').setAttribute('style', 'background-color:#153052');
        window.onresize = function(){
          let deviceWidth = document.documentElement.clientWidth;
          document.documentElement.style.fontSize = deviceWidth / 96+ 'px';
        };
      });
    },
    beforeDestroy() {
      document.querySelector('body').setAttribute('style', 'background-color:#ffffff');
    },
    metaInfo: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' }
      ]
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/common2.css";
  @import "~@/assets/styles/index2.css";
</style>
