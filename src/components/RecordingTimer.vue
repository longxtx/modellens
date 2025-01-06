`<script setup>
import { ref, onUnmounted } from 'vue';
import { formatDuration } from '../utils/formatters';

const props = defineProps({
  isRecording: {
    type: Boolean,
    required: true
  }
});

const duration = ref(0);
const timerInterval = ref(null);

const startTimer = () => {
  duration.value = 0;
  timerInterval.value = setInterval(() => {
    duration.value++;
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  return duration.value;
};

defineExpose({ startTimer, stopTimer });

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<template>
  <div v-if="isRecording" class="recording-timer">
    {{ formatDuration(duration) }}
  </div>
</template>

<style scoped>
.recording-timer {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>`