<template>
  <div class="resources-page">
    <h2>{{ langText.title }}</h2>

    <section class="resource-section">
      <h3>{{ langText.section1.title }}</h3>
      <ul>
        <li v-for="(item, idx) in langText.section1.items" :key="idx">
          <a :href="item.url" target="_blank" rel="noopener">{{ item.label }}</a> — <small>{{ item.desc }}</small>
        </li>
      </ul>
    </section>

    <section class="resource-section">
      <h3>{{ langText.section2.title }}</h3>
      <ul>
        <li v-for="(item, idx) in langText.section2.items" :key="idx">
          <a :href="item.url" target="_blank" rel="noopener">{{ item.label }}</a> — <small>{{ item.desc }}</small>
        </li>
      </ul>
    </section>

    <section class="resource-section">
      <h3>{{ langText.section3.title }}</h3>
      <ul>
        <li v-for="(item, idx) in langText.section3.items" :key="idx">
          <a :href="item.url" target="_blank" rel="noopener">{{ item.label }}</a> — <small>{{ item.desc }}</small>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { inject, computed } from 'vue';

export default {
  name: 'Resources',
  setup() {
    const state = inject('language');

    const langText = computed(() =>
      state.language === '中文'
        ? {
            title: '资源中心',
            section1: {
              title: '移民注意事项',
              items: [
                {
                  label: '澳洲移民官方指南',
                  url: 'https://www.homeaffairs.gov.au/',
                  desc: '政府移民政策与流程',
                },
                {
                  label: '移民生活贴士论坛',
                  url: 'https://www.expatexchange.com/',
                  desc: '经验分享与问答社区',
                },
                {
                  label: '本地法律援助',
                  url: 'https://www.fairwork.gov.au/',
                  desc: '劳工权益与法律咨询',
                },
              ],
            },
            section2: {
              title: '心理健康教育',
              items: [
                {
                  label: 'Beyond Blue',
                  url: 'https://www.beyondblue.org.au/',
                  desc: '焦虑与抑郁支持资源',
                },
                {
                  label: 'Head to Health',
                  url: 'https://www.headtohealth.gov.au/',
                  desc: '全国心理健康服务目录',
                },
                {
                  label: 'TED 心理讲座',
                  url: 'https://www.ted.com/topics/mental+health',
                  desc: '国际心理健康主题演讲',
                },
              ],
            },
            section3: {
              title: '身体健康小知识',
              items: [
                {
                  label: 'Healthdirect',
                  url: 'https://www.healthdirect.gov.au/',
                  desc: '专业医疗信息与症状检查',
                },
                {
                  label: '澳洲健康生活网站',
                  url: 'https://www.eatforhealth.gov.au/',
                  desc: '营养与饮食建议',
                },
                {
                  label: 'NIH 健康百科',
                  url: 'https://www.nih.gov/health-information',
                  desc: '国际权威健康百科',
                },
              ],
            },
          }
        : {
            title: 'Resources Hub',
            section1: {
              title: 'Immigration Essentials',
              items: [
                {
                  label: 'Australia Immigration Guide',
                  url: 'https://www.homeaffairs.gov.au/',
                  desc: 'Official policy & processes',
                },
                {
                  label: 'Expat Exchange Forum',
                  url: 'https://www.expatexchange.com/',
                  desc: 'Community Q&A and tips',
                },
                {
                  label: 'Fair Work Ombudsman',
                  url: 'https://www.fairwork.gov.au/',
                  desc: 'Work rights & legal advice',
                },
              ],
            },
            section2: {
              title: 'Mental Health Education',
              items: [
                {
                  label: 'Beyond Blue',
                  url: 'https://www.beyondblue.org.au/',
                  desc: 'Anxiety & depression support',
                },
                {
                  label: 'Head to Health',
                  url: 'https://www.headtohealth.gov.au/',
                  desc: 'National mental health services',
                },
                {
                  label: 'TED Mental Health Talks',
                  url: 'https://www.ted.com/topics/mental+health',
                  desc: 'International expert talks',
                },
              ],
            },
            section3: {
              title: 'Physical Wellness Tips',
              items: [
                {
                  label: 'Healthdirect',
                  url: 'https://www.healthdirect.gov.au/',
                  desc: 'Symptom checker & advice',
                },
                {
                  label: 'Eat for Health',
                  url: 'https://www.eatforhealth.gov.au/',
                  desc: 'Nutrition & diet guidelines',
                },
                {
                  label: 'NIH Health Info',
                  url: 'https://www.nih.gov/health-information',
                  desc: 'Authoritative health encyclopedia',
                },
              ],
            },
          }
    );

    return { langText };
  },
};
</script>

<style scoped>
.resources-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
}
.resource-section {
  margin-bottom: 40px;
}
.resource-section h3 {
  border-left: 4px solid #1e90ff;
  padding-left: 10px;
  margin-bottom: 15px;
  color: #333;
}
.resource-section ul {
  list-style: none;
  padding: 0;
}
.resource-section li {
  margin-bottom: 10px;
  font-size: 1rem;
}
.resource-section a {
  color: #1e90ff;
  text-decoration: none;
}
.resource-section a:hover {
  text-decoration: underline;
}
.resource-section small {
  color: #666;
}
</style>
