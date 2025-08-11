<template>
  <div class="auth-page">
    <h2>{{ langText.title }}</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="email" :placeholder="langText.email" type="email" required />
      <input v-model="password" :placeholder="langText.password" type="password" required />
      <p v-if="password && !isStrongPassword" class="error">{{ langText.error }}</p>
      
      <div class="role-selector">
        <label>
          <input type="radio" v-model="role" value="user" checked />
          <span>{{ langText.user }}</span>
        </label>
        <label>
          <input type="radio" v-model="role" value="admin" />
          <span>{{ langText.admin }}</span>
        </label>
      </div>
      
      <button type="submit" class="cta-btn" :disabled="!isStrongPassword">{{ langText.signupbtn }}</button>
    </form>
    <p v-if="message" class="success">{{ message }}</p>
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
          title: '注册',
          email: '电子邮件',
          password: '密码',
          error: '密码必须至少有 8 个字符，包括数字、大写字母和特殊字符。',
          role: '请选择身份',
          user: '用户',
          admin: '管理员',
          signupbtn: '注册',
        }
      : {
          title: 'Register',
          email: 'Email',
          password: 'Password',
          error: 'Password must be at least 8 characters and include a number, uppercase letter, and special character.',
          role: 'Select Role',
          user: 'User',
          admin: 'Admin',
          signupbtn: 'Sign Up',
       }
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
      role: 'user',
      message: '',
    };
  },
  computed: {
    isStrongPassword() {
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      return strongRegex.test(this.password);
    },
  },
  methods: {
    handleRegister() {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const exists = users.find(u => u.email === this.email);
      
      if (exists) {
        this.message = this.state.language === '中文'
          ? '电子邮件已注册。'
          : 'Email already registered.';
        return;
      }

      const newUser = {
        email: this.email,
        password: this.password,
        role: this.role,
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // 自动登录新注册用户
      this.authStore.login(newUser);
      
      this.message = this.state.language === '中文'
        ? '注册成功！正在跳转到仪表板...'
        : 'Registration successful! Redirecting to dashboard...';
      
      // 重定向到仪表盘
      setTimeout(() => {
        this.router.push('/dashboard');
      }, 1500);
      
      this.email = this.password = '';
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
input, select {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.role-selector {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
}
.role-selector label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
.cta-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
.cta-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.error {
  color: red;
  font-size: 14px;
  text-align: left;
  margin-top: -5px;
  margin-bottom: 10px;
}
.success {
  color: green;
  margin-top: 10px;
}
</style>