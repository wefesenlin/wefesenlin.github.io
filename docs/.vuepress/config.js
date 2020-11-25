
const plugins = require('./config/plugin')
const nav = require("./config/nav");

/**
 * see: https://www.vuepress.cn/config/#基本配置
 */
module.exports = {
  base: "/docs/",
  // 添加浏览器图标
  head: [
    ['link', {rel: 'icon', href: '/assets/img/logo.png'}]
  ],
  title: "森林",
  description: "森林博客",
  themeConfig: {
    logo: "/assets/img/logo.png",
    nav,

    /**
     * 侧边栏
     */
    sidebar: "auto",
    // sidebar: require('./config/sidebar'),

    /**
     * 搜索配置
     */
    // 禁用搜搜
    // search: false,
    // 搜索框显示的搜索结果数量
    searchMaxSuggestions: 10,

    /**
     * 标题配置
     */
    // 显示所有页面的标题链接
    displayAllHeaders: false, // 默认值：false
    // 活动的标题链接
    activeHeaderLinks: false, // 默认值：true

    /**
     * 其它配置
     */
    // 最后更新时间
    lastUpdated: "最后更新", // string | boolean

    // 上 / 下一篇链接
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true,

    // 页面滚动
    smoothScroll: true,
  },
  plugins,
};
