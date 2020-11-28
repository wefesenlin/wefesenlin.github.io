# SSH2

基于node的ssh2工具实现本地部署

## 1.初始化部署环境

新建一个部署目录， 将需要部署的项目放入deploy文件夹中

```sh
mkdir deploy

cd deploy

npm init -y

# 安装ssh2依赖
npm i ssh2 -D
```

## 2.创建添加压缩包脚本

```sh
touch tar.sh
```

tar.sh脚本文件内容

```sh
#! /bin/sh
cd zhihu
npm run build
tar zcvf dist.tar.gz dist
```

添加可执行权限

```sh
chmod +x tar.sh
```

## 3. 创建部署脚本deploy.js

```sh
touch deploy.js
```

Deploy.js文件内容

```js
const cp = require('child_process')
const Client = require('ssh2').Client;

class Deploy {
  constructor(options) {
    this.options = options;
    this.tar();
  }
  /**
   * 打包压缩应用
   */
  tar() {
    const cp = require("child_process");
    const pro = cp.exec("./tar.sh", () => {});

    pro.stdout.pipe(process.stdout);

    pro.on("exit", () => {
      console.log("dist目录添加压缩包成功");
      this.connect();
    });
  }
  /**
   * 部署文件
   */
  connect() {
    const conn = new Client();
    const { ssh, localPath, serverPath, shell } = this.options;
    // 连接ssh上传
    conn
      .on("ready", () => {
        console.log("ssh2客户端连接成功");

        // 建立ftp传输目标文件
        conn.sftp((err, sftp) => {
          sftp.fastPut(localPath, serverPath, {}, (err, result) => {
            if (err) {
              console.log("sftp error: ");
              throw err;
            }
            conn.shell((error, stream) => {
              if (error) {
                console.log("shell error: ");
                throw error;
              }
              stream.end(shell);
            });
          });
        });
      })
      .connect(ssh);
  }
}


const deployOptions = {
  ssh: {
    // 服务器公网IP地址
    host: "",
    // 服务器默认推送端口号
    port: 22,
    // 服务器用户名
    username: "",
    // 服务器用户密码,
    password: ""
  },
  // 部署文件的本地路径
  localPath: "./zhihu/dist.tar.gz",
  // 部署文件的服务器路径
  serverPath: "/root/h5/dist.tar.gz",
  // 部署脚本（根据实际目录填写命令）
  shell: `
    cd /root/h5
    mv /root/h5/zhihu /root/h5/bak/zhihu.$(date "+%Y%m%d%H%M%S").bak
    mkdir zhihu
    tar zxvf dist.tar.gz
    mv dist /root/h5/zhihu
    rm -rf dist.tar.gz
    exit
  `,
};
new Deploy(deployOptions);
```
