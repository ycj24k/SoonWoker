const { desktopCapturer, ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');

class ScreenRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.mainWindow = null;
  }

  setMainWindow(window) {
    this.mainWindow = window;
  }

  async startRecording() {
    if (this.isRecording) {
      return { success: false, message: '正在录制中' };
    }

    try {
      // 获取屏幕源
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });

      if (sources.length === 0) {
        return { success: false, message: '无法获取屏幕源' };
      }

      // 发送源ID到渲染进程
      const sourceId = sources[0].id;
      this.isRecording = true;
      
      return { 
        success: true, 
        sourceId: sourceId,
        message: '开始录制' 
      };
    } catch (error) {
      console.error('启动录制失败:', error);
      return { success: false, message: error.message };
    }
  }

  async stopRecording(videoData, taskId = '') {
    if (!this.isRecording) {
      return { success: false, message: '当前没有进行录制' };
    }

    try {
      this.isRecording = false;
      
      // 确保videos目录存在 - 在应用根目录下
      const appPath = process.env.NODE_ENV === 'development' 
        ? path.join(__dirname, '../../') 
        : path.dirname(app.getPath('exe'));
      const videosDir = path.join(appPath, 'videos');
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }

      // 生成文件名：任务ID_日期时间格式 (YYYYMMDD_HHmmss)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const dateTimeStr = `${year}${month}${day}_${hours}${minutes}${seconds}`;
      
      // 如果有任务ID，使用任务ID_日期时间，否则使用日期时间
      const fileName = taskId 
        ? `${taskId}_${dateTimeStr}.webm`
        : `${dateTimeStr}.webm`;
      const filePath = path.join(videosDir, fileName);

      // 将base64数据转换为Buffer并保存
      const buffer = Buffer.from(videoData.replace('data:video/webm;base64,', ''), 'base64');
      fs.writeFileSync(filePath, buffer);

      console.log('视频已保存到:', filePath);
      
      return { 
        success: true, 
        filePath: filePath,
        fileName: fileName,
        message: '录制已保存' 
      };
    } catch (error) {
      console.error('停止录制失败:', error);
      return { success: false, message: error.message };
    }
  }

  // 获取videos目录路径
  getVideosPath() {
    const appPath = process.env.NODE_ENV === 'development' 
      ? path.join(__dirname, '../../') 
      : path.dirname(app.getPath('exe'));
    return path.join(appPath, 'videos');
  }
}

// 创建录制器实例
const recorder = new ScreenRecorder();

// IPC事件处理
ipcMain.handle('start-recording', async () => {
  return await recorder.startRecording();
});

ipcMain.handle('stop-recording', async (event, videoData, taskId) => {
  return await recorder.stopRecording(videoData, taskId);
});

ipcMain.handle('get-videos-path', () => {
  return recorder.getVideosPath();
});

// 使用全局变量方式，避免webpack模块转换问题
global.ScreenRecorderInstance = recorder;
global.setMainWindow = (window) => recorder.setMainWindow(window);

// 不导出任何内容，完全依赖全局变量