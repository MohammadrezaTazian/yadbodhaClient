'use client';
import { Row, Col, Form, Button, Avatar, Input, Typography, message, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import './profile.css';
import { LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { ProfileModel } from '@/app/models/user/profileModel';
import { userServices } from '@/app/services/userServices';
import { UploadFile as AntUploadFile, RcFile } from 'antd/es/upload/interface';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import ProvienceLookup from '../lookup/ProvienceLookup';
import CityLookup from '../lookup/CityLookup';
const { Title } = Typography;

interface UploadFile extends AntUploadFile {
  originFileObj?: RcFile;
}
export default function Profile() {
  const [form] = Form.useForm<ProfileModel>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [removePic, setRemovePic] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const provinceIdValue = Form.useWatch('provinceId', form);

  useEffect(() => {
    getProfileInfo();
  }, []);

  const getProfileInfo = async () => {
    setIsLoading(true);
    try {
      const result: ProfileModel = await userServices.getProfileInfo();
      if (result) {
        if (result.imageUrl) {
          const imageUrl = await result.imageUrl;
          setAvatarUrl(imageUrl!);
        }
        form.setFieldsValue(result);
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (file: UploadFile) => {
    setFileList([file]);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatarUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file.originFileObj as RcFile); // خواندن فایل به عنوان URL
  };
  const handleUploadClick = () => {
    document.getElementById('avatar-uploader')?.click(); // شبیه‌سازی کلیک بر روی input
  };
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadFile: UploadFile = {
        uid: String(Date.now()),
        name: file.name,
        status: 'done',
        originFileObj: file as RcFile,
      };
      handleFileChange(uploadFile);
    }
  };
  const handleRemove = () => {
    setRemovePic(true);
    setFileList([]);
    setAvatarUrl(undefined); // Reset avatar URL if image is removed
  };

  const showMessage = () => {
    messageApi.success('اطلاعات با موفقیت ثبت شد.');
  };

  const handleSubmit = async (values: ProfileModel) => {
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('mobile1', values.mobile1 ? values.mobile1 : '');
    formData.append('nationalCode', values.nationalCode ? values.nationalCode : '');
    formData.append('provinceId', values.provinceId?.toString() ? values.provinceId.toString() : '');
    formData.append('cityId', values.cityId?.toString() ? values.cityId.toString() : '');
    if (fileList.length > 0) {
      formData.append('profilePictureFile', fileList[0].originFileObj as RcFile);
    }

    setIsLoading(true);
    try {
      await userServices.ProfileUpdate(formData, removePic);
      showMessage();
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = async (path: string) => {
    setIsLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      errorByMessage(error);
    }
  };
  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <Spin spinning={isLoading}>
        {contextHolder}
        <Row style={{ height: 'fit-content' }}>
          <Col span={24}>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item style={{ alignItems: 'center' }}>
                <Input type="file" accept="image/*" id="avatar-uploader" style={{ display: 'none' }} onChange={handleFileSelection} />

                <div>
                  <Avatar src={avatarUrl} size={100} onClick={handleUploadClick} style={{ cursor: 'pointer', backgroundColor: 'GrayText' }} />
                </div>
                {!avatarUrl ? (
                  <Button type="link" onClick={handleUploadClick}>
                    انتخاب عکس پروفایل
                  </Button>
                ) : (
                  <Button type="link" onClick={handleRemove}>
                    حذف عکس پروفایل
                  </Button>
                )}
              </Form.Item>
              <Col span={24}>
                <Title level={4} className="title-label">
                  ثبت مشخصات شخصی
                </Title>
              </Col>
              <Row gutter={24}>
                <Col xs={24} sm={12} span={12}>
                  <Form.Item name="fullName" label="نام و نام خانوادگی" rules={[{ required: true, message: 'لطفاً نام خود را وارد کنید!' }]}>
                    <Input className="input" />
                  </Form.Item>
                  <Form.Item name="mobile" label="تلفن همراه">
                    <Input className="input" readOnly />
                  </Form.Item>
                  <Form.Item name="mobile1" label="تلفن همراه">
                    <Input className="input" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} span={12}>
                  <Form.Item name="nationalCode" label="کد ملی">
                    <Input className="input" />
                  </Form.Item>

                  <Form.Item name="provinceId" label="استان">
                    <ProvienceLookup style={{ backgroundColor: '#4a4848a6', fontSize: 'large', minHeight: '40px !important' }} />
                  </Form.Item>
                  <Form.Item name="cityId" label="شهر">
                    <CityLookup
                      style={{ backgroundColor: '#4a4848a6', fontSize: 'large', minHeight: '40px !important' }}
                      provinceId={provinceIdValue}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item style={{ textAlign: 'end' }}>
                  <Button type="primary" htmlType="submit" style={{ minWidth: '100px', height: '40px' }}>
                    ثبت
                  </Button>
                  <Button
                    type="primary"
                    loading={isLoading}
                    icon={<LeftOutlined />}
                    style={{ marginRight: '5px', height: '40px' }}
                    onClick={() => handleNavigation('/')}
                  ></Button>
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
