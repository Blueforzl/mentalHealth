<template>
  <el-aside :width="isCollapsed ? '64px' : '264px'">
    <el-menu
      :collapse-transition="false"
      :collapse="isCollapsed"
      default-active="2"
      class="sidebarMenu"
    >
      <div class="brand">
        <el-image :src="iconUrl" class="brandIcon" />
        <div v-show="!isCollapsed" class="infoCard">
          <h1 class="brandTitle">心理健康AI助手</h1>
          <p class="brandSubtitle">管理后台</p>
        </div>
      </div>
      <el-menu-item
        @click="handleSelect"
        v-for="item in router.options.routes[0].children"
        :key="item.path"
        :index="item.path"
      >
        <el-icon><component :is="item.meta?.icon" /></el-icon>
        <span>{{ item.meta?.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router";
const iconUrl = new URL("../assets/imgs/机器人.png", import.meta.url).href;
const router = useRouter();
import { computed } from "vue";
import { useAdminStore } from "@/store/admin";
const adminStore = useAdminStore();

const isCollapsed = computed(() => adminStore.isCollapsed);

const handleSelect = (key) => {
  console.log(key.index);
  const currentRoute = router.options.routes[0];
  // console.log(`${currentRoute.path}/${key}`);
  router.push(`${currentRoute.path}/${key.index}`);
};
</script>
<style lang="scss" scoped>
.sidebarMenu {
  height: 100%;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #ffffff;
  .infoCard {
    .brandTitle {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #1f2937;
    }
    .brandSubtitle {
      font-size: 14px;

      color: #6b7280;
    }
  }
}
.brandIcon {
  width: 50px;
  height: 50px;
}
</style>
