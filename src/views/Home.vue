<template>
  <div class="home-page">
    <section class="section">
      <div class="section-content">
        <h2>{{ langText.title1 }}</h2>
        <p>{{ langText.desc1 }}</p>
        <router-link to="/booking" class="cta-btn">{{ langText.button1 }}</router-link>
      </div>
      <div class="section-image">[Promotional Photo Placeholder]</div>
    </section>

    <section class="section">
      <div class="section-content">
        <h2>{{ langText.title2 }}</h2>
        <p>{{ langText.desc2 }}</p>
        <router-link to="/booking" class="cta-btn">{{ langText.button2 }}</router-link>
      </div>
      <div class="section-image">[Promotional Photo Placeholder]</div>
    </section>

    <section class="section reverse">
      <div class="section-image">[Promotional Photo Placeholder]</div>
      <div class="section-content">
        <h2>{{ langText.title3 }}</h2>
        <p>{{ langText.desc3 }}</p>
        <router-link to="/booking" class="cta-btn">{{ langText.button3 }}</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { inject, computed } from 'vue';

export default {
  name: 'Home',
  setup() {
    const state = inject('language');

    const langText = computed(() => {
      return state.language === 'EN'
        ? {
            title1: 'Maternal & Child Care',
            desc1:
              'Our Maternal & Child Care service offers multilingual guidance for new and expecting mothers, including vaccination schedules, nutrition plans, and postpartum mental health support.',
            button1: 'Start free Now!',

            title2: 'Physiotherapy',
            desc2:
              'This service provides personalized physical therapy sessions designed to improve mobility, manage chronic pain, and support recovery from injury.',
            button2: 'Get started',

            title3: 'Mental Health Support',
            desc3:
              'Our Mental Health Support service focuses on creating a safe, inclusive environment where immigrants can access counseling, stress management workshops, and peer support groups.',
            button3: 'Start free Now!',
          }
        : {
            title1: '母婴健康护理',
            desc1:
              '我们的母婴健康服务为新手和准妈妈提供多语种指导，包括疫苗接种时间表、营养计划和产后心理支持。',
            button1: '立即免费开始',

            title2: '物理治疗',
            desc2:
              '该服务提供个性化的物理治疗方案，帮助改善活动能力，缓解慢性疼痛，支持康复过程。',
            button2: '开始使用',

            title3: '心理健康支持',
            desc3:
              '我们的心理健康支持服务致力于为移民群体营造一个安全包容的环境，提供心理咨询、压力管理讲座及同伴互助小组。',
            button3: '立即免费开始',
          };
    });

    return {
      langText,
    };
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
.nav-links a, .nav-links button {
  margin-left: 15px;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
.nav-links button {
  padding: 6px 12px;
  border-radius: 4px;
}
.login-btn {
  border: 1px solid #000;
}
.signup-btn {
  background-color: #000;
  color: rgb(0, 0, 0);
}
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 20px;
  border-bottom: 1px solid #eee;
}
.section.reverse {
  flex-direction: row-reverse;
}
.section-content {
  flex: 1;
  padding: 20px;
}
.section-content h2 {
  margin-bottom: 15px;
}
.section-content p {
  margin-bottom: 20px;
}
.section-image {
  flex: 1;
  background-color: #f5f5f5;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #aaa;
}
.cta-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
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
</style>
