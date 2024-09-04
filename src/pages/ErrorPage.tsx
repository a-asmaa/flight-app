// src/pages/BadRequest.tsx
import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function BadRequest() {
  const navigate = useNavigate();
  
  return (
    <Result
      status='404'
      title="400"
      subTitle="Sorry, the page parameters are invalid."
      extra={<Button type="primary" onClick={() => navigate('/flights')}>Go Back</Button>}
    />
  );
}
