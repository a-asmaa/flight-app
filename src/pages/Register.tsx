import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message, Spin, Typography, Row, Col } from 'antd';
import fetchUtils from '../utils/fetchUtils';
import { setUserData } from '../utils/storage';
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  username?: string;
  password?: string;
  remember?: boolean;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {
      setIsLoading(true);

      const result = await fetchUtils('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          'name': values.username,
          'email': values.email,
          'password': values.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(result);
      setUserData(result);
      messageApi.open({
        type: 'success',
        content: 'User created successfully',
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
            <Typography.Title level={3}>Sign Up</Typography.Title>
            <Typography.Text type="secondary">Create your account</Typography.Text>
          </div>

          <Form
            name="register"
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
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>

            <Typography.Text>
              Already have an account? <Link to="/login">Login</Link>
            </Typography.Text>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Register;
