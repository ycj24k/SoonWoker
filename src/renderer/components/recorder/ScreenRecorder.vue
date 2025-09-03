<template>
  <div class="screen-recorder">
    <el-tooltip 
      :content="isRecording ? $t('recorder.stopRecording') : $t('recorder.startRecording')" 
      placement="top">
      <el-button
        :type="isRecording ? 'danger' : 'primary'"
        :icon="isRecording ? 'el-icon-video-pause' : 'el-icon-video-camera'"
        circle
        @click="toggleRecording"
        :loading="loading"
        class="record-btn"
      >
      </el-button>
    </el-tooltip>
    
    <!-- 录制状态指示器 -->
    <div v-if="isRecording" class="recording-indicator">
      <span class="recording-dot"></span>
      <span class="recording-text">{{ recordingTime }}</span>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
  name: 'ScreenRecorder',
  data() {
    return {
      isRecording: false,
      loading: false,
      mediaRecorder: null,
      recordedChunks: [],
      startTime: null,
      recordingTime: '00:00',
      timer: null,
      stream: null
    };
  },
  methods: {
    async toggleRecording() {
      if (this.isRecording) {
        await this.stopRecording();
      } else {
        await this.startRecording();
      }
    },

    async startRecording() {
      this.loading = true;
      
      try {
        // 调用主进程开始录制
        const result = await ipcRenderer.invoke('start-recording');
        
        if (!result.success) {
          this.$message.error(result.message);
          this.loading = false;
          return;
        }

        // 获取屏幕流
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: result.sourceId,
              minWidth: 1280,
              maxWidth: 1920,
              minHeight: 720,
              maxHeight: 1080
            }
          }
        });

        this.stream = stream;
        this.recordedChunks = [];
        
        // 创建MediaRecorder
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        });

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = async () => {
          await this.saveRecording();
        };

        // 开始录制
        this.mediaRecorder.start();
        this.isRecording = true;
        this.startTime = Date.now();
        this.startTimer();
        
        this.$message.success(this.$t('recorder.recordingStarted') || '开始录制');
        this.$emit('recording-started');
        
      } catch (error) {
        console.error('启动录制失败:', error);
        this.$message.error(this.$t('recorder.startFailed') || '启动录制失败');
      } finally {
        this.loading = false;
      }
    },

    async stopRecording() {
      this.loading = true;
      
      try {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
        
        // 停止所有轨道
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
        
        this.isRecording = false;
        this.stopTimer();
        this.$emit('recording-stopped');
        
      } catch (error) {
        console.error('停止录制失败:', error);
        this.$message.error(this.$t('recorder.stopFailed') || '停止录制失败');
      } finally {
        this.loading = false;
      }
    },

    async saveRecording() {
      if (this.recordedChunks.length === 0) {
        return;
      }

      try {
        // 将录制的数据块合并为Blob
        const blob = new Blob(this.recordedChunks, {
          type: 'video/webm'
        });

        // 转换为base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result;
          
          // 发送到主进程保存
          const result = await ipcRenderer.invoke('stop-recording', base64data);
          
          if (result.success) {
            this.$message.success(this.$t('recorder.savedSuccess') || `录制已保存: ${result.fileName}`);
            this.$emit('recording-saved', result);
          } else {
            this.$message.error(result.message);
          }
        };
        reader.readAsDataURL(blob);
        
      } catch (error) {
        console.error('保存录制失败:', error);
        this.$message.error(this.$t('recorder.saveFailed') || '保存录制失败');
      }
    },

    startTimer() {
      this.timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        this.recordingTime = `${minutes}:${seconds}`;
      }, 1000);
    },

    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        this.recordingTime = '00:00';
      }
    },

    // 外部调用的方法，用于在提交作业时自动停止录制
    async stopIfRecording() {
      if (this.isRecording) {
        await this.stopRecording();
      }
    }
  },

  beforeDestroy() {
    // 组件销毁时确保停止录制
    if (this.isRecording) {
      this.stopRecording();
    }
  }
};
</script>

<style lang="less" scoped>
.screen-recorder {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  .record-btn {
    &:hover {
      transform: scale(1.1);
    }
  }

  .recording-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background: rgba(245, 108, 108, 0.1);
    border-radius: 15px;

    .recording-dot {
      width: 8px;
      height: 8px;
      background: #f56c6c;
      border-radius: 50%;
      animation: blink 1s infinite;
    }

    .recording-text {
      font-size: 14px;
      color: #f56c6c;
      font-weight: 500;
    }
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
