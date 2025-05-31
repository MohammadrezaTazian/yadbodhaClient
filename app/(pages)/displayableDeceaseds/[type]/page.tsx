'use client';
import { Row, Col, Form, Button, message, Avatar, Typography, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import './displayableDeceaseds.css';
import { LeftOutlined } from '@ant-design/icons';
import { deceasedServices } from '@/app/services/deceasedServices';
import { DeceasedInfoParamModel } from '@/app/models/Deceased/DeceasedInfoParamModel';

const { Title } = Typography;
export default function displayableDeceaseds({ params }: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [deceaseds, setDeceaseds] = useState<DeceasedInfoParamModel[]>();

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setIsLoading(true);
      const result = await deceasedServices.getDeceasedInfoWithParamList(params.type);
      if (result) {
        setDeceaseds(result);
        setIsLoading(false);
      }
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    }
  };

  const handleDecceased = async (deceasedId: number, displayStatus: boolean) => {
    setIsLoading(true);
    const displayStatusVal = displayStatus ? 1 : 0;
    //await router.replace(`/deceasedInfoRegister/${deceasedId}/Display/${displayStatusVal}`);
    router.push(`../deceasedInfoDisplay?id=${encodeURIComponent(deceasedId)}&display=${displayStatusVal}`);
  };

  const handlePicDecceased = async (deceasedId: number, displayStatus: boolean) => {
    setIsLoading(true);
    const displayStatusVal = displayStatus ? 1 : 0;
    router.push(`../deceasedPics?id=${encodeURIComponent(deceasedId)}&display=${displayStatusVal}`);
  };

  return (
    <div className="displayable-container">
      <Row>
        <Col span={24}>
          <Title level={4} className="title-color">
            {`لیست اموات قابل مشاهده ${params.type === 'private' ? 'مختص شما' : ''}`}
          </Title>
        </Col>
      </Row>

      <Row gutter={[10, 10]} style={{ height: 'fit-content' }}>
        {deceaseds &&
          (deceaseds.length !== 0 ? (
            deceaseds.map((deceased) => (
              <Col xs={24} sm={12} span={12} key={deceased.deceasedId}>
                <Card
                  className="card-padding"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // رنگ پس‌زمینه مات
                    border: 0,
                  }}
                >
                  <Row>
                    <Col span={6}>
                      <Avatar src={deceased.imageUrl} size={100} style={{ cursor: 'pointer', backgroundColor: 'GrayText' }} />
                    </Col>
                    <Col span={10} className="col-dead-info">
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
                    <Col span={8} style={{ paddingLeft: '10px' }}>
                      <Row>
                        <Col>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="dead-button-displayable"
                            onClick={() => handleDecceased(deceased.deceasedId, deceased.displayStatus)}
                          >
                            مشخصات
                          </Button>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="dead-button-displayable"
                            onClick={() => handlePicDecceased(deceased.deceasedId, deceased.displayStatus)}
                          >
                            تصاویر
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Button type="primary" htmlType="submit" className="dead-button-displayable">
                            فیلم
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))
          ) : (
            <Row>
              <Col span={24} className="col-dead-info dead-info">
                موردی یافت نشد
              </Col>
            </Row>
          ))}
      </Row>
      <Row>
        <Col span={24} style={{ marginBottom: '10px', textAlign: 'end' }}>
          <Button
            type="primary"
            loading={isLoading}
            icon={<LeftOutlined />}
            style={{ marginTop: '5px' }}
            onClick={() => router.replace('/')}
          ></Button>
        </Col>
      </Row>
    </div>
  );
}
