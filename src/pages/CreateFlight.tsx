import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Upload, Typography, Row, Col, message, FormProps, Spin, UploadProps, Space } from 'antd';
import AppLayout from '../layout';
import fetchUtils from '../utils/fetchUtils';
import { useNavigate, useParams } from 'react-router';
import { FieldType, Flight } from '../types/flight';
import { getToken } from '../utils/storage';
import { getPayload } from '../utils/getPayload';
import { ErrorResponse } from '../types/response';


const CreateFlight: React.FC = () => {

  const [messageApi, contextHolder] = message.useMessage();
  const [departureDate, setDepartureDate] = useState<string|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<Flight>({
    id: '',
    capacity: 0,
    code: '',
    departureDate: '',
    img: '',
    status: '',
  });
  const navigate = useNavigate();
  const {flightId} = useParams();


  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e, "files");
    return e?.fileList;
  };
  
  const props: UploadProps = {
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
      }
      return false;;
    },
  };

  
  const handleSaveFlight: FormProps<FieldType>['onFinish'] = async (values) => {

    try {

      const withImage = values.upload !== undefined;
      const payload = getPayload(values, departureDate, withImage);
  
      if(flightId) { // update flight
        const url = `/flights/${flightId}`.concat('', withImage ? '/withPhoto' : '');        
        const result = await fetchUtils(url , {
          method: 'PUT',
          body: payload,
          headers: {
            "Content-Type": withImage ? "multipart/form-data" : "application/json",
            "Authorization": `Bearer ${getToken()}`
          }
        });
  
        console.log(result);
        messageApi.open({ // TODO: fix this
          type: 'success',
          content: 'Flight updated successfully',
        });
      } else { //create new flight

        const url = '/flights'.concat('', withImage ? '/withPhoto' : '');        
        const result = await fetchUtils(url, {
          method: 'POST',
          headers: {
            "Content-Type": withImage ? "multipart/form-data" : "application/json",
            "authorization": `Bearer ${getToken()}`
          },
          body: payload,
        });
  
        console.log(result);
        messageApi.open({ // TODO: fix this
          type: 'success',
          content: 'Flight created successfully',
        });
      }

      setTimeout(navigate, 0, "/flights");
    } catch (err) {
      console.log(err);
      messageApi.open({ // TODO: fix this
        type: 'error',
        content: (err as ErrorResponse).message + " Please try again!",
        duration: 5,
      });
    }
  };

  const getFlightById = async (id: string) => {

    try {
      setLoading(true);
      const result = await fetchUtils(`/flights/${id}/details`);
      console.log(flightId, "flightId", result);
      setDefaultValues(result);

    } catch (error) {
      messageApi.error({
        type: 'error',
        content: error + " Please try again!",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (flightId) {
      getFlightById(flightId);
    }
  }, [flightId])


  return (
    <AppLayout>
     { contextHolder}
      { loading ? 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '380px'}}>
          <Spin size='large' />
        </div> 
      : 
      <Row style={{ marginTop: 5, width: '100%' }}>
        <Col xs={24} sm={20} md={16} lg={16} xl={12}>
          <Typography.Title level={3} style={{ marginBottom: 20 }}>
            { flightId ? 'Edit' : 'Create' } Flight
          </Typography.Title>

          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            style={{ maxWidth: '100%' }}
            onFinish={handleSaveFlight}
          >
            <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please enter flight code!' }]}>
              <Input defaultValue={defaultValues.code} placeholder="Enter flight code" />
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
              <InputNumber placeholder="Enter capacity" defaultValue={defaultValues.capacity} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Upload"
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload listType="picture-card" maxCount={1} {...props}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{}}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button type="default" onClick={() => navigate('/flights')} >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>}
    </AppLayout>
  );
};

export default CreateFlight;
