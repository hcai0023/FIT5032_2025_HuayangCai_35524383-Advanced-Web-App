<template>
  <div>
    <header class="header">
      <div class="logo">[LOGO]</div>
      <nav class="nav-links">
        <router-link to="/" class="home-icon">🏠</router-link>
        <router-link to="/about">{{ langText.about }}</router-link>
        <router-link to="/resources">{{ langText.resources }}</router-link>
        <router-link to="/booking">{{ langText.services }}</router-link>
        <router-link to="/forum">{{ langText.forum }}</router-link>
        <button class="lang-btn" @click="toggleLanguage">🌐{{ state.language }}</button>
        
        <!-- 用户状态显示 -->
        <div v-if="authStore.isAuthenticated" class="user-info">
          <router-link to="/dashboard">
            <span class="username">{{ authStore.currentUser.email }}</span>
          </router-link>
          <span v-if="authStore.isAdmin" class="admin-badge">ADMIN</span>
          <button @click="logout" class="logout-btn">{{ langText.logout }}</button>
        </div>
        <div v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="login-btn">{{ langText.login }}</router-link>
          <router-link to="/register" class="signup-btn">{{ langText.signup }}</router-link>
        </div>
      </nav>
    </header>
    <router-view></router-view>
    <footer class="footer">
      <div class="footer-content">
        <div class="logo">[LOGO]</div>
        <div>
          <p>{{ langText.latestBlog }}</p>
          <p>{{ langText.ready }}</p>
          <p>{{ langText.intro }}</p>
        </div>
        <div class="footer-links">
          <p>{{ langText.product }}</p>
          <p>{{ langText.company }}</p>
          <p>{{ langText.privacy }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { provide, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'App',
  setup() {
    const state = reactive({
      language: localStorage.getItem('language') || 'EN',
    });
    
    const authStore = useAuthStore();
    
    // 初始化认证状态
    onMounted(() => {
      authStore.initAuth();
    });

    const toggleLanguage = () => {
      state.language = state.language === 'EN' ? '中文' : 'EN';
      localStorage.setItem('language', state.language);
    };

    provide('language', state);
    provide('toggleLanguage', toggleLanguage);

    const langText = computed(() => {
      return state.language === 'EN'
        ? {
            about: 'About',
            resources: 'Resources',
            services: 'Services',
            forum: 'Forum',
            login: 'Log in',
            signup: 'Sign up',
            logout: 'Logout',
            latestBlog: 'Latest Blog Post',
            ready: 'Ready to get started?',
            intro: '[Introduction of the distinguished health charity]',
            product: 'Product',
            company: 'Company',
            privacy: 'Privacy — Terms',
          }
        : {
            about: '关于我们',
            resources: '资源',
            services: '服务项目',
            forum: '论坛',
            login: '登录',
            signup: '注册',
            logout: '退出',
            latestBlog: '最新博客',
            ready: '准备好开始了吗？',
            intro: '【知名健康慈善组织的简介】',
            product: '产品',
            company: '公司',
            privacy: '隐私 - 条款',
          };
    });
    
    // 登出功能
    const logout = () => {
      authStore.logout();
    };

    return { state, toggleLanguage, langText, authStore, logout };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}
.logo {
  font-weight: bold;
  font-size: 18px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
}
.nav-links a, .nav-links button {
  text-decoration: none;
  /* background: none; */
  /* border: none; */
  cursor: pointer;
  font-size: 14px;
}
.nav-links button {
  padding: 6px 12px;
  border-radius: 4px;
}
.login-btn {
  border: 1px solid #000;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  padding: 6px 12px;
  border-radius: 8px;
}
.login-btn:hover {
  background-color: #000000;
  color: white;
}
.signup-btn {
  border: 1px solid #000;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 6px 12px;
  border-radius: 4px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.username {
  font-weight: 500;
}
.admin-badge {
  background-color: #ffc107;
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
.logout-btn {
  background-color: #f8f9fa;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}
.logout-btn:hover {
  background-color: #dc3545;
  color: white;
}
.home-icon {
  font-size: 18px;
}
.footer {
  background-color: #f8f8f8;
  padding: 40px 20px;
}
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.footer-links p {
  margin: 5px 0;
}
.lang-btn {
  background-color: white;
  color: black;
  border: 1px solid #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>