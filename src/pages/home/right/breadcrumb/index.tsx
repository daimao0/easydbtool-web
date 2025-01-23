import React from 'react';
import {Breadcrumb} from 'antd';

const RightBreadcrumb: React.FC = () => {
    const a = 1;
    return (
        <Breadcrumb
            style={{margin: '8px 0px 0px 32px'}}
            items={[
                {
                    title: <a href="/">Home</a>,
                },
                {
                    title: <a href="">数据库</a>,
                },
                {
                    title: <a href="">表</a>,
                }
            ]}
        />
    );
};

export default RightBreadcrumb;