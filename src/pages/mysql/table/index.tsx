import React, {useCallback} from "react";
import {useParams} from "react-router-dom";
import {Button, Flex, Space, Table, TableProps} from "antd";
import Search from "antd/es/input/Search";
import {SearchProps} from "antd/lib/input";
import {apiListTableNames} from "../../../api/easydbtool/table-api.ts";
import MySQLTableDialog, {MySQLTableDialogRef} from "./dialog/table.tsx";


interface DataType {
    key: string;
    name: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: '表名',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>编辑</a>
                <a>删除</a>
            </Space>
        ),
    },
];

const MySQLTable: React.FC = () => {
    const databaseName = useParams().databaseName

    const [tableData, setTableData] = React.useState<DataType[]>([])
    const tableDialogRef = React.useRef<MySQLTableDialogRef>(null)

    // remote http api to load table
    const loadTableNames = useCallback(async () => {
        const resp = await apiListTableNames(databaseName as string)
        const tableDataParam = resp.data?.map((item) => ({key: item, name: item}))
        setTableData(tableDataParam)
    }, [databaseName])

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


    return (
        <>
            <Flex gap={"small"} wrap>
                <Button type={"primary"} style={{marginRight: 20}} onClick={()=>{tableDialogRef.current?.showModal()}}>新建表</Button>
                <Search placeholder="请输入表名" onSearch={onSearch} style={{width: 600}}/>
            </Flex>

            <Table<DataType> columns={columns} dataSource={tableData}/>
            <MySQLTableDialog ref={tableDialogRef}/>
        </>
    );
};

export default MySQLTable