import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import MainLayout from './layout/mainLayout';
import { AuthProvider } from './contexts/AuthProvider';
import 'leaflet/dist/leaflet.css';
import faIR from 'antd/lib/locale/fa_IR';

export const metadata: Metadata = {
  title: 'یادبود',
  description: 'یادبودها',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>یادبودها</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={faIR}
            theme={{
              token: {
                fontFamily: 'IRANSansNum',
              },
            }}
          >
            <AuthProvider>
              <MainLayout>{children}</MainLayout>
            </AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
