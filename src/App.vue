<script setup>
import mqtt from 'mqtt';
import { onMounted, onUnmounted, ref } from 'vue';
import ChatInput from './components/ChatInput.vue';
import ChatMessage from './components/ChatMessage.vue';
import SystemLogs from './components/SystemLogs.vue';
import { mqttConfig } from './config/mqtt';
import { useChatStore } from './stores/chat';


const MQTT_BROKER_URL = 'ws://localhost:9001/mqtt';
const USER_ID = 'user/66166';
const SV_IDS = ['audio/10666','msg/10666']

const chatStore = useChatStore();
const client = ref(null);
const systemLogsRef = ref(null);

const connectMqtt = () => {
  try {
    client.value = mqtt.connect(mqttConfig.url, mqttConfig.options);

    client.value.on('connect', () => {
      systemLogsRef.value?.addLog('Connected to MQTT broker');
      client.value.subscribe('chat/messages');
    });

    client.value.on('message', (topic, message) => {
      const messageData = JSON.parse(message.toString());
      messageData.type = 'system';
      chatStore.addMessage({
        ...messageData
      });
      systemLogsRef.value?.addLog(`Received message: ${messageData.content}`);
    });

    client.value.on('error', (error) => {
      systemLogsRef.value?.addLog(`MQTT Error: ${error.message}`);
    });
  } catch (error) {
    systemLogsRef.value?.addLog(`MQTT Connection Error: ${error.message}`);
  }
};

const sendMessage = (message) => {
  chatStore.addMessage(message);
  if (client.value?.connected) {
    client.value.publish('chat/messages', JSON.stringify(message));
    systemLogsRef.value?.addLog(`Sent message: ${message.content}`);
  }
};

onMounted(() => {
  connectMqtt();
});

onUnmounted(() => {
  if (client.value) {
    client.value.end();
  }
});
</script>

<template>
  <div class="app-container">
    <div class="chat-section">
      <div class="messages-container">
        <ChatMessage
          v-for="message in chatStore.messages"
          :key="message.timestamp"
          :message="message"
        />
      </div>
      <ChatInput @send-message="sendMessage" />
    </div>
    <SystemLogs ref="systemLogsRef" class="logs-section" />
  </div>
</template>

<style>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.chat-section {
  flex: 0 0 50%;
  width: 50%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
  max-width: 50%;
}

.logs-section {
  width: 50%;
  display: flex;
  height: 70vh;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
  height: 300px; /* 设置一个固定的高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
}

.messages-container {
  height: 65vh; /* 设置固定高度为视口高度的80% */
  overflow-y: auto; /* 添加垂直滚动条 */
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  float: left; /* 使容器浮动到左侧 */
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>