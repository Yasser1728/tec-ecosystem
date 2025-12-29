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
                  var piCheckAttempts = 0;
                  var maxAttempts = 100; // 10 seconds
                  
                  var checkPi = setInterval(function() {
                    piCheckAttempts++;
                    
                    if (window.Pi) {
                      clearInterval(checkPi);
                      console.log('✅ Pi SDK loaded successfully (attempt ' + piCheckAttempts + ')');
                      console.log('📱 App ID:', window.piConfig.appId);
                      console.log('🧪 Sandbox Mode:', window.piConfig.sandbox);
                      
                      // Initialize Pi SDK
                      try {
                        if (window.Pi.init) {
                          window.Pi.init({ version: "2.0", sandbox: window.piConfig.sandbox });
                          console.log('✅ Pi SDK initialized');
                        }
                      } catch (e) {
                        console.warn('⚠️ Pi SDK init failed:', e);
                      }
                    }
                    
                    if (piCheckAttempts >= maxAttempts) {
                      clearInterval(checkPi);
                      console.warn('⚠️ Pi SDK check timeout after ' + piCheckAttempts + ' attempts');
                    }
                  }, 100);
                  
                  // Timeout after 10 seconds
                  setTimeout(function() {
                    clearInterval(checkPi);
                    if (!window.Pi) {
                      console.warn('⚠️ Pi SDK not loaded. Using sandbox mode.');
                      // Create mock Pi object for sandbox
                      var authenticatedScopes = [];
                      var isAuthenticated = false;
                      
                      window.Pi = {
                        authenticate: function(scopes, onIncompletePaymentFound) {
                          console.log('🧪 Sandbox: Mock authentication with scopes:', scopes);
                          authenticatedScopes = scopes || [];
                          isAuthenticated = true;
                          return Promise.resolve({
                            accessToken: 'sandbox_token_' + Date.now(),
                            user: {
                              uid: 'sandbox_user_' + Date.now(),
                              username: 'sandbox_user',
                              wallet_address: null
                            }
                          });
                        },
                        createPayment: function(paymentData, callbacks) {
                          // Check if authenticated with payments scope
                          if (!isAuthenticated) {
                            console.error('❌ Sandbox: Not authenticated');
                            return Promise.reject(new Error('User must authenticate first'));
                          }
                          if (!authenticatedScopes.includes('payments')) {
                            console.error('❌ Sandbox: Missing payments scope');
                            return Promise.reject(new Error('Cannot create a payment without "payments" scope'));
                          }
                          
                          console.log('🧪 Sandbox: Mock payment', paymentData);
                          var paymentId = 'sandbox_payment_' + Date.now();
                          var txid = 'sandbox_txid_' + Date.now();
                          
                          setTimeout(function() {
                            if (callbacks.onReadyForServerApproval) {
                              callbacks.onReadyForServerApproval(paymentId);
                            }
                          }, 1000);
                          setTimeout(function() {
                            if (callbacks.onReadyForServerCompletion) {
                              callbacks.onReadyForServerCompletion(paymentId, txid);
                            }
                          }, 2000);
                          return Promise.resolve({ identifier: paymentId });
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
