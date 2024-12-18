import React, {useEffect, useRef, useState} from 'react';
import {Button, Flex, Popconfirm, Table} from 'antd';
import type {TableProps} from 'antd';
import DatasourceDialog, {DatasourceDialogRef, DatasourceType} from "./dialog/datasource.tsx";
import {getArrCookie, setArrCookie} from "../../../utils/cookie-util.ts";

interface DataType {
    key:string
    driverName: string
    name: string
    address: string
    username: string
    password: string
}

const MySQLDatasource: React.FC = () => {

    const datasourceDialogRef = useRef<DatasourceDialogRef>(null)

    const columns: TableProps<DataType>['columns'] = [
        {
            title: '数据源名称',
            dataIndex: 'name',
            key: 'name',
            render: (_, record ) => <a href={`/home/mysql/${record.key}/database`}>{record.name}</a>,
        }, {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            render: (text) => <p>{text}</p>,
        }, {
            title: '用户',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <p>{text}</p>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Flex gap="small" wrap>
                    <Button size={"small"} onClick={() => editDatasource(record)}>编辑</Button>
                    <Popconfirm title={"你确定要删除吗？"}
                                onConfirm={() => deleteDatasource(record)}
                                okText={"确定"}
                                cancelText={"取消"}
                    >
                        <Button size={"small"} type="primary" danger>删除</Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];
    //

    //datasource data
    const [datasource, setDatasource] = useState<DataType[]>([])

    // load datasource to table render
    const loadDatasourceList = () => {
        const arrCookie = getArrCookie<DatasourceType>('datasource');
        const dataList: DataType[] = arrCookie.map((item) => ({
            key: item.id!,
            driverName: item.driverName,
            name: item.name,
            address: item.address,
            username: item.username,
            password: item.password,
        }));
        setDatasource(dataList)
    }

    // delete datasource
    const deleteDatasource = (record: DataType) => {
        const arr = getArrCookie<DatasourceType>('datasource')
        const newArr = arr.filter(item => item.id !== record.key);
        setArrCookie('datasource', newArr, 400)
        loadDatasourceList()
    }
    // edit datasource
    const editDatasource = (record: DataType) => {
        const datasourceParam: DatasourceType = {
            id: record.key,
            driverName: record.driverName,
            name: record.name,
            address: record.address,
            username: record.username,
            password: record.password,
        }
        datasourceDialogRef.current?.editModal(datasourceParam)

    }

    useEffect(() => {
        loadDatasourceList()
        return () => {
        };
    }, []);


    return (
        <div>
            <Table<DataType> columns={columns} dataSource={datasource}/>
            {/*datasource dialog*/}
            <DatasourceDialog ref={datasourceDialogRef} loadDatasource={loadDatasourceList}/>
        </div>
    )
}

export default MySQLDatasource;