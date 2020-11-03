import dayjs from 'dayjs'

module.exports = {
  "@vuepress/last-updated": {
    transformer: (timestamp) => {
      return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  "@vuepress/nprogress": true,
  "@vuepress/back-to-top": true,
  "vuepress-plugin-auto-sidebar": {
    // nav: true
  },
  // https://www.vuepress.cn/plugin/official/plugin-medium-zoom.html#使用
  "@vuepress/medium-zoom": {},
};