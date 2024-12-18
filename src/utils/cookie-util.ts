import Cookies from "js-cookie";

export const setObjectCookie = (name: string, value: object, expires: number) => {
    Cookies.set(name, JSON.stringify(value), {expires})
}

export const getObjectCookie = (name: string) => {
    return JSON.parse(Cookies.get(name) as string)
}

// set array cookie
export const setArrCookie = <T>(name: string, arr: T[], expires: number) => {
    Cookies.set(name, JSON.stringify(arr), {expires})
}
// 定义一个泛型函数，允许传入具体的数组元素类型
export const getArrCookie = <T>(name: string): T[] => {
    try {
        // 获取 Cookie 中的字符串
        const arrStr = Cookies.get(name);

        // 如果 Cookie 不存在或为空字符串，返回空数组
        if (!arrStr) {
            return [];
        }

        // 尝试解析 JSON 字符串
        const parsedArr = JSON.parse(arrStr);

        // 确保解析结果是一个数组，如果不是则返回空数组
        if (!Array.isArray(parsedArr)) {
            console.warn(`Cookie "${name}" is not a valid array.`);
            return [];
        }

        // 返回解析后的数组
        return parsedArr as T[];
    } catch (error) {
        // 捕获并处理 JSON 解析错误
        console.error(`Error parsing cookie "${name}":`, error);
        return [];
    }
};