
# 配置SSH秘钥

## 创建秘钥

```sh
cd ~/.ssh

# ssh-keygen -t rsa -C [注释] -f [路径文件]
ssh-keygen -t rsa -C deployment -f deploy

#or
ssh-keygen -t rsa -C deployment -f ~/.ssh/deploy
```

## Github项目仓库配置私钥

  1. 进入Github目标仓库，选择Tab【settings】栏目，选择侧边【secrets】栏目
  2. 将创建的私钥填入

## 远端服务器配置公钥

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

## 修改秘钥配置文件

修改/etc/.ssh目录下的sshd_config配置文件

```sh
PermitRootLogin yes

AuthorizedKeysFile .ssh/authorized_keys
```

> 注：此步骤缺失，会令GithubActions访问远程服务器目录权限不足导致代码部署失败

如Github Actions异常：

 stderr:  Warning: Permanently added '***' (ECDSA) to the list of known hosts.

  Load key "/home/runner/.ssh/deploy_key": invalid format
