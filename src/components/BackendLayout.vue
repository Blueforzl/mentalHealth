<script setup>
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import Dashboard from "../views/dashboard.vue";
</script>

<template>
  <div class="common-layout">
    <el-container class="mainContainer">
      <Sidebar />
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  .el-header {
    height: 74px;
  }
  .mainContainer {
    height: 100%;
  }
  .el-main {
    background-color: #fff;
    margin: 19px;
  }
}
</style>