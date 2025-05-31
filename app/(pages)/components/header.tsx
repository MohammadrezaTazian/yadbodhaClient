'use client';
import { Layout, Row, Col, Image, Button, Dropdown, Divider } from 'antd';
import logoImage from '@/public/images/logo.png';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import React, { CSSProperties, useContext } from 'react';
import { AuthContext } from '@/app/contexts/AuthProvider';

const { Header } = Layout;

const triggerStyle: CSSProperties = {
  fontSize: 'clamp(30px, 8vw, 45px)',
  padding: '0',
  color: 'rgba(0, 0, 0, 0.8)',
  background: 'transparent',
};
const header = ({ params }: any) => {
  const { collapseSetter } = params;
  const authContext = useContext(AuthContext);

  return (
    <Header className="header" style={{ background: 'white' }}>
      <Row align="middle">
        <Col style={{ display: 'flex', verticalAlign: 'middle' }}>
          <Button onClick={collapseSetter} style={triggerStyle} type="text">
            <MenuOutlined />
          </Button>
        </Col>
        <Col className="header-logo">
          <Image
            style={{ width: 'clamp(40px, 11vw, 65px)', margin: '5px 0' }}
            height={'auto'}
            src={logoImage.src}
            preview={false}
            alt="Motorsazan Logo"
            className="header-logo-img"
          />
        </Col>
        <Col flex={'1 1 auto'} className="header-title">
          <h3>یادبودها</h3>
        </Col>
        <Col flex={'40px'} style={{ display: 'flex', verticalAlign: 'middle' }}>
          <Dropdown
            dropdownRender={() => (
              <Row
                justify="center"
                style={{
                  background: '#fff',
                  width: '150px',
                  padding: '20px 10px',
                  borderRadius: '10px',
                  boxShadow: '0.1em 0.1em 0.8em rgba(124, 124, 124, 0.4)',
                }}
              >
                <UserOutlined />
                {authContext.userInfo && authContext.userInfo.fullName !== null && `${authContext.userInfo.fullName}`}
                <Divider style={{ margin: '10px' }} />
                <Button type="dashed" onClick={() => authContext.logout()}>
                  خروج
                </Button>
              </Row>
            )}
          >
            <UserOutlined style={{ fontSize: '30px', verticalAlign: 'middle' }} />
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

export default header;
