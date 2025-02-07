import React, {forwardRef, useContext, useImperativeHandle, useState} from 'react';
import {Col, Form, Input, message, Modal, Row, Tabs, TabsProps} from 'antd';
import MySQLColumn, {MySQLColumnRef} from "./column/column.tsx";
import {apiCreateTable, TableVO} from "../../../../api/easydbtool/table-api.ts";
import {useParams} from "react-router-dom";
import MySQLIndex from "./index";
import {TableContext} from "../context/table-context.ts";
import {HTTP_OK} from "../../../../api/code.ts";

export interface MySQLTableDialogRef {
    showModal: () => void
    editModal: (tableVO: TableVO) => void
}


const MySQLTableDialog: React.ForwardRefRenderFunction<MySQLTableDialogRef> = (_, ref) => {
    const [messageApi, contextHolder] = message.useMessage()
    // the databaseName is the name of the database
    const databaseName = useParams().databaseName as string
    // dialog status
    const [isModalOpen, setIsModalOpen] = useState(false);
    // the dialog is edit or not
    const [isEdit, setIsEdit] = useState(false)
    // mysqlColumnRef is the ref of the mysqlColumn
    const mysqlColumnRef = React.useRef<MySQLColumnRef>(null)
    // tableForm is the form of the table
    const tableForm = Form.useForm()[0]

    const {columns, setTableName, indexesRequest, loadTables} = useContext(TableContext);
    //  useImperativeHandle expose ref
    useImperativeHandle(ref, () => ({
        showModal,
        editModal
    }));


    // editModal ,
    const editModal = (tableVO: TableVO) => {
        setIsEdit(true)
        setIsModalOpen(true);
        // mysqlColumnRef.current?.initColumnsInEdit()
        const dataSource = tableVO.columns.map((column, index) => ({
            ...column,
            key: index + 1,
        }));
        if (mysqlColumnRef.current) {
            mysqlColumnRef.current?.setDataSource(dataSource);
            // 使用form实例直接设置表单字段值
            mysqlColumnRef.current?.getColumnForm().setFieldsValue(
                dataSource.reduce((acc, record) => {
                    acc[String(record.key)] = {
                        name: record.name,
                        type: record.type,
                        size: record.size,
                        points: record.points,
                        notnull: record.notNull,
                        default: record.default,
                        comment: record.comment,
                        pk: record.pk,
                    };
                    return acc;
                }, {})
            );
        } else {
            console.error("MySQLColumn component ref is not ready.");
        }
    };

    // showModal open the dialog,
    const showModal = () => {
        setIsEdit(false)
        setIsModalOpen(true);
    };

    // handleOk dialog confirm
    const handleOk = () => {
        const columnForm = mysqlColumnRef.current?.getColumnForm()
        tableForm.validateFields().then(() => {
            columnForm?.validateFields().then(() => {
                setIsModalOpen(false)
                const tableCreateRequest = {
                    name: tableForm.getFieldValue('name'),
                    desc: tableForm.getFieldValue('desc'),
                    columns: columns,
                    indexes: indexesRequest
                }
                apiCreateTable(databaseName, tableCreateRequest).then(r => {
                    if (r.code == HTTP_OK) {
                        messageApi.success("创建成功").then()
                    } else {
                        messageApi.error(r.message).then()
                    }
                }).catch(e => messageApi.error(e))
                    .finally(() => {
                        loadTables()
                    })
            })
        })

    };

    // handleCancel dialog cancel
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const tabItems: TabsProps['items'] = [{
        key: '1',
        label: '字段信息',
        children: (
            <MySQLColumn ref={mysqlColumnRef}/>
        ),
    }, {
        key: '2',
        label: '索引信息',
        children: (
            <MySQLIndex/>
        ),

    }]

    const onFormValuesChange = () => {
        const map = tableForm?.getFieldsValue()
        setTableName(map.name)
    }

    return (
        <>
            {contextHolder}
            <Modal width={1200} title={isEdit ? "编辑表" : "新增表"} maskClosable={false} open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}>
                <Form form={tableForm} onValuesChange={onFormValuesChange}>
                    <Row>
                        <Col span={8}>
                            <Form.Item name={`name`} label={`表名`}
                                       rules={[{required: true, message: '表名不能为空',},]}>
                                <Input placeholder="请输入表名"/>
                            </Form.Item>
                        </Col>
                        <Col span={2}/>
                        <Col span={8}>
                            <Form.Item name={`desc`} label={`表描述`}
                                       rules={[{required: true, message: '表描述不能为空',},]}>
                                <Input placeholder="请输入表的描述"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Tabs defaultActiveKey="1" type={"card"} items={tabItems} onChange={() => {
                }}/>
            </Modal>
        </>
    );
};

export default forwardRef(MySQLTableDialog);