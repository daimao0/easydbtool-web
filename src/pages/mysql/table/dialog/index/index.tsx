import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from "react";
import {Button, Checkbox, Form, Input, Select, Table, TableProps} from "antd";
import {DeleteTwoTone} from '@ant-design/icons';
import {MySQLTableContextType, TableContext} from "../../context/table-context.ts";
import {ColumnCreateRequest} from "../../../../../api/easydbtool/column-api.ts";

interface DataType {
    key: number;
    name: string;
    columnName: string[];
    method: string;
    unique: boolean;
    comment: string;
}

export type MySQLIndexRef = object


const MySQLIndex: React.ForwardRefRenderFunction<MySQLIndexRef> = (_props, ref) => {

    const indexes: TableProps<DataType>['columns'] = [
        {
            title: '索引名',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Form.Item name={[String(record.key), 'name']} rules={[{required: true, message: '索引名不能为空',}]}>
                    <Input/>
                </Form.Item>
            ),
        },
        {
            title: '字段',
            dataIndex: 'columnName',
            key: 'columnName',
            render: (_, record) => (
                <Form.Item name={[String(record.key), 'columnName']}
                           rules={[{required: true, message: '字段不能为空',}]}>
                    <Select
                        style={{width: '100%'}}
                        showSearch
                        mode="multiple"
                        allowClear
                        placeholder={'请选择字段'}
                        options={columnNameOptions}
                    />
                </Form.Item>
            )
        },
        {
            title: '索引方法',
            dataIndex: 'method',
            key: 'method',
            render: (_, record) =>
                <Form.Item name={[String(record.key), 'method']} style={{width: '100px'}}>
                    <Input disabled={true}/>
                </Form.Item>
            ,
        },
        {
            title: '唯一性',
            dataIndex: 'unique',
            key: 'unique',
            render: (_, record) => (
                <Form.Item name={[String(record.key), 'unique']} valuePropName={'checked'}>
                    <Checkbox checked={record.unique}/>
                </Form.Item>
            )
        },
        {
            title: '注释',
            dataIndex: 'comment',
            key: 'comment',
            render: (_, record) =>
                <Form.Item name={[String(record.key), 'comment']}
                           rules={[{required: true, message: '字段注释不能为空',}]}>
                    <Input/>
                </Form.Item>
            ,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) =>
                <Form.Item>
                    <DeleteTwoTone onClick={()=>removeIndex(record.key)}/>
                </Form.Item>
            ,
        },
    ];

    const {columns, tableName, setIndexesRequest} = useContext<MySQLTableContextType>(TableContext)
    const [columnNameOptions, setColumnNameOptions] = useState<{ value: string, label: React.ReactNode }[]>([])
    const form = Form.useForm()[0]
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: 1,
            name: `idx_${tableName}_created_at`,
            columnName: ['created_at'],
            method: 'BTREE',
            unique: false,
            comment: '创建时间索引',
        }, {
            key: 2,
            name: `idx_${tableName}_updated_at`,
            columnName: ['updated_at'],
            method: 'BTREE',
            unique: false,
            comment: '更新时间索引',
        }, {
            key: 3,
            name: `idx_${tableName}_deleted_at`,
            columnName: ['deleted_at'],
            method: 'BTREE',
            unique: false,
            comment: '删除时间索引',
        }
    ])

    useEffect(() => {
        const fetchColumnOptions = () => {
            const columnNames = columns.map((column: ColumnCreateRequest) => ({value: column.name, label: column.name}))
            setColumnNameOptions(columnNames)
        }
        fetchColumnOptions()

        const fetchIndexes = () => {
            const indexes = dataSource.map((index) => {
                return {
                    name: index.name,
                    columnName: index.columnName,
                    unique: index.unique,
                    comment: index.comment,
                }
            })
            setIndexesRequest(indexes)
        }
        fetchIndexes()

    }, [columns, dataSource, tableName]);


    useImperativeHandle(ref, () => (
        {
            getColumns: () => dataSource,
            getColumnForm: () => form
        }
    ))
    const handleAddColumn = () => {
        const newData: DataType = {
            key: dataSource.length + 1,
            name: '',
            columnName: [],
            method: '',
            unique: false,
            comment: '',
        };
        setDataSource([...dataSource, newData])
    }
    const handleFormValueChange = (allValues: DataType[]) => {
        form?.validateFields()
        setIndexesRequest(allValues)
    }

    const removeIndex = (key: number) => {
        const newData = dataSource.filter(item => item.key !== key);
        setDataSource(newData);
    };

    return (
        <>
            <Button onClick={handleAddColumn} type="primary" style={{marginBottom: 16}}>
                添加索引
            </Button>

            <Form form={form}
                  initialValues={dataSource.reduce((acc, record) => {
                      acc[String(record.key)] = {
                          key: record.key,
                          name: record.name,
                          columnName: record.columnName,
                          method: record.method,
                          unique: record.unique,
                          comment: record.comment,
                      };
                      return acc;
                  }, {} as Record<string, DataType>)}
                  onValuesChange={(_, allValues) => handleFormValueChange(allValues)}
            >

                <Table<DataType> columns={indexes} dataSource={dataSource}/>
            </Form>
        </>
    )
};

export default forwardRef(MySQLIndex);