import React from 'react';
import { Breadcrumb, Button, Layout, theme } from 'antd';
import { clearToken, getUser } from './utils/storage';
import { useNavigate } from "react-router-dom";
import { AuthUser } from './types/user';

const { Header, Content } = Layout;

const AppLayout = ({children} : {children: any}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const user: AuthUser = getUser();

  const navigate = useNavigate();

  const logout = () => {

    clearToken();
    setTimeout(navigate, 0, "/login");
  }

    return <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          gap: '1rem',
        }}
      >
        <img className="demo-logo" src="/assets/Logo.svg" alt="logo" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
          <h4 > {user.name}, Logged in </h4>
          <Button onClick={logout}> Logout</Button>
        </div>
      </Header>
      <Content style={{ padding: '0 48px', height: '100vh' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Flight List</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
};

export default AppLayout;