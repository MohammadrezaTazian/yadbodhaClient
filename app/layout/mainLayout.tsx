'use client';
import './layout.css';
import { Layout } from 'antd';
import HeaderComp from '../(pages)/components/header';
import FooterComp from '../(pages)/components/footer';
import { CSSProperties, useState } from 'react';
import SideBar from '../(pages)/components/sidebar';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;

export const metadata = {
  title: 'یادبودها',
  description: 'یادبود - خاطره ها',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const style: CSSProperties = {
    backgroundColor: '#f0efef',
    minHeight: '99%',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1,
    margin: '0',
  };
  const [collapse, setCollapse] = useState(true);
  const [styleSideBar, setStyleSideBar] = useState(style);
  const pathname = usePathname();
  // const [isLoading, setIsLoading] = useState(false);

  const collapseSetter = () => {
    if (collapse) {
      setCollapse(false);
      style.margin = '5px';
    } else {
      setCollapse(true);
      style.margin = '0';
    }
    setStyleSideBar(style);
  };

  // useEffect(() => {
  //   getUserInfo();
  // }, []);

  // const getUserInfo = async () => {
  //   setIsLoading(true);
  //   try {
  //     if (Cookies.get('access-token')) {
  //       const result: UserInfoModel = await userServices.userInfo();
  //       if (result) {
  //         authContext.setUserInfo(result);
  //       }
  //     }
  //   } catch (error) {
  //     errorByMessage(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleMenuClick = () => {
    //setIsLoading(true);
  };
  return pathname !== '/login' ? (
    <>
      {/* <Spin spinning={isLoading} className="custom-spin"> */}
      <HeaderComp params={{ collapseSetter }} />
      <Layout className="layout">
        <Sider
          collapsible={true}
          collapsedWidth={0}
          style={styleSideBar}
          width={'300px'}
          className="sidebar"
          breakpoint="md"
          trigger={null}
          collapsed={collapse}
        >
          <SideBar params={{ collapseSetter }} onMenuClick={handleMenuClick} />
        </Sider>

        <Content className="contents" onClick={() => !collapse && collapseSetter()}>
          {children}
        </Content>
      </Layout>
      <FooterComp />
      {/* </Spin> */}
    </>
  ) : (
    <>
      {/* <Spin spinning={isLoading} className="custom-spin"> */}
      <Layout className="layout">
        <Sider
          collapsible={true}
          collapsedWidth={0}
          style={styleSideBar}
          width={'300px'}
          className="sidebar"
          breakpoint="md"
          trigger={null}
          collapsed={collapse}
        >
          <SideBar params={{ collapseSetter }} />
        </Sider>

        <Content onClick={() => !collapse && collapseSetter()}>{children}</Content>
      </Layout>
      {/* </Spin> */}
    </>
  );
}
