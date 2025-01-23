import easyDbToolApi, {Resp} from "../api-config.ts";


/**
 * the remote api to list table names
 *
 * @param databaseName the database name
 */
export const apiListTableNames = async (databaseName: string): Promise<Resp<string[]>> => {
    const resp = await easyDbToolApi.get(`/api/v1/database/${databaseName}/tables`);
    return resp.data;
}