import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Button, Form, Input, Modal, Select} from 'antd';

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
    setIsEdit: (editMode: boolean) => void
}

const MySQLDatabaseDialog: React.ForwardRefRenderFunction<MySQLDatabaseDialogRef, MySQLDatabaseDialogProps> = (props, ref) => {
    // Determine whether the current mode is in editing
    const [isEdit, setIsEdit] = useState(false);
    // Determine whether open the dialog
    const [isModalOpen, setIsModalOpen] = useState(false)
    // form element
    const [form] = Form.useForm<MySQLDatabaseFormData>();

    // expose show modal to the parent component
    useImperativeHandle(ref, () => ({
        showModal,
        setIsEdit

    }), [isEdit])

    useEffect(() => {
    }, []);

    //open the dialog
    const showModal = () => {
        setIsModalOpen(true)
    }
    // submit the dialog
    const handleModalOK = () => {
        // props.loadDatabase()
        console.log('ok',isEdit)
        // setIsModalOpen(false)
    }
    // cancel the dialog
    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>新建数据库</Button>
            <Modal title={"数据库"} open={isModalOpen} onOk={handleModalOK} onCancel={handleModalCancel}>
                <Form
                    labelCol={{span: 6}}
                    wrapperCol={{span: 16}}
                    form={form}
                    name="control-hooks"
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

