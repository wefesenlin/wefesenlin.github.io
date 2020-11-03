module.exports = [
  { text: "首页", link: "/" },
  {
    text: "计算机",
    ariaLabel: "计算机组成原理",
    items: [
      { text: "操作系统", link: "/computer/system/" },
      { text: "浏览器工作原理", link: "/computer/browser/" },
      // { text: "数据结构与算法", link: "/computer/browser/" },
      // { text: "设计模式", link: "/computer/browser/" },
    ],
  },
  {
    text: "前端",
    ariaLabel: "前端知识体系",
    items: [
      { text: "Javascript", link: "/web/javascript/" },
      { text: "HTML", link: "/web/html/" },
      { text: "CSS", link: "/web/css/" },
    ],
  },
  {
    text: "后端",
    ariaLabel: "后端知识体系",
    items: [
      { text: "MySQL", link: "/server/mysql/" },
      { text: "MongoDB", link: "/server/mongodb/" },
      { text: "Nginx", link: "/server/nginx/" },
      { text: "Node", link: "/server/node/" },
      { text: "Nestjs", link: "/server/nestjs/" },
    ],
  },
  {
    text: "工具",
    ariaLabel: "工具链",
    items: [
      { text: "Docker", link: "/tools/docker/" },
    ],
  },
];