import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Booking from '../views/Booking.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import About from '../views/About.vue'
import Forum from '@/views/Forum.vue';
import Resources from '@/views/Resources.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { 
    path: '/', 
    component: Home,
    meta: { public: true } 
  },
  { 
    path: '/booking', 
    component: Booking,
    meta: { requiresAuth: true }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    component: Login,
    meta: { public: true, hideWhenAuthenticated: true }
  },
  { 
    path: '/register', 
    component: Register,
    meta: { public: true, hideWhenAuthenticated: true }
  },
  { 
    path: '/about', 
    component: About,
    meta: { public: true }
  },
  { 
    path: '/forum', 
    component: Forum,
    meta: { public: true }
  },
  { 
    path: '/resources', 
    component: Resources,
    meta: { public: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  console.log(`Navigating to: ${to.path}`)
  // 确保认证状态是最新的
  if (!authStore.isAuthenticated) {
    authStore.initAuth();
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }
  
  // 检查是否已登录用户访问登录/注册页
  if (to.meta.hideWhenAuthenticated && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }
  
  next();
});

export default router;