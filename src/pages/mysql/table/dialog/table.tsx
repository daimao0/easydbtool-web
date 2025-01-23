import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {GetRef, InputRef, Modal, Button, Form, Input, Popconfirm, Table, TableProps} from 'antd';


export interface MySQLTableDialogRef {
    showModal: () => void
    editModal: () => void
}

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    name: string;
    type: string;
    size: string
    points: string;
    default: string;
    comment: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                title,
                                                                                editable,
                                                                                children,
                                                                                dataIndex,
                                                                                record,
                                                                                handleSave,
                                                                                ...restProps
                                                                            }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{margin: 0}}
                name={dataIndex}
                rules={[{required: true, message: `${title} is required.`}]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{paddingInlineEnd: 24}}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

interface DataType {
    key: React.Key;
    name: string;
    type: string;
    size: string
    points: string;
    default: string;
    comment: string;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

const MySQLTableDialog: React.ForwardRefRenderFunction<MySQLTableDialogRef, {}> = (props, ref) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: '0',
            name: 'id',
            type: 'bigint',
            size: '20',
            points: '',
            default: '',
            comment: '主键',
        },
        {
            key: '1',
            name: 'name',
            type: 'varchar',
            size: '255',
            points: '',
            default: '',
            comment: '主键',
        },
    ]);

    const [count, setCount] = useState(2);

    //  useImperativeHandle expose ref
    useImperativeHandle(ref, () => ({
        showModal,
        editModal
    }));

    // editModal ,
    const editModal = () => {
        setIsEdit(true)
        setIsModalOpen(true);
    };

    // showModal open the dialog,
    const showModal = () => {
        setIsEdit(false)
        setIsModalOpen(true);
    };

    // handleOk dialog confirm
    const handleOk = () => {
        setIsModalOpen(false);
    };

    // handleCancel dialog cancel
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // handleDelete delete table row
    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '字段名称',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: '字段类型',
            dataIndex: 'type',
            editable: true,
        },
        {
            title: '长度',
            dataIndex: 'size',
            editable: true,
        },
        {
            title: '小数点',
            dataIndex: 'points',
            editable: true,
        },
        {
            title: '默认值',
            dataIndex: 'default',
            editable: true,
        },
        {
            title: '注释',
            dataIndex: 'comment',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData: DataType = {
            key: 2,
            name: 'id',
            type: 'bigint',
            size: '20',
            points: '',
            default: '',
            comment: '主键',
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (

        <Modal width={1200} title={isEdit ? "编辑表" : "新增表"} maskClosable={false} open={isModalOpen} onOk={handleOk}
               onCancel={handleCancel}>
            <div>
                <Button onClick={handleAdd} type="primary" style={{marginBottom: 16}}>
                    添加字段
                </Button>
                <Table<DataType>
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                />
            </div>
        </Modal>

    );
};

export default forwardRef(MySQLTableDialog);