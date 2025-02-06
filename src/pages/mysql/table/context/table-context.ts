// table context is the react Context api interface
import {ColumnCreateRequest} from "../../../../api/easydbtool/column-api.ts";
import {createContext} from "react";
import {IndexRequest} from "../../../../api/easydbtool/index-api.ts";

export interface MySQLTableContextType {
    loadTables: ()=>void
    columns: ColumnCreateRequest[]
    setColumns: (columns: ColumnCreateRequest[]) => void
    tableName: string
    setTableName: (tableName: string) => void
    indexesRequest: IndexRequest[]
    setIndexesRequest: (indexes: IndexRequest[]) => void
}

// provide default value
const defaultTableContext: MySQLTableContextType = {
    loadTables: () => {
    },
    columns: [],
    setColumns: () => {
    },

    tableName: '',
    setTableName: () => {
    },

    indexesRequest: [],
    setIndexesRequest: () => {
    }
};

// table context is the react Context api for table, use to share variables
export const TableContext = createContext<MySQLTableContextType>(defaultTableContext)
