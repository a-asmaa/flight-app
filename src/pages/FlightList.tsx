import React, { useEffect, useState } from 'react'
import { Flight } from '../types/flight';
import { Space, Table, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AppLayout from '../layout';
import { getToken } from '../utils/storage';


const columns: TableProps<Flight>['columns'] = [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Capacity',
    dataIndex: 'capacity',
    key: 'capacity',
  },
  {
    title: 'Departure Date',
    dataIndex: 'departureDate',
    key: 'departureDate',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditOutlined />
        <DeleteOutlined />
      </Space>
    ),
  },
];
export default function FlightList() {

    const [flights, setFlights] = useState<Flight[]>([]);
    const [size, setSize] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
      console.log(process.env.REACT_APP_URL)
      const token = getToken();

      fetch(`http://localhost:3000/flights?page=${page}&size=${size}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setFlights(data.resources);
        });
    }, []);
  return (
    <AppLayout children={<Table columns={columns} dataSource={flights} />} />
  )
}
