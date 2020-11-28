# 自动部署GithubActions

## 部署远程服务器

配置Github Actions自动部署远程服务器，主要步骤：

  1. 进入Github目标仓库
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

## 部署GithubPages

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
