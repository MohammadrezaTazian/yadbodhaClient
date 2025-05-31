'use client';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Image, Modal, message, Button } from 'antd';
import './deceasedPics.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { DeceasedInfoModel } from '@/app/models/Deceased/DeceasedInfoModel';
import { deceasedServices } from '@/app/services/deceasedServices';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { PicFileModel } from '@/app/models/Deceased/picFileModel';
import { fileManagerServices } from '@/app/services/fileManagerServices';
import { useRouter } from 'next/navigation';

const deceasedPics: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [deceasedInfo, setDeceasedInfo] = useState<DeceasedInfoModel>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState<string | null>();
  const [fileList, setFileList] = useState<PicFileModel[]>([]);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setDisplay(searchParams.get('display'));
    getDeceasedInfo(Number(searchParams.get('id')));
    getDeceasedPicsInfo(Number(searchParams.get('id')));
  }, []);

  const getDeceasedInfo = async (deceasedId: number) => {
    try {
      setIsLoading(true);
      const result = await deceasedServices.getDeceasedInfo(deceasedId);
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

  const getDeceasedPicsInfo = async (deceasedId: number) => {
    setIsLoading(true);
    try {
      const result: PicFileModel[] = await fileManagerServices.getDeceasedPicsList(deceasedId);
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

  const showImage = (index: number) => {
    console.log(index);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setCurrentIndex(null);
  };

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex !== null && prevIndex + 1 < fileList.length ? prevIndex + 1 : 0));
  };

  const goToPreviousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : fileList.length - 1));
  };

  return (
    <div style={{ padding: '20px' }} className="displayable-container">
      <Card
        title={
          <>
            تصاویر ثبت شده برای <span style={{ color: 'Highlight', fontWeight: 'bold' }}>{deceasedInfo?.deceasedFullName}</span>
            <Button
              type="primary"
              loading={isLoading}
              icon={<LeftOutlined />}
              style={{ marginRight: '5px', height: '30px', float: 'inline-end' }}
              onClick={async () => {
                setIsLoading(true);
                display === '1' ? await router.replace(`/displayableDeceaseds/general`) : await router.replace(`/displayableDeceaseds/private`);
              }}
            ></Button>
          </>
        }
        bordered={false}
        style={{ borderRadius: '8px' }}
      >
        <Row gutter={16}>
          {fileList.length > 0 ? (
            fileList.map((file, index) => (
              <Col key={file.fileId} style={{ position: 'relative' }} xs={24} sm={12} md={8} lg={6}>
                <Image
                  src={
                    'http://localhost:7210/api/fileManager/imageFile/' +
                    encodeURIComponent(file.fileUrl!) +
                    '/' +
                    encodeURIComponent(file.fileGUIDName!)
                  }
                  alt={file.altName!}
                  preview={false}
                  onClick={() => showImage(index)}
                  style={{ borderRadius: '8px', margin: '5px', cursor: 'pointer' }}
                />
              </Col>
            ))
          ) : (
            <Col span={24} className="col-dead-info dead-info">
              موردی یافت نشد
            </Col>
          )}
        </Row>
      </Card>

      <Modal open={currentIndex !== null} onCancel={handleClose} footer={null} width={800} style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Image
            src={
              currentIndex !== null && fileList
                ? 'http://localhost:7210/api/fileManager/imageFile/' +
                  encodeURIComponent(fileList[currentIndex].fileUrl!) +
                  '/' +
                  encodeURIComponent(fileList[currentIndex].fileGUIDName!)
                : ''
            }
            alt={`Image ${currentIndex !== null ? currentIndex + 1 : ''}`}
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', cursor: 'default' }}
            preview={false}
          />
          <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} onClick={goToPreviousImage}>
            <LeftOutlined style={{ fontSize: '36px', color: 'black', cursor: 'pointer' }} />
          </div>
          <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} onClick={goToNextImage}>
            <RightOutlined style={{ fontSize: '36px', color: 'black', cursor: 'pointer' }} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default deceasedPics;
