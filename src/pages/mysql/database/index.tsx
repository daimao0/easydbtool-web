import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {TableProps} from 'antd';
import {Button, Flex, message, Popconfirm, Table} from 'antd';
import {useParams} from "react-router-dom";
import {apiConnect} from "../../../api/easydbtool/datasource-api.ts";
import {getArrCookie} from "../../../utils/cookie-util.ts";
import {DatasourceType} from "../datasource/dialog/datasource.tsx";
import {setSession} from "../../../utils/session-utils.ts";
import {apiDropDatabase, apiListDatabase} from "../../../api/easydbtool/database-api.ts";
import MySQLDatabaseDialog, {MySQLDatabaseDialogRef} from "./dialog/database.tsx";

interface DatabaseTableDataType {
    key: string;
    name: string;
}

const MySQLDatabase: React.FC = () => {

    const columns: TableProps<DatabaseTableDataType>['columns'] = [
        {
            title: '数据库',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a href={`/home/mysql/${datasourceId}/database/${text}/table`}>{text}</a>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (

                <Flex gap="small" wrap>
                    <Button size={"small"} onClick={() => {
                        handleEditDatabase(record)
                    }}>编辑</Button>
                    <Popconfirm title={"你确定要删除吗？"}
                                onConfirm={() => handleDropDatabase(record.name)}
                                okText={"确定"}
                                cancelText={"取消"}
                    >
                        <Button size={"small"} type="primary" danger>删除</Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    //message render
    const [messageApi, contextHolder] = message.useMessage()
    // loading render
    const [loading, setLoading] = useState(false)
    // current datasource id
    const datasourceId = useParams().datasourceId
    // table rows to render the table component
    const [tableData, setTableData] = useState<DatabaseTableDataType[]>()
    //ref
    const databaseDialogRef = useRef<MySQLDatabaseDialogRef>(null)

    // connect datasource
    const connect = useCallback(async () => {
        const arrCookie = getArrCookie<DatasourceType>('datasource');
        for (const item of arrCookie) {
            if (item.id === datasourceId) {
                await apiConnect(item).then(resp => {
                    if (resp.code !== 200) {
                        messageApi.error(resp.message)
                    }
                })
            }
        }
    }, [datasourceId])
    const loadDatabase = async () => {
        const databaseResp = await apiListDatabase()
        if (databaseResp) {
            const tableDataParam = databaseResp.data.map((item) => ({
                key: item.name,
                name: item.name
            }))
            setTableData(tableDataParam)
        }
    }

    const initializeDataSource = useCallback(async () => {
        try {
            setLoading(true)
            // set datasourceId in session
            setSession('datasourceId', datasourceId)
            //connect datasource
            await connect()
            // list database to render table
            await loadDatabase()
        } catch (err) {
            console.log("Failed to initialize rows source", err)
        } finally {
            setLoading(false)
        }
    }, [connect, datasourceId])

    // the click function when drop database
    const handleDropDatabase = async (databaseName: string) => {
        const resp = await apiDropDatabase(databaseName)
        if (resp.code != 200) {
            messageApi.error(resp.message)
        }
        await loadDatabase()
    }

    const handleEditDatabase = (record: DatabaseTableDataType) => {
        databaseDialogRef.current?.showModal()
        databaseDialogRef.current?.editModal({name: record.name,charset:"utf8mb4"})
        console.log(record)
    }

    useEffect(() => {
        initializeDataSource().then(() => {
        })
    }, [initializeDataSource]);

    return (
        <>
            {contextHolder}
            <Table<DatabaseTableDataType> loading={loading} columns={columns} dataSource={tableData}/>
            <MySQLDatabaseDialog ref={databaseDialogRef} loadDatabase={loadDatabase}/>
        </>
    )
}

export default MySQLDatabase;