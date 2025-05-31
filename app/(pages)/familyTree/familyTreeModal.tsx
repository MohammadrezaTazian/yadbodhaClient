'use client';
import { Row, Col, Form, Input, message, Spin, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
//import './familyTree.css';
import { FamilyTreeModel } from '@/app/models/familyTree/FamilyTreeModel';
import { familyTreeServices } from '@/app/services/familyTreeServices';

interface PropsModel {
  familyTreeModalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  reloadParent: () => void;
  familyTreeId: number | undefined;
}

export default function FamilyTreeModal(props: PropsModel) {
  const [form] = Form.useForm<FamilyTreeModel | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (props.familyTreeId !== 0) {
      if (props.familyTreeId) getFamilyTreeInfo(props.familyTreeId);
    } else {
      props.familyTreeModalOpen && initForm();
    }
  }, [props.familyTreeModalOpen]);

  const initForm = () => {
    form.setFieldValue('familyTreeName', '');
    form.setFieldValue('description', '');
    form.setFieldValue('displayStatus', true);
  };

  const getFamilyTreeInfo = async (familyTreeId: number) => {
    try {
      setIsLoading(true);
      const result = await familyTreeServices.getFamilyTreeInfo(familyTreeId);
      if (result) {
        form.setFieldsValue(result);
      } else {
        messageApi.warning('خطا در دریافت اطلاعات متوفی.');
      }
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue(true);
      if (props.familyTreeId === 0) {
        await familyTreeServices.familyTreeAdd(values);
        messageApi.success('ایجاد موفق');
      } else {
        await familyTreeServices.familyTreeUpdate(values);
        messageApi.success('بروزرسانی موفق');
      }
      props.reloadParent && props.reloadParent();
      props.setModalOpen(false);
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = async () => {
    props.reloadParent && props.reloadParent();
    props.setModalOpen(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {contextHolder}
      <Modal
        title={props.familyTreeId === 0 ? 'ایجاد شجره نامه' : 'ویرایش شجره نامه'}
        centered
        open={props.familyTreeModalOpen}
        cancelButtonProps={{ size: 'middle' }}
        okText={'تایید'}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        destroyOnClose={true}
        loading={isLoading}
        wrapClassName="custom-modal"
      >
        <Spin spinning={isLoading}>
          <Row style={{ height: 'fit-content' }}>
            <Col span={24}>
              <Form form={form} layout="vertical">
                <Row gutter={24}>
                  <Col xs={24} sm={24} span={12}>
                    <Form.Item name="familyTreeName" label="نام شجره" rules={[{ required: true, message: 'لطفاً نام شجره را وارد کنید!' }]}>
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} span={12}>
                    <Form.Item name="displayStatus" label="نحوه نمایش اطلاعات">
                      <Select
                        //defaultValue={1}
                        style={{ backgroundColor: '#4a4848a6 !important', fontSize: 'large', minHeight: '40px !important' }}
                        options={[
                          { value: false, label: 'نمایش برای افراد انتخابی' },
                          { value: true, label: 'نمایش برای همه' },
                        ]}
                        // dropdownRender={(menu) => <div className="custom-dropdown">{menu}</div>}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} span={12}>
                    <Form.Item name="description" label="توضیحات">
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Spin>
      </Modal>
    </div>
  );
}
