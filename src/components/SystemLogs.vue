`<script setup>
import { marked } from 'marked';
import { ref } from 'vue';

const logs = ref([]);
const expandedLogs = ref(new Set()); // 跟踪展开状态的日志ID

const addLog = (log) => {
  logs.value.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    content: log
  });
};

const renderMarkdown = (content) => {
  try {
    return marked(content);
  } catch (error) {
    return content;
  }
};

const toggleExpand = (logId) => {
  if (expandedLogs.value.has(logId)) {
    expandedLogs.value.delete(logId);
  } else {
    expandedLogs.value.add(logId);
  }
};

const isExpanded = (logId) => expandedLogs.value.has(logId);


defineExpose({ addLog });
</script>

<template>
  <div class="logs-container">
    <h2 class="logs-title">Reasoning Logs</h2>
    <div class="logs-content">
      <div v-for="log in logs" :key="log.id" class="log-entry">
        <div 
          class="log-message" 
          :class="{ 'collapsed': !isExpanded(log.id) }"
          v-html="renderMarkdown(log.content)"
        ></div>
        <button 
          v-if="log.content.length > 150"
          class="expand-button" 
          @click="toggleExpand(log.id)"
        >
          {{ isExpanded(log.id) ? '收起' : '展开' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logs-container {
  height: 80vh; /* 设置为视口高度 */
  background-color: #1e1e1e;
  color: #fff;
  padding: 1rem;
  overflow-y: auto;
}

.logs-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333;
}

.logs-content {
  height: calc(100% - 4rem); /* 减去标题和内边距的高度 */
  font-family: monospace;
  overflow-y: auto; 
}

.log-entry {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.log-timestamp {
  text-align: left;
  display: block;
  color: #888;
  margin-right: 0.5rem;
}

.log-message {
  color: #4fc08d;
  text-align: left;
}

.log-message :deep(pre) {
  background-color: #2d2d2d;
  padding: 0.5rem;
  border-radius: 0.25rem;
  overflow-x: auto;
}

.log-message :deep(code) {
  font-family: monospace;
  color: #e6e6e6;
}

.log-message :deep(p) {
  margin: 0;
}
.log-message {
  color: #4fc08d;
  text-align: left;
  position: relative;
}

.log-message.collapsed {
  max-height: 4.5em; /* 约3行文本的高度 */
  overflow: hidden;
}

.log-message.collapsed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.5em;
  background: linear-gradient(transparent, #1e1e1e);
}

.expand-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 2px 8px;
  font-size: 0.8rem;
  margin-top: 4px;
}

.expand-button:hover {
  color: #4fc08d;
  text-decoration: underline;
}
</style>`