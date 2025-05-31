'use client';
import { Row, Col, Form, Button, message, Avatar, Input, Typography, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { UploadFile as AntUploadFile, RcFile } from 'antd/es/upload/interface';
import './deceasedInfoRegister.css';
import { LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MyMap from './map';
import { DeceasedInfoModel } from '@/app/models/Deceased/DeceasedInfoModel';
import { deceasedServices } from '@/app/services/deceasedServices';
import InputNemric from '../../../components/InputNumeric/InputNemric';
import PersianDatePicker from '../../../components/persianDatePicker/PersianDatePicker';
import DefaultTextTypeLookup from '../../../lookup/DefaultTextTypeLookup';
import DefaultTextLookup from '../../../lookup/DefaultTextLookup';
import LanguageLookup from '../../../lookup/LanguageLookup';
import { DefaultTextModel } from '@/app/models/DefaultText/DefaultTextModel';

const { Title } = Typography;
interface UploadFile extends AntUploadFile {
  originFileObj?: RcFile;
}

const deceasedInfoRegister = ({ params }: any) => {
  const [form] = Form.useForm<DeceasedInfoModel>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const router = useRouter();
  const defaultTextTypeIdValue = Form.useWatch('defaultTextTypeId', form);
  const languageIdValue = Form.useWatch('languageId', form);
  const [defaultTextId, setDefaultTextId] = useState<string | number | null>(null);
  const [defaultTextView, setDefaultTextView] = useState<DefaultTextModel | null>();
  const [longitude, setLongitude] = useState<number | null>(46.219053268432624);
  const [latitude, setLatitude] = useState<number | null>(38.04049512038982);
  const [displayMap, setDisplayMap] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [accessStatus, setAccessStatus] = useState(false);

  useEffect(() => {
    getDefaultText();
  }, [defaultTextId]);

  useEffect(() => {
    setDefaultTextView(null);
  }, [languageIdValue || defaultTextTypeIdValue]);

  useEffect(() => {
    if (params.operation !== 'Add') {
      getDeceasedInfo();
      getDefaultText();
    } else {
      form.setFieldValue('displayStatus', 1);
    }
  }, [displayMap]);

  const getDefaultText = async () => {
    setIsLoading(true);
    try {
      let result: DefaultTextModel;
      if (defaultTextId) {
        result = await deceasedServices.getDefaultText(Number(defaultTextId));
        if (result) {
          setDefaultTextView({ ...result });
        }
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getDeceasedInfo = async () => {
    try {
      setIsLoading(true);
      const result = await deceasedServices.getDeceasedInfo(params.deceasedId);
      if (result) {
        result.longitude && setLongitude(result.longitude);
        result.latitude && setLatitude(result.latitude);
        if (result.latitude === null || result.longitude === null) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setLatitude(lat);
                setLongitude(lon);
              },
              (error) => {
                //console.error('Error getting geolocation:', error);
                errorByMessage('خطا در دریافت مختصات');
                console.error('خطا در دریافت مختصات', error);
              }
            );
          } else {
            //alert('Geolocation is not supported by this browser.');
            alert('مختصات توسط این مرورگر پشتیبانی نمیشود');
          }
        }

        if (result.imageUrl) {
          const imageUrl = await result.imageUrl;
          setAvatarUrl(imageUrl!);
        }
        form.setFieldsValue(result);
        result.displayStatus === true ? form.setFieldValue('displayStatus', 1) : form.setFieldValue('displayStatus', 0);
        result.languageId && form.setFieldValue('languageId', result.languageId);
        result.defaultTextTypeId && form.setFieldValue('defaultTextTypeId', result.defaultTextTypeId);
        result.defaultTextId && setDefaultTextId(result.defaultTextId);
      } else {
        setAccessStatus(true);
        messageApi.warning('مجوز دسترسی به اطلاعات را ندارید.');
      }
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
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
    setFileList([]);
    setAvatarUrl(undefined); // Reset avatar URL if image is removed
  };

  const handleSubmit = async (values1: DeceasedInfoModel) => {
    const values = form.getFieldsValue(true);
    const formData = new FormData();
    formData.append('block', values.block.toString());
    formData.append('row', values.row.toString());
    formData.append('number', values.number.toString());
    formData.append('phase', values.phase?.toString() ? values.phase.toString() : '');
    formData.append('deceasedFullName', values.deceasedFullName);
    formData.append('birthDate', values.birthDate);
    formData.append('deathDate', values.deathDate);
    formData.append('provinceId', values.provinceId?.toString() ? values.provinceId.toString() : '');
    formData.append('cityId', values.cityId?.toString() ? values.cityId.toString() : '');
    formData.append('graveyardName', values.graveyardName ? values.graveyardName : '');
    formData.append('deceasedFatherName', values.deceasedFatherName ? values.deceasedFatherName : '');
    formData.append('deceasedMotherName', values.deceasedMotherName ? values.deceasedMotherName : '');
    formData.append('remark', values.remark ? values.remark : '');

    formData.append('defaultTextId', defaultTextTypeIdValue && values.defaultTextId?.toString() ? values.defaultTextId.toString() : '');
    formData.append('displayStatus', values.displayStatus && values.displayStatus.toString() === '1' ? 'true' : 'false');
    formData.append('longitude', longitude!.toString());
    formData.append('latitude', latitude!.toString());

    if (fileList.length > 0) {
      formData.append('deceasedProfileFile', fileList[0].originFileObj as RcFile);
      formData.append('imageUrl', '');
    } else if (avatarUrl) {
      formData.append('imageUrl', avatarUrl);
    }

    formData.append('qrCode', values.qrCode?.toString() ? values.qrCode.toString() : '');
    setIsLoading(true);
    try {
      params.deceasedId === '0' ? await deceasedServices.DeceasedAdd(formData) : await deceasedServices.DeceasedUpdate(formData, params.deceasedId);
      router.replace('/registeredDeceaseds');
      messageApi.success('اطلاعات با موفقیت ثبت شد.');
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Spin spinning={isLoading}>
      {contextHolder}
      <div className="container">
        <Form form={form} onFinish={handleSubmit} layout="vertical" className="form-width" disabled={params.operation === 'Display'}>
          <Form.Item style={{ alignItems: 'center' }}>
            <Input type="file" accept="image/*" id="avatar-uploader" style={{ display: 'none' }} onChange={handleFileSelection} />

            <div>
              <Avatar src={avatarUrl} size={100} onClick={handleUploadClick} style={{ cursor: 'pointer', backgroundColor: 'GrayText' }} />
            </div>
            {!avatarUrl ? (
              <Button type="link" onClick={handleUploadClick}>
                انتخاب عکس فوت شده
              </Button>
            ) : (
              <Button type="link" onClick={handleRemove}>
                حذف عکس فوت شده
              </Button>
            )}
          </Form.Item>
          <Col span={24}>
            <Title level={4} className="title-label">
              ثبت/نمایش مشخصات فوت شده
            </Title>
          </Col>
          <Row gutter={24}>
            <Col xs={24} sm={12} span={12}>
              <Form.Item name="deceasedFullName" label="نام و نام خانوادگی" rules={[{ required: true, message: 'لطفاً نام متوفی را وارد کنید!' }]}>
                <Input className="input" />
              </Form.Item>
              <Form.Item name="birthDate" label="تاریخ تولد" rules={[{ required: true, message: 'لطفاً تاریخ تولد متوفی را وارد کنید!' }]}>
                <PersianDatePicker />
              </Form.Item>
              <Form.Item name="deathDate" label="تاریخ فوت" rules={[{ required: true, message: 'لطفاً تاریخ فوت متوفی را وارد کنید!' }]}>
                <PersianDatePicker />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} span={12}>
              <Form.Item name="block" label="بلوک" rules={[{ required: true, message: 'لطفاً بلوک قبر را وارد کنید!' }]}>
                <Input className="input" />
              </Form.Item>
              <Form.Item name="row" label="ردیف" rules={[{ required: true, message: 'لطفاً ردیف قبر را وارد کنید!' }]}>
                <Input className="input" />
              </Form.Item>
              <Form.Item name="number" label="شماره" rules={[{ required: true, message: 'لطفاً شماره قبر را وارد کنید!' }]}>
                <InputNemric className="input" />
              </Form.Item>
            </Col>
            {!displayMap && (
              <Col span={24} style={{ marginBottom: '10px' }}>
                <Button
                  type="primary"
                  onClick={() => setDisplayMap(true)}
                  style={{ minWidth: '100px', height: '40px', marginTop: '10px' }}
                  disabled={false}
                >
                  اطلاعات بیشتر و نمایش موقعیت روی نقشه
                </Button>
              </Col>
            )}
            {displayMap && (
              <>
                <hr style={{ border: '1px solid black', width: '100%', borderColor: 'gray' }} />
                <Col xs={24} sm={12} span={12}>
                  <Form.Item name="phase" label="فاز">
                    <Input className="input" />
                  </Form.Item>
                  <Form.Item name="deceasedFatherName" label="نام پدر">
                    <Input className="input" />
                  </Form.Item>
                  <Form.Item name="deceasedMotherName" label="نام مادر">
                    <Input className="input" />
                  </Form.Item>
                  <Form.Item name="graveyardName" label="آرامگاه">
                    <Input className="input" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} span={12}>
                  <Form.Item name="displayStatus" label="نحوه نمایش اطلاعات">
                    <Select
                      //defaultValue={1}
                      style={{ backgroundColor: '#4a4848a6 !important', fontSize: 'large', minHeight: '40px !important' }}
                      options={[
                        { value: 0, label: 'نمایش برای افراد انتخابی' },
                        { value: 1, label: 'نمایش برای همه' },
                      ]}
                      dropdownRender={(menu) => <div className="custom-dropdown">{menu}</div>}
                    />
                  </Form.Item>
                  <Form.Item name="languageId" label=" زبان اشعار انتخابی ">
                    <LanguageLookup style={{ backgroundColor: '#4a4848a6', fontSize: 'large', minHeight: '40px !important' }} />
                  </Form.Item>

                  <Form.Item name="defaultTextTypeId" label="اشعار انتخابی برای">
                    <DefaultTextTypeLookup
                      languageId={languageIdValue}
                      style={{ backgroundColor: '#4a4848a6', fontSize: 'large', minHeight: '40px !important' }}
                    />
                  </Form.Item>
                  <Form.Item name="defaultTextId" label="متن پیش فرض">
                    <DefaultTextLookup
                      value={defaultTextId}
                      onChange={setDefaultTextId}
                      languageId={languageIdValue}
                      defaultTextTypeId={defaultTextTypeIdValue}
                      style={{ backgroundColor: '#4a4848a6', fontSize: 'large', minHeight: '40px !important' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col xs={24} sm={12} lg={6} className="defaultText">
                      {defaultTextView?.text1}
                    </Col>
                    <Col xs={24} sm={12} lg={6} className="defaultText">
                      {defaultTextView?.text2}
                    </Col>
                    <Col xs={24} sm={12} lg={6} className="defaultText">
                      {defaultTextView?.text3}
                    </Col>
                    <Col xs={24} sm={12} lg={6} className="defaultText">
                      {defaultTextView?.text4}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Form.Item name="remark" label="دل نوشته">
                    <Input className="input" />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          <div>
            {displayMap && <MyMap form={form} latitude={latitude!} setLatitude={setLatitude} longitude={longitude!} setLongitude={setLongitude} />}
          </div>
          <Form.Item style={{ textAlign: 'end' }}>
            <div style={{ textAlign: 'left' }}>
              {!(params.operation === 'Display') && (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ minWidth: '100px', height: '40px', marginTop: '10px', display: `${accessStatus ? 'none' : ''}` }}
                  //disabled={accessStatus}
                >
                  {Number(params.deceasedId) === 0 ? 'ثبت' : 'ویرایش'}
                </Button>
              )}
              <Button
                type="primary"
                loading={isLoading}
                icon={<LeftOutlined />}
                style={{ marginRight: '5px', height: '40px', marginTop: '10px' }}
                // onClick={() => router.replace('/registeredDeceaseds')}
                onClick={async () => {
                  setIsLoading(true);
                  await router.replace(`/registeredDeceaseds`);
                }}
                disabled={false}
              ></Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default deceasedInfoRegister;
