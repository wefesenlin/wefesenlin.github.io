module.exports = [
  { text: "首页", link: "/" },
  // { text: "Guide", link: "/guide/", target: "_blank" },
  // {
  //   text: "External",
  //   link: "https://google.com",
  //   target: "_self",
  //   rel: "",
  // },
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
      { text: "node", link: "/server/node/" },
      { text: "nestjs", link: "/server/nestjs/" },
    ],
  },
];