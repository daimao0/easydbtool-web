import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';
import {Button, Form, Input, message, Modal, Select} from 'antd';
import {apiCreateDatabase} from "../../../../api/easydbtool/database-api.ts";

const {Option} = Select;

type MySQLDatabaseFormData = {
    name: string
    charset: string
}

interface MySQLDatabaseDialogProps {
    loadDatabase: () => void
}

export interface MySQLDatabaseDialogRef {
    showModal: () => void,
    editModal: (record: MySQLDatabaseFormData) => void
}

const MySQLDatabaseDialog: React.ForwardRefRenderFunction<MySQLDatabaseDialogRef, MySQLDatabaseDialogProps> = (props, ref) => {
    // antd message
    const [messageApi, contextHolder] = message.useMessage();

    // Determine whether open the dialog
    const [isModalOpen, setIsModalOpen] = useState(false)
    // form element
    const [form] = Form.useForm<MySQLDatabaseFormData>();
    const formInitVal = {
        name: '',
        charset: 'utf8mb4'
    }

    //open the dialog
    const showModal = () => {
        setIsModalOpen(true)
    }
    const editModal = useCallback((record: MySQLDatabaseFormData) => {
        form.setFieldsValue({
            name: record.name,
            charset: record.charset
        })
    }, [form])

    // expose show modal to the parent component
    useImperativeHandle(ref, () => ({
        showModal,
        editModal

    }), [editModal])

    useEffect(() => {
    }, []);

    // submit the dialog
    const handleModalOK = async () => {
        // props.loadDatabase()
        const formVal = await form.validateFields()
        //remote api create database
        const resp = await apiCreateDatabase(formVal)
        if (resp.code != 200) {
            messageApi.error(resp.message)
        }
        //load database
        props.loadDatabase()
        setIsModalOpen(false)
    }
    // cancel the dialog
    const handleModalCancel = () => {
        setIsModalOpen(false)
        form.resetFields()
    }

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={showModal}>新建数据库</Button>
            <Modal title={"数据库"} open={isModalOpen} onOk={handleModalOK} onCancel={handleModalCancel}>
                <Form
                    labelCol={{span: 6}}
                    wrapperCol={{span: 16}}
                    form={form}
                    name="control-hooks"
                    initialValues={formInitVal}
                >
                    <Form.Item name="name" label="数据库名称" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="charset" label="字符集" rules={[{required: true}]}>
                        <Select
                            placeholder="just utf8mb4"
                            allowClear
                        >
                            <Option value="utf8mb4">utf8mb4</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>


    );
};

export default forwardRef(MySQLDatabaseDialog)

