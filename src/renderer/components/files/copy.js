const fs = require("fs");
const path = require("path");
function copy(src, srcafter, isFolder, callback, fileList) {
  if (isFolder) {
    //复制文件夹
    fs.cp(src, srcafter, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        callback(fileList,false);
      }else{
        console.log("copyover");
        console.log("err");
        callback(fileList,true);
      }
      
    });
  } else {
    // 复制文件
    fs.cp(src, srcafter, (err) => {
      if (err) {
        console.error(err);
        console.log("err");
        callback(fileList,false);
      }else{
        console.log("copyover");
        callback(fileList,true);
      }
    });
  }
}
export { copy };
//'./src/renderer/components/files/test'
//'./src/renderer/components/files/testafter/tset'
