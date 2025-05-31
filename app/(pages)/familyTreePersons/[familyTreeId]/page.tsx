'use client';
import { Row, Col, Button, Avatar, Typography, Card, Switch, Spin, Popconfirm } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import './familyTreePerson.css';
import { LeftOutlined } from '@ant-design/icons';
import { familyTreeServices } from '@/app/services/familyTreeServices';
import { FamilyTreePersonModel } from '@/app/models/familyTree/FamilyTreePersonModel';
import FamilyTreePersonModal from './familyTreePersonModal';
import FamilyTreePersonChildModal from './familyTreePersonChildModal';
import FamilyTreePersonParentModal from './familyTreePersonParentModal';

const { Title } = Typography;
export default function FamilyTreePersons({ params }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [familyTreePersons, setFamilyTreePersons] = useState<FamilyTreePersonModel[]>([]);
  const [familyTreePerson, setFamilyTreePerson] = useState<FamilyTreePersonModel>();
  const [familyTreePersonModalOpen, setFamilyTreePersonModalOpen] = useState(false);
  const [familyTreePersonParentModalOpen, setFamilyTreePersonParentModalOpen] = useState(false);
  const [familyTreePersonChildModalOpen, setFamilyTreePersonChildModalOpen] = useState(false);

  useEffect(() => {
    getFamilyTreePersonList();
  }, []);

  const getFamilyTreePersonList = async () => {
    try {
      setIsLoading(true);
      const result = await familyTreeServices.getFamilyTreePersonList(params.familyTreeId);

      if (result) {
        setFamilyTreePersons(result);
        setIsLoading(false);
      }
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    }
  };

  const handleChange = async (isActive: boolean, familyTreePerson: FamilyTreePersonModel) => {
    try {
      setIsLoading(true);
      await familyTreeServices.familyTreePersonActivate(isActive, familyTreePerson.familyTreePersonId!);
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFamilyTreePerson = async (familyTreePerson: FamilyTreePersonModel) => {
    setFamilyTreePersonModalOpen(true);
    setFamilyTreePerson(familyTreePerson);
  };

  const handleFamilyTreePersonParent = async (familyTreePerson: FamilyTreePersonModel) => {
    setFamilyTreePersonParentModalOpen(true);
    setFamilyTreePerson(familyTreePerson);
  };

  const handleFamilyTreePersonChild = async (familyTreePerson: FamilyTreePersonModel) => {
    setFamilyTreePersonChildModalOpen(true);
    setFamilyTreePerson(familyTreePerson);
  };
  const handleNavigation = async (path: string) => {
    setIsLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      errorByMessage(error);
    }
  };

  const handleFamilyTreePersonDelete = async (familyTreePersonId: number) => {
    try {
      setIsLoading(true);
      await familyTreeServices.FamilyTreePersonDelete(params.familyTreeId, familyTreePersonId);
      await getFamilyTreePersonList();
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPerson = async () => {
    setFamilyTreePersonModalOpen(true);
    const newFamilyTreePerson = { familyTreePersonId: 0, familyTreeId: params.familyTreeId, familyTreePersonName: '', isDeceased: true };
    setFamilyTreePerson(newFamilyTreePerson);
  };

  return (
    <div className="container">
      <Spin spinning={isLoading}>
        <Row>
          <Col span={24}>
            <Title level={4} className="title-color">
              ثبت نفرات برای این شجره نامه
            </Title>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ marginBottom: '10px', textAlign: 'end' }}>
            {familyTreePersons && familyTreePersons.length === 0 && (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  handleNewPerson();
                }}
              >
                ثبت فرد جدید
              </Button>
            )}
            <Button type="primary" icon={<LeftOutlined />} style={{ marginRight: '5px' }} onClick={() => handleNavigation('/familyTree')}></Button>
          </Col>
        </Row>

        <Row gutter={[10, 10]} style={{ height: 'fit-content' }}>
          {familyTreePersons &&
            familyTreePersons.map((familyTreePerson) => (
              <Col key={familyTreePerson.familyTreePersonId} xs={24} sm={12} span={12}>
                <Card
                  className="card-padding"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 0,
                  }}
                >
                  <Row>
                    <Col span={6}>
                      <Avatar src={familyTreePerson.imageUrl} size={100} style={{ cursor: 'pointer', backgroundColor: 'GrayText' }} />
                    </Col>
                    <Col span={12} className="col-dead-info">
                      <Row>
                        <Col span={24} className="dead-info">
                          {familyTreePerson.familyTreePersonName}
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24} className="dead-info dead-font">
                          {familyTreePerson.wifeName}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={6} style={{ alignContent: 'center', textAlign: 'end' }}>
                      <Switch
                        checkedChildren="فعال"
                        unCheckedChildren="غیرفعال"
                        defaultChecked={familyTreePerson.isActive}
                        onChange={(isActive) => {
                          handleChange(isActive, familyTreePerson);
                        }}
                      />
                    </Col>
                    <Col span={24} style={{ marginTop: '15px', textAlign: 'end' }}>
                      <Button type="primary" htmlType="submit" className="dead-button" onClick={() => handleFamilyTreePerson(familyTreePerson)}>
                        ویرایش
                      </Button>

                      <Button type="primary" className="dead-button" onClick={() => handleFamilyTreePersonParent(familyTreePerson)}>
                        تعریف پدر و مادر
                      </Button>

                      <Button type="primary" className="dead-button" onClick={() => handleFamilyTreePersonChild(familyTreePerson)}>
                        تعریف فرزند
                      </Button>

                      <Popconfirm
                        title="آیا مطمئن به حذف تمام اطلاعات می باشید؟"
                        placement="topRight"
                        onConfirm={() => handleFamilyTreePersonDelete(familyTreePerson.familyTreePersonId!)}
                        cancelButtonProps={{ size: 'middle' }}
                        okButtonProps={{ size: 'middle' }}
                      >
                        <Button type="primary" htmlType="submit" className="dead-button">
                          حذف
                        </Button>
                      </Popconfirm>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
        </Row>
        <FamilyTreePersonModal
          modalOpen={familyTreePersonModalOpen}
          setModalOpen={setFamilyTreePersonModalOpen}
          reloadParent={getFamilyTreePersonList}
          familyTreePerson={familyTreePerson}
        />
        <FamilyTreePersonParentModal
          modalOpen={familyTreePersonParentModalOpen}
          setModalOpen={setFamilyTreePersonParentModalOpen}
          reloadParent={getFamilyTreePersonList}
          familyTreePerson={familyTreePerson}
        />
        <FamilyTreePersonChildModal
          modalOpen={familyTreePersonChildModalOpen}
          setModalOpen={setFamilyTreePersonChildModalOpen}
          reloadParent={getFamilyTreePersonList}
          familyTreePerson={familyTreePerson}
        />
      </Spin>
    </div>
  );
}
