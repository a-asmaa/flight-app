import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Upload, Typography, Row, Col, message, FormProps } from 'antd';
import AppLayout from '../layout';
import fetchUtils from '../utils/fetchUtils';
import { useNavigate } from 'react-router';
import { log } from 'console';

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  console.log(e, "files");
  
  return e?.fileList;
};

type FieldType = {
  code: string;
  departureDate: Object;
  capacity: number;
  photo?: string;
};

const CreateFlight: React.FC = () => {

  const [messageApi, contextHolder] = message.useMessage();
  const [departureDate, setDepartureDate] = useState<string|null>(null);
  const navigate = useNavigate();

  const handleCreateFlight: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {

      const _body = {
        'code': values.code,
        'capacity': values.capacity,
        'departureDate':  departureDate  // '2020-10-23'
      };

      // if() {
      //   _body['photo'] = values.photo
      // }

      const result = await fetchUtils('/flights', {
        method: 'POST',
        body: JSON.stringify(_body),
      });

      console.log(result);
      messageApi.open({ // TODO: fix this
        type: 'success',
        content: 'Flight created successfully',
      });
      
      setTimeout(navigate, 0, "/flights");
    } catch (err) {
      console.log(err);
      messageApi.open({ // TODO: fix this
        type: 'error',
        content: err + " Please try again!",
        duration: 5,
      });
    }
  };

  

  return (
    <AppLayout>
     { contextHolder}
      <Row justify="center" style={{ marginTop: 50 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 20 }}>
            Create Flight
          </Typography.Title>

          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            style={{ maxWidth: '100%' }}
            onFinish={handleCreateFlight}
          >
            <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please enter flight code!' }]}>
              <Input placeholder="Enter flight code" />
            </Form.Item>

            <Form.Item
              label="Departure Date"
              name="departureDate"
              rules={[{ required: true, message: 'Please select departure date!' }]}
            >
              <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'}  
                onChange={(date, dateString) => {
                  setDepartureDate(dateString as string)
                  console.log(dateString, departureDate);
                  }}/>
            </Form.Item>

            <Form.Item
              label="Capacity"
              name="capacity"
              rules={[{ required: true, message: 'Please enter capacity!' }]}
            >
              <InputNumber placeholder="Enter capacity" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Upload"
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload action="/upload.do" listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default CreateFlight;
