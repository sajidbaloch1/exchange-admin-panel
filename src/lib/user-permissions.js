import CryptoJS from "crypto-js";

/**
 * Logs out the user by clearing the localStorage and reloading the page.
 */
export const logoutUser = () => {
  localStorage.clear();
  window.location.reload();
};

/**
 * Decrypts an AES encrypted string using the permissions AES secret.
 * @param {string} encryptedString - The string to decrypt.
 * @returns {object} - The decrypted object.
 */
const decryptAESEncryption = (encryptedString) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, process.env.REACT_APP_PERMISSIONS_AES_SECRET);
    const string = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(string);
  } catch (e) {
    //logoutUser();
  }
};

/**
 * Gets the active app modules from the localStorage and decrypts them.
 * @returns {object} - The decrypted active app modules.
 */
const appModules = () => {
  const modules = JSON.parse(localStorage.getItem(process.env.REACT_APP_PERMISSIONS_AMLS_KEY));
  if (!modules) {
    //logoutUser();
  }
  return decryptAESEncryption(modules);
};

/**
 * Gets the active session keys from the localStorage and decrypts them.
 * @returns {object} - The decrypted active session keys.
 */
const activeSessionKeys = () => {
  const activeKeys = JSON.parse(localStorage.getItem(process.env.REACT_APP_PERMISSIONS_UPLS_KEY));
  if (!activeKeys) {
    //logoutUser();
  }
  return decryptAESEncryption(activeKeys);
};

/**
 * The decrypted active app modules.
 * @type {object}
 */
export const activeModules = appModules();

/**
 * The decrypted active session keys.
 * @type {object}
 */
export const permissionKeys = activeSessionKeys();

/**
 * Checks if a given permission key is included in the active session keys.
 * @param {string} key - The permission key to check.
 * @returns {boolean} - Whether the permission key is included in the active session keys.
 */
const hasPermission = (key = null) => {
  if (!key) {
    return false;
  }
  return permissionKeys.includes(key);
};

/**
 * The permission object containing all the permissions for the app.
 * @type {object}
 */
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

const appStaticModules = () => {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const staticModules = {};
  //console.log(user)

  if (user && user.role === 'system_owner') {

    staticModules.MULTI_LOGIN_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.CURRENCIES_MODULE = {
      ACTIVE: true,
      CREATE: false,
      UPDATE: true,
      DELETE: true,
    };

    staticModules.SPORT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.COMPETITION_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.EVENT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.ADD_EVENT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };

    staticModules.ACCOUNT_STATEMENT_REPORT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };

    staticModules.TRANSCATION_PANEL_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
  } else if (user && user.role === 'super_admin') {
    staticModules.MULTI_LOGIN_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.CURRENCIES_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.SPORT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.COMPETITION_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.ADD_EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.ACCOUNT_STATEMENT_REPORT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };

    staticModules.TRANSCATION_PANEL_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
  } else if (user && user.role === 'admin') {
    staticModules.MULTI_LOGIN_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.CURRENCIES_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.SPORT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.COMPETITION_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.ADD_EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.ACCOUNT_STATEMENT_REPORT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };


    staticModules.THEME_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
    staticModules.TRANSCATION_PANEL_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
  } else if (user && user.role === 'super_master') {
    staticModules.MULTI_LOGIN_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.CURRENCIES_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.SPORT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.COMPETITION_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.ADD_EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.ACCOUNT_STATEMENT_REPORT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };


    staticModules.THEME_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
    staticModules.TRANSCATION_PANEL_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
  } else if (user && user.role === 'master') {
    staticModules.MULTI_LOGIN_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.CURRENCIES_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.SPORT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.COMPETITION_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.ADD_EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.ACCOUNT_STATEMENT_REPORT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };


    staticModules.THEME_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
    staticModules.TRANSCATION_PANEL_USER_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };
  } else if (user && user.role === 'agent') {
    staticModules.MULTI_LOGIN_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
      STATUS: true,
    };

    staticModules.CURRENCIES_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.SPORT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.COMPETITION_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.ADD_EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.ACCOUNT_STATEMENT_REPORT_MODULE = {
      ACTIVE: true,
      CREATE: true,
      UPDATE: true,
      DELETE: true,
    };


    staticModules.THEME_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
    staticModules.TRANSCATION_PANEL_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
  } else {
    staticModules.MULTI_LOGIN_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.CURRENCIES_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.SPORT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.COMPETITION_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    };

    staticModules.ADD_EVENT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.ACCOUNT_STATEMENT_REPORT_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };

    staticModules.THEME_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
    staticModules.TRANSCATION_PANEL_USER_MODULE = {
      ACTIVE: false,
      CREATE: false,
      UPDATE: false,
      DELETE: false,
    };
  }

  return staticModules;
};

export const appStaticModulesByUser = appStaticModules();
