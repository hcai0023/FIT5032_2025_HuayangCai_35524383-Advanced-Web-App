<template>
  <div class="dashboard">
    <h1>{{ langText.welcome }}, {{ authStore.currentUser }}</h1>
    
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
        <button class="btn btn-email" @click="showEmailModal = true">
          <i class="icon">✉️</i> {{ langText.sendEmail }}
        </button>
      </div>
    </div>
    
    <div v-if="showEmailModal" class="modal-backdrop">
      <div class="email-modal">
        <div class="modal-header">
          <h3>{{ langText.sendEmail }}</h3>
          <button @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ langText.recipient }}</label>
            <input v-model="emailData.to" type="email" required>
          </div>
          
          <div class="form-group">
            <label>{{ langText.subject }}</label>
            <input v-model="emailData.subject">
          </div>
          
          <div class="form-group">
            <label>{{ langText.message }}</label>
            <textarea v-model="emailData.text" rows="4"></textarea>
          </div>
          
          <div class="form-group">
            <label>{{ langText.attachment }}</label>
            <input type="file" @change="handleAttachment">
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeModal">
            {{ langText.cancel }}
          </button>
          <button 
            class="btn btn-send" 
            @click="sendEmail"
            :disabled="sending"
          >
            <span v-if="sending">{{ langText.sending }}</span>
            <span v-else>{{ langText.send }}</span>
          </button>
        </div>
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
import { inject, computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const state = inject('language');
    const authStore = useAuthStore();
    const showEmailModal = ref(false);
    const sending = ref(false);

    const emailData = ref({
      to: '',
      subject: '',
      text: '',
      attachment: null
    });
    
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
            forum: 'Go to Forum',
            sendEmail: 'Send Emails',
            recipient: 'Recipient',
            subject: 'Subject',
            message: 'Message',
            attachment: 'Attachment',
            cancel: 'Cancel',
            sending: 'Sending',
            send: 'Send'
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
            forum: '前往论坛',
            sendEmail: '发送邮件',
            recipient: '收件人',
            subject: '主题',
            message: '信息',
            attachment: '附件',
            cancel: '取消',
            sending: '发送中',
            send: '已发送', 
          };
    });
    const closeModal = () => {
      showEmailModal.value = false;
      resetForm();
    };

    const resetForm = () => {
      emailData.value = {
        to: '',
        subject: '',
        text: '',
        attachment: null
      };
    };

    const handleAttachment = (event) => {
      emailData.value.attachment = event.target.files[0];
    };

    const sendEmail = async () => {
      sending.value = true;
      
      try {
        const formData = new FormData();
        formData.append('to', emailData.value.to);
        formData.append('subject', emailData.value.subject);
        formData.append('text', emailData.value.text);
        
        if (emailData.value.attachment) {
          formData.append('attachment', emailData.value.attachment);
        }

        const response = await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to send email');
        }
        
        alert(`Success\n${result.info}`);
        closeModal();
      } catch (error) {
        console.error('Email error:', error);
        alert(`Error: ${error.message}`);
      } finally {
        sending.value = false;
      }
    };
    return {
      langText,
      state,
      authStore,
      showEmailModal,
      emailData,
      sending,
      closeModal,
      handleAttachment,
      sendEmail
    };
  },
  
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
.btn-email {
  background-color: #4caf50;
  color: white;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.email-modal {
  background: white;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.form-group textarea {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.btn-cancel {
  background: #f5f5f5;
}

.btn-send {
  background: #4caf50;
  color: white;
}

.btn-send:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>