import { ADMIN, AGENT, MASTER, SUPER_ADMIN, SUPER_MASTER, SYSTEM_OWNER } from "../../lib/default-values";
import { appModules } from "../../lib/user-permissions";

const activeModules = appModules();

const menuItems = [
  {
    id: activeModules?.DASHBOARD,
    title: "Dashboard",
    path: `${process.env.PUBLIC_URL}/dashboard`,
    icon: "home",
    userRoles: [SYSTEM_OWNER, SUPER_ADMIN, ADMIN, SUPER_MASTER, MASTER, AGENT],
  },
  {
    id: activeModules?.ACCOUNT_MODULE,
    title: "Accounts",
    path: `${process.env.PUBLIC_URL}/account-list`,
    icon: "users",
    userRoles: [SYSTEM_OWNER, SUPER_ADMIN, ADMIN, SUPER_MASTER, MASTER],
  },
  {
    id: activeModules?.MULTI_LOGIN,
    title: "Multi Login",
    path: `${process.env.PUBLIC_URL}/multi-login`,
    icon: "user",
    userRoles: [SUPER_ADMIN, ADMIN, SUPER_MASTER, MASTER, AGENT],
  },
  {
    id: activeModules?.EVENT_BET_MODULE,
    title: "Event Bet",
    path: `${process.env.PUBLIC_URL}/event-bet-detail`,
    icon: "layers",
    userRoles: [SYSTEM_OWNER],
  },
  {
    id: activeModules?.USER_MODULE,
    title: "Users",
    path: `${process.env.PUBLIC_URL}/user-list`,
    icon: "user",
    userRoles: [SYSTEM_OWNER, SUPER_ADMIN, ADMIN, SUPER_MASTER, MASTER, AGENT],
  },
  {
    id: activeModules?.CURRENCIES,
    title: "Currencies",
    path: `${process.env.PUBLIC_URL}/currency-list`,
    icon: "dollar-sign",
    userRoles: [SYSTEM_OWNER],
  },
  {
    id: activeModules?.SPORTS,
    title: "Sports",
    path: `${process.env.PUBLIC_URL}/sport-list`,
    icon: "grid",
    userRoles: [SYSTEM_OWNER],
  },
  {
    id: activeModules?.COMPETITIONS,
    title: "Competitions",
    path: `${process.env.PUBLIC_URL}/competition-list`,
    icon: "globe",
    userRoles: [SYSTEM_OWNER],
  },
  {
    id: activeModules?.EVENTS,
    title: "Events",
    path: `${process.env.PUBLIC_URL}/event-list`,
    icon: "layers",
    userRoles: [SYSTEM_OWNER],
  },
  {
    id: activeModules?.ADD_EVENT,
    title: "Add Event",
    path: `${process.env.PUBLIC_URL}/api-event-list`,
    icon: "layers",
    userRoles: [SYSTEM_OWNER],
  },
  {
    id: activeModules?.THEME_USER_MODULE,
    title: "Theme Users",
    path: `${process.env.PUBLIC_URL}/theme-user-list`,
    icon: "user",
    userRoles: [SUPER_ADMIN],
  },
  {
    id: activeModules?.TRANSACTION_PANEL_USER_MODULE,
    title: "Transaction panel users",
    path: `${process.env.PUBLIC_URL}/transaction-panel-user-list`,
    icon: "users",
    userRoles: [MASTER],
  },
  {
    id: activeModules?.BANK_MODULE,
    title: "Bank",
    path: `${process.env.PUBLIC_URL}/bank`,
    icon: "briefcase",
    userRoles: [SYSTEM_OWNER, SUPER_ADMIN, ADMIN, SUPER_MASTER, MASTER],
  },
  {
    id: activeModules?.REPORT_MODULE,
    title: "Reports",
    icon: "file-text",
    userRoles: [SYSTEM_OWNER, SUPER_ADMIN, ADMIN, SUPER_MASTER, MASTER, AGENT],
    children: [
      {
        title: "Account statement",
        path: `${process.env.PUBLIC_URL}/account-statement`,
      },
      {
        title: "User history",
        path: `${process.env.PUBLIC_URL}/user-history`,
      },
    ],
  },
];

export default menuItems;
