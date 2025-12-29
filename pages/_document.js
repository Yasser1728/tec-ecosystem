import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Pi Network SDK v2.0 */}
          <script 
            src="https://sdk.minepi.com/pi-sdk.js"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Pi SDK Configuration
                window.piConfig = {
                  appId: '${process.env.NEXT_PUBLIC_PI_APP_ID || 'tec-titan-elite-commerce-04d84accdca2487c'}',
                  sandbox: ${process.env.NEXT_PUBLIC_PI_SANDBOX || 'true'}
                };
                
                // Initialize Pi SDK when loaded
                (function() {
                  var checkPi = setInterval(function() {
                    if (window.Pi) {
                      clearInterval(checkPi);
                      console.log('✅ Pi SDK loaded successfully');
                      console.log('📱 App ID:', window.piConfig.appId);
                      console.log('🧪 Sandbox Mode:', window.piConfig.sandbox);
                      
                      // Initialize Pi SDK
                      if (window.Pi.init) {
                        window.Pi.init({ version: "2.0", sandbox: window.piConfig.sandbox });
                      }
                    }
                  }, 100);
                  
                  // Timeout after 10 seconds
                  setTimeout(function() {
                    clearInterval(checkPi);
                    if (!window.Pi) {
                      console.warn('⚠️ Pi SDK not loaded. Using sandbox mode.');
                      // Create mock Pi object for sandbox
                      window.Pi = {
                        authenticate: function(scopes, onIncompletePaymentFound) {
                          console.log('🧪 Sandbox: Mock authentication');
                          return Promise.resolve({
                            accessToken: 'sandbox_token',
                            user: {
                              uid: 'sandbox_user_' + Date.now(),
                              username: 'sandbox_user',
                              wallet_address: null
                            }
                          });
                        },
                        createPayment: function(paymentData, callbacks) {
                          console.log('🧪 Sandbox: Mock payment', paymentData);
                          setTimeout(function() {
                            if (callbacks.onReadyForServerApproval) {
                              callbacks.onReadyForServerApproval('sandbox_payment_' + Date.now());
                            }
                          }, 1000);
                          setTimeout(function() {
                            if (callbacks.onReadyForServerCompletion) {
                              callbacks.onReadyForServerCompletion('sandbox_payment_' + Date.now(), 'sandbox_txid_' + Date.now());
                            }
                          }, 2000);
                          return Promise.resolve({ identifier: 'sandbox_payment_' + Date.now() });
                        }
                      };
                    }
                  }, 10000);
                })();
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
