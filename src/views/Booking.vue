<template>
  <div class="booking-page">
    <h2>{{ langText.title }}</h2>
    <form @submit.prevent="submitForm" class="booking-form">
      <label>{{ langText.name }}</label>
      <input v-model="form.name" :placeholder="langText.namePlaceholder" />
      <p v-if="errors.name" class="error">{{ errors.name }}</p>

      <label>{{ langText.phone }}</label>
      <input v-model="form.phone" :placeholder="langText.phonePlaceholder" />
      <p v-if="errors.phone" class="error">{{ errors.phone }}</p>

      <label>{{ langText.service }}</label>
      <select v-model="form.service">
        <option disabled value="">{{ langText.selectService }}</option>
        <option>{{ langText.service1 }}</option>
        <option>{{ langText.service2 }}</option>
        <option>{{ langText.service3 }}</option>
      </select>

      <label>{{ langText.date }}</label>
      <input type="date" v-model="form.date" />
      <p v-if="errors.date" class="error">{{ errors.date }}</p>

      <label>{{ langText.notes }}</label>
      <textarea v-model="form.notes" :placeholder="langText.notesPlaceholder"></textarea>

      <button type="submit" class="cta-btn">{{ langText.submit }}</button>
    </form>
  </div>
</template>

<script>
import { inject, computed } from 'vue';

export default {
  setup() {
    const state = inject('language');

    const langText = computed(() =>
      state.language === '中文'
        ? {
            title: '预约服务',
            name: '姓名',
            namePlaceholder: '请输入姓名',
            phone: '电话',
            phonePlaceholder: '请输入电话（+61XXXXXXXXX）',
            service: '服务类型',
            selectService: '请选择服务',
            service1: '母婴健康护理',
            service2: '物理治疗',
            service3: '心理健康支持',
            date: '预约日期',
            notes: '附加说明',
            notesPlaceholder: '请输入附加说明',
            submit: '提交预约',
            success: '预约已成功提交！',
            errorName: '姓名必须为2-20个字符。',
            errorPhone: '无效的电话格式（+61XXXXXXXXX）。',
            errorDate: '日期不能早于今天。',
          }
        : {
            title: 'Book a Service',
            name: 'Name',
            namePlaceholder: 'Enter your name',
            phone: 'Phone',
            phonePlaceholder: 'Phone (+61XXXXXXXXX)',
            service: 'Service Type',
            selectService: 'Select Service',
            service1: 'Maternal & Child Care',
            service2: 'Physiotherapy',
            service3: 'Mental Health Support',
            date: 'Appointment Date',
            notes: 'Additional Notes',
            notesPlaceholder: 'Enter any notes here',
            submit: 'Submit',
            success: 'Appointment booked!',
            errorName: 'Name must be 2-20 characters.',
            errorPhone: 'Invalid phone format (+61XXXXXXXXX).',
            errorDate: 'Date cannot be in the past.',
          }
    );

    return {
      state,
      langText,
    };
  },
  data() {
    return {
      form: { name: '', phone: '', service: '', date: '', notes: '' },
      errors: {},
      appointments: JSON.parse(localStorage.getItem('appointments')) || [],
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      const today = new Date().toISOString().split('T')[0];
      if (!this.form.name || this.form.name.length < 2 || this.form.name.length > 20) {
        this.errors.name = this.langText.errorName;
      }
      if (!/^\+61\d{9}$/.test(this.form.phone)) {
        this.errors.phone = this.langText.errorPhone;
      }
      if (!this.form.date || this.form.date < today) {
        this.errors.date = this.langText.errorDate;
      }
      return Object.keys(this.errors).length === 0;
    },
    submitForm() {
      if (this.validateForm()) {
        this.appointments.push({ ...this.form });
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
        alert(this.langText.success);
        this.form = { name: '', phone: '', service: '', date: '', notes: '' };
      }
    },
  },
};
</script>

<style scoped>
.booking-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.booking-form {
  display: flex;
  flex-direction: column;
}

.booking-form label {
  font-weight: bold;
  margin-top: 15px;
}

input,
select,
textarea {
  padding: 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}

.cta-btn {
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 25px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.cta-btn:hover {
  background-color: #0057b8;
}
</style>
