# vueperss部署GithubPages

## 使用GithubActions部署

搜索github-pages-deploy-action并进行配置

```js
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

## 使用TravisCI部署

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
