const fs = require("fs");
const path = require("path");
// 使用promisify方法来promise化指定方法
const { promisify } = require("util");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// 异步
export async function calcSize(dirPath, callback) {
  let fileSize = 0;
  let error = null;
  async function calc(dirPath) {
    try {
      const statObj = await stat(dirPath);
      if (statObj.isDirectory()) {
        const files = await readdir(dirPath);
        let dirs = files.map((item) => {
          return path.join(dirPath, item);
        });
        let index = 0;
        async function next() {
          if (index < dirs.length) {
            let current = dirs[index++];
            await calc(current);
            await next();
          }
        }
        return await next();
      } else {
        fileSize += statObj.size;
      }
    } catch (err) {
      error = err;
    }
  }
  await calc(dirPath);
  callback(error, fileSize, dirPath);
}

export function getFileName(name) {
  return name.substring(name.lastIndexOf("\\") + 1);
}
export function getExtension(name) {
  return name.substring(name.lastIndexOf(".") + 1);
}

export function bytesToSize(bytes) {
  if (bytes === 0) return "0 B";
  var k = 1024,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
}

export function isFolder(path) {
  let _stat = fs.lstatSync(path);
  return _stat.isDirectory();
}
