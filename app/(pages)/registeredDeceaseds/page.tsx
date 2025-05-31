'use client';
import { Row, Col, Button, Avatar, Typography, Card, Switch, Spin, Tooltip, Popconfirm, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import './registeredDeceaseds.css';
import { LeftOutlined } from '@ant-design/icons';
import { deceasedServices } from '@/app/services/deceasedServices';
import { DeceasedInfoModel } from '@/app/models/Deceased/DeceasedInfoModel';

const { Title } = Typography;
export default function registeredDeceaseds() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [deceaseds, setDeceaseds] = useState<DeceasedInfoModel[]>();
  const [messageApi, contextHolder] = message.useMessage();
  // const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setIsLoading(true);
      const result = await deceasedServices.getDeceasedInfoList();

      if (result) {
        setDeceaseds(result);
        setIsLoading(false);
      }
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    }
  };

  const handleChange = async (isActive: boolean, deceasedId: number) => {
    try {
      setIsLoading(true);
      await deceasedServices.deceasedActivate(isActive, deceasedId);
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecceased = async (deceasedId: number, operation: string) => {
    // setLoadingIds((prev) => [...prev, deceasedId]);
    setIsLoading(true);
    await router.replace(`/deceasedInfoRegister/${deceasedId}/${operation}`);
    //setIsLoading(false);
  };

  const handleNavigation = async (path: string) => {
    setIsLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      errorByMessage(error);
    }
  };

  const handleDecceasedDelete = async (deceasedId: number) => {
    try {
      setIsLoading(true);
      await deceasedServices.deceasedDelete(deceasedId);
      await initData();
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonAccess = async (deceased: DeceasedInfoModel) => {
    if (deceased.displayStatus === true) return;
    {
      //   messageApi.warning('برای افزودن افراد جهت نمایش به صورت اختصاصی، باید نحوه نمایش اطلاعات را به انتخابی تغییر دهید.');
      setIsLoading(true);
      await router.replace(`/deceasedPersonsAccess/${deceased.deceasedId}`);
    }
  };
  const handlePicRegister = async (deceased: DeceasedInfoModel) => {
    try {
      if (deceased.subscription === false) return;
      setIsLoading(true);
      await router.replace(`/deceasedPicsManager/${deceased.deceasedId}`);
      setIsLoading(true);
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilmRegister = async (deceased: DeceasedInfoModel) => {
    try {
      if (deceased.displayStatus === false) return;
      setIsLoading(true);
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerDeadContainer">
      <Spin spinning={isLoading}>
        {contextHolder}
        <Row>
          <Col span={24}>
            <Title level={4} className="title-color">
              لیست اموات ثبت شده شما
            </Title>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: '10px', textAlign: 'end' }}>
            <Button type="primary" htmlType="submit" onClick={() => handleDecceased(0, 'Add')}>
              ثبت مورد جدید
            </Button>
            <Button type="primary" icon={<LeftOutlined />} style={{ marginRight: '5px' }} onClick={() => handleNavigation('/')}></Button>
          </Col>
        </Row>

        <Row gutter={[10, 10]} style={{ height: 'fit-content' }}>
          {deceaseds &&
            deceaseds.map((deceased) => (
              <Col key={deceased.deceasedId} xs={24} sm={12} span={12}>
                <Card
                  className="card-padding"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // رنگ پس‌زمینه مات
                    border: 0,
                  }}
                >
                  <Row>
                    <Col span={6}>
                      {/* <Avatar size={100} src="https://via.placeholder.com/100" /> */}
                      <Avatar src={deceased.imageUrl} size={100} style={{ cursor: 'pointer', backgroundColor: 'GrayText' }} />
                    </Col>
                    <Col span={12} className="col-dead-info">
                      <Row>
                        <Col span={24} className="dead-info">
                          {deceased.deceasedFullName}
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24} className="dead-info dead-font">
                          {`${deceased.deceasedFatherName !== null || deceased.deceasedMotherName !== null ? 'فرزند' : ''} ${
                            deceased.deceasedFatherName !== null ? deceased.deceasedFatherName : ''
                          } ${deceased.deceasedFatherName !== null && deceased.deceasedMotherName !== null ? 'و' : ''} ${
                            deceased.deceasedMotherName !== null ? deceased.deceasedMotherName : ''
                          }`}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={6} style={{ alignContent: 'center', textAlign: 'end' }}>
                      <Switch
                        checkedChildren="فعال"
                        unCheckedChildren="غیرفعال"
                        defaultChecked={deceased.isActive}
                        onChange={(isActive) => {
                          handleChange(isActive, deceased.deceasedId);
                        }}
                      />
                    </Col>
                    <Col span={24} style={{ marginTop: '15px', textAlign: 'end' }}>
                      <Tooltip
                        title={
                          deceased.displayStatus
                            ? 'برای افزودن افراد جهت نمایش به صورت اختصاصی، باید نحوه نمایش اطلاعات را به انتخابی تغییر دهید.'
                            : ''
                        }
                      >
                        <Button type="primary" className="dead-button" onClick={() => handlePersonAccess(deceased)}>
                          دسترسی افراد خاص
                        </Button>
                      </Tooltip>
                      <Tooltip title={!deceased.subscription ? 'برای ثبت تصاویر، ابتدا باید اشتراک داشته باشید.' : ''}>
                        <Button type="primary" className="dead-button" onClick={() => handlePicRegister(deceased)}>
                          ثبت تصاویر
                        </Button>
                      </Tooltip>

                      <Tooltip title={!deceased.subscription ? 'برای ثبت فیلم، ابتدا باید اشتراک داشته باشید.' : ''}>
                        <Button type="primary" className="dead-button" onClick={() => handleFilmRegister(deceased)}>
                          ثبت فیلم
                        </Button>
                      </Tooltip>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="dead-button"
                        onClick={() => handleDecceased(deceased.deceasedId, 'Update')}
                        // loading={loadingIds.includes(deceased.deceasedId)}
                      >
                        ویرایش
                      </Button>
                      <Popconfirm
                        title="آیا مطمئن به حذف تمام اطلاعات متوفی می باشید؟"
                        placement="topRight"
                        onConfirm={() => handleDecceasedDelete(deceased.deceasedId)}
                        cancelButtonProps={{ size: 'middle' }}
                        okButtonProps={{ size: 'middle' }}
                      >
                        <Button type="primary" htmlType="submit" className="dead-button">
                          حذف
                        </Button>
                      </Popconfirm>

                      <Button
                        type="primary"
                        htmlType="submit"
                        className="dead-button"
                        onClick={() => handleDecceased(deceased.deceasedId, 'Display')}
                        // loading={loadingIds.includes(deceased.deceasedId)}
                      >
                        مشاهده
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
        </Row>
      </Spin>
    </div>
  );
}
