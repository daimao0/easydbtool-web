import React from "react";
import {Content} from "antd/es/layout/layout";
import {theme} from "antd";
import {Outlet} from "react-router-dom";

const Right: React.FC = () => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            <Outlet/>
        </Content>
    )
}

export default Right
