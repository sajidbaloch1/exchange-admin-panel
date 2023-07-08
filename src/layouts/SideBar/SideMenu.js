export const MENUITEMS = [
  {
    menutitle: "MAIN",
    Items: [
      {
        path: `${process.env.PUBLIC_URL}/dashboard`,
        icon: "home",
        type: "link",
        active: true,
        title: "Dashboard",
      },
    ],
  },
  {
    menutitle: "USERS",
    Items: [
      {
        path: `${process.env.PUBLIC_URL}/user-list`,
        icon: "users",
        type: "link",
        active: false,
        title: "User-list",
      },
    ],
  },

];
