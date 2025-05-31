import { Button, Col, Form, FormInstance, InputNumber, Row } from 'antd';
import { mobileModel } from './mobileModel';
import { Dispatch, SetStateAction, useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';

interface Props {
  form: FormInstance<mobileModel>;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  isResendDisabled: boolean;
}
export default function SendCode(props: Props) {
  return (
    <>
      <label className="label" style={{ textAlign: 'center', marginTop: '50px', fontSize: '15px' }}>
        کد ارسالی جهت ورود به سیستم را وارد کنید
      </label>
      <Form.Item
        label="کد ارسالی"
        name="activationCode"
        style={{ marginTop: '25px' }}
        rules={[
          {
            required: true,
            message: 'لطفا کد ارسالی به تلفن همراه خود را وارد نمایید!',
          },
        ]}
      >
        <InputNumber className="input" maxLength={4} style={{ textAlign: 'center', color: 'aqua' }} readOnly={!props.isResendDisabled} />
      </Form.Item>
    </>
  );
}
