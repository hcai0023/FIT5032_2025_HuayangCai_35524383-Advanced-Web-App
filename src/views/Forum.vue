<template>
  <div class="forum-page">
    <h2>{{ langText.title }}</h2>
    <form @submit.prevent="addPost" class="forum-form">
      <input v-model="newPost.author" :placeholder="langText.author" required />
      <textarea v-model="newPost.content" :placeholder="langText.content" required></textarea>
      <button type="submit" class="post-btn">{{ langText.post }}</button>
    </form>

    <div v-if="posts.length" class="post-list">
      <div v-for="(post, index) in posts" :key="index" class="post-item">
        <p><strong>{{ post.author }}</strong>:</p>
        <p>{{ post.content }}</p>
        <small>{{ post.timestamp }}</small>
      </div>
    </div>
    <div v-else class="no-posts">
      <p>{{ langText.noPosts }}</p>
    </div>
  </div>
</template>

<script>
import { inject, computed } from 'vue';

export default {
  name: 'Forum',
  setup() {
    const state = inject('language');

    const langText = computed(() => {
      return state.language === '中文'
        ? {
            title: '社区论坛',
            author: '您的姓名',
            content: '您想分享的内容...',
            post: '发表帖子',
            noPosts: '暂无帖子，快来分享您的想法吧！',
          }
        : {
            title: 'Community Forum',
            author: 'Your name',
            content: 'What would you like to share...',
            post: 'Post Message',
            noPosts: 'No posts yet. Be the first to share your thoughts!',
          };
    });

    return {
      langText,
      state,
    };
  },
  data() {
    return {
      newPost: {
        author: '',
        content: '',
      },
      posts: JSON.parse(localStorage.getItem('forumPosts')) || [],
    };
  },
  methods: {
    addPost() {
      const timestamp = new Date().toLocaleString();
      this.posts.unshift({ ...this.newPost, timestamp });
      localStorage.setItem('forumPosts', JSON.stringify(this.posts));
      this.newPost = { author: '', content: '' };
    },
  },
};
</script>

<style scoped>
.forum-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
}
.forum-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}
.forum-form input,
.forum-form textarea {
  margin: 10px 0;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.forum-form textarea {
  resize: vertical;
  min-height: 100px;
}
.post-btn {
  background-color: #1e90ff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  align-self: flex-start;
}
.post-btn:hover {
  background-color: #0057b8;
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.post-item {
  background-color: #f9f9f9;
  border-left: 4px solid #1e90ff;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}
.no-posts {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-top: 40px;
}
</style>