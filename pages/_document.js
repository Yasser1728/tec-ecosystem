import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Pi Network SDK v2.0 */}
          <script 
            src="https://sdk.minepi.com/pi-sdk.js" 
            async
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.Pi = window.Pi || {};
                window.Pi.init = function() {
                  console.log('Pi SDK initialized with App ID: ${process.env.NEXT_PUBLIC_PI_APP_ID || 'tec-titan-elite-commerce-04d84accdca2487c'}');
                };
              `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
