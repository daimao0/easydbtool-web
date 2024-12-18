import React, {useState} from "react";
import {DatabaseOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import Sider from "antd/es/layout/Sider";
import reactLogo from "../../../../assets/react.svg";
import {Link} from "react-router-dom";

const LeftMenu: React.FC = () => {
    const [collapsed] = useState(false);
    return (
        <Sider theme={"light"} trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo">
                <a href="/">
                    <img src={reactLogo} alt="Logo"/>
                </a>
            </div>
            <Menu
                theme="light"
                mode="inline"
                // defaultSelectedKeys={['1']}
                onClick={()=>{}}
                items={[
                    {
                        key: '1',
                        icon: <DatabaseOutlined/>,
                        label: (<Link to={'/home/mysql/datasource'}>MySQL</Link>),
                    },
                    {
                        key: '2',
                        icon: <DatabaseOutlined/>,
                        label: 'PgSQL',
                    },
                    {
                        key: '3',
                        icon: <DatabaseOutlined/>,
                        label: 'nav 3',
                    },
                ]}
            />
        </Sider>
    )
}
export default LeftMenu
