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
  // {
  //   menutitle: "USERS",
  //   Items: [
  //     {
  //       path: `${process.env.PUBLIC_URL}/user-list`,
  //       icon: "users",
  //       type: "link",
  //       active: false,
  //       title: "Users",
  //     },
  //   ],
  // },
  {
    menutitle: "USERS",
    Items: [
      {
        title: "Users",
        icon: "users",
        type: "sub",
        badge1: true,
        badge: "badge bg-secondary",
        badgetxt: "2",
        background: "hor-rightangle",
        active: false,
        children: [
          {
            path: `${process.env.PUBLIC_URL}/super-admin-list`,
            title: "Super Admin",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/admin-list`,
            title: "Admin",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/master-list`,
            title: "Masters",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/client-list`,
            title: "Clients",
            type: "link",
          },

        ],
      },
    ],
  },

];
