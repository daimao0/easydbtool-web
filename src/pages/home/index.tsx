import React from 'react';
import {Layout} from 'antd';
import LeftMenu from "./left/menu";
import RightHeader from "./header";
import Right from "./right";


const Home: React.FC = () => {
    return (
        <Layout style={{height: '100vh'}}>
            <LeftMenu/>
            <Layout>
                <RightHeader/>
                <Right/>
            </Layout>
        </Layout>
    );
};

export default Home;