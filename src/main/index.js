const { Menu, app, BrowserWindow, shell } = require("electron");
// Note: Store should be handled in renderer process, not main
// import "../renderer/store";
const fs = require('fs');
const child_process = require('child_process');
const path = require('path')
// 导入录制器模块（设置全局变量）
require('./recorder');
// require("./fingerprint/win");
// 获取应用根目录（兼容三端，与 exe 同级）
// 开发环境：使用项目根目录
// 生产环境：获取可执行文件所在目录（与 exe 同级，兼容 Windows/Linux/macOS）
let root = "";
if (process.env.NODE_ENV === "development") {
  root = path.join(__dirname, '../../');
} else {
  root = path.dirname(app.getPath("exe"));
}

// 获取日志文件的路径
const logPath = path.join(app.getPath('userData'), 'app.log');
// 写入日志的函数
function writeLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  // 异步追加日志信息
  fs.appendFile(logPath, logMessage, (err) => {
    if (err) throw err;
    console.log('日志信息已追加到文件');
  });
}


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9081`
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1280,
    title: "卡树自动拷贝打印系统 V3.1",
    icon: "static/images/logo64.ico", // sets window icon
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });
  // mainWindow.maximize();
  // 使窗口可以拖拽
  mainWindow.setIgnoreMouseEvents(false);
   Menu.setApplicationMenu(null); //关闭菜单
  //mainWindow.webContents.openDevTools({mode:'bottom'});
  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);
  global.setMainWindow(mainWindow);
  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.commandLine.appendSwitch("no-sandbox");
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
// 执行安装脚本（仅在首次安装时执行一次，兼容三端，无需额外权限）
function runInstallScript() {
  const productionServerPath = path.join(root, "ProductionServer");
  const installFlagPath = path.join(productionServerPath, ".install_completed");
  
  // 检查是否已执行过
  if (fs.existsSync(installFlagPath)) {
    console.log("安装脚本已执行过，跳过本次执行");
    return;
  }

  // 根据平台确定脚本文件名和命令（使用 sh 执行 .sh 文件无需执行权限）
  const scriptName = process.platform === "win32" ? "install.bat" : "install.sh";
  const installScriptPath = path.join(productionServerPath, scriptName);
  const execCommand = process.platform === "win32" 
    ? `"${installScriptPath}"` 
    : `sh "${installScriptPath}"`; // 使用 sh 执行，无需执行权限

  // 检查脚本是否存在
  if (!fs.existsSync(installScriptPath)) {
    console.log("安装脚本不存在: " + installScriptPath);
    return;
  }

  // 执行安装脚本
  console.log("首次安装，执行安装脚本: " + installScriptPath);
  writeLog(`首次安装，执行安装脚本: ${installScriptPath} (平台: ${process.platform})`);
  
  child_process.exec(execCommand, { cwd: productionServerPath }, (error, stdout, stderr) => {
    if (error) {
      console.error("安装脚本执行错误:", error);
      writeLog("安装脚本执行错误: " + error.message);
      return;
    }

    // 执行成功，创建标记文件
    try {
      fs.writeFileSync(installFlagPath, new Date().toISOString(), "utf-8");
      console.log("安装脚本执行完成");
      writeLog("安装脚本执行完成");
      if (stdout) console.log("输出:", stdout);
      if (stderr) console.error("错误输出:", stderr);
    } catch (writeErr) {
      console.error("创建安装标记文件失败:", writeErr);
      writeLog("创建安装标记文件失败: " + writeErr.message);
    }
  });
}

app.on("ready", () => {
  // 在创建窗口后执行安装脚本
  createWindow();
  // 延迟执行安装脚本，确保应用已启动
  setTimeout(() => {
    runInstallScript();
  }, 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
app.on("renderer-process-crashed", function (event, webContents, details) {
  // 输出一下捕捉到的reason，实际可以根据不同的“原因”进行具体处理
  console.error("renderer-process-crashed, reason => ", JSON.stringify(details));
  // 重启应用
  writeLog("renderer-process-crashed, reason => " + JSON.stringify(details))
});

const { ipcMain } = require("electron");
let preFilePath = "";
// app.on("will-finish-launching", () => {
app.on("open-file", (e, filePath) => {
  preFilePath = filePath;
});

ipcMain.on('open-help-file', async event => {   
  const helpFilePath = path.join(root, "ProductionServer", "User Manual.pdf");
  
  try {
    await shell.openPath(helpFilePath);
  } catch (error) {
    console.error("打开帮助文件错误:", error);
    writeLog("打开帮助文件错误: " + error.message);
    if (event.reply) {
      event.reply('open-help-file-error', error.message);
    }
  }
});

ipcMain.on("get-root", (event) => {
  event.reply("get-root-callback", root);
});

if (process.platform === "win32" && process.argv.length >= 2) {
  console.log("process argv:", process.argv);
  // windows系统当没有路径参数时这个位置默认有个.，需要加以判断
  preFilePath = process.argv[1] === "." ? "" : process.argv[1];
}
// });

ipcMain.on("open-program", (event) => {
  if (process.env.NODE_ENV !== "development") {
    //调试模式下不运行此行
    if (preFilePath != "") {
      event.reply("open-program-callback", preFilePath);
    }
  }
});

// 1. preFilePath
//

// const ffi = require('ffi-napi');
// const { ipcMain } = require("electron");
// ipcMain.on("init-frp", (event) => {
//   let result1 = frp_cap.LIVESCAN_Init();
//   let result2 = frp_cap.LIVESCAN_GetChannelCount();
//   event.reply("init-frp-callback", result1 == 1 && result2 > 0);

// });

// const frp = new ffi.Library('../../lib/ID_FprCap.dll', {
//   'LIVESCAN_Init':
//     [
//       'int', [],
//     ],
//     'LIVESCAN_BeginCapture':
//     [
//       'int', ['int']
//     ]
// });
// let result = frp_cap.LIVESCAN_Init();//初始化
// console.log(`LIVESCAN_Init: ` + result);

// result = frp_cap.LIVESCAN_GetChannelCount();//获得采集器通道数量
// console.log(`LIVESCAN_GetChannelCount: ` + result);

// result = frp_cap.LIVESCAN_BeginCapture(0);// 准备采集一帧图像
// console.log(`LIVESCAN_BeginCapture: ` + result);

// const buf = new Buffer.alloc(256 * 360 + 1078);
// console.log("BMP图像获取状态：", frp_cap.LIVESCAN_GetFPBmpData(0, buf))
// //console.log(buf.toString('hex'))
// fs.writeFile('./1.bmp',buf,'',()=>{});//11
// const buf2 = new Buffer.alloc(256 * 360);
// console.log("图像获取状态：", frp_cap.LIVESCAN_GetFPRawData(0, buf2))
// console.log(buf2.toString('hex'))

//console.log("buf", buf.toString("base64")); //12
//console.log("test", frp_cap.LIVESCAN_GetFPRawData(0, buf));
//console.log("buf", buf.toString("base64")); //
//frp_cap.LIVESCAN_EndCapture(0);
//result = frp.FP_Begin();
//console.log(`FP_Begin`, result);
//
//const buf2 = new Buffer(512);
//frp.FP_FeatureExtract(65, 99, buf, buf2);
//console.log("buf2: ", buf2.toString("base64")); //111111
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
