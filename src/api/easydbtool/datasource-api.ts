import easyDbToolApi, {Resp} from "../api-config.ts";

// testConnect api params
type TestConnectRequest = {
    id?: string;
    driverName: string;
    name: string;
    address: string;
    username: string;
    password: string;
}
// testConnect api
export const apiTestConnect = async (params: TestConnectRequest): Promise<Resp<null>> => {
    const resp = await easyDbToolApi.post("/api/v1/datasource/test-connect", params);
    return resp.data;
}

export const apiConnect = async (params: TestConnectRequest): Promise<Resp<null>> => {
    const resp = await easyDbToolApi.post("/api/v1/datasource/connect", params);
    return resp.data;
}