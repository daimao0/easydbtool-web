import easyDbToolApi, {Resp} from "../../api.ts";


type ApiListDatabaseData = {
    name: string
}


export const apiListDatabase = async (): Promise<Resp<ApiListDatabaseData[]>> => {
    const resp = await easyDbToolApi.get("/api/v1/database/list");
    return resp.data;
}
