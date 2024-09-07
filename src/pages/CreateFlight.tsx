import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Upload, Typography, Row, Col, message, FormProps, Spin, UploadProps, Space, App } from 'antd';
import AppLayout from '../layout';
import fetchUtils from '../utils/fetchUtils';
import { useNavigate, useParams } from 'react-router';
import { FieldType, Flight } from '../types/flight';
import { ErrorResponse } from '../types/response';
import { createFlight, getPayload, updateFlight } from '../service/flight';


const CreateFlight: React.FC = () => {

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
  const { message } = App.useApp();


  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
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
       
        const result = await updateFlight(flightId, payload, withImage);

        if(result && result.id) {
          message.success({ 
            type: 'success',
            content: 'Flight updated successfully',
          });
        } else {
          message.error(result.message, 5);
        }
      } else { //create new flight

        const result = await createFlight(payload, withImage);

        if(result && result.id) {
          message.success({ 
            type: 'success',
            content: 'Flight created successfully',
          });
        } else {
          message.error(result.message, 5);
        }
      }

      setTimeout(navigate, 0, "/flights");
    } catch (err) {
      console.log(err);
      message.error({ // TODO: fix this
        content: (err as ErrorResponse).message + " Please try again!",
        duration: 5,
      });
    }
  };

  const getFlightById = async (id: string) => {

    try {
      setLoading(true);
      const result = await fetchUtils(`/flights/${id}/details`);
      setDefaultValues(result);

    } catch (error) {
      message.error('Failed to fetch flight details. Please try again.');

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
      { loading ? 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '380px'}}>
          <Spin size='large' />
        </div> 
      : 
      <Row style={{ width: '100%', placeContent: 'center' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={12}>
          <Typography.Title level={3} style={{ marginBottom: 40 }}>
            { flightId ? 'Edit' : 'Create' } Flight
          </Typography.Title>

          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            onFinish={handleSaveFlight}
            labelAlign='left'
            style={{ maxWidth: '100%' }}

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
                // defaultValue={defaultValues.departureDate}
                onChange={(date, dateString) => {
                  setDepartureDate(dateString as string)
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
                <Button type="primary" htmlType="submit" style={{ borderRadius: '4px', marginRight: '10px' }}>
                  Submit
                </Button>
                <Button type="default" onClick={() => navigate('/flights')} >
                  Cancel
                </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>}
    </AppLayout>
  );
};

export default CreateFlight;
