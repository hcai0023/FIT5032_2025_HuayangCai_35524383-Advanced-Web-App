<template>
  <div class="dashboard">
    <h1>{{ langText.welcome }}, {{ authStore.currentUser.email }}</h1>
    
    <div v-if="authStore.isAdmin" class="admin-section">
      <h2>{{ langText.adminPanel }}</h2>
      <div class="admin-stats">
        <div class="stat-card">
          <h3>42</h3>
          <p>{{ langText.users }}</p>
        </div>
        <div class="stat-card">
          <h3>128</h3>
          <p>{{ langText.bookings }}</p>
        </div>
        <div class="stat-card">
          <h3>24</h3>
          <p>{{ langText.pending }}</p>
        </div>
      </div>
      
      <div class="admin-actions">
        <button class="btn btn-primary">
          <i class="icon">👥</i> {{ langText.manageUsers }}
        </button>
        <button class="btn btn-secondary">
          <i class="icon">📊</i> {{ langText.viewReports }}
        </button>
      </div>
    </div>
    
    <div class="user-content">
      <h2>{{ langText.yourActivities }}</h2>
      <div class="activity-list">
        <div class="activity">
          <i class="icon">📅</i>
          <div>
            <h3>{{ langText.upcomingBooking }}</h3>
            <p>{{ langText.tomorrow }} 10:00 AM</p>
          </div>
        </div>
        <div class="activity">
          <i class="icon">💬</i>
          <div>
            <h3>{{ langText.recentForumPost }}</h3>
            <p>{{ langText.healthTips }}</p>
          </div>
        </div>
      </div>
      
      <div class="user-actions">
        <router-link to="/booking" class="btn btn-primary">
          <i class="icon">➕</i> {{ langText.newBooking }}
        </router-link>
        <router-link to="/forum" class="btn btn-secondary">
          <i class="icon">💬</i> {{ langText.forum }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const state = inject('language');
    const authStore = useAuthStore();
    
    const langText = computed(() => {
      return state.language === 'EN'
        ? {
            welcome: 'Welcome',
            adminPanel: 'Admin Panel',
            users: 'Users',
            bookings: 'Bookings',
            pending: 'Pending',
            manageUsers: 'Manage Users',
            viewReports: 'View Reports',
            yourActivities: 'Your Activities',
            upcomingBooking: 'Upcoming Booking',
            tomorrow: 'Tomorrow',
            recentForumPost: 'Recent Forum Post',
            healthTips: 'Health Tips for Beginners',
            newBooking: 'New Booking',
            forum: 'Go to Forum'
          }
        : {
            welcome: '欢迎',
            adminPanel: '管理员面板',
            users: '用户',
            bookings: '预定',
            pending: '待处理',
            manageUsers: '管理用户',
            viewReports: '查看报告',
            yourActivities: '您的活动',
            upcomingBooking: '即将到来的预约',
            tomorrow: '明天',
            recentForumPost: '最近的论坛帖子',
            healthTips: '初学者健康提示',
            newBooking: '新建预约',
            forum: '前往论坛'
          };
    });
    
    return {
      langText,
      state,
      authStore
    };
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}

.admin-section, .user-content {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.admin-stats {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.stat-card {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0;
  color: #0d6efd;
}

.admin-actions, .user-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: 500;
}

.icon {
  font-size: 1.2rem;
}

.activity-list {
  margin: 20px 0;
}

.activity {
  display: flex;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;
}

.activity .icon {
  font-size: 2rem;
}

.activity h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.activity p {
  margin: 0;
  color: #666;
}
</style>