<script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const robotImage = new URL('@/assets/imgs/robot-fill.png', import.meta.url).href;
</script>
<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">
          欢迎来到
          <br />
          <span class="highlight-text">心理健康AI助手</span>
        </h2>
        <p class="description">我们的AI助手可以帮助你识别和管理情绪，提供个性化的咨询服务。</p>
        <div class="hero-actions">
          <el-button @click="router.push('/consultation')" style="border-color: #fff" size="large">
            开始倾诉，获得陪伴
          </el-button>
          <el-button color="transparent" style="border-color: #fff" size="large" @click="router.push('/emotion-diary')">
            记录心情，释放情感
          </el-button>
        </div>
      </div>
      <div class="robot">
        <el-image style="width: 150px; height: 150px" :src="robotImage" alt="机器人" class="robot-image" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .home-container {
    background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95);
    color: white;
    padding: 5rem 0;
    height: calc(100vh - 285px);
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
      .text {
        width: 500px;
        .title {
          font-size: 45px;
          font-weight: bold;
          // line-height: 1.2;
          margin-bottom: 15px;
          .highlight-text {
            color: #ffd700;
          }
        }
        .hero-actions {
          margin-top: 30px;
        }
      }
      .robot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        height: 260px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
        box-shadow:
          0 15px 35px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }
    }
  }
</style>
