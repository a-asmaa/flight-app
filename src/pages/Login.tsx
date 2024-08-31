import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import { Link } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};


const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


const Login: React.FC = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        // TODO: login
    
        fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': values.username,
            'password': values.password
        })
        }).then((res) => {
            if(res.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'This is a success message',
                });
            }
            console.log(res);
            
            return res.json();
          })
          .then((res) => { 
            console.log(res, "ehhhhhhh");
            if(res.status !== 200) {
                messageApi.open({
                    type: 'error',
                    content: res.message
                });
            }
        })
    
    };

  return  <>
      {contextHolder}
        <span> Login with email </span>

        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            >
            <Input />
            </Form.Item>

            <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
            >
                 Don't have an account? <Link to='/register'> Register</Link>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </>
};

export default Login;