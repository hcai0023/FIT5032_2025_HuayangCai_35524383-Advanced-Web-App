<template>
  <div class="dashboard">
    <h1>{{ langText.welcome }}, {{ authStore.currentUser }}</h1>
    
    <div v-if="authStore.isAdmin()" class="admin-section">
      <h2>{{ langText.adminPanel }}</h2>
      <!-- 用户管理表格 -->
      <div class="table-section">
        <div class="table-header">
          <h3>{{ langText.userManagement }}</h3>
          <div class="table-controls">
            <button class="btn btn-primary" @click="exportUserCSV">
              <i class="icon">📝</i> {{ langText.exportCSV }}
            </button>
            <button class="btn btn-secondary" @click="exportUserPDF">
              <i class="icon">📄</i> {{ langText.exportPDF }}
            </button>
          </div>
        </div>
        
        <!-- 表格搜索和过滤 -->
        <div class="table-filters">
          <div class="global-search">
            <input 
              v-model="userTable.search" 
              :placeholder="langText.globalSearch"
            >
          </div>
          
          <div class="column-filters">
            <div v-for="(col, index) in userColumns" :key="index" class="column-filter">
              <input 
                v-model="userTable.columnFilters[col.field]"
                :placeholder="langText.search + ' ' + col.title"
              >
            </div>
          </div>
        </div>
        
        <!-- 用户表格 -->
        <div class="table-container">
          <table class="interactive-table">
            <thead>
              <tr>
                <th v-for="(col, index) in userColumns" :key="index" 
                    @click="sortTable('user', col.field)"
                    :class="{ active: userTable.sortField === col.field }">
                  {{ col.title }}
                  <span v-if="userTable.sortField === col.field">
                    {{ userTable.sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, userIndex) in paginatedUserData" :key="userIndex">
                <td v-for="(col, colIndex) in userColumns" :key="colIndex">
                  {{ user[col.field] }}
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 分页控件 -->
          <div class="pagination">
            <button @click="prevUserPage" :disabled="userTable.currentPage === 1">
              {{ langText.prev }}
            </button>
            <span>
              {{ langText.page }} {{ userTable.currentPage }} {{ langText.of }} {{ userTotalPages }}
            </span>
            <button @click="nextUserPage" :disabled="userTable.currentPage >= userTotalPages">
              {{ langText.next }}
            </button>
          </div>
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
      <!-- 预约表格 -->
      <div class="table-section">
        <div class="table-header">
          <h3>{{ langText.appointmentHistory }}</h3>
          <div class="table-controls">
            <button class="btn btn-primary" @click="exportAppointmentCSV">
              <i class="icon">📝</i> {{ langText.exportCSV }}
            </button>
            <button class="btn btn-secondary" @click="exportAppointmentPDF">
              <i class="icon">📄</i> {{ langText.exportPDF }}
            </button>
          </div>
        </div>
        
        <!-- 表格搜索和过滤 -->
        <div class="table-filters">
          <div class="global-search">
            <input 
              v-model="appointmentTable.search" 
              :placeholder="langText.globalSearch"
            >
          </div>
          
          <div class="column-filters">
            <div v-for="(col, index) in appointmentColumns" :key="index" class="column-filter">
              <input 
                v-model="appointmentTable.columnFilters[col.field]"
                :placeholder="langText.search + ' ' + col.title"
              >
            </div>
          </div>
        </div>
        
        <!-- 预约表格 -->
        <div class="table-container">
          <table class="interactive-table">
            <thead>
              <tr>
                <th v-for="(col, index) in appointmentColumns" :key="index" 
                    @click="sortTable('appointment', col.field)"
                    :class="{ active: appointmentTable.sortField === col.field }">
                  {{ col.title }}
                  <span v-if="appointmentTable.sortField === col.field">
                    {{ appointmentTable.sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(appointment, apptIndex) in paginatedAppointmentData" :key="apptIndex">
                <td v-for="(col, colIndex) in appointmentColumns" :key="colIndex">
                  {{ appointment[col.field] }}
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 分页控件 -->
          <div class="pagination">
            <button @click="prevAppointmentPage" :disabled="appointmentTable.currentPage === 1">
              {{ langText.prev }}
            </button>
            <span>
              {{ langText.page }} {{ appointmentTable.currentPage }} {{ langText.of }} {{ appointmentTotalPages }}
            </span>
            <button @click="nextAppointmentPage" :disabled="appointmentTable.currentPage >= appointmentTotalPages">
              {{ langText.next }}
            </button>
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
        <router-link class="btn btn-email" to="/email">📧 {{ langText.sendEmail }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, computed, ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default {
  setup() {
    const state = inject('language');
    const authStore = useAuthStore();
    // 用户表格配置
    const userTable = reactive({
      data: [],
      columns: [
        { title: 'ID', field: 'id' },
        { title: 'Name', field: 'name' },
        { title: 'Email', field: 'email' },
        { title: 'Role', field: 'role' },
        { title: 'Join Date', field: 'joinDate' },
        { title: 'Status', field: 'status' }
      ],
      sortField: 'id',
      sortDirection: 'asc',
      search: '',
      columnFilters: {},
      currentPage: 1,
      rowsPerPage: 10
    });

    // 预约表格配置
    const appointmentTable = reactive({
      data: [],
      columns: [
        { title: 'ID', field: 'id' },
        { title: 'Service', field: 'service' },
        { title: 'Date', field: 'date' },
        { title: 'Time', field: 'time' },
        { title: 'Duration', field: 'duration' },
        { title: 'Status', field: 'status' }
      ],
      sortField: 'id',
      sortDirection: 'asc',
      search: '',
      columnFilters: {},
      currentPage: 1,
      rowsPerPage: 10
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
            send: 'Send',
            userManagement: 'User Management',
            appointmentHistory: 'Appointment History',
            globalSearch: 'Global search...',
            search: 'Search',
            prev: 'Prev',
            next: 'Next',
            page: 'Page',
            of: 'of',
            exportCSV: 'Export CSV',
            exportPDF: 'Export PDF',
            id: 'ID',
            name: 'Name',
            email: 'Email',
            role: 'Role',
            joinDate: 'Join Date',
            status: 'Status',
            service: 'Service',
            date: 'Date',
            time: 'Time',
            duration: 'Duration',
            // 新增导出文本
            exportedUsers: 'Exported Users',
            exportedAppointments: 'Exported Appointments',
            exportSuccess: 'Export successful!',
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
            userManagement: '用户管理',
            appointmentHistory: '预约历史',
            globalSearch: '全局搜索...',
            search: '搜索',
            prev: '上一页',
            next: '下一页',
            page: '页',
            of: '共',
            exportCSV: '导出CSV',
            exportPDF: '导出PDF',
            id: '编号',
            name: '姓名',
            email: '邮箱',
            role: '角色',
            joinDate: '加入日期',
            status: '状态',
            service: '服务',
            date: '日期',
            time: '时间',
            duration: '时长',
            // 新增导出文本
            exportedUsers: '导出的用户',
            exportedAppointments: '导出的预约',
            exportSuccess: '导出成功!',
          };
    });
    
    // 模拟用户数据
    const generateMockUsers = () => {
      const roles = ['Admin', 'User', 'Moderator'];
      const statuses = ['Active', 'Pending', 'Suspended'];
      const users = [];
      
      for (let i = 1; i <= 45; i++) {
        users.push({
          id: `U${i.toString().padStart(4, '0')}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          role: roles[i % 3],
          joinDate: `2023-${(i % 12 + 1).toString().padStart(2, '0')}-${(i % 28 + 1).toString().padStart(2, '0')}`,
          status: statuses[i % 3]
        });
      }
      
      return users;
    };

    // 模拟预约数据
    const generateMockAppointments = () => {
      const services = ['Health Check', 'Consultation', 'Therapy', 'Vaccination', 'Follow-up'];
      const statuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled'];
      const appointments = [];
      
      for (let i = 1; i <= 35; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        appointments.push({
          id: `A${i.toString().padStart(4, '0')}`,
          service: services[i % 5],
          date: date.toISOString().split('T')[0],
          time: `${i % 12 + 8}:${(i * 5 % 60).toString().padStart(2, '0')} AM`,
          duration: `${15 + i % 6 * 15} mins`,
          status: statuses[i % 4]
        });
      }
      
      return appointments;
    };

    // 初始化模拟数据
    userTable.data = generateMockUsers();
    appointmentTable.data = generateMockAppointments();

    // 表格排序函数
    const sortTable = (tableType, field) => {
      const table = tableType === 'user' ? userTable : appointmentTable;
      
      if (table.sortField === field) {
        // 切换排序方向
        table.sortDirection = table.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // 设置新的排序字段和方向
        table.sortField = field;
        table.sortDirection = 'asc';
      }
    };

    // 计算过滤后的用户数据
    const filteredUserData = computed(() => {
      return userTable.data.filter(user => {
        // 全局搜索过滤
        if (userTable.search) {
          const searchLower = userTable.search.toLowerCase();
          const match = Object.values(user).some(value => 
            String(value).toLowerCase().includes(searchLower)
          );
          if (!match) return false;
        }
        
        // 列过滤
        for (const [field, filterValue] of Object.entries(userTable.columnFilters)) {
          if (filterValue && !String(user[field]).toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
        }
        
        return true;
      }).sort((a, b) => {
        const field = userTable.sortField;
        const direction = userTable.sortDirection === 'asc' ? 1 : -1;
        
        if (a[field] < b[field]) return -1 * direction;
        if (a[field] > b[field]) return 1 * direction;
        return 0;
      });
    });

    // 计算过滤后的预约数据
    const filteredAppointmentData = computed(() => {
      return appointmentTable.data.filter(appointment => {
        // 全局搜索过滤
        if (appointmentTable.search) {
          const searchLower = appointmentTable.search.toLowerCase();
          const match = Object.values(appointment).some(value => 
            String(value).toLowerCase().includes(searchLower)
          );
          if (!match) return false;
        }
        
        // 列过滤
        for (const [field, filterValue] of Object.entries(appointmentTable.columnFilters)) {
          if (filterValue && !String(appointment[field]).toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
        }
        
        return true;
      }).sort((a, b) => {
        const field = appointmentTable.sortField;
        const direction = appointmentTable.sortDirection === 'asc' ? 1 : -1;
        
        if (a[field] < b[field]) return -1 * direction;
        if (a[field] > b[field]) return 1 * direction;
        return 0;
      });
    });

    // 计算用户表格分页数据
    const paginatedUserData = computed(() => {
      const startIndex = (userTable.currentPage - 1) * userTable.rowsPerPage;
      return filteredUserData.value.slice(startIndex, startIndex + userTable.rowsPerPage);
    });

    // 计算预约表格分页数据
    const paginatedAppointmentData = computed(() => {
      const startIndex = (appointmentTable.currentPage - 1) * appointmentTable.rowsPerPage;
      return filteredAppointmentData.value.slice(startIndex, startIndex + appointmentTable.rowsPerPage);
    });

    // 计算总页数
    const userTotalPages = computed(() => {
      return Math.ceil(filteredUserData.value.length / userTable.rowsPerPage);
    });

    const appointmentTotalPages = computed(() => {
      return Math.ceil(filteredAppointmentData.value.length / appointmentTable.rowsPerPage);
    });

    // 分页导航
    const prevUserPage = () => {
      if (userTable.currentPage > 1) {
        userTable.currentPage--;
      }
    };

    const nextUserPage = () => {
      if (userTable.currentPage < userTotalPages.value) {
        userTable.currentPage++;
      }
    };

    const prevAppointmentPage = () => {
      if (appointmentTable.currentPage > 1) {
        appointmentTable.currentPage--;
      }
    };

    const nextAppointmentPage = () => {
      if (appointmentTable.currentPage < appointmentTotalPages.value) {
        appointmentTable.currentPage++;
      }
    };

    // 导出功能
    const exportToCSV = (data, columns, filename) => {
      const header = columns.map(col => `"${col.title}"`).join(',');
      const rows = data.map(item => 
        columns.map(col => `"${item[col.field]}"`).join(',')
      ).join('\n');
      
      const csvContent = `data:text/csv;charset=utf-8,${header}\n${rows}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
    };

    const exportToPDF = (data, columns, filename, title) => {
      const doc = new jsPDF();
      
      // 添加标题
      doc.text(title, 14, 15);
      
      // 准备表格数据
      const tableData = data.map(item => 
        columns.map(col => item[col.field])
      );
      
      // 添加表格
      doc.autoTable({
        head: [columns.map(col => col.title)],
        body: tableData,
        startY: 20
      });
      
      // 保存PDF
      doc.save(`${filename}.pdf`);
    };

    // 导出用户数据
    const exportUserCSV = () => {
      exportToCSV(
        filteredUserData.value, 
        userTable.columns, 
        `${langText.value.exportedUsers}_${new Date().toISOString().slice(0, 10)}`
      );
      alert(langText.value.exportSuccess);
    };

    const exportUserPDF = () => {
      exportToPDF(
        filteredUserData.value, 
        userTable.columns, 
        `${langText.value.exportedUsers}_${new Date().toISOString().slice(0, 10)}`,
        langText.value.userManagement
      );
      alert(langText.value.exportSuccess);
    };

    // 导出预约数据
    const exportAppointmentCSV = () => {
      exportToCSV(
        filteredAppointmentData.value, 
        appointmentTable.columns, 
        `${langText.value.exportedAppointments}_${new Date().toISOString().slice(0, 10)}`
      );
      alert(langText.value.exportSuccess);
    };

    const exportAppointmentPDF = () => {
      exportToPDF(
        filteredAppointmentData.value, 
        appointmentTable.columns, 
        `${langText.value.exportedAppointments}_${new Date().toISOString().slice(0, 10)}`,
        langText.value.appointmentHistory
      );
      alert(langText.value.exportSuccess);
    };
    
    return {
      langText,
      state,
      authStore,
      userColumns: userTable.columns,
      userTable,
      appointmentColumns: appointmentTable.columns,
      appointmentTable,
      paginatedUserData,
      paginatedAppointmentData,
      userTotalPages,
      appointmentTotalPages,
      sortTable,
      prevUserPage,
      nextUserPage,
      prevAppointmentPage,
      nextAppointmentPage,
      exportUserCSV,
      exportUserPDF,
      exportAppointmentCSV,
      exportAppointmentPDF,
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

.table-section {
  margin-bottom: 30px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-controls {
  display: flex;
  gap: 10px;
}

.table-filters {
  margin-bottom: 15px;
}

.global-search {
  margin-bottom: 15px;
}

.global-search input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.column-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.column-filter input {
  width: 100%;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 0.9em;
}

.table-container {
  overflow-x: auto;
}

.interactive-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.interactive-table th {
  background-color: #f5f7fa;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  border-bottom: 2px solid #e1e4e8;
}

.interactive-table th:hover {
  background-color: #ebeff5;
}

.interactive-table th.active {
  background-color: #e1e8ff;
  color: #3366ff;
}

.interactive-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.interactive-table tr:nth-child(even) {
  background-color: #f9fafb;
}

.interactive-table tr:hover {
  background-color: #f0f4ff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}

.pagination button {
  padding: 6px 12px;
  background-color: #f0f4ff;
  border: 1px solid #d0d8e8;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  font-size: 0.9em;
}

/* 原有样式保持不变 */
.dashboard {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
}

.admin-section, .user-content {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
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
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #0d6efd;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-email {
  background-color: #4caf50;
  color: white;
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

/* 模态框样式保持不变 */
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
  background: #f55
}
</style>