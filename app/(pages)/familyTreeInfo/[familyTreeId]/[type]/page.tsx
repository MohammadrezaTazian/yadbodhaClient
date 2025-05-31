'use client';
import { Row, Col, Form, Button, message, Avatar, Typography, Card, Spin, Switch, Tooltip, Popconfirm } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { LeftOutlined } from '@ant-design/icons';
import { AuthContext } from '@/app/contexts/AuthProvider';
import { FamilyTreeModel } from '@/app/models/familyTree/FamilyTreeModel';
import { familyTreeServices } from '@/app/services/familyTreeServices';
import TreeComponent from './TreeComponent';

const { Title } = Typography;
export default function FamilyTreeInfo({ params }: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [displayTree, setDisplayTree] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [familyTrees, setFamilyTrees] = useState<FamilyTreeModel[]>();
  const searchParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    console.log('params:', params.familyTreeId);
    console.log('paramsType:', params.type);

    setDisplayTree(false);
  }, []);

  const initData = async () => {
    try {
      setIsLoading(true);
      // const result = await vacationServices.hourlyVacation(
      //   vacationOwner,
      // );
      // if (result) {
      //   setVacations(result);
      //   setIsLoading(false);
      // }
    } catch (error) {
      errorByMessage(error);
      //initLogin();
      setIsLoading(false);
    }
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
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
      await initData();
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFamilyTree = async (familyTreeId: number, operation: string) => {
    // setLoadingIds((prev) => [...prev, deceasedId]);
    setIsLoading(true);
    await router.replace(`/familyTreeRegister/${familyTreeId}/${operation}`);
    //setIsLoading(false);
  };

  const displayFamilyTree = async (familyTreeId: number) => {
    // setLoadingIds((prev) => [...prev, deceasedId]);
    setIsLoading(true);
    await router.replace(`/familyTreeInfo/${familyTreeId}`);
    //setIsLoading(false);
  };
  return (
    <div style={{ padding: '5px' }}>
      <Spin spinning={isLoading}>
        {contextHolder}
        <>
          <TreeComponent familyTreeId={params.familyTreeId} />
          <Row>
            <Col span={24} style={{ marginBottom: '10px', textAlign: 'end' }}>
              <Button
                type="primary"
                //loading={isLoading}
                icon={<LeftOutlined />}
                style={{ marginTop: '5px' }}
                onClick={() => (params.type === 'myfamily' ? router.replace('/familyTree') : router.replace('/familyTreesDisplay'))}
              ></Button>
            </Col>
          </Row>
        </>
      </Spin>
    </div>
  );
}
