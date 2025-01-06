`<script setup>
import { computed, ref } from 'vue';
import { useAudioRecording } from '../composables/useAudioRecording';
import AudioRecorderButton from '../components/AudioRecorderButton.vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['send-message']);
const message = ref('');
const isVoiceMode = ref(false);
const timerRef = ref(null);
const imageFile = ref(null);
const imagePreview = ref('');
const isPlaying = ref(false);
const {
  isRecording,
  isSupported,
  startRecording,
  stopRecording
} = useAudioRecording();

const buttonText = computed(() => {
  if (isPlaying.value) return '正在播放...';
  return isRecording.value ? '录音中...' : '按住说话';
});

const sendMessage = () => {
  if (!message.value.trim() && !imageFile.value) return;

  const messageData = {
    type: 'user',
    timestamp: Date.now()
  };

  if (imageFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      messageData.content = {
        image: e.target.result,
        text: message.value.trim()
      };
      messageData.contentType = 'image_with_text';
      
      emit('send-message', messageData);
      // 清空输入
      message.value = '';
      imageFile.value = null;
      imagePreview.value = '';
    };
    reader.readAsDataURL(imageFile.value);
  } else {
    messageData.content = message.value;
    messageData.contentType = 'text';
    emit('send-message', messageData);
    message.value = '';
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.type.startsWith('image/')) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
  event.target.value = '';
};

const toggleInputMode = () => {
  ElMessage.info('语音功能暂未实现');
  console.log('语音功能暂未实现');
  return;
  // isVoiceMode.value = !isVoiceMode.value;
  // if (isRecording.value) {

  // }
};

const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = '';
};
</script>

<template>
  <div class="chat-input">
    <div v-if="!isVoiceMode" class="text-input-container">
      <div v-if="imagePreview" class="image-preview-container">
        <img :src="imagePreview" class="preview-image" />
        <button class="remove-image-btn" @click="removeImage">×</button>
      </div>

      <textarea
        v-model="message"
        @keyup.enter.exact.prevent="sendMessage"
        :placeholder="imagePreview ? '添加消息...' : '输入消息...'"
        class="message-input"
      ></textarea>
      
      <div class="input-actions">
        <label class="upload-btn">
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="hidden"
          />
          📎
        </label>
        
        <button
          class="mode-toggle-btn"
          @click="toggleInputMode"
          title="Switch to voice input"
        >
          🎤
        </button>
        
        <button @click="sendMessage" class="send-btn">
          Send
        </button>
      </div>
    </div>

    <div v-else class="voice-input-container">
     <div class="voice-record-wrapper">
        <AudioRecorderButton @start-recording="startRecording" @stop-recording="stopRecording" @send-audio="sendMessage" />
      </div> 
      
      <div class="input-actions">
        
        <button
          class="mode-toggle-btn"
          @click="toggleInputMode"
          title="Switch to text input"
        >
          ⌨️
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  /* padding: 1rem; */
  border-top: 1px solid #e5e7eb;
  background-color: white;
}

.text-input-container{
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #ececec;
}

.voice-input-container {
  border: none;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #FFF;
}

.message-input {
  /* width: 100%; */
  min-height: 50px;
  resize: vertical;
  margin: 5px;
  border: none; /* 去掉边框 */
  background-color: #ececec; /* 设置背景色 */
  border-radius: 0.375rem;
  padding: 0.5rem; 
  outline: none; /* 去掉聚焦时的默认边框 */
}

.input-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.voice-record-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-btn,
.mode-toggle-btn,
.send-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-btn{
  padding-top: .5rem;
  height: 25px;
}

.input-actions{
  height: 100%;
  padding: 0.5rem 1rem;
  border: none; /* 去掉边框 */
}

.upload-btn:hover,
.mode-toggle-btn:hover,
.send-btn:hover {
  background-color: #f3f4f6;
}

.voice-record-btn {
  width: 100%;
  border: none;
  border-radius: 0.375rem;
  /* background-color: white; */
  background-color: #ececec!important;
  cursor: pointer;
  transition: all 0.2s;
}

.voice-record-btn.recording {
  background-color: #fee2e2;
  border-color: #ef4444;
}

.hidden {
  display: none;
}

.send-btn {
  margin-left: auto;
  background-color: #4f46e5;
  color: white;
}

.send-btn:hover {
  background-color: #4338ca;
}

.image-preview-container {
  margin: 0.5rem 0.5rem 0 0.5rem;
  width: 60px;
  height: 60px;
  position: relative;
  display: inline-block;
  background-color: #ececec;
  
  /* margin-bottom: 0.3rem; */
  text-align: left;
}

.preview-image {
  background-position: 50%;
  width: 60px;
  height: 60px;
  border-radius: 10px; 
}

.remove-image-btn {
  position: absolute;
  top: -5px;
  left: 45px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.record-button {
  width: 60%;
  margin-top: 2rem;
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