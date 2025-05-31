'use client';
import { Row, Col, Form, Button, message, Avatar, Typography, Card, Spin, Switch, Tooltip, Popconfirm, Radio, RadioChangeEvent } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { LeftOutlined } from '@ant-design/icons';
import { AuthContext } from '@/app/contexts/AuthProvider';
import { FamilyTreeModel } from '@/app/models/familyTree/FamilyTreeModel';
import { familyTreeServices } from '@/app/services/familyTreeServices';
import './familyTrees.css';

const { Title } = Typography;
export default function FamilyTree() {
  const [isLoading, setIsLoading] = useState(false);
  const [displayTree, setDisplayTree] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [familyTrees, setFamilyTrees] = useState<FamilyTreeModel[]>();
  const [familyTreesFiltered, setFamilyTreesFiltered] = useState<FamilyTreeModel[]>();

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
      const result = await familyTreeServices.getFamilyTreesList();
      if (result) {
        setFamilyTrees(result);
        setFamilyTreesFiltered(result.filter((familyTree) => familyTree.displayStatus === false));
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
    setIsLoading(true);
    await router.push(`../familyTreeInfo/${encodeURIComponent(familyTreeId)}/${'display'}`);
    //await router.replace(`/familyTreeInfo/${familyTreeId}`);
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    const displayStatus = e.target.value === 0 ? false : true;
    setFamilyTreesFiltered(familyTrees?.filter((familyTree) => familyTree.displayStatus === displayStatus));
  };

  return (
    <div className="displayable-container">
      <Spin spinning={isLoading}>
        {contextHolder}
        <Row>
          <Col span={24}>
            <Title level={4} className="title-color">
              لیست شجره نامه های قابل نمایش
            </Title>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: '10px', textAlign: 'end' }}>
            <Button type="primary" icon={<LeftOutlined />} style={{ marginRight: '5px' }} onClick={() => handleNavigation('/')}></Button>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: '15px', textAlign: 'center', color: 'white' }}>
            <Radio.Group
              defaultValue={0}
              options={[
                { value: 0, label: <span style={{ color: 'aqua' }}>اختصاصی</span> },
                { value: 1, label: <span style={{ color: 'aqua' }}>عمومی</span> },
              ]}
              onChange={(e) => handleRadioChange(e)}
            ></Radio.Group>
          </Col>
        </Row>
        <Row gutter={[10, 10]} style={{ height: 'fit-content' }}>
          {familyTreesFiltered &&
            familyTreesFiltered.map((familyTree) => (
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
                      s
                    </Col>
                    <Col span={8} style={{ marginTop: '15px' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="familyTrees-button"
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
      </Spin>
    </div>
  );
}
