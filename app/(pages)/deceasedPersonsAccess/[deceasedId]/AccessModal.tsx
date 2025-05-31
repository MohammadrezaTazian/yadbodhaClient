'use client';
import { Row, Col, Form, Input, message, Spin, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { deceasedServices } from '@/app/services/deceasedServices';
import { DeceasedPersonsAccessModel } from '@/app/models/Deceased/DeceasedPersonsAccessModel';

interface PropsModel {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  reloadParent: () => void;
  deceasedId: number | undefined;
}

export default function AccessModal(props: PropsModel) {
  const [form] = Form.useForm<DeceasedPersonsAccessModel | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    initForm();
  }, []);

  const initForm = async () => {
    form.setFieldsValue({
      mobile: undefined,
      name: null,
      deceasedId: props.deceasedId,
    });
  };

  const onOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue(true);
      await deceasedServices.personAccessAdd(values);
      messageApi.success('ایجاد موفق');
      initForm();
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
    props.reloadParent && props.reloadParent();
  };

  const onCancel = async () => {
    props.reloadParent && props.reloadParent();
    props.setModalOpen(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Modal
        title={`ثبت اطلاعات فرد`}
        centered
        //width={500}
        open={props.modalOpen}
        cancelButtonProps={{ size: 'middle' }}
        okText={'تایید'}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        destroyOnClose={true}
        loading={isLoading}
        wrapClassName="custom-modal"
      >
        <Spin spinning={isLoading}>
          {contextHolder}
          <Row style={{ height: 'fit-content' }}>
            <Col span={24}>
              <Form form={form} layout="vertical">
                <Row gutter={24}>
                  <Col xs={24} sm={24} span={12}>
                    <Form.Item name="mobile" label="تلفن همراه" rules={[{ required: true, message: 'لطفاً تلفن فرد را وارد کنید!' }]}>
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} span={12}>
                    <Form.Item name="name" label="نام و نام خانوادگی">
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="deceasedId" hidden>
                  <Input className="input" />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Spin>
      </Modal>
    </div>
  );
}
