<template>
  <div class="auth-page">
    <h2>{{ langText.title }}</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" :placeholder="langText.email" type="email" required />
      <input v-model="password" :placeholder="langText.password" type="password" required />
      <button type="submit" class="cta-btn">{{ langText.loginBtn }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { inject, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const state = inject('language');
    const authStore = useAuthStore();
    const router = useRouter();

    const langText = computed(() => {
      return state.language === '中文'
        ? {
            title: '登录',
            email: '电子邮件',
            password: '密码',
            loginBtn: '登录',
            invalid: '账号或密码错误，请重试。',
          }
        : {
            title: 'Login',
            email: 'Email',
            password: 'Password',
            loginBtn: 'Login',
            invalid: 'Invalid credentials. Please try again.',
          };
    });

    return {
      langText,
      state,
      authStore,
      router
    };
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    handleLogin() {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === this.email && u.password === this.password);
      
      if (user) {
        // 使用认证存储登录
        this.authStore.login(user);
        
        // 重定向到仪表盘
        this.router.push('/dashboard');
      } else {
        this.error = this.state.language === '中文'
          ? '账号或密码错误，请重试。'
          : 'Invalid credentials. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.cta-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>