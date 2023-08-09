import CryptoJS from "crypto-js";

export const logoutUser = () => {
  localStorage.clear();
  window.location.reload();
};

const decryptAESEncryption = (encryptedString) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, process.env.REACT_APP_PERMISSIONS_AES_SECRET);
    const string = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(string);
  } catch (e) {
    logoutUser();
  }
};

const appModules = () => {
  const modules = JSON.parse(localStorage.getItem(process.env.REACT_APP_PERMISSIONS_AMLS_KEY));
  if (!modules) {
    logoutUser();
  }
  return decryptAESEncryption(modules);
};

const activeSessionKeys = () => {
  const activeKeys = JSON.parse(localStorage.getItem(process.env.REACT_APP_PERMISSIONS_UPLS_KEY));
  if (!activeKeys) {
    logoutUser();
  }
  return decryptAESEncryption(activeKeys);
};

export const activeModules = appModules();
export const permissionKeys = activeSessionKeys();

const hasPermission = (key = null) => {
  if (!key) {
    return false;
  }
  return permissionKeys.includes(key);
};

export const permission = {
  // Account Module
  ACCOUNT_MODULE: {
    ACTIVE: hasPermission(activeModules?.ACCOUNT_MODULE),
    CREATE: hasPermission(activeModules?.ACCOUNT_CREATE),
    UPDATE: hasPermission(activeModules?.ACCOUNT_UPDATE),
    DELETE: hasPermission(activeModules?.ACCOUNT_DELETE),
    DEPOSIT: hasPermission(activeModules?.ACCOUNT_DEPOSIT),
    WITHDRAW: hasPermission(activeModules?.ACCOUNT_WITHDRAW),
  },

  // User Module
  USER_MODULE: {
    ACTIVE: hasPermission(activeModules?.USER_MODULE),
    CREATE: hasPermission(activeModules?.USER_CREATE),
    UPDATE: hasPermission(activeModules?.USER_UPDATE),
    DELETE: hasPermission(activeModules?.USER_DELETE),
    USER_STATUS_UPDATE: hasPermission(activeModules?.USER_STATUS_UPDATE),
    USER_BET_UPDATE: hasPermission(activeModules?.USER_BET_UPDATE),
  },

  // Theme User Module
  THEME_USER_MODULE: {
    ACTIVE: hasPermission(activeModules?.THEME_USER_MODULE),
    CREATE: hasPermission(activeModules?.THEME_USER_CREATE),
    UPDATE: hasPermission(activeModules?.THEME_USER_UPDATE),
    DELETE: hasPermission(activeModules?.THEME_USER_DELETE),
  },

  // Bank Permission
  BANK_MODULE: {
    ACTIVE: hasPermission(activeModules?.BANK_MODULE),
    DEPOSIT: hasPermission(activeModules?.BANK_DEPOSIT),
    WITHDRAW: hasPermission(activeModules?.BANK_WITHDRAW),
  },

  // Report Permissions
  REPORT_MODULE: {
    ACTIVE: hasPermission(activeModules?.REPORT_MODULE),
    ACCOUNT_STATEMENT: hasPermission(activeModules?.REPORT_ACCOUNT_STATEMENT),
  },
};
