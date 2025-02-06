import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from "react";
import {Button, Checkbox, Form, FormInstance, Input, Select, Table, TableProps} from "antd";
import {DeleteTwoTone} from "@ant-design/icons";
import {TableContext} from "../../context/table-context.ts";

interface DataType {
    key: number;
    name: string;
    type: string;
    size: number | null;
    points: string | null;
    notnull: boolean;
    default: string;
    comment: string;
    pk: boolean;
}

export interface MySQLColumnRef {
    getColumns: () => DataType[]
    getColumnForm: () => FormInstance
    setDataSource: (dataSource: DataType[]) => void
}


const MySQLColumn: React.ForwardRefRenderFunction<MySQLColumnRef> = (_props, ref) => {


    const columnHeaders: TableProps<DataType>['columns'] = [
        {
            title: '字段名称',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Form.Item name={[String(record.key), 'name']} rules={[{required: true, message: '字段名称不能为空',}]}>
                    <Input/>
                </Form.Item>
            ),
        },
        {
            title: '字段类型',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (
                <Form.Item name={[String(record.key), 'type']} rules={[{required: true, message: '字段类型不能为空'}]}>
                    <Select
                        style={{width: 120}}
                        showSearch
                        options={[
                            {value: 'int', label: 'int'},
                            {value: 'bigint', label: 'bigint'},
                            {value: 'decimal', label: 'decimal'},
                            {value: 'varchar', label: 'varchar'},
                            {value: 'text', label: 'text'},
                            {value: 'datetime', label: 'datetime'},
                            {value: 'timestamp', label: 'timestamp'},
                        ]}
                    />
                </Form.Item>
            )
        },
        {
            title: '长度',
            dataIndex: 'size',
            key: 'size',
            render: (_, record) =>
                <Form.Item name={[String(record.key), 'size']}>
                    <Input placeholder={"数字不指定宽度"}/>
                </Form.Item>
            ,
        },
        {
            title: '小数点',
            dataIndex: 'points',
            key: 'points',
            render: (_, record) =>
                <Form.Item name={[String(record.key), 'points']}>
                    <Input placeholder={"10,2"}/>
                </Form.Item>
            ,
        },
        {
            title: '默认值',
            dataIndex: 'default',
            key: 'default',
            render: (_, record) =>
                <Form.Item name={[String(record.key), 'default']}>
                    <Input/>
                </Form.Item>
            ,
        },
        {
            title: '不为空',
            dataIndex: 'notnull',
            key: 'notnull',
            render: (_, record) => (
                <Form.Item name={[String(record.key), 'notnull']} valuePropName={'checked'}>
                    <Checkbox checked={record.notnull}/>
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
            title: '主键',
            dataIndex: 'pk',
            key: 'pk',
            render: (_, record) => (
                <Form.Item name={[String(record.key), 'pk']} valuePropName={'checked'}>
                    <Checkbox checked={record.pk}/>
                </Form.Item>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) =>
                <Form.Item>
                    <DeleteTwoTone onClick={() => removeColumn(record.key)}/>
                </Form.Item>
            ,
        },
    ];

    const {setColumns} = useContext(TableContext);
    const form = Form.useForm()[0]
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: 1,
            name: 'id',
            type: 'bigint',
            size: null,
            points: null,
            notnull: true,
            default: '',
            comment: '主键',
            pk: true,
        }, {
            key: 2,
            name: 'created_at',
            type: 'datetime',
            size: null,
            points: null,
            notnull: true,
            default: '',
            comment: '创建时间',
            pk: false,
        }, {
            key: 3,
            name: 'updated_at',
            type: 'datetime',
            size: null,
            points: null,
            notnull: true,
            default: '',
            comment: '更新时间',
            pk: false,
        }, {
            key: 4,
            name: 'deleted_at',
            type: 'datetime',
            size: null,
            points: null,
            notnull: true,
            default: '',
            comment: '删除时间',
            pk: false,
        },
    ])
    const handleAddColumn = () => {
        const newData: DataType = {
            key: dataSource.length + 1,
            name: '',
            type: '',
            size: null,
            points: null,
            notnull: false,
            default: '',
            comment: '',
            pk: false,
        };
        setDataSource([...dataSource, newData])
    }
    useEffect(() => {
        if (form) {
            onFormValuesChange()
        }
    }, []); // 只在组件挂载时执行

    useImperativeHandle(ref, () => (
        {
            getColumns: () => dataSource,
            getColumnForm: () => form,
            setDataSource: (dataSource) => {
                const newArr = dataSource.map((item,index)=>({
                    ...item,
                    key: index+1
                }))
                setDataSource(newArr)
                form.resetFields()
                form.setFieldsValue(newArr)
            }
        }
    ))

    const onFormValuesChange = () => {
        const columnMap = form?.getFieldsValue()
        if (columnMap) {
            const arr = Object.keys(columnMap).map(key => {
                columnMap[key].size = Number(columnMap[key].size)
                return columnMap[key]
            })
            setColumns(arr)
        }
    };
    const removeColumn = (key: number) => {
        const newData = dataSource.filter(item => item.key !== key);
        setDataSource(newData);
    };

    return (
        <>
            <Button onClick={handleAddColumn} type="primary" style={{marginBottom: 16}}>
                添加字段
            </Button>

            <Form form={form} onValuesChange={onFormValuesChange} initialValues={dataSource.reduce((acc, record) => {
                acc[String(record.key)] = {
                    key: record.key,
                    name: record.name,
                    type: record.type,
                    size: record.size,
                    points: record.points,
                    notnull: record.notnull,
                    default: record.default,
                    comment: record.comment,
                    pk: record.pk,
                };
                return acc;
            }, {} as Record<string, DataType>)}>

                <Table<DataType> columns={columnHeaders} dataSource={dataSource}/>
            </Form>
        </>
    )
};

export default forwardRef(MySQLColumn);