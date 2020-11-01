
const plugins = require('./config/plugin')
const nav = require("./config/nav");

/**
 * see: https://www.vuepress.cn/config/#基本配置
 */
module.exports = {
  title: "森林博客",
  description: "森林博客",
  themeConfig: {
    logo: "/assets/img/logo.png",
    nav,
    // sidebar: true,

    /**
     * 搜索配置
     */
    // search: false,
    // 搜索框显示的搜索结果数量
    searchMaxSuggestions: 10,

    /**
     * 侧边栏配置
     */

    // sidebar: auto,
    // sidebar: [
    //   {
    //     title: "HTML",
    //     children: ["/", "/html/1", "/html/2"],
    //     initialOpenGroupIndex: -1, // 可选的, 默认值是 0
    //   },
    //   {
    //     title: "CSS",
    //     children: ["/", "/css/1", "/css/2"],
    //     initialOpenGroupIndex: -1, // 可选的, 默认值是 0
    //   },
    //   {
    //     title: "JavaScript", // 必要的
    //     // path: "/algorithm/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    //     // collapsable: false, // 可选的, 默认值是 true,
    //     // sidebarDepth: 1, // 可选的, 默认值是 1
    //     children: ["/"],
    //   },
    // ],

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
    lastUpdated: "Last Updated", // string | boolean

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
