import { Button, Form, FormInstance, InputNumber } from 'antd';
import { mobileModel } from './mobileModel';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { authenticateServices } from '@/app/services/authenticateServices';
import { ActivateRequestModel } from '@/app/models/authentication/ActivateRequestModel';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import InputNemric from '../components/InputNumeric/InputNemric';
interface Props {
  form: FormInstance<mobileModel>;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  setIsResendDisabled: Dispatch<SetStateAction<boolean>>;
  setActivateRequest: Dispatch<SetStateAction<ActivateRequestModel>>;
  //changeActivationCode: (newCode: number) => void;
}
export default function RecieveCode(props: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialPage = async () => {
    props.form.setFieldsValue({
      mobile: '',
    });
  };

  useEffect(() => {
    initialPage();
  }, []);

  const handleConfirmCodeSend = async () => {
    setIsLoading(true);
    try {
      if (props.form.getFieldValue('mobile')) {
        const result: ActivateRequestModel = await authenticateServices.getActivationCode(props.form.getFieldValue('mobile'));
        console.log('mobile', result);
        if (result) {
          props.setActivateRequest(result);
          props.setHidden(true);
          props.setIsResendDisabled(true); // غیرفعال کردن دکمه ارسال مجدد کد
        }
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form.Item
        label="تلفن همراه"
        name="mobile"
        rules={[
          {
            required: true,
            message: 'لطفا شماره تلفن همراه خود را وارد نمایید!',
          },
        ]}
        style={{ marginTop: '50px' }}
      >
        <InputNemric className="input" style={{ color: 'aqua', textAlign: 'center' }} />
      </Form.Item>

      <Button loading={isLoading} type="primary" htmlType="submit" className="button" onClick={handleConfirmCodeSend} style={{ marginTop: '30px' }}>
        ارسال کد
      </Button>
    </>
  );
}
