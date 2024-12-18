import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {Button, Form, Input, Modal, Popover} from 'antd';
import {apiTestConnect} from "../../../../api/easydbtool/datasource/api.ts";
import {getArrCookie, setArrCookie} from "../../../../utils/cookie-util.ts";

export type DatasourceType = {
    id?: string
    driverName: string
    name: string
    address: string
    username: string
    password: string
}

interface DatasourceDialogProps {
    loadDatasource: () => void,
}

export interface DatasourceDialogRef {
    showModal: () => void
    editModal: (editDatasourceParam: DatasourceType) => void
}


const DatasourceDialog: React.ForwardRefRenderFunction<DatasourceDialogRef, DatasourceDialogProps> = (
    {loadDatasource},
    ref
) => {
    const datasourceDefaultValue: DatasourceType = useMemo(() => ({
        driverName: 'mysql',
        name: '本机mysql',
        address: '127.0.0.1:3306',
        username: 'root',
        password: '123456'
    }), [])
    // form element
    const [datasourceForm] = Form.useForm<DatasourceType>()
    const [datasourceFormInitValue, setDatasourceFormInitValue] = useState(datasourceDefaultValue)
    // dialog state
    const [isModalOpen, setIsModalOpen] = useState(false);
    // test connect result on the floating window  <popover>
    const [testConnectPopoverVisible, setTestConnectPopoverVisible] = useState(false)
    const [testConnectPopoverContent, setTestConnectPopoverContent] = useState('')
    const [testConnectPopoverLoading, setTestConnectPopoverLoading] = useState(false)


    useEffect(() => {
    }, [datasourceFormInitValue]);

    // handle edit datasource button
    const editModal = useCallback((editDatasourceParam: DatasourceType) => {
        datasourceForm.setFieldsValue(editDatasourceParam)
        setDatasourceFormInitValue(editDatasourceParam)
        setIsModalOpen(true);
    }, [datasourceForm]);

    // handle add datasource button handle
    const showModal = useCallback(() => {
        datasourceForm.setFieldsValue(datasourceDefaultValue)
        setDatasourceFormInitValue(datasourceDefaultValue)
        setIsModalOpen(true);
    }, [datasourceForm]);

    //expose ref
    useImperativeHandle(ref, () => ({
        showModal,
        editModal
    }), [showModal, editModal])

    const handleOk = async () => {
        const id = datasourceFormInitValue?.id
        console.log('ok', datasourceFormInitValue)
        const values = await datasourceForm.validateFields();
        const arrCookie = getArrCookie<DatasourceType>('datasource');
        console.log(111, id)
        // edit datasource
        for (let i = 0; i < arrCookie.length; i++) {
            if (id === arrCookie[i].id) {
                arrCookie[i] = {
                    id: id,
                    ...values
                }
                setArrCookie<DatasourceType>('datasource', arrCookie, 400)
                setIsModalOpen(false);
                loadDatasource()
                return
            }
        }
        // add datasource
        arrCookie.push({
            id: Date.now().toString(),
            ...values
        })
        setArrCookie<DatasourceType>('datasource', arrCookie, 400)
        setIsModalOpen(false);
        // load datasource render MySQL table
        loadDatasource()
    };

    // test connect
    const handleTestConnect = async () => {
        try {
            setTestConnectPopoverLoading(true)
            const values = await datasourceForm.validateFields();
            const resp = await apiTestConnect(values);
            setTestConnectPopoverContent(resp.code == 200 ? 'ok' : resp.message)
            // delay 0ms to confirm testConnect update
            setTimeout(() => {
                setTestConnectPopoverVisible(true);
            }, 0);
        } finally {
            setTestConnectPopoverLoading(false)
        }
    }

    const handleCancel = () => {

        setIsModalOpen(false);
    };

    return (
        <>
            <Button onClick={showModal}>
                添加数据源
            </Button>
            <Modal title="数据源" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={"确定"}
                   cancelText={"取消"}>
                <Form
                    labelCol={{span: 6}}
                    wrapperCol={{span: 16}}
                    form={datasourceForm}
                    initialValues={datasourceFormInitValue}
                >
                    <Form.Item<DatasourceType> label="驱动名称" name={"driverName"}
                                               rules={[{required: true, message: '请选择驱动名称'}]}>
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item<DatasourceType> label="数据源名称" name={"name"}
                                               rules={[{required: true, message: '请输入数据源名称'}]}>
                        <Input placeholder={"自定义名称"}/>
                    </Form.Item>
                    <Form.Item<DatasourceType> label="地址" name={"address"}
                                               rules={[{required: true, message: '请输入地址'}]}>
                        <Input placeholder={"127.0.0.1:3306"}/>
                    </Form.Item>
                    <Form.Item<DatasourceType> label="用户名" name={"username"}
                                               rules={[{required: true, message: '请输入用户名'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item<DatasourceType> label="密码" name={"password"}
                                               rules={[{required: true, message: '请输入密码'}]}>
                        <Input.Password placeholder="input password"/>
                    </Form.Item>
                    <Popover content={testConnectPopoverContent} title="" open={testConnectPopoverVisible}
                             onOpenChange={(newVisible) => {
                                 if (!newVisible) {
                                     // 当 Popover 关闭时重置可见状态
                                     setTestConnectPopoverVisible(false);
                                 }
                             }}
                             trigger="focus">
                        <Button loading={testConnectPopoverLoading} onClick={handleTestConnect}>测试连接</Button>
                    </Popover>
                </Form>
            </Modal>
        </>
    );
};
// Export with correct typing for ref and props
export default forwardRef(DatasourceDialog);