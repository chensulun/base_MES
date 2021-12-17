<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!topNav"
    />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <el-dropdown @command="handleCommandSite">
        <span class="el-dropdown-link">
          {{ siteName }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="mixingStation in mixingStationList"
            :command="mixingStation"
          >
            {{ mixingStation.msName }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown @command="handleCommandEquipment">
        <span class="el-dropdown-link">
          {{ equipmentName }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="equipment in equipmentList"
            :command="equipment"
            >{{ equipment.peName }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown @command="handleCommandPoundRoom">
        <span class="el-dropdown-link">
          {{ poundRoomName }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="poundRoom in poundRoomList"
            :command="poundRoom"
            >{{ poundRoom.prName }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import drGit from "@/components/RuoYi/Git";
import drDoc from "@/components/RuoYi/Doc";
import { listMixingStationByRole } from "@/api/manage/mixingStation";
import { listProductionEquipment } from "@/api/manage/productionEquipment";
import { listPoundRoom } from "@/api/manage/poundRoom";
import {
  getMS,
  setMS,
  removeMS,
  getMSId,
  setMSId,
  removeMSId,
  getEquipment,
  setEquipment,
  removeEquipment,
  getEquipmentId,
  setEquipmentId,
  removeEquipmentId,
  getEquipmentUrl,
  setEquipmentUrl,
  removeEquipmentUrl,
  getEquipmentWS,
  setEquipmentWS,
  removeEquipmentWS,
  setPrId,
  setPeId,
  getPrId,
  removePrId,
  removePeId,
  setPrName,
  getPrName,
  removePrName,
} from "@/utils/station";

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    drGit,
    drDoc,
  },
  data() {
    return {
      siteName: "请选择站点",
      equipmentName: "请选择设备",
      poundRoomName: "请选择库房",
      //站点
      mixingStationList: [],
      //设备
      equipmentList: [],
      //库房
      poundRoomList: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav;
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
    },
    handleCommandSite(command) {
      let ms = getMS();
      if (command.msName === ms) {
        return;
      }
      this.siteName = command.msName;
      setMS(command.msName);
      setMSId(command.msId);
      removeEquipment();
      removeEquipmentId();
      removeEquipmentUrl();
      removeEquipmentWS();
      removePrId();
      removePeId();
      removePrName();
      this.equipmentName = "请选择设备";
      this.poundRoomName = "请选择磅房";
      this.getEquipmentList(command.msId);
      this.getPoundRoomList(command.msId);
      location.reload();
    },
    handleCommandEquipment(command) {
      let pe = getEquipment();
      if (command.peName === pe) {
        return;
      }
      this.equipmentName = command.peName;
      console.log(command);
      setEquipment(command.peName);
      setEquipmentId(command.prId);
      setEquipmentUrl(command.peUrl);
      setEquipmentWS(command.peDatabase);
      setPeId(command.peId);
      location.reload();
    },
    handleCommandPoundRoom(command) {
      let pr = getPrName();
      if (command.prName === pr) {
        return;
      }
      this.poundRoomName = command.prName;
      setPrId(command.prId);
      setPrName(command.prName);
      location.reload();
    },
    /** 查询站点信息列表 */
    getMixingStationList() {
      listMixingStationByRole(null).then((response) => {
        this.mixingStationList = response.rows;
        let ms = getMS();
        if (!ms || ms.length <= 0) {
          console.log("初始化加载站点信息");
          if (this.mixingStationList.length > 0) {
            let mixingStation = this.mixingStationList[0];
            setMS(mixingStation.msName);
            setMSId(mixingStation.msId);
            this.siteName = mixingStation.msName;
            this.getEquipmentList(mixingStation.msId);
            this.getPoundRoomList(mixingStation.msId);
          }
        }
      });
    },
    /** 查询站点设备信息列表 */
    getEquipmentList(msId) {
      listProductionEquipment({ msId: msId }).then((response) => {
        this.equipmentList = response.rows;
        let equipment = getEquipment();
        if (!equipment || equipment <= 0) {
          console.log("初始化加载设备信息");
          if (this.equipmentList.length > 0) {
            let equipment = this.equipmentList[0];
            setEquipment(equipment.peName);
            setEquipmentId(equipment.prId);
            setEquipmentUrl(equipment.peUrl);
            setEquipmentWS(equipment.peDatabase);
            setPeId(equipment.peId);
            this.equipmentName = equipment.peName;
          }
        }
      });
    },

    /** 查询磅房信息列表 */
    getPoundRoomList(msId) {
      listPoundRoom({ msId: msId }).then((response) => {
        console.log(response.rows);
        this.poundRoomList = response.rows;
        let prName = getPrName();
        if (!prName || prName <= 0) {
          console.log("初始化加载磅房信息");
          if (this.poundRoomList.length > 0) {
            let pr = this.poundRoomList[0];
            setPrId(pr.prId);
            setPrName(pr.prName);
            this.poundRoomName = pr.prName;
          }
        }
      });
    },
    initShow() {
      let ms = getMS();
      if (ms && ms.length > 0) {
        this.siteName = ms;
      }
      let equipment = getEquipment();
      if (equipment && equipment.length > 0) {
        this.equipmentName = equipment;
      }
      let prName = getPrName();
      if (prName && prName.length > 0) {
        this.poundRoomName = prName;
      }
    },
  },
  created() {
    this.getMixingStationList();
    this.initShow();
    let msId = getMSId();
    if (msId) {
      this.getEquipmentList(msId);
      this.getPoundRoomList(msId);
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #5a5e66;
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 15px;
  vertical-align: text-bottom;
}
</style>
