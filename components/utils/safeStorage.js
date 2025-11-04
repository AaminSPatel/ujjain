// Create: src/utils/safeStorage.js
const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
    } catch (error) {
      console.warn('localStorage access denied, using default value',error);
    }
    return defaultValue;
  },

  set: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      }
    } catch (error) {
      console.warn('localStorage access denied, value not saved',error);
    }
    return false;
  },

  remove: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.warn('localStorage access denied, item not removed', error);
    }
    return false;
  }
};

export default safeStorage;