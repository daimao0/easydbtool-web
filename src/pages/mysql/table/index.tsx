import React, {useCallback, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Flex, message, Popconfirm, Space, Table, TableProps} from "antd";
import Search from "antd/es/input/Search";
import {SearchProps} from "antd/lib/input";
import {apiDropTable, apiGetTable, apiListTableNames} from "../../../api/easydbtool/table-api.ts";
import MySQLTableDialog, {MySQLTableDialogRef} from "./dialog/table.tsx";
import {ColumnCreateRequest} from "../../../api/easydbtool/column-api.ts";
import {TableContext} from "./context/table-context.ts";
import {IndexRequest} from "../../../api/easydbtool/index-api.ts";
import {HTTP_OK} from "../../../api/code.ts";


interface DataType {
    key: string;
    name: string;
}


const MySQLTable: React.FC = () => {
    // current datasource id
    const datasourceId = useParams().datasourceId
    const databaseName = useParams().databaseName
    const [messageApi, contextHolder] = message.useMessage();
    const columns: TableProps<DataType>['columns'] = [
        {
            title: '表名',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a href={`/home/mysql/${datasourceId}/database/${databaseName}/table/${text}`}>{text}</a>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => editTable(record)}>编辑</Button>
                    <Popconfirm
                        title="是否删除该表?"
                        description="物理删除，无法恢复"
                        onConfirm={() => {
                            dropTable(record.name)
                        }}
                        onCancel={() => {
                        }}
                        okText="是"
                        cancelText="否"
                    >
                        <Button danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const [tableData, setTableData] = React.useState<DataType[]>([])
    const tableDialogRef = React.useRef<MySQLTableDialogRef>(null)

    const [columnsContext, setColumnsContext] = useState<ColumnCreateRequest[]>([])
    const [tableNameContext, setTableNameContext] = useState<string>('')
    const [indexesContext, setIndexesContext] = useState<IndexRequest[]>([])

    // remote http api to load table
    const loadTableNames = useCallback(async () => {
        const resp = await apiListTableNames(databaseName as string)
        const tableDataParam = resp.data?.map((item) => ({key: item, name: item}))
        setTableData(tableDataParam)
    }, [databaseName])

    const editTable=(record:{key:string,name:string})=>{
        apiGetTable(databaseName as string, record.name).then((resp) => {
            tableDialogRef.current?.editModal(resp.data)
        })
    }

    // remote http api to drop table
    const dropTable = (tableName: string) => {
        apiDropTable(databaseName as string, tableName).then((resp) => {
            if (resp.code === HTTP_OK) {
                messageApi.success("删除成功").then()
            } else {
                messageApi.error(resp.message).then()
            }
        }).catch(err => messageApi.error(err))
            .finally(() => loadTableNames().then())
    }

    React.useEffect(() => {
        (async () => {
            await loadTableNames()
        })()
    }, [loadTableNames]);

    // search
    const onSearch: SearchProps['onSearch'] = (value) => {
        loadTableNames().then(() => {
            if (value) {
                setTableData(tableData.filter(item => item.name.includes(value)))
            }
        })
    }
    // useMemo to cache value obj
    const tableContextValue = useMemo(() => ({
        loadTables: loadTableNames,
        columns: columnsContext,
        setColumns: (newColumns: ColumnCreateRequest[]) => setColumnsContext(newColumns),
        tableName: tableNameContext,
        setTableName: (newTableName: string) => setTableNameContext(newTableName),
        indexesRequest: indexesContext,
        setIndexesRequest: (newIndexes: IndexRequest[]) => setIndexesContext(newIndexes)
    }), [columnsContext, indexesContext, loadTableNames, tableNameContext])
    return (
        <TableContext.Provider value={tableContextValue}>
            {contextHolder}
            <Flex gap={"small"} wrap>
                <Button type={"primary"} style={{marginRight: 20}} onClick={() => {
                    tableDialogRef.current?.showModal()
                }}>新建表</Button>
                <Search placeholder="请输入表名" onSearch={onSearch} style={{width: 600}}/>
            </Flex>

            <Table<DataType> columns={columns} dataSource={tableData}/>
            <MySQLTableDialog ref={tableDialogRef}/>
        </TableContext.Provider>
    );
};

export default MySQLTable