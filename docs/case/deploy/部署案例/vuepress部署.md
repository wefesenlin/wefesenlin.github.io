# vuepress部署

## 目录

- 1 ssh秘钥配置
  - 1.1 创建ssh秘钥
  - 1.2 代码托管仓库配置私钥
  - 1.3 远程服务器配置公钥
  - 1.4 修改ssh秘钥配置文件
- 2 自动化部署工具配置
  - 2.1 配置GithubActions
  - 2.2 配置TravisCI
- 3 远程服务器配置Nginx

---

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

参考文档：

- [ECS实例数据传输的实现方式](https://help.aliyun.com/document_detail/51935.html?spm=a2c4g.11186623.2.14.227f21e8MFcqoh)

> 注：方式2较为繁琐

### 1.4 修改秘钥配置文件

修改/etc/.ssh目录下的sshd_config配置文件

```sh
PermitRootLogin yes

AuthorizedKeysFile .ssh/authorized_keys
```

> 注：此步骤缺失，会令GithubActions访问远程服务器目录权限不足导致代码部署失败

如Github Actions异常：

 stderr:  Warning: Permanently added '***' (ECDSA) to the list of known hosts.

  Load key "/home/runner/.ssh/deploy_key": invalid format

---

## 2 配置GithubActions

### 2.1 部署GithubPages

搜索github-pages-deploy-action并进行配置

```yml
# Deploy to GitHub Pages
- name: Deploy to GitHub Pages
  # You may pin to the exact commit or the version.
  # uses: JamesIves/github-pages-deploy-action@132898c54c57c7cc6b80eb3a89968de8fc283505
  uses: JamesIves/github-pages-deploy-action@3.7.1
  with:
    # You can configure the action to deploy using SSH by setting this option to true. More more information on how to add your ssh key pair please refer to the Using a Deploy Key section of this README.
    SSH: # optional
    # Depending on the repository permissions you may need to provide the action with a GitHub personal access token instead of the provided GitHub token in order to deploy. This should be stored as a secret.
    ACCESS_TOKEN: # optional
    # In order for GitHub to trigger the rebuild of your page you must provide the action with the repositories provided GitHub token.
    GITHUB_TOKEN: # optional
    # This is the branch you wish to deploy to, for example gh-pages or docs.
    BRANCH:
    # The folder in your repository that you want to deploy. If your build script compiles into a directory named build you would put it here. Folder paths cannot have a leading / or ./. If you wish to deploy the root directory you can place a . here.
    FOLDER:
    # If you would like to push the contents of the deployment folder into a specific directory on the deployment branch you can specify it here.
    TARGET_FOLDER: # optional
    # The base branch of your repository which you would like to checkout prior to deploying. This defaults to the current commit SHA that triggered the build followed by master if it does not exist. This is useful for making deployments from another branch, and also may be necessary when using a scheduled job.
    BASE_BRANCH: # optional
    # If you need to customize the commit message for an integration you can do so.
    COMMIT_MESSAGE: # optional
    # If your project generates hashed files on build you can use this option to automatically delete them from the deployment branch with each deploy. This option can be toggled on by setting it to true.
    CLEAN: # optional, default is true
    # If you need to use CLEAN but you would like to preserve certain files or folders you can use this option. This should be formatted as an array but stored as a string.
    CLEAN_EXCLUDE: # optional
    # Allows you to customize the name that is attached to the GitHub config which is used when pushing the deployment commits. If this is not included it will use the name in the GitHub context, followed by the name of the action.
    GIT_CONFIG_NAME: # optional
    # Allows you to customize the email that is attached to the GitHub config which is used when pushing the deployment commits. If this is not included it will use the email in the GitHub context, followed by a generic noreply GitHub email.
    GIT_CONFIG_EMAIL: # optional
    # Allows you to speicfy a different repository path so long as you have permissions to push to it. This should be formatted like so: JamesIves/github-pages-deploy-action
    REPOSITORY_NAME: # optional
    # This should point to where your project lives on the virtual machine. The GitHub Actions environment will set this for you. It is only neccersary to set this variable if you're using the node module.
    WORKSPACE: # optional
    # This option can be used if you'd prefer to have a single commit on the deployment branch instead of maintaining the full history.
    SINGLE_COMMIT: # optional
    # Migrates files from Git LFS so they can be comitted to the deployment branch.
    LFS: # optional
    # Silences the action output preventing it from displaying git messages.
    SILENT: # optional
    # Preserves and restores any workspace changes prior to deployment.
    PRESERVE: # optional
```

### 2.2 部署远程服务器

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
    - name: SSH Deploy Aliyun
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

## 3 远程服务器配置Nginx

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

输入配置

```nginx
server {
  listen       80;
  server_name  www.wefe.cc;

  #charset koi8-r;
  #access_log  /var/log/nginx/host.access.log  main;

  location /docs/ {
      alias /root/docs/dist/;
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

启动

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
