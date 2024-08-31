import React, { useEffect, useState } from 'react'
import { Flight } from '../types/flight';
import { Space, Table, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';


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

      fetch(`http://localhost:3000/flights?page=${page}&size=${size}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA0MjU1MTI5LWViOWQtNDU5Yy1hYzE2LWM3NTkxN2E4Nzk4MCIsIm5hbWUiOiJhc21hYSIsImVtYWlsIjoiYXNtYWFAbWFpbC5jb20iLCJpYXQiOjE3MjUwNTk0MjYsImV4cCI6MTcyNTA2MDYyNn0.gMsJkkQA4IKTfPKgPMMiIBqf7zRbxFyygS55MTADH9k'
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
    <div>
      {/* Header  */}
      
      {/* TODO: add Filter  */}
        <Table columns={columns} dataSource={flights} />
    </div>
  )
}
