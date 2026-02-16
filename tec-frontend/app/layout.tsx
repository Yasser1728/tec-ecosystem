import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'TEC App — The Elite Consortium',
  description: 'بوابتك إلى منظومة TEC — 24 تطبيق في عالم واحد',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="beforeInteractive" />
        <Script id="pi-init" strategy="beforeInteractive">
          {`Pi.init({ version: "2.0", sandbox: ${process.env.NODE_ENV !== 'production'} });`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
