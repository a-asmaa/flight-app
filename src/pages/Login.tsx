import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, message, Spin, Typography, Row, Col } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import fetchUtils from '../utils/fetchUtils';
import { setUserData } from '../utils/storage';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {
      setIsLoading(true);

      const result = await fetchUtils('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          'email': values.username,
          'password': values.password,
        }),
      });

      console.log(result);
      setUserData(result);
      messageApi.open({
        type: 'success',
        content: 'User Logged in successfully',
      });

      setTimeout(navigate, 0, "/flights");
    } catch (err) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: err + " Please try again!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      {isLoading && (
        <Spin tip="Loading" size="large" style={{ width: '100%', marginTop: 20 }}>
          <div style={{ height: '100vh' }}></div>
        </Spin>
      )}

      <Row justify="center" style={{ marginTop: 50 }}>
        <Col xs={24} sm={16} md={12} lg={8} xl={6}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Typography.Title level={3}>Login</Typography.Title>
            <Typography.Text type="secondary">Access your account</Typography.Text>
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>

            <Typography.Text>
              Don't have an account? <Link to="/register">Register</Link>
            </Typography.Text>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Login;
