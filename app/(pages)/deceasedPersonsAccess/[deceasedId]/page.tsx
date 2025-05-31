'use client';
import { Row, Col, Button, Typography, Spin, Tooltip, Popconfirm, Space, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import './deceasedPersonsAccess.css';
import { LeftOutlined } from '@ant-design/icons';
import { deceasedServices } from '@/app/services/deceasedServices';
import AccessModal from './AccessModal';
import { DeceasedPersonsAccessModel } from '@/app/models/Deceased/DeceasedPersonsAccessModel';
import Table, { ColumnsType } from 'antd/es/table';
import { AiOutlineDelete } from 'react-icons/ai';

const { Search } = Input;
const { Title } = Typography;

export default function deceasedPersonsAccess({ params }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [deceasedAccessPersons, setDeceasedAccessPersons] = useState<DeceasedPersonsAccessModel[]>();
  const [searchValue, setSearchValue] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>();

  //const [messageApi, contextHolder] = message.useMessage();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setIsLoading(true);
      const result = await deceasedServices.getDeceasedPersonsAccessList(params.deceasedId);
      if (result) {
        setDeceasedAccessPersons(result);
        setIsLoading(false);
      }
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    }
  };

  const handleNavigation = async (path: string) => {
    setIsLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      errorByMessage(error);
    }
  };

  const addAccess = async () => {
    setModalOpen(true);
  };

  const filterTable = (value: React.Key | boolean, record: DeceasedPersonsAccessModel) => {
    return record.mobile!.includes(value.toString()) || record.name!.includes(value.toString());
  };

  const onDelete = async (record: DeceasedPersonsAccessModel) => {
    setIsLoading(true);
    try {
      if (record.accessId) await deceasedServices.accessDelete(record.accessId);
      initData();
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnsType<DeceasedPersonsAccessModel> = [
    {
      title: 'تلفن همراه',
      dataIndex: 'mobile',
      key: 'mobile',
      //width: '16%',
      sorter: (a: DeceasedPersonsAccessModel, b: DeceasedPersonsAccessModel) => a.mobile.localeCompare(b.mobile),
      filteredValue: searchValue,
      onFilter: filterTable,
    },
    {
      title: 'نام',
      dataIndex: 'name',
      key: 'name',
      //width: '16%',
      filteredValue: searchValue,
      onFilter: filterTable,
      ellipsis: true,
      className: 'dir-ltr',
    },
    {
      title: 'عملیات',
      key: 'actionMenu',
      width: '80px',
      fixed: 'right',
      render: (_: unknown, record: DeceasedPersonsAccessModel) => (
        <Space>
          <>
            <Popconfirm
              title="آیا مطمئن به حذف اطلاعات سطر جاری می باشید؟"
              placement="topRight"
              onConfirm={() => onDelete(record)}
              cancelButtonProps={{ size: 'middle' }}
              okButtonProps={{ size: 'middle' }}
            >
              <Tooltip title="حذف">
                <Button shape="circle" className="text-delete" icon={<AiOutlineDelete />} />
              </Tooltip>
            </Popconfirm>
          </>
        </Space>
      ),
    },
  ];

  return (
    <div className="registerDeadContainer">
      <Spin spinning={isLoading}>
        {/* {contextHolder} */}
        <Row>
          <Col span={24}>
            <Title level={5} className="title-color">
              لیست افرادی که به مشخصات مرحوم/مرحومه
            </Title>
            <Title level={3} className="title-color-Access">
              جعفر ضیایی
            </Title>
            <Title level={5} className="title-color">
              دسترسی دارند
            </Title>
          </Col>
        </Row>
        <Row gutter={[10, 10]} style={{ marginRight: '10px' }}>
          <Col span={24} style={{ textAlign: 'end' }}>
            <Button type="primary" htmlType="submit" onClick={() => addAccess()}>
              ثبت فرد جدید
            </Button>
            <Button
              type="primary"
              icon={<LeftOutlined />}
              style={{ marginRight: '5px' }}
              onClick={() => handleNavigation('/registeredDeceaseds')}
            ></Button>
          </Col>
          <Col span={24} style={{ paddingRight: '10px' }}>
            <Search
              placeholder="موبایل / نام"
              // className="ant-input"
              onSearch={(value: string) => setSearchValue([value])}
              style={{ width: '100%' }}
            />
            <Table
              className="custom-table"
              columns={columns}
              dataSource={deceasedAccessPersons}
              rowKey={(element) => element.accessId!}
              pagination={{
                hideOnSinglePage: true,
                current: currentPage,
                onChange: (pageNum) => {
                  setCurrentPage(pageNum);
                },
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
              }}
              style={{ marginTop: '5px' }}
            />
          </Col>
        </Row>
        <AccessModal modalOpen={modalOpen} setModalOpen={setModalOpen} reloadParent={initData} deceasedId={params.deceasedId} />
      </Spin>
    </div>
  );
}
