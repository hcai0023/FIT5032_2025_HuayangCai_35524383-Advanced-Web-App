import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null);
  const isAuthenticated = ref(false);
  const isAdmin = ref(false);
  
  // 初始化认证状态
  const initAuth = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      currentUser.value = user;
      isAuthenticated.value = true;
      isAdmin.value = user.role === 'admin';
    }
  };
  
  // 登录功能
  const login = (user) => {
    currentUser.value = user;
    isAuthenticated.value = true;
    isAdmin.value = user.role === 'admin';
    localStorage.setItem('currentUser', JSON.stringify(user));
  };
  
  // 登出功能
  const logout = () => {
    currentUser.value = null;
    isAuthenticated.value = false;
    isAdmin.value = false;
    localStorage.removeItem('currentUser');
  };
  
  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    initAuth,
    login,
    logout
  };
});