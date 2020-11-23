const dayjs = require('dayjs')

module.exports = {
  "@vuepress/last-updated": {
    transformer: (timestamp) => {
      return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  "@vuepress/nprogress": {},
  "@vuepress/back-to-top": true,
  // https://www.vuepress.cn/plugin/official/plugin-medium-zoom.html#使用
  "@vuepress/medium-zoom": {},
  "beautiful-bar": {}
};