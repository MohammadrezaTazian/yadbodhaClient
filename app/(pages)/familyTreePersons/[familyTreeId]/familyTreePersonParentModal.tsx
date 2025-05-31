'use client';
import { Row, Col, Form, Input, message, Spin, Modal, Select, Avatar, Button } from 'antd';
import { useEffect, useState } from 'react';
import { errorByMessage } from '@/app/helper/ErrorHandler';
// import './FamilyTreePersons.css';
import { familyTreeServices } from '@/app/services/familyTreeServices';
import { FamilyTreePersonModel } from '@/app/models/familyTree/FamilyTreePersonModel';
import { UploadFile as AntUploadFile, RcFile } from 'antd/es/upload/interface';

interface PropsModel {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  reloadParent: () => void;
  familyTreePerson: FamilyTreePersonModel | undefined;
}
interface UploadFile extends AntUploadFile {
  originFileObj?: RcFile;
}
export default function FamilyTreePersonParentModal(props: PropsModel) {
  const [form] = Form.useForm<FamilyTreePersonModel | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(undefined);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (props.familyTreePerson) {
      initForm();
      // form.setFieldsValue(props.familyTreePerson);
      // form.setFieldValue('isDeceased', props.familyTreePerson.isDeceased === true ? 1 : 0);
      // setAvatarUrl(props.familyTreePerson.imageUrl);
    }
  }, [props.modalOpen]);

  const initForm = () => {
    const initFamilyTreePerson = {
      familyTreeId: props.familyTreePerson?.familyTreeId,
      familyTreePersonId: 0,
      familyTreePersonName: '',
      imageUrl: '',
      isActive: true,
      parentId: props.familyTreePerson?.familyTreePersonId,
      picName: '',
      wifeName: '',
    };
    form.setFieldsValue(initFamilyTreePerson);
    setAvatarUrl(undefined);
    form.setFieldValue('isDeceased', 0);
    // form.setFieldValue('isActive', true);
  };

  const onOk = async () => {
    try {
      const values = form.getFieldsValue(true);

      if (props.familyTreePerson && props.familyTreePerson.familyTreeId) {
        const formData = new FormData();
        formData.append('familyTreeId', props.familyTreePerson.familyTreeId.toString());
        formData.append('familyTreePersonId', props.familyTreePerson && props.familyTreePerson.familyTreePersonId!.toString());
        formData.append('familyTreePersonName', values.familyTreePersonName);
        formData.append('isDeceased', values.isDeceased && values.isDeceased.toString() === '1' ? 'true' : 'false');
        formData.append('wifeName', values.wifeName);
        formData.append('isActive', values.isActive);
        if (fileList.length > 0) {
          formData.append('familyTreePersonFile', fileList[0].originFileObj as RcFile);
          formData.append('imageUrl', '');
        } else if (avatarUrl) {
          formData.append('imageUrl', avatarUrl);
        }
        setIsLoading(true);
        await familyTreeServices.familyTreePersonParentAdd(formData);
        messageApi.success('اطلاعات با موفقیت ثبت شد.');
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

  const handleUploadClick = () => {
    document.getElementById('avatar-uploader')?.click(); // شبیه‌سازی کلیک بر روی input
  };
  const handleRemove = () => {
    setFileList([]);
    setAvatarUrl(undefined); // Reset avatar URL if image is removed
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
  return (
    <div style={{ textAlign: 'center' }}>
      {contextHolder}
      <Modal
        title={'تعریف پدر یا مادر برای شجره نامه'}
        centered
        open={props.modalOpen}
        cancelButtonProps={{ size: 'middle' }}
        okText={'تایید'}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        destroyOnClose={true}
        loading={isLoading}
        wrapClassName="custom-modal"
      >
        <div className="container">
          <Form form={form} layout="vertical" className="form-width">
            <Form.Item style={{ alignItems: 'center' }}>
              <Input type="file" accept="image/*" id="avatar-uploader" style={{ display: 'none' }} onChange={handleFileSelection} />

              <div>
                <Avatar src={avatarUrl} size={100} onClick={handleUploadClick} style={{ cursor: 'pointer', backgroundColor: 'GrayText' }} />
              </div>
              {!avatarUrl ? (
                <Button type="link" onClick={handleUploadClick}>
                  انتخاب عکس جهت نمایش در درخت
                </Button>
              ) : (
                <Button type="link" onClick={handleRemove}>
                  حذف عکس نمایشی
                </Button>
              )}
            </Form.Item>
            <Row gutter={24}>
              <Col xs={24} sm={24} style={{ marginBottom: '20px', color: 'aqua' }}>
                تعریف پدر و مادر برای <span className="label">{props.familyTreePerson?.familyTreePersonName}</span>
              </Col>
              <Col xs={24} sm={12} span={12}>
                <Form.Item name="familyTreePersonName" label="نام پدر/مادر" rules={[{ required: true, message: 'لطفاً نام را وارد کنید!' }]}>
                  <Input className="input" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} span={12}>
                <Form.Item name="wifeName" label="نام همسر">
                  <Input className="input" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} span={12}>
                <Form.Item name="isDeceased">
                  <Select
                    style={{ backgroundColor: '#4a4848a6 !important', fontSize: 'large', minHeight: '40px !important' }}
                    options={[
                      { value: 0, label: 'فوت نشده' },
                      { value: 1, label: 'فوت شده' },
                    ]}
                    dropdownRender={(menu) => <div className="custom-dropdown">{menu}</div>}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {/* <Spin spinning={isLoading}>
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
        </Spin> */}
      </Modal>
    </div>
  );
}
