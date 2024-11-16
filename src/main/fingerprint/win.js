import * as ffi from "ffi-napi";
import { app } from "electron";
const fs = require("fs");
const { ipcMain } = require("electron");
// const { Input } = require("element-ui");
const path = require("path");
let root = "";
if (process.env.NODE_ENV !== "development") {
  root = path.dirname(app.getPath("exe"));
} else {
  root = "..\\..\\";
}
//console.log(root);
let interval;
const frp_cap = new ffi.Library(`${root}\\lib\\ID_FprCap.dll`, {
  LIVESCAN_Init: ["int", []], //初始化
  LIVESCAN_GetChannelCount: ["int", []], //获得采集器通道数量
  LIVESCAN_BeginCapture: ["int", ["int"]], // 准备采集一帧图像
  LIVESCAN_GetFPRawData: ["int", ["int", "uchar*"]], //采集一帧图像
  LIVESCAN_GetFPBmpData: ["int", ["int", "uchar*"]], //采集一帧 BMP 格式图像数据
  LIVESCAN_EndCapture: ["int", ["int"]], //结束采集
});

ipcMain.on("get-root", (event) => {
  event.reply("get-root-callback", root);
});
ipcMain.on("init-frp", (event) => {
  let result1 = frp_cap.LIVESCAN_Init();
  let result2 = frp_cap.LIVESCAN_GetChannelCount();
  event.reply("init-frp-callback", result1 == 1 && result2 > 0);
});

ipcMain.on("end-frp", (event) => {
  let result10 = frp_cap.LIVESCAN_EndCapture(0);
  clearInterval(interval);
  event.reply("end-frp-callback", result10);
});

ipcMain.on("input-frp", (event) => {
  let result3 = frp_cap.LIVESCAN_BeginCapture(0);
  if (result3) {
    const buf1 = new Buffer.alloc(256 * 360 + 1078);
    const buf2 = new Buffer.alloc(256 * 360);
    let i = 0;
    interval = setInterval(() => {
      take(event, buf1, buf2, interval);
      i++;
      //console.log(i);
    }, 1000);
  }
});

function take(event, buf1, buf2, interval) {
  let result4 = 0;
  let result5 = 0;
  let result6 = 0;
  result4 = frp_cap.LIVESCAN_GetFPBmpData(0, buf1);
  result5 = frp_cap.LIVESCAN_GetFPRawData(0, buf2);
  if (result4 == 1 && result5 == 1) {
    ////console.log(buf1.toString('hex').substr(0,10))
    //console.log("BMP图像获取状态：", result4);
    ////console.log(buf2.toString('hex').substr(0,10))
    //console.log("图像获取状态：", result5);

    if (
      buf1.toString("hex").substr(0, 10) != " 424d000000" &&
      buf2.toString("hex").substr(0, 10) != "fafafafafa"
    ) {
      //  fs.writeFile('./src/renderer/assets/picture/1.jpg',buf1,'',()=>{});
      //  fs.writeFile('./src/renderer/assets/picture/1.bmp',buf1,'',()=>{});
      event.reply("input-frp-callback", buf1, buf2);
      result6 = frp_cap.LIVESCAN_EndCapture(0);
      //console.log("结束录入：" + result6);
      clearInterval(interval);
    }
  }
}

const fpr = new ffi.Library(`${root}\\lib\\ID_Fpr.dll`, {
  FP_Begin: ["int", []], //初始化操作
  FP_FeatureExtract: ["int", ["char", "char", "char*", "char*"]], //指纹图像特征提取
  FP_FeatureMatch: ["int", ["char*", "char*", "float*"]], //指纹特征数据进行比对
  FP_ImageMatch: ["int", ["char*", "char*", "float*"]], //图像和指纹特征进行比对
  FP_End: ["int", []], //结束操作
});

ipcMain.on("ok-frp", (event, data) => {
  let result7 = fpr.FP_Begin();
  //console.log("初始化：" + result7);
  const buf3 = new Buffer.alloc(512);
  let result8 = fpr.FP_FeatureExtract(65, 99, data, buf3);
  //console.log("指纹特征提取：" + result8);
  // //console.log(buf3.toString("base64"));
  // //console.log("buf3:"+buf3);
  event.reply("ok-frp-callback", buf3.toString("base64"));
});
ipcMain.on("judge-frp", (event, data1, data2) => {
  const a = new Buffer.alloc(4);
  const Buffer1 = new Buffer.from(data1, "base64"); //把base64码转成buffer对象
  const Buffer2 = new Buffer.from(data2, "base64"); //把base64码转成buffer对象
  //console.log("Buffer1:" + Buffer1);
  //console.log("Buffer2:" + Buffer2);
  let result9 = fpr.FP_FeatureMatch(Buffer1, Buffer2, a);
  //console.log("调用相似度：" + result9);
  //console.log("相似度：" + a.readFloatLE(0).toFixed(2));
  event.reply("judge-frp-callback", {
    rate: a.readFloatLE(0).toFixed(2),
    data1: data1,
    data2: data2,
  });
});
