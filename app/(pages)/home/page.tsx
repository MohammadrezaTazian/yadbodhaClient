'use client';
import { Row, Col, Button, Spin, App } from 'antd';
import { useState } from 'react';
import './home.css';
import { useRouter } from 'next/navigation';
import { errorByMessage } from '@/app/helper/ErrorHandler';

export default function Home() {
  const { message } = App.useApp();
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const handleNavigation = async (path: string) => {
    setIsSpinning(true);
    try {
      await router.push(path);
    } catch (error) {
      errorByMessage(error);
    }
  };

  return (
    <div className="wrap" style={{ position: 'relative', height: '100vh - Calc(300px)' }}>
      <Spin spinning={isSpinning}>
        <Row className="padding" gutter={[10, 10]}>
          <Col className="col">
            <Button
              className="button"
              onClick={() => {
                handleNavigation('/profile');
              }}
            >
              مشخصات کاربر
            </Button>
          </Col>
          <Col className="col">
            <Button className="button" type="primary" onClick={() => handleNavigation('/registeredDeceaseds')}>
              اموات ثبت شده
            </Button>
          </Col>
          <Col className="col">
            <Button className="button" type="primary" onClick={() => handleNavigation('/displayableDeceaseds/general')}>
              اموات قابل نمایش
            </Button>
          </Col>
          <Col className="col">
            <Button className="button" type="primary" onClick={() => handleNavigation('/displayableDeceaseds/private')}>
              مشاهده اموات اختصاصی
            </Button>
          </Col>
          <Col className="col">
            <Button className="button" type="primary" onClick={() => handleNavigation('/familyTree')}>
              تعریف شجره نامه
            </Button>
          </Col>
          <Col className="col">
            <Button className="button" type="primary" onClick={() => handleNavigation('/familyTreesDisplay')}>
              مشاهده شجره نامه ها
            </Button>
          </Col>
          <Col className="col">
            <Button className="button" type="primary" onClick={() => handleNavigation('/familyTreesDisplay')}>
              ارائه خدمات
            </Button>
          </Col>
          <Col className="col">
            <Button className="button" type="primary">
              اسکن کیو آر کد
            </Button>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
