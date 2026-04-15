<script setup>
  import { logout } from '@/api/admin';
  import { useRouter } from 'vue-router';
  import { ElMessageBox } from 'element-plus';
  import { useAdminStore } from '@/store/admin';
  const adminStore = useAdminStore();

  const router = useRouter();
  const brandLogo = new URL('@/assets/imgs/机器人.png', import.meta.url).href;
  const isLogin = adminStore.token !== null;

  async function handleLogout() {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await logout();
        /* localStorage.removeItem('token')
      localStorage.removeItem('userInfo') */
        adminStore.removeAll();
        router.push('/auth/login');
      })
      .catch(() => {});
  }
</script>
<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image style="width: 50px; height: 50px" :src="brandLogo" alt="logo" />
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <template v-if="isLogin">
          <router-link to="/consultation" class="nav-link">AI咨询</router-link>
          <router-link to="/emotion-diary" class="nav-link"> 情绪日记 </router-link>
        </template>
        <router-link to="/knoeledge" class="nav-link">知识库</router-link>
        <el-button v-if="isLogin" @click="handleLogout" class="logout-btn"> 退出登录 </el-button>
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">注册</router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 心理健康AI助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .frontend-layout {
    background-color: #fff;
    .navbar-container {
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .brand-section {
        display: flex;
        align-items: center;
        .brand-name {
          margin-left: 10px;
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
      }
      .nav-section {
        display: flex;
        align-items: center;
        gap: 40px;
        .nav-link {
          color: #4b5563;
          font-size: 16px;
          font-weight: 500;
          &:hover {
            color: #4a90e2;
          }
        }
      }
    }

    .footer-container {
      background: #1f2937;
      color: white;
      padding: 15px 0;
      margin-top: auto;
      .footer-bottom {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 10px;
        text-align: center;
      }
    }
  }
</style>
