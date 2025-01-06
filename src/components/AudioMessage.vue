<template>
  <div class="audio-message">
    <button 
      class="play-button" 
      @click="togglePlay"
      :class="{ 'playing': isPlaying }"
    >
      {{ isPlaying ? '⏸️' : '▶️' }}
    </button>
    <div class="duration">{{ formatDuration(duration) }}</div>
    <audio ref="audioElement" :src="audioUrl" class="hidden" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatDuration } from '../utils/formatters';
import { useAudioRecording } from '../composables/useAudioRecording'; // 添加: 引入 useAudioRecording

const props = defineProps({
  audioUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
});


const { audioElement, isPlaying, togglePlay } = useAudioRecording(props.audioUrl); // 添加: 使用 useAudioRecording



</script>

<style scoped>
.audio-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}

.play-button {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.play-button:hover {
  opacity: 0.8;
}

.duration {
  color: #666;
  font-size: 0.875rem;
}

.hidden {
  display: none;
}
</style>