'use client';
'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Avatar, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile as AntUploadFile, RcFile } from 'antd/es/upload/interface';

interface UserFormValues {
  firstName: string;
  lastName: string;
}

interface UploadFile extends AntUploadFile {
  originFileObj?: RcFile;
}

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

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
    const file = e.target.files?.[0]; // دریافت فایل انتخابی

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

  const handleSubmit = async (values: UserFormValues) => {
    const formData = new FormData();

    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);

    if (fileList.length > 0) {
      formData.append('profilePicture', fileList[0].originFileObj as RcFile);
    }

    try {
      console.log('formData:', formData);
      const response = await fetch('http://localhost:7210/api/authentication/Authenticate/create', {
        method: 'POST',
        headers: {
          //"Content-Type": "multipart/form-data",
          Authorization:
            'Bearer ' +
            'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InppYXlpIiwiZUlEIjoiMTU5MiIsInVzZXJJZCI6Ijk0MDQiLCJleHAiOjE3MzM2NDg2OTIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzI0MSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzA3NiJ9.kgzFVJgKc_TOd4PGaTW3AqFgGplcgDzU4Hq-junxFB8',
        },
        body: formData,
      });
      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message
        console.error('Error response:', errorMessage); // Log error response
        message.error('خطا در ثبت اطلاعات: ' + errorMessage);
        return;
      }

      if (response.ok) {
        message.success('اطلاعات با موفقیت ثبت شد.');
      } else {
        message.error('خطا در ثبت اطلاعات.');
      }
    } catch (error) {
      message.error('خطا در ارسال درخواست.');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="نام" name="firstName" rules={[{ required: true, message: 'لطفا نام را وارد کنید!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="نام خانوادگی" name="lastName" rules={[{ required: true, message: 'لطفا نام خانوادگی را وارد کنید!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="عکس پروفایل">
        {/* Input برای بارگذاری عکس */}
        <input
          type="file"
          accept="image/*"
          id="avatar-uploader"
          style={{ display: 'none' }} // مخفی کردن input
          onChange={handleFileSelection} // تابع انتخاب فایل
        />
        {/* آواتار، که بر روی آن کلیک می‌شود */}
        <div onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
          <Avatar src={avatarUrl} size={100} />
        </div>
        {avatarUrl && (
          <Button type="link" onClick={handleRemove}>
            حذف آواتار
          </Button>
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          ثبت
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
