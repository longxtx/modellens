`<template>
  <button
    class="record-button"
    :class="{ 'recording': isRecording, 'disabled': isPlaying }"
    @mousedown="startRecording"
    @mouseup="stopRecording"
    @mouseleave="stopRecording"
    :disabled="isPlaying"
  >
    {{ buttonText }}
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useAudioRecording } from '../composables/useAudioRecording'; // 添加: 引入 useAudioRecording

// 查询当前浏览器支持的音频格式
const Formats = AudioRecorder.getSupportedFormats();
const store = useAudioStore();

const { isPlaying } = useAudioRecording(); // 添加: 使用 useAudioRecording

const buttonText = computed(() => {
  if (isPlaying) return '正在播放...'; // 修改: 使用 isPlaying 从 useAudioRecording
  return store.isRecording ? '录音中...' : '按住说话';
});

const startRecording = () => {
  console.log('startRecording');
  store.startRecording();
};

const stopRecording = () => {
  console.log('stopRecording');
  store.stopRecording();
};
</script>

<style scoped>
.record-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.record-button:hover:not(:disabled) {
  background-color: #45a049;
}

.record-button.recording {
  background-color: #f44336;
  transform: scale(1.05);
}

.record-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>`