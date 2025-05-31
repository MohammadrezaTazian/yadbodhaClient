'use client';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { Menu, Spin } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { MenuInfo } from 'rc-menu/lib/interface';

const sideBar = ({ onMenuClick, params }: any) => {
  const { collapseSetter } = params;
  const router = useRouter();
  const path = usePathname();

  const handleMenu = (info: MenuInfo) => {
    try {
      onMenuClick();
      router.replace(info.key);
      collapseSetter();
    } catch (error) {
      errorByMessage(error);
    }
  };

  // const handleMenu = (info: MenuInfo) => {
  //   onMenuClick(); // فراخوانی تابع لودینگ در صفحه اصلی
  //   router.replace(info.key);
  // };

  return (
    <Menu
      theme="light"
      style={{ fontSize: '14px' }}
      mode="inline"
      onClick={handleMenu}
      selectedKeys={[path]}
      items={[
        {
          label: 'صفحه اصلی',
          key: '/',
          style: path === '/' ? { color: 'red', background: 'lightblue' } : {},
        },
        {
          label: 'مشخصات کاربر',
          key: '/profile',
          style: path === '/profile' ? { color: 'red', background: 'lightblue' } : {},
        },
        {
          label: 'اموات ثبت شده',
          key: '/registeredDeceaseds',
          style: path === '/registeredDeceaseds' ? { color: 'red', background: 'lightblue' } : {},
        },
        {
          label: 'اموات قابل نمایش',
          key: '/displayableDeceaseds/general',
          style: path === '/displayableDeceaseds/general' ? { color: 'red', background: 'lightblue' } : {},
        },
        {
          label: 'مشاهده اموات اختصاصی',
          key: '/displayableDeceaseds/private',
          style: path === '/displayableDeceaseds/private' ? { color: 'red', background: 'lightblue' } : {},
        },
        {
          label: 'تعریف شجره نامه',
          key: '/familyTree',
          style: path === '/familyTree' ? { color: 'red', background: 'lightblue' } : {},
        },
        {
          label: 'مشاهده شجره نامه ها',
          key: '/familyTreesDisplay',
          style: path === '/familyTreesDisplay' ? { color: 'red', background: 'lightblue' } : {},
        },
      ]}
    ></Menu>
  );
};

export default sideBar;
