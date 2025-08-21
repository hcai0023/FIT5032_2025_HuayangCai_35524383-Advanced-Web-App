<template>
  <div class="email-page">
    <h2>{{ langText.title }}</h2>
    <form ref="form" @submit.prevent="sendEmail">
      <input type="text" name="user_name" v-model="form.name" :placeholder="langText.name" required />
      <input type="email" name="user_email" v-model="form.email" :placeholder="langText.email" required />
      <input type="text" name="subject" v-model="form.subject" :placeholder="langText.subject" required />
      
      <textarea name="message" v-model="form.message" :placeholder="langText.message" required></textarea>
      
      <input type="file" @change="handleFileUpload" />
      
      <button type="submit" class="cta-btn">{{ langText.send }}</button>
    </form>

    <p v-if="status" :class="statusClass">{{ status }}</p>
  </div>
</template>

<script>
import emailjs from "@emailjs/browser";
import { inject, computed, ref } from "vue";

export default {
  name: "Email",
  setup() {
    const language = inject("language");
    const form = ref({
      name: "",
      email: "",
      subject: "",
      message: "",
      attachment: null,
    });

    const status = ref("");
    const statusClass = ref("");

    const langText = computed(() =>
      language.value === "中文"
        ? {
            title: "发送邮件",
            name: "姓名",
            email: "邮箱",
            subject: "主题",
            message: "邮件内容",
            send: "发送邮件",
            success: "✅ 邮件已成功发送！",
            error: "❌ 邮件发送失败，请稍后重试。",
          }
        : {
            title: "Send an Email",
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            send: "Send Email",
            success: "✅ Email sent successfully!",
            error: "❌ Failed to send email, please try again later.",
          }
    );

    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          form.value.attachment = reader.result.split(",")[1]; // Base64 only
        };
        reader.readAsDataURL(file);
      }
    }

    function sendEmail() {
      const templateParams = {
        user_name: form.value.name,
        user_email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
        attachment: form.value.attachment,
      };

      // ⚠️ 需要在 EmailJS 控制台获取以下三个值
      const SERVICE_ID = "service_z9rkx6r";
      const TEMPLATE_ID = "template_0ztx0xj";
      const PUBLIC_KEY = "ttNF9fPwZOrlFvh9K";

      emailjs
        .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then(
          () => {
            status.value = langText.value.success;
            statusClass.value = "success";
            form.value = { name: "", email: "", subject: "", message: "", attachment: null };
          },
          () => {
            status.value = langText.value.error;
            statusClass.value = "error";
          }
        );
    }

    return { form, sendEmail, handleFileUpload, status, statusClass, langText };
  },
};
</script>

<style scoped>
.email-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
form input,
form textarea {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.cta-btn {
  background-color: #1e90ff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.cta-btn:hover {
  background-color: #0057b8;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
