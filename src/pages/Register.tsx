import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message } from 'antd';
import Typography from 'antd/es/typography/Typography';
import fetchUtils from '../utils/fetchUtils';
import { setToken } from '../utils/storage';
import { Link } from "react-router-dom";

type FieldType = {
  email?: string;
  username?: string;
  password?: string;
  remember?: string;
};


const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


const Register: React.FC = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        // TODO: register

      
            try {
              const result = await fetchUtils('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    'name': values.username,
                    'email': values.email,
                    'password': values.password
                })

              }); // Adjust the endpoint as necessary
              console.log(result);
              //set token
              setToken(result);
                messageApi.open({
                    type: 'success',
                    content: 'User created successfully',
                });
            } catch (err) {
              console.log(err);
                messageApi.open({
                    type: 'error',
                    content: err + "Please try again!!",
                });
            }
       

        // fetch('http://localhost:3000/', {
        //     method: 'POST',
        //     headers: {
        //       'accept': 'application/json',
        //       'Content-Type': 'application/json'
        //     },
        //     // body: '{\n  "name": "asmaa",\n  "email": "asmaa@mail.com",\n  "password": "as123"\n}',
        //     body: JSON.stringify({
        //       'name': values.username,
        //       'email': values.email,
        //       'password': values.password
        //     })
        // }).then((res) => {
        //     if(res.status === 201) {
        //        
        //     }
        //     console.log(res);
            
        //     return res.json();
        //   })
        //   .then((res) => { 
        //     console.log(res, "ehhhhhhh");
        //     if(res.status !== 200) {
        //        
        //     }

        //    
        // })
    };

  return  <>
      {contextHolder}

      <Typography>Don't have an account?</Typography>
      <span>Sign up with your email and password</span>
      
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
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
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

            <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
            >
            <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
            >
                Already have an account? <Link to='/login'> Login</Link>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>
    </>
};

export default Register;