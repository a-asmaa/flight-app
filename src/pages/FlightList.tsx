import React, { useEffect, useState } from 'react'
import { Flight } from '../types/flight';
import { GetProps, Input, message, Modal, Popconfirm, Space, Spin, Table, TablePaginationConfig, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AppLayout from '../layout';
import { getToken } from '../utils/storage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import fetchUtils, { BASE_URL } from '../utils/fetchUtils';
import { ErrorResponse } from '../types/response';


interface TableParams {
  pagination?: TablePaginationConfig;
}


type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;


export default function FlightList() {
    const token = getToken();
    const navigate = useNavigate();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageLoading, setIsImageLoading] = useState<boolean>(false);
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

      const code = searchParams.get('code');
      const getUrl = `${BASE_URL}/flights?page=${tableParams.pagination?.current}&size=${tableParams.pagination?.pageSize}`

      const url = code ? getUrl + `&code=${code}` : getUrl;

      fetch(url, {
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
            <EditOutlined onClick={() => navigate(`/flights/edit/${record.id}`)} />
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
      fetch(`${BASE_URL}/flights/${id}`, {
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


    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
      console.log(info?.source, value);

      if(!value) return;

      // add search params to url
      setSearchParams((prev) => {
        prev.set('code', `${value}`);
        return prev;
      });
    }

 

    return (
      <>
        {contextHolder}
        <AppLayout children={
          <>
            <div style={{marginBottom: '20px', justifyContent: 'end', display: 'flex'}}>
              <Search placeholder="search by code" onSearch={onSearch} onClear={() => setSearchParams((prev) => { prev.delete('code'); return prev })} allowClear style={{ width: 300 }} />
            </div>
           
            <Table columns={columns} dataSource={flights} pagination={tableParams.pagination} 
                 loading={isLoading} onChange={handleTableChange} />
          </>} />
        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} 
            footer={null}>

          {imageLoading ? 
            <Spin size='large' /> :
            <img src={selectedFlight?.img} alt="preview" />}
        </Modal>
      </>
    )
}
