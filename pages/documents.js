import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        {/* ربط مكتبة Pi Network الرسمية للعمل داخل Pi Browser */}
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
