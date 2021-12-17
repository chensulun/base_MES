<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col v-for="video in videoData" :key="video.monitorId" :sm="12" :md="12" :lg="8" :xl="8">
        <video class="video" controls  :ref="video.monitorId"></video>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Hls from "hls.js";
  import { listMonitor} from "@/api/manage/monitor";
  import {getMSId} from '@/utils/station'

  export default {
    name: "index",
    data() {
      return {
        videoData: [],
        // 查询参数
        queryParams: {
          monitorType: 0,
          msId: null,
        },
      }
    },
    methods: {
      /**初始化查询数据 */
      initQueryData(){
        this.queryParams.monitorType = this.$route.name;
        this.queryParams.msId = getMSId();
      },
      /** 查询监控管理列表 */
      getList() {
        if (this.queryParams.monitorType == null || this.queryParams.msId == null) {
          return;
        }
        let _this = this;
        listMonitor(this.queryParams).then(response => {
          this.videoData = response.rows;

          _this.loadVideoFn();
        });
      },
      destroyHls: function () {
        let _this = this;
        for (let i = 0; i < _this.videoData.length; i++) {
          let video = _this.videoData[i];
          if (video.hls) {
            _this.$refs[video.monitorId][0].pause();
            video.hls.destroy();
            video.hls = null;
          }

        }
      },
      loadVideoFn: function () {
        let _this = this;
        this.$nextTick(() => {
          if (Hls.isSupported()) {
            for (let i = 0; i < _this.videoData.length; i++) {
              let video = _this.videoData[i];
              let hls = new Hls();
              hls.loadSource(video.monitorUrl);
              hls.attachMedia(_this.$refs[video.monitorId][0]);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('加载成功');
                _this.$refs[video.monitorId][0].play();
              });
              hls.on(Hls.Events.ERROR, (event, data) => {
                // console.log(event, data);
                // 监听出错事件
                console.log('加载失败');
              });
              _this.videoData[i].hls = hls;
            }
          }
        });
      },
    },
    created: function () {
      let _this = this;
      _this.$once('hook:beforeDestroy', () => {
        _this.destroyHls()
      });
      _this.initQueryData();
      _this.getList();

    },
    mounted() {
      //加载视频
      //let _this = this;
      //_this.loadVideoFn();
    }
  }
</script>

<style  lang="scss" scoped>
  .video {
    /*overflow: hidden;
    position: relative;*/
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
