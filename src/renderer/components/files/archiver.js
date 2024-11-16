// 第一步，导入必要的模块
const fs = require('fs');
const archiver = require('archiver');
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));
function zip(filesList,zippath,callback,isPassword,pass)
{
// 第二步，创建可写流来写入数据
const output = fs.createWriteStream(zippath);// 将压缩包保存到当前项目的目录下，并且压缩包名为test.zip
if(isPassword)
{
  
  const archive = archiver.create('zip-encrypted',
  {
      zlib: {
          level: 8,//压缩等级
      },
      encryptionMethod: 'aes256',//加密方法
      password:pass ,//解压密码
  });

    // 第三步，建立管道连接
  archive.pipe(output);

  // 第四步，压缩多个文件到压缩包中
  for (let i in filesList) {
      console.log("压缩:")
      if(filesList[i].folder)
      {
        archive.directory(i, filesList[i].name);
        console.log(filesList[i].name)
      }else{
        archive.append(i, {name: filesList[i].name});
        console.log(filesList[i].name)
      }
    }

   //监听所有archive数据都写完
   output.on('close', function() {
    setTimeout(() => {
      callback(true);
    }, 1000);
    console.log('压缩完成', archive.pointer() / 1024 / 1024 + 'M');
  });
  archive.on('error', function(err) {
    callback(false);
    console.log("压缩失败!");
    throw err;
  });

  // 第五步，完成压缩
  archive.finalize();
}else{
  const archive = archiver('zip', {zlib: {level: 9}});// 设置压缩等级

    // 第三步，建立管道连接
  archive.pipe(output);

  // 第四步，压缩多个文件到压缩包中
  for (let i in filesList) {
      console.log("压缩:")
      if(filesList[i].folder)
      {
        archive.directory(i, filesList[i].name);
        console.log(filesList[i].name)
      }else{
        var stream = fs.createReadStream(i);
        archive.append(stream, {name: filesList[i].name});
        console.log(filesList[i].name)
      }
    }

  
    //监听所有archive数据都写完
    output.on('close', function() {
      setTimeout(() => {
        callback(true);
      }, 1000);
      console.log('压缩完成', archive.pointer() / 1024 / 1024 + 'M');
    });
    archive.on('error', function(err) {
      callback(false);
      console.log("压缩失败!");
      throw err;
    });

    // 第五步，完成压缩
    archive.finalize();
}




}
export {		
	zip
}