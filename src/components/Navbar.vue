<template>
  <div class="navbar">
    <div class="flexbox">
      <el-button @click="handleCollapsed">
        <el-icon>
          <component :is="adminStore.isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </el-button>
      <p class="pageTitle">导航栏</p>
    </div>
    <div class="flexbox">
      <el-dropdown @command="handleCommand">
        <div class="flexbox">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            class="brandIcon"
          />
          <span>admin</span>
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { useAdminStore } from "@/store/admin";
const adminStore = useAdminStore();
const iconUrl = new URL("@/assets/imgs/user.jpg", import.meta.url).href;
const handleCommand = (command) => {
  if (command === "logout") {
    console.log(command);
    // 退出登录逻辑
  }
};
const handleCollapsed = () => {
  adminStore.toggleCollapsed();
};
</script>
<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: fLex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;
  .flexbox {
    display: flex;
    justify-content: center;
    align-items: center;
    .pageTitle {
      font-size: 20px;
      font-weight: bold;
      margin-left: 20px;
      color: #1f2937;
    }
  }
}
.brandIcon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>

