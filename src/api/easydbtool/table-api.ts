import easyDbToolApi, {Resp} from "../api-config.ts";
import {ColumnCreateRequest} from "./column-api.ts";


/**
 * the remote api to list table names
 *
 * @param databaseName the database name
 */
export const apiListTableNames = async (databaseName: string): Promise<Resp<string[]>> => {
    const resp = await easyDbToolApi.get(`/api/v1/database/${databaseName}/tables`);
    return resp.data;
}

export type TableVO = {
    name: string,
    desc: string,
    createSQL: string,
    database: { name: string }
    columns: ColumnCreateRequest[]
    indexes: { name: string, unique: boolean, Comment: string, columns: ColumnCreateRequest[] }[]
}

export const apiGetTable = async (databaseName: string, tableName: string): Promise<Resp<TableVO>> => {
    const resp = await easyDbToolApi.get(`/api/v1/database/${databaseName}/table/${tableName}`);
    return resp.data;
}

// create table api request params
type CreateTableDataRequest = {
    name: string,
    desc: string,
    columns: ColumnCreateRequest[]
}
export const apiCreateTable = async (databaseName: string, request: CreateTableDataRequest) => {
    const resp = await easyDbToolApi.post(`/api/v1/database/${databaseName}/table`, request);
    return resp.data;
}
/**
 * the remote api to drop table
 * @param databaseName the database name
 * @param tableName the table name
 */
export const apiDropTable = async (databaseName: string, tableName: string) => {
    const resp = await easyDbToolApi.delete(`/api/v1/database/${databaseName}/table/${tableName}`);
    return resp.data;
}

export const apiPageTableData = async (databaseName: string, tableName: string, page: number, size: number) => {
    const resp = await easyDbToolApi.get(`/api/v1/database/${databaseName}/table/${tableName}/page`, {
        params: {
            databaseName,
            tableName,
            page,
            size
        }
    });
    return resp.data;
}