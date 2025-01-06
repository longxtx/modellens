// useAudioRecording.js
import { ref, onUnmounted } from 'vue';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/wav';

export function useAudioRecording() {
  const isRecording = ref(false);
  const isSupported = ref(true);
  const rec = ref(null);
  const recBlob = ref(null);
  const audioContext = ref(null);

  const recOpen = () => {
    // 创建录音对象
    rec.value = Recorder({
      type: 'wav', // 录音格式，可以换成wav等其他格式
      sampleRate: 16000, // 录音的采样率，越大细节越丰富越细腻
      bitRate: 16, // 录音的比特率，越大音质越好
    });

    if (!rec.value) {
      isSupported.value = false;
      alert('当前浏览器不支持录音功能！');
      return;
    }

    // 获得权限
    rec.value.open(
      () => {
        console.log('录音已打开');
        rec.value.close();
      },
      (msg, isUserNotAllow) => {
        isSupported.value = false;
        console.error((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg);
      }
    );
  };

  const startRecording = () => {
    if (!isSupported.value) {
      throw new Error('Audio recording is not supported in your browser');
    }

    if (!rec.value) {
      console.error('未打开录音');
      return;
    }

    // 开始
    rec.value.open(
      () => {
        console.log('已开始录音');
        isRecording.value = true;
        rec.value.start();
      },
      (msg, isUserNotAllow) => {
        console.error((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg);
      }
    );
  };

  const stopRecording = () => {
    if (!rec.value || !isRecording.value) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      rec.value.stop(
        (blob, duration) => {
          if (duration < 1000) {
            console.warning('说话时间太短');
            isRecording.value = false;
            return;
          }
          recBlob.value = blob;
          const localUrl = (window.URL || window.webkitURL).createObjectURL(blob);
          console.log('录音成功', blob, localUrl, '时长:' + duration + 'ms');
          isRecording.value = false;
          rec.value.close(); // 关闭录音，释放录音资源
          resolve(localUrl);
        },
        (err) => {
          console.error('结束录音出错：' + err);
          rec.value.close(); // 关闭录音，释放录音资源
          resolve(null);
        }
      );
    });
  };

  onUnmounted(() => {
    if (rec.value) {
      rec.value.close();
      rec.value = null;
    }
  });

  return {
    isRecording,
    isSupported,
    recOpen,
    startRecording,
    stopRecording,
    recBlob,
  };
}