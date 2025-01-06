<script setup>
import 'highlight.js/styles/github-dark.css';
import { onMounted } from 'vue';
import { useAutoScroll } from '../composables/useAutoScroll';
import { useMarkdown } from '../composables/useMarkdown';
import AudioMessage from './AudioMessage.vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});

const { scrollToBottom } = useAutoScroll();
const { renderContent } = useMarkdown();

onMounted(() => {
  const messagesContainer = document.querySelector('.messages-container');
  scrollToBottom(messagesContainer);
});
</script>

<template>
  <div :class="['message', message.type === 'user' ? 'message-user' : 'message-system']">
    <div :class="['message-timestamp', message.type === 'user' ? 'timestamp-right' : 'timestamp-left']" >
      {{ new Date(message.timestamp).toLocaleTimeString() }}
    </div>
    <div :class="['message-content', message.type === 'user' ? 'content-right' : 'content-left']">
      <template v-if="message.contentType === 'text'">
        <div v-html="renderContent(message.content)" class="markdown-content"></div>
      </template>
      <template v-else-if="message.contentType === 'image_with_text'">
        <div class="image-with-text">
          <img :src="message.content.image" alt="Uploaded image" class="message-image" />
          <div v-if="message.content.text" v-html="renderContent(message.content.text)" class="markdown-content"></div>
        </div>
      </template>
      <template v-else-if="message.contentType === 'image'">
        <img :src="message.content" alt="Uploaded image" class="message-image" />
      </template>
      <template v-else-if="message.contentType === 'pdf'">
        <div class="pdf-link">
          <a :href="message.content" target="_blank">View PDF</a>
        </div>
      </template>
      <template v-else-if="message.contentType === 'audio'">
        <AudioMessage 
          :audio-url="message.content"
          :duration="message.duration"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.message {
  margin: 2.5rem 0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  position: relative; /* 添加相对定位 */
}

.message-user {
  margin-left: 20%;
  margin-right: 2%;
}

.message-system {
  /* background-color: #f5f5f5; */
  margin-left: 2%;
  margin-right: 20%;
}

.message-content {
  word-break: break-word;
  max-width: none; /* 移除或设置为 none */
  width: auto; /* 设置为 auto */
  padding: 0.1rem; /* 确保有足够的内边距 */
  
}

.content-left {
  text-align: left;
}

.content-right {
  text-align: right;
}

.message-image {
  max-width: 50%;
  border-radius: 0.25rem;
}

.message-timestamp {
  font-size: 0.75rem;
  color: #666;
  position: absolute;
  top: -1rem; /* 调整时间戳的位置 */
  z-index: 1; /* 确保时间戳在内容之上 */
}

.timestamp-left {
  left: 0.5rem;
}

.timestamp-right {
  right: 0.5rem;
}

.markdown-content {
  background-color: #fff; /* 添加背景色 */
  padding: 0.1rem 1rem; /* 添加内边距 */
  border-radius: 0.5rem; /* 添加边框半径 */
  box-shadow: 0 2px 4px rgba(73, 160, 76, 0.1); /* 添加阴影效果 */
  background-color: #e3f2fd;
  display: inline-block; /* 使内容宽度自适应 */
  box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

/* 新增选择器 */
.message-system .markdown-content {
  background-color: #f5f5f5; /* 设置系统消息的背景色 */
}

.markdown-content :deep(pre) {
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  font-family: monospace;
}

.image-with-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.message-user .image-with-text {
  align-items: flex-end;
}
</style>