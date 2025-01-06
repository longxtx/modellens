import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useChatStore = defineStore('chat', () => {
  const messages = ref([]);
  const MAX_MESSAGES = 100;

  const addMessage = (message) => {
    messages.value.push(message);
    if (messages.value.length > MAX_MESSAGES) {
      messages.value = messages.value.slice(-MAX_MESSAGES);
    }
  };

  return {
    messages,
    addMessage
  };
}, {
  persist: true
});