import easyDbToolApi, {Resp} from "../api-config.ts";


type ApiListDatabaseData = {
    name: string
}


export const apiListDatabase = async (): Promise<Resp<ApiListDatabaseData[]>> => {
    const resp = await easyDbToolApi.get("/api/v1/database/list");
    return resp.data;
}

export const apiCreateDatabase = async (param: { name: string, charset: string }) => {
    const resp = await easyDbToolApi.post("/api/v1/database/create", param);
    return resp.data;
}

export const apiDropDatabase = async (databaseName: string) => {
    const resp = await easyDbToolApi.delete(`/api/v1/database/drop/${databaseName}`);
    return resp.data;
}