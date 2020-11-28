# 配置Nginx

## 基本操作

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

## 配置文件

### 主配置文件nginx.conf

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

### 子配置文件wefe.cc.conf

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

参考文档：

- location root 与alias的指令区别 <https://blog.csdn.net/lizhiyuan_eagle/article/details/90639448>

反向代理示例

```nginx
server {
    listen 80; // 默认端口
    server_name 123.56.119.218; // 域名，当你访问这个域名时，会直接去找/home/www目录下的index.html文件
    root   /home/www; // 根目录
    index  index.html index.htm index.php; // 默认首页

    // 反向代理
    location /api/ { // 前端访问api下的接口时，会代理到proxy_pass指向的地址
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:3000; // 反向代理，用户访问api接口时，指向本地服务3000端口
    }
}
```

---

---

## 异常问题

### 403 Forbidden

- <https://www.cnblogs.com/lxwphp/p/11124633.html>
- <https://www.linuxprobe.com/nginx-403-forbidden.html>
