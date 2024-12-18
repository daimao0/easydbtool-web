// src/utils/session.ts
export const setSession = <T>(key: string, value: T) => {
    try {
        // 将值转换为 JSON 字符串并存储
        const sessionValue = JSON.stringify(value);
        window.localStorage.setItem(key, sessionValue); // 使用 localStorage
        // window.sessionStorage.setItem(key, sessionValue); // 使用 sessionStorage
    } catch (error) {
        console.error('Error setting session:', error);
    }
};

export const getSession = <T>(key: string): T | null => {
    try {
        // 从 localStorage 中获取值并解析为 JSON
        const sessionValue = window.localStorage.getItem(key); // 使用 localStorage
        // const sessionValue = window.sessionStorage.getItem(key); // 使用 sessionStorage
        return sessionValue ? JSON.parse(sessionValue) : null;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
};

export const removeSession = (key: string) => {
    try {
        // 从 localStorage 中移除指定的 key
        window.localStorage.removeItem(key); // 使用 localStorage
        // window.sessionStorage.removeItem(key); // 使用 sessionStorage
    } catch (error) {
        console.error('Error removing session:', error);
    }
};