# vueperss部署GithubPages

## GithubActions部署

搜索github-pages-deploy-action并进行配置

## TravisCI部署

创建并配置.travis.yml文件

```yml
# see: https://docs.travis-ci.com/user/languages/javascript-with-nodejs/
language: node_js
os:
  - linux
node_js:
  - lts/*
cache:
  - yarn
script:
  - yarn deploy
deploy:
  provider: pages
  strategy: git
  cleanup: true
  local_dir: docs/.vuepress/dist
  # 在 GitHub 中生成，用于允许 Travis 向你的仓库推送代码。在 Travis 的项目设置页面进行配置，设置为 secure variable
  token: $GITHUB_TOKEN
  keep_history: true
  on:
    branch: master
```

创建部署脚本

```sh
# !/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 安装依赖
yarn install

# 生成静态文件
yarn build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

# 如果使用 travis 持续集成
git push -f https://${GITHUB_TOKEN}@github.com/wefesenlin/wefesenlin.github.io.git master


cd -
```

Package.json添加执行脚本deploy命令

```js
"scripts": {
  "deploy": "bash deploy.sh"
},
```
