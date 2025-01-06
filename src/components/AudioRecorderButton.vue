`<template>
  <button
    class="record-button"
    :class="{ 'recording': uar.isRecording, 'disabled': uar.isPlaying }"
    @mousedown="startRecording"
    @mouseup="stopRecording"
    @mouseleave="stopRecording"
    :disabled="uar.isPlaying"
  >
    {{ buttonText }}
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useAudioRecording } from '../composables/useAudioRecording';

const uar = useAudioRecording();

const buttonText = computed(() => {
  if (uar.isPlaying) return '正在播放...';
  return uar.isRecording.value ? '录音中...' : '按住说话';
});

const startRecording = () => {
  console.log('startRecording');
  uar.recOpen(); 
  uar.startRecording();
};

const stopRecording = () => {
  console.log('stopRecording');
  uar.stopRecording();
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