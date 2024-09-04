import React, { useEffect, useState } from 'react'
import { Flight } from '../types/flight';
import { GetProp, message, Modal, Popconfirm, Space, Table, TablePaginationConfig, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AppLayout from '../layout';
import { getToken } from '../utils/storage';
import { useNavigate, useSearchParams } from 'react-router-dom';


interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function FlightList() {
    const token = getToken();
    const navigate = useNavigate();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    let [searchParams, setSearchParams] = useSearchParams();

    const [tableParams, setTableParams] = useState<TableParams>({
      pagination: {
        current: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 5,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50', '100'],
      },
    });

    const [messageApi, contextHolder] = message.useMessage();

    // Helper function to validate query parameters
    const validateQueryParams = (page: number, pageSize: number) => {
      if (isNaN(page) || page <= 0 || isNaN(pageSize)) {
        return false;
      }
      return true;
    };

    // Check and validate query params in useEffect
    useEffect(() => {
      const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
      const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 5;

      if (Object.entries(searchParams).length === 0) {
        setSearchParams((prev) => {
          prev.set('page', `${page}`);
          prev.set('pageSize', `${pageSize}`);
          return prev;
        });
      }

      if (!validateQueryParams(page, pageSize)) {
        // If parameters are invalid, redirect to a "Bad request" page
        navigate('/bad-request');
      } else {
        // Fetch flights if the parameters are valid
        getFlights();
      }
    }, [searchParams]);

    const getFlights = () => {
      setIsLoading(true);
      fetch(`http://localhost:3000/flights?page=${tableParams.pagination?.current}&size=${tableParams.pagination?.pageSize}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: data.total,
            },
          });
          setFlights(data.resources);
        }).catch(() => {
          setIsLoading(false);
        });
    }

    const handleTableChange: TableProps<Flight>['onChange'] = (pagination) => {
      setTableParams({
        pagination,
      });
  
      setSearchParams((prev) => {
        prev.set('page', `${pagination.current}`);
        prev.set('pageSize', `${pagination.pageSize}`);
        return prev;
      });
  
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        setFlights([]);
      }
    };

    const columns: TableProps<Flight>['columns'] = [
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
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
            {record.img && <EyeOutlined onClick={() => handlePreview(record)} />}
            <EditOutlined onClick={() => console.log(record)} />
            <Popconfirm title="Delete Flight" description={`Are you sure to delete flight with code ${record.code}?`} 
              okText="Delete" cancelText="Cancel" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} 
              onConfirm={() => handleDeleteFlight(record.id)}>
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ];

    const handlePreview = (record: Flight) => {
      setIsModalOpen(true);
      setSelectedFlight(record);
    }

    const handleDeleteFlight = (id: string) => {
      fetch(`http://localhost:3000/flights/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
          messageApi.open({
            type: 'success',
            content: 'Flight deleted successfully',
          });
          getFlights();
        }).catch((err) => {
            messageApi.open({
              type: 'error',
              content: err + " Please try again!",
            });
        });
    }

    return (
      <>
        {contextHolder}
        <AppLayout children={
          <Table columns={columns} dataSource={flights} pagination={tableParams.pagination} 
                 loading={isLoading} onChange={handleTableChange} />} />
        <Modal open={isModalOpen}>
          <img src={selectedFlight?.img} alt="preview" />
        </Modal>
      </>
    )
}
