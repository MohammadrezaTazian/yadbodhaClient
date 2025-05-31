'use client';
import { Row, Col, Form, Button, message, Avatar, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import './deceasedInfoDisplay.css';
import { LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { deceasedServices } from '@/app/services/deceasedServices';
import { DeceasedInfoGraveModel } from '@/app/models/Deceased/DeceasedInfoGraveModel';

const { Title } = Typography;
export default function deceasedInfoDisplay() {
  const [form] = Form.useForm<DeceasedInfoGraveModel>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [display, setDisplay] = useState<string | null>();
  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log('searchParams.get(', searchParams.get('id'));
    setDisplay(searchParams.get('display'));
    getDeceasedInfoForGrave(Number(searchParams.get('id')));
  }, []);

  const getDeceasedInfoForGrave = async (deceasedId: number) => {
    try {
      setIsLoading(true);
      if (deceasedId) {
        const result = await deceasedServices.getDeceasedInfoForGrave(deceasedId);
        if (result) {
          setLongitude(result.longitude!);
          setLatitude(result.latitude!);

          if (result.imageUrl) {
            const imageUrl = await result.imageUrl;
            setAvatarUrl(imageUrl!);
          }
          form.setFieldsValue(result);
          console.log('result::::', result);
        }
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dead-info-container" style={{ textAlign: 'center' }}>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Avatar src={avatarUrl} size={150} />
        </Col>
        <Col span={24} style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          سعید ضیائی کیا
        </Col>
        <Col span={24} style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          1400/12/12 - 1460/12/12
        </Col>
        <Col span={24} style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          فرزند گرامی جعفر و فاطمه صغری
        </Col>
        <Col span={24} style={{ color: 'white' }}>
          ای پدر مردانه بودن را به ما آموختی
          <br />
          روشنی دادی به جمع ما ولی خود سوختی
        </Col>
        <Col span={24} style={{ color: 'white' }}>
          خسته بودی از مرام و خصلت این روزگار
          <br />
          رفتی و این آتش پر نور را افروختی
        </Col>

        <Col span={24} style={{ textAlign: 'end', padding: '0px' }}>
          <Button
            className="dead-info-display-button"
            type="primary"
            htmlType="submit"
            style={{ minWidth: '75px', height: '35px', marginLeft: '5px' }}
          >
            تصاویر
          </Button>
          <Button
            className="dead-info-display-button"
            type="primary"
            htmlType="submit"
            style={{ minWidth: '75px', height: '35px', marginLeft: '5px' }}
          >
            فیلم
          </Button>
          <Button
            className="dead-info-display-button"
            type="primary"
            htmlType="submit"
            style={{ minWidth: '75px', height: '35px', marginLeft: '5px' }}
          >
            دل نوشته
          </Button>
          <Button
            className="dead-info-display-button"
            type="primary"
            loading={isLoading}
            icon={<LeftOutlined />}
            style={{ height: '35px' }}
            onClick={async () => {
              setIsLoading(true);
              display === '1' ? await router.replace(`/displayableDeceaseds/general`) : await router.replace(`/displayableDeceaseds/private`);
            }}
          ></Button>
        </Col>
      </Row>
    </div>
  );
}
