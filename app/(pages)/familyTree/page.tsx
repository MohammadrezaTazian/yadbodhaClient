'use client';
import { Row, Col, Form, Button, message, Avatar, Typography, Card, Spin, Switch, Tooltip, Popconfirm } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { LeftOutlined } from '@ant-design/icons';
import { AuthContext } from '@/app/contexts/AuthProvider';
import { FamilyTreeModel } from '@/app/models/familyTree/FamilyTreeModel';
import { familyTreeServices } from '@/app/services/familyTreeServices';
import './familyTree.css';
import FamilyTreeModal from './familyTreeModal';

const { Title } = Typography;
export default function FamilyTree() {
  const [isLoading, setIsLoading] = useState(false);
  const [displayTree, setDisplayTree] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [familyTrees, setFamilyTrees] = useState<FamilyTreeModel[]>();
  const [familyTree, setFamilyTree] = useState<FamilyTreeModel>();

  const [familyTreeModalOpen, setFamilyTreeModalOpen] = useState(false);
  const [familyTreeId, setFamilyTreeId] = useState<number>(0);

  useEffect(() => {
    getFamilyTreeList();
    setDisplayTree(false);
  }, []);

  const getFamilyTreeList = async () => {
    try {
      setIsLoading(true);
      const result = await familyTreeServices.getFamilyTreeList();
      if (result) {
        setFamilyTrees(result);
        setIsLoading(false);
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, 700);
  };

  const onNew = () => {};

  const handlePersonAccess = async (familyTree: FamilyTreeModel) => {
    if (familyTree.displayStatus === true) return;
    {
      //   messageApi.warning('برای افزودن افراد جهت نمایش به صورت اختصاصی، باید نحوه نمایش اطلاعات را به انتخابی تغییر دهید.');
      setIsLoading(true);
      await router.replace(`/familyTreePersonsAccess/${familyTree.familyTreeId}`);
    }
  };

  const handleFamilyTreeDelete = async (familyTreeId: number) => {
    try {
      setIsLoading(true);
      await familyTreeServices.familyTreeDelete(familyTreeId);
      getFamilyTreeList();
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const displayFamilyTree = async (familyTreeId: number) => {
    // setLoadingIds((prev) => [...prev, deceasedId]);
    setIsLoading(true);
    //await router.push(`/familyTreeInfo/${familyTreeId}/`);
    await router.push(`../familyTreeInfo/${encodeURIComponent(familyTreeId)}/${'myfamily'}`);
    //router.push(`../deceasedInfoDisplay?id=${encodeURIComponent(deceasedId)}&display=${displayStatusVal}`);
    //setIsLoading(false);
  };

  const familyTreePersons = async (familyTreeId: number) => {
    setIsLoading(true);
    await router.replace(`/familyTreePersons/${familyTreeId}`);
  };
  const handleActive = async (isActive: boolean, familyTreeId: number) => {
    try {
      setIsLoading(true);
      await familyTreeServices.familyTreeActivate(isActive, familyTreeId);
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="displayable-container">
      <Spin spinning={isLoading}>
        {contextHolder}
        <Row>
          <Col span={24}>
            <Title level={4} className="title-color">
              لیست شجره نامه های ثبت شده من
            </Title>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: '10px', textAlign: 'end' }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                setFamilyTreeId(0);
                setFamilyTreeModalOpen(true);
              }}
            >
              ثبت مورد جدید
            </Button>
            <Button type="primary" icon={<LeftOutlined />} style={{ marginRight: '5px' }} onClick={() => handleNavigation('/')}></Button>
          </Col>
        </Row>

        <Row gutter={[10, 10]} style={{ height: 'fit-content' }}>
          {familyTrees &&
            familyTrees.map((familyTree) => (
              <Col key={familyTree.familyTreeId} xs={24} sm={12} span={12}>
                <Card
                  className="card-padding"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // رنگ پس‌زمینه مات
                    border: 0,
                  }}
                >
                  <Row>
                    <Col span={16} className="col-dead-info">
                      <Row>
                        <Col span={24} className="dead-info">
                          {familyTree.familyTreeName}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8} style={{ alignContent: 'center' }}>
                      <Switch
                        checkedChildren="فعال"
                        unCheckedChildren="غیرفعال"
                        defaultChecked={familyTree.isActive}
                        onChange={(isActive) => {
                          handleActive(isActive, familyTree.familyTreeId!);
                        }}
                      />
                    </Col>
                    <Col span={12} style={{ marginTop: '15px' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="familyTree-button"
                        onClick={() => {
                          setFamilyTreeId(familyTree.familyTreeId!);
                          setFamilyTreeModalOpen(true);
                        }}
                      >
                        ویرایش
                      </Button>
                      <Popconfirm
                        title="آیا مطمئن به حذف تمام اطلاعات شجره نامه می باشید؟"
                        placement="topRight"
                        onConfirm={() => handleFamilyTreeDelete(familyTree.familyTreeId!)}
                        cancelButtonProps={{ size: 'middle' }}
                        okButtonProps={{ size: 'middle' }}
                      >
                        <Button type="primary" htmlType="submit" className="familyTree-button">
                          حذف
                        </Button>
                      </Popconfirm>
                    </Col>
                    <Col span={12} style={{ marginTop: '15px', minWidth: '100px' }}>
                      <Tooltip
                        title={
                          familyTree.displayStatus
                            ? 'برای افزودن افراد جهت نمایش به صورت اختصاصی، باید نحوه نمایش اطلاعات را به انتخابی تغییر دهید.'
                            : ''
                        }
                      >
                        <Button type="primary" className="familyTree-button" onClick={() => handlePersonAccess(familyTree)}>
                          دسترسی افراد خاص
                        </Button>
                      </Tooltip>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="familyTree-button"
                        onClick={() => familyTreePersons(familyTree.familyTreeId!)}
                      >
                        تعریف نفرات
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="familyTree-button"
                        onClick={() => displayFamilyTree(familyTree.familyTreeId!)}
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
        <FamilyTreeModal
          familyTreeModalOpen={familyTreeModalOpen}
          setModalOpen={setFamilyTreeModalOpen}
          reloadParent={getFamilyTreeList}
          familyTreeId={familyTreeId}
        />
      </Spin>
    </div>
  );
}
