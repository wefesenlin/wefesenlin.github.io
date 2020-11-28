# vuepress部署远程服务器

## 目录

- 1 ssh秘钥配置
  - 1.1 创建ssh秘钥
  - 1.2 代码托管仓库配置私钥
  - 1.3 远程服务器配置公钥
  - 1.4 修改ssh秘钥配置文件
- 2 配置GithubActions
- 3 配置Nginx

## 1 ssh秘钥配置

### 1.1 创建ssh秘钥

```sh
cd ~/.ssh

# ssh-keygen -t rsa -C [注释] -f [路径文件]
ssh-keygen -t rsa -C deployment -f deploy

#or
ssh-keygen -t rsa -C deployment -f ~/.ssh/deploy
```

### 1.2 代码托管仓库配置私钥

  1. 进入Github目标仓库，选择Tab【settings】栏目，选择侧边【secrets】栏目
  2. 将创建的私钥填入

### 1.3 远端服务器配置公钥

把公钥写进服务器.ssh目录下的authorized_key文件

方式1：

使用ssh-copy-id命令

```sh
# 默认使用 22 端口
ssh-copy-id -i ~/.ssh/id_rsa.pub <服务器用户名>@<服务器地址>

# 如需指定端口号
ssh-copy-id -i ~/.ssh/id_rsa.pub <服务器用户名>@<服务器地址> -p <服务器端口号>
```

方式2：

使用scp传输命令

```sh
scp deployment.pub root@47.115.0.145:.
```

登录远端服务器，将公钥内容写入授权文件，进入.ssh文件夹，查看是否有authorized_keys文件,若没有则创建一个;

```sh
# 登录远端服务器
ssh root@47.115.0.145

# 访问.ssh文件夹
cd .ssh

# 查看文件列表
ls -la

# 将公钥内容写入authorized_keys文件
cat deployment.pub >> ~/.ssh/authorized_keys
```

参考文档：[ECS实例数据传输的实现方式](https://help.aliyun.com/document_detail/51935.html?spm=a2c4g.11186623.2.14.227f21e8MFcqoh)

> 注：方式2较为繁琐

### 1.4 修改秘钥配置文件

修改/etc/.ssh目录下的sshd_config配置文件

```sh
PermitRootLogin yes

AuthorizedKeysFile .ssh/authorized_keys
```

> 注：此步骤缺失，会令GithubActions访问远程服务器目录权限不足导致代码部署失败
>
>
>
> 如Github Actions异常：
>
> stderr:  Warning: Permanently added '***' (ECDSA) to the list of known hosts.
>
> Load key "/home/runner/.ssh/deploy_key": invalid format

---

## 2 配置GithubActions

主要步骤：

  1. 进入Github目标项目代码仓库
  2. 选择【actions】-【Continuous integration workflows】-【Node.js】
  3. 在右侧面板【marketspace】搜索ssh-deploy并复制配置信息补充yml配置文件

```yml
# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: VuePress CI/CD

on:
  push:
    branches: [ docs ]
  # pull_request:
  #   branches: [ docs ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm run buildcd --if-present
    # 部署阿里云
    - name: SSH Deploy Server
      uses: easingthemes/ssh-deploy@v2.1.5
      with:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_DEPLOY_KEY }}
        REMOTE_HOST: ${{ secrets.SSH_HOST }}
        REMOTE_USER: ${{ secrets.SSH_USER }}
        REMOTE_PORT: ${{ secrets.SSH_PORT }}
        SOURCE: docs/.vuepress/dist
        TARGET: ${{ secrets.TARGET }}
        # Arguments to pass to rsync
        ARGS: "-avzr --delete"
```

---

## 3 配置Nginx

### 3.1 主配置文件nginx.conf

执行命令

```sh
# 访问nignx配置目录
cd /etc/nginx

# 查看nginx配置
cat nginx.conf
```

修改配置文件

```nginx
user  root;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    gzip  on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_http_version 1.0;
    gzip_comp_level 2;
    gzip_types text/plain application/x-javascript text/css application/xml;
    gzip_var on;

    include /etc/nginx/conf.d/*.conf;
}
```

### 3.2 子配置文件wefe.cc.conf

执行命令

```sh
# 访问nginx子配置模块目录
cd /etc/nginx/conf.d

# 创建目标域名配置文件
touch wefe.cc.conf
```

wefe.cc.conf配置

```nginx
server {
  listen       80;
  server_name  www.wefe.cc;

  #charset koi8-r;
  #access_log  /var/log/nginx/host.access.log  main;

  location /docs/ {
      alias /root/web/docs/dist/;
      index  index.html index.htm;
  }

  #error_page  404              /404.html;

  # redirect server error pages to the static page /50x.html
  #
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
      root   /usr/share/nginx/html;
  }
}
```

### 3.3 nginx相关操作

启动nginx

```sh
nginx
```

重启nginx

```sh
nginx -s reload
```

查看nginx进程号

```sh
ps -ef | grep nginx
```

停止nginx

从容停止

```sh
kill -QUIT 主进程号
```

快速停止

```sh
kill -TERM 主进程号
```

强制停止

```sh
kill -9 nginx
```

查看端口号

```js
# 查看端口
netstat -tlnp

netstat -nlp | grep :80
```

检查nginx配置语法

```sh
nginx -t -c /etc/nginx/nginx.conf
```

查看日志

```sh
# 访问nginx日志目录
cd /var/log/nginx

# 查看日志
cat access.log

# or
cat /var/log/nginx/error.log
```

启动nginx服务

```sh
systemctl start nginx.service
```

设置开机自启动

```sh
systemctl enable nginx.service
```

停止开机自启动

```sh
systemctl disable nginx.service
```

查看服务当前状态

```sh
systemctl status nginx.service
```

重新启动服务

```sh
systemctl restart nginx.service
```

查看所有已启动的服务

```sh
systemctl list-units --type=service
```

### 3.4 nginx异常问题

403 Forbidden

- <https://www.cnblogs.com/lxwphp/p/11124633.html>
- <https://www.linuxprobe.com/nginx-403-forbidden.html>
