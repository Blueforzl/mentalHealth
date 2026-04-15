<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon>
          <Back />
        </el-icon>
        <span>返回首页</span>
        <div class="title-text">
          <h2>登录您的账户</h2>
          <p>登录后即可开始使用心理AI助手</p>
        </div>
      </div>
    </div>
    <div class="form-container">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名或邮箱" size="large" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            size="large"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%; margin-top: 40px" type="primary" @click="submitForm(ruleFormRef)"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          还没有账号？
          <el-link style="text-align: center" text-decoration="none" type="primary" @click="handleRegister">
            去注册
          </el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { login } from '@/api/admin';

  const router = useRouter();

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const ruleFormRef = ref(null);
  const formData = reactive({
    username: '',
    password: '',
  });
  const rules = reactive({
    username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  });
  const submitForm = async (formRef) => {
    await formRef.validate((valid, fields) => {
      if (valid) {
        // console.log(formData);
        login(formData).then((data) => {
          if (!data.token) {
            return ElMessage.error('登录失败');
          }

          localStorage.setItem('token', data.token);
          localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
          if (data.userInfo.userType === 2) {
            router.push('/back/dashboard');
          } else {
            router.push('/');
          }
        });
      } else {
        console.log('登录失败');
      }
    });
  };
</script>
<style lang="scss" scoped>
  .container {
    width: 384px;
    .title {
      .back-home {
        margin-bottom: 60px;
      }
      .title-text {
        text-align: center;
        h2 {
          font-size: 64px;
          margin-bottom: 10px;
        }
        p {
          font-size: 18px;
          color: #6b7280;
        }
      }
    }
  }
</style>
