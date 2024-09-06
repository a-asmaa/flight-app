import React, { useEffect } from 'react';
import { Breadcrumb, Button, Layout, Space, theme } from 'antd';
import { clearToken, getToken, getUser } from './utils/storage';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthUser } from './types/user';
import { isTokenExpired } from './utils/auth';

const { Header, Content } = Layout;

const AppLayout = ({ children }: { children: any }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const user: AuthUser = getUser();
  const navigate = useNavigate();
  let location = useLocation();

  const logout = () => {
    clearToken();
    setTimeout(navigate, 0, "/login");
  }


  useEffect(() => {

    const token = getToken();
    if (token) {
      if (isTokenExpired(token)) {
        clearToken();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location.pathname, navigate]);
  
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#001529',
          padding: '0 24px',
          gap: '1rem',
          color: 'white',
        }}
      >
        <img className="demo-logo" src="/flight-logo.png" alt="logo" style={{ height: 40 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h4>{user.name}, Logged in</h4>
          <Button onClick={logout} type="primary">Logout</Button>
        </div>
      </Header>
      <Content style={{ padding: '24px 48px', minHeight: 'calc(100vh - 64px)' }}>
        <Space style={{ justifyContent: 'space-between', display: 'flex' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link to="/flights" className='list-link'>Flight List </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          { (!location.pathname.includes('/create') && !location.pathname.includes('/edit')) && <Link to="/flights/create" className='create-link'>Create New Flight</Link> }
        </Space>
        <div
          style={{
            marginTop: 24,
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
  );
};

export default AppLayout;
