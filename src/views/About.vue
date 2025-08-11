<template>
  <div class="about-page">
    <h2>{{ langText.heading }}</h2>
    <p>{{ langText.instruction }}</p>

    <div class="stars">
      <span v-for="star in 5" :key="star" @click="setRating(star)" class="star" :class="{ filled: star <= rating }">★</span>
    </div>

    <button class="submit-btn" @click="submitRating">{{ langText.submit }}</button>

    <p v-if="submitted" class="thank-you">{{ langText.thank }} {{ rating }} {{ langText.stars }}</p>

    <!-- Placeholder for future content -->
    <section class="future-content">
      <h3>{{ langText.aboutSection }}</h3>
      <p>{{ langText.aboutContent }}</p>
    </section>
  </div>
</template>

<script>
import { inject, computed } from 'vue';

export default {
  name: 'About',
  setup() {
    const state = inject('language');

    const langText = computed(() => {
      return state.language === 'EN'
        ? {
            heading: 'Rate Our Charity',
            instruction: 'Please rate your experience and support for our community services:',
            submit: 'Submit Rating',
            thank: 'Thank you for your feedback! Your rating:',
            stars: 'stars.',
            aboutSection: 'About Our Charity',
            aboutContent: '[Content about mission, vision, core values coming soon...]',
          }
        : {
            heading: '为我们的慈善组织评分',
            instruction: '请评价您对我们社区服务的体验与支持：',
            submit: '提交评分',
            thank: '感谢您的反馈！您的评分是：',
            stars: '颗星。',
            aboutSection: '关于我们的慈善组织',
            aboutContent: '【关于使命、愿景和核心价值观的内容即将上线……】',
          };
    });

    return {
      state,
      langText,
    };
  },
  data() {
    return {
      rating: 0,
      submitted: false,
    };
  },
  methods: {
    setRating(value) {
      this.rating = value;
    },
    submitRating() {
      if (this.rating > 0) {
        this.submitted = true;
        localStorage.setItem('userRating', this.rating);
      } else {
        alert(this.state.language === 'EN' ? 'Please select at least one star before submitting.' : '请至少选择一颗星再提交。');
      }
    },
  },
};
</script>

<style scoped>
.about-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}
.stars {
  font-size: 30px;
  margin: 20px 0;
}
.star {
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
}
.star.filled {
  color: #ffcc00;
}
.submit-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #333;
}
.thank-you {
  color: green;
  margin-top: 15px;
}
.future-content {
  margin-top: 50px;
  text-align: left;
}
</style>