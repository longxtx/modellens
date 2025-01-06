import { nextTick } from 'vue';

export function useAutoScroll() {
  const scrollToBottom = async (element) => {
    if (!element) return;
    
    await nextTick();
    element.scrollTop = element.scrollHeight;
  };

  return {
    scrollToBottom
  };
}