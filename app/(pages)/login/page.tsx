'use client';
import { Button, Col, Form, Row, Spin } from 'antd';
import './login.css';
import { useContext, useEffect, useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { mobileModel } from './mobileModel';
import RecieveCode from './recieveCode';
import SendCode from './sendCode';
import { useRouter } from 'next/navigation';
import { authenticateServices } from '@/app/services/authenticateServices';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { ActivateRequestModel } from '@/app/models/authentication/ActivateRequestModel';
import { AuthContext } from '@/app/contexts/AuthProvider';
import { useWatch } from 'antd/es/form/Form';

export default function login() {
  const router = useRouter();
  const [form] = Form.useForm<mobileModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(12);
  const [activateRequest, setActivateRequest] = useState<ActivateRequestModel>({});
  const authContext = useContext(AuthContext);

  const watchActivationCode = useWatch('activationCode', form);
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (watchActivationCode) {
        let activeCode: String = watchActivationCode?.toString();
        if (activeCode && activeCode.length === 4) {
          const tempActivateRequest: ActivateRequestModel = {
            protectedMobile: activateRequest.protectedMobile,
            protectedUserId: activateRequest.protectedUserId,
            activationCode: Number(activeCode),
          };
          const result = await authenticateServices.login(tempActivateRequest);
          authContext.getUserInfo();
          if (result) {
            router.replace('/home');
          }
        }
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isResendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(12); // Reset countdown to 2 minutes
    }

    return () => clearInterval(timer);
  }, [isResendDisabled, countdown]);

  const handleConfirmCodeReSend = async () => {
    setIsLoading(true);
    try {
      if (form.getFieldValue('mobile')) {
        const result: ActivateRequestModel = await authenticateServices.getActivationCode(form.getFieldValue('mobile'));
        if (result) {
          console.log('activationCode', result.activationCode);
          //setActivateResult(result);
          //setHidden(true);
          setIsResendDisabled(true); // غیرفعال کردن دکمه ارسال مجدد کد
        }
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-html">
        <label className="tab">یادبود</label>
        <div className="login-form">
          <div className="group">
            <Spin spinning={isLoading}>
              <Form form={form} layout="vertical">
                {!hidden ? (
                  <RecieveCode
                    form={form}
                    hidden={hidden}
                    setHidden={setHidden}
                    setIsResendDisabled={setIsResendDisabled}
                    setActivateRequest={setActivateRequest}
                    //changeActivationCode={changeActivationCode}
                  />
                ) : (
                  <>
                    <SendCode form={form} hidden={hidden} setHidden={setHidden} isResendDisabled={isResendDisabled} />

                    <Button
                      type="primary"
                      htmlType="submit"
                      className="button"
                      loading={isLoading}
                      style={{ marginTop: '30px' }}
                      onClick={handleConfirm}
                      disabled={!isResendDisabled}
                    >
                      تایید
                    </Button>
                    <Row style={{ float: 'left', alignItems: 'center' }}>
                      <Col style={{ marginTop: '20px', marginRight: '5px' }}>
                        <Button type="primary" disabled={isResendDisabled} style={{ color: 'white' }} onClick={handleConfirmCodeReSend}>
                          {isResendDisabled ? `ارسال مجدد کد (${countdown}s)` : 'ارسال مجدد کد'}
                        </Button>
                      </Col>
                      <Col style={{ marginTop: '20px', marginRight: '5px' }}>
                        <Button
                          type="primary"
                          loading={isLoading}
                          icon={<LeftOutlined />}
                          onClick={() => {
                            setHidden(false);
                          }}
                        ></Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
}
