<script setup>
  import { ref } from 'vue';
  import { register } from '@/api/front';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const formData = ref({
    username: '',
    email: '',
    nickname: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 1,
    userType: 1,
  });
  const rules = ref({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '请再次确认密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== formData.value.password) {
            callback(new Error('两次输入密码不一致'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  });
  const formRef = ref(null);
  const submitForm = async () => {
    await formRef.value.validate();
    const res = await register(formData.value);
    if (res.data?.code === 'BUSINESS_ERROR') {
      ElMessage.error(res.data.message || '注册失败');
      return;
    }
    ElMessage.success('注册成功');
    router.push('/auth/login');
  };
</script>
<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>注册</h2>
        <p>请注册您的账号</p>
      </div>
    </div>
    <div class="form-container">
      <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称（可选）"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号（可选）"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" placeholder="请再次确认密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" @click="submitForm"> 注册 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .container {
    width: 384px;
    .flex-box {
      display: flex;
      align-items: center;
    }
    .title {
      .title-text {
        text-align: center;
        h2 {
          font-size: 36px;
          margin-bottom: 10px;
        }
        p {
          font-size: 18px;
          color: #6b7280;
        }
      }
    }
    .form-container {
      margin-top: 30px;
      .btn {
        margin-top: 40px;
        width: 100%;
      }
      .footer {
        padding: 30px;
        text-align: center;
      }
    }
  }
</style>
