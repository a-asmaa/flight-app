import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Upload,
} from 'antd';

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CreateFlight: React.FC = () => {

  return (
    <>
    {/* Title  */}
    Create Flight 
    <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
    >
    
    <Form.Item label="Code">
        <Input />
    </Form.Item>
   
    <Form.Item label="Departure Date">
        <DatePicker />
    </Form.Item>

    <Form.Item label="Capacity">
        <InputNumber />
    </Form.Item>
   
    <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload action="/upload.do" listType="picture-card">
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
        </Upload>
    </Form.Item>
  
    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

    </Form>

    </>
  );
};

export default () => <CreateFlight />;