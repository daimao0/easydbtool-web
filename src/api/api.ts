import axios from "axios"
import {getSession} from "../utils/session-utils.ts";

export type Resp<T> = {
    code: number,
    data: T,
    message: string
}
const easyDbToolApi = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000
})

const pathToExcludeDatasourceId = [
    "/api/v1/datasource/test-connect",
    "/api/v1/datasource/connect"
]

// request interceptor
easyDbToolApi.interceptors.request.use(config => {
    const datasourceId = getSession<string>('datasourceId');
    // 检查请求的 URL 是否需要添加 datasourceId
    if (datasourceId && shouldAddDatasourceId(config.url)) {
        // 将 datasourceId 添加到请求头中
        config.headers['X-Datasource-Id'] = datasourceId;
    }
    // 返回修改后的配置
    return config;
}, (error) => {
    return Promise.reject(new Error(`Request failed: ${error}`));
})

//response interceptor
easyDbToolApi.interceptors.response.use(response => {
    // console.log("response interceptor handle:", response)
    return response
}, (error)=>{
    return Promise.reject(new Error(`Request failed: ${error}`));
})

// 判断请求 URL 是否需要添加 datasourceId
function shouldAddDatasourceId(url?: string): boolean {
    if (!url) return false;
    //  check the url in the exclude list
    for (const path of pathToExcludeDatasourceId) {
        if (url === path) {
            return false;
        }
    }
    return true;
}

export default easyDbToolApi