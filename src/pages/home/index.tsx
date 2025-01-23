import React from 'react';
import {Layout} from 'antd';
import LeftMenu from "./left/menu";
import RightHeader from "./right/header";
import Right from "./right";
import RightBreadcrumb from "./right/breadcrumb";


const Home: React.FC = () => {
    return (
        <Layout style={{height: '100vh'}}>
            <LeftMenu/>
            <Layout>
                <RightHeader/>
                <RightBreadcrumb/>
                <Right/>
            </Layout>
        </Layout>
    );
};

export default Home;