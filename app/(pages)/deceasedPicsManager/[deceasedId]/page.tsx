'use client';
import { Button, message, Upload, Image, Row, Col, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import './deceasedPicsManager.css';
import { DeleteOutlined, LeftOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { deceasedServices } from '@/app/services/deceasedServices';
import { PicFileModel } from '@/app/models/Deceased/picFileModel';
import api, { getAccessToken, getUrlToken } from '@/app/services/api';
import { fileManagerServices } from '@/app/services/fileManagerServices';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { DeceasedInfoModel } from '@/app/models/Deceased/DeceasedInfoModel';
import { useRouter } from 'next/navigation';

export default function DeceasedPicsManager({ params }: any) {
  const [fileList, setFileList] = useState<PicFileModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [deceasedInfo, setDeceasedInfo] = useState<DeceasedInfoModel>();
  useEffect(() => {
    getDeceasedInfo();
    getDeceasedPicsInfo();
  }, []);

  const getDeceasedPicsInfo = async () => {
    setIsLoading(true);
    try {
      const result: PicFileModel[] = await fileManagerServices.getDeceasedPicsList(params.deceasedId);
      console.log('result', result);
      if (result) {
        if (result) {
          setFileList(result);
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
        setDeceasedInfo(result);
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

  const handleRemove = async (fileId: number) => {
    try {
      await fileManagerServices.DeceasedPicDelete(fileId); // add
      getDeceasedPicsInfo();
    } catch (error) {
      console.error(error);
    }
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append('picFile', file); // Assuming your backend expects the file field to be named 'file'
    try {
      await deceasedServices.DeceasedPicAddDelete(formData, params.deceasedId, false); // add
      getDeceasedPicsInfo();
    } catch (error) {
      console.error(error);
      onError(error); // Call onError if an error occurs
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
    <div className="container">
      {contextHolder}
      <div style={{ padding: '20px' }}>
        {deceasedInfo?.deceasedFullName && (
          <div style={{ color: 'white', textAlign: 'right', paddingBottom: '10px' }}>
            تصاویر ثبت شده برای <span style={{ color: 'beige', fontWeight: 'bold' }}>{deceasedInfo?.deceasedFullName}</span>
          </div>
        )}
        <Upload
          customRequest={customRequest} // Use customRequest to handle file upload
          showUploadList={false}
          beforeUpload={(file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            if (!isJpgOrPng) {
              message.error('فقط فایلهای jpeg و png و jpg را می توانید ارسال کنید');
            }
            return isJpgOrPng;
          }}
        >
          <Button className="button" icon={<UploadOutlined style={{ marginLeft: '5px' }} />}>
            ارسال عکس
          </Button>
        </Upload>
        <Button
          type="primary"
          loading={isLoading}
          icon={<LeftOutlined />}
          style={{ marginRight: '5px', height: '40px' }}
          onClick={() => handleNavigation('/registeredDeceaseds')}
        ></Button>
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <Row gutter={[10, 10]}>
            {fileList.length > 0 &&
              fileList.map((file) => (
                <Col key={file.fileId} style={{ position: 'relative' }} xs={24} sm={12} md={8} lg={6}>
                  <Image
                    src={
                      'http://localhost:7210/api/fileManager/imageFile/' +
                      encodeURIComponent(file.fileUrl!) +
                      '/' +
                      encodeURIComponent(file.fileGUIDName!)
                    }
                    alt={file.altName!}
                    style={{ borderRadius: '8px', margin: '5px', cursor: 'pointer' }}
                  />
                  <Popconfirm
                    title="آیا مطمئن به حذف عکس مورد نظر می باشید؟"
                    placement="topRight"
                    onConfirm={() => handleRemove(file.fileId!)}
                    cancelButtonProps={{ size: 'middle' }}
                    okButtonProps={{ size: 'middle' }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        cursor: 'pointer',
                        color: 'red',
                      }}
                    >
                      <DeleteOutlined />
                    </div>
                  </Popconfirm>
                </Col>
              ))}
          </Row>
        </div>
      </div>
    </div>
  );
}
