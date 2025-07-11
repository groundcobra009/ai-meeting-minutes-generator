const STORAGE_KEY_PREFIX = 'ai_minutes_generator_';

export const savePartialResult = (key: string, data: any) => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify({
      data,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to save partial result:', error);
  }
};

export const getPartialResult = (key: string) => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
    const item = localStorage.getItem(storageKey);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    // Check if data is older than 24 hours
    const timestamp = new Date(parsed.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      localStorage.removeItem(storageKey);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Failed to get partial result:', error);
    return null;
  }
};

export const clearPartialResult = (key: string) => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to clear partial result:', error);
  }
};

export const clearAllPartialResults = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all partial results:', error);
  }
};