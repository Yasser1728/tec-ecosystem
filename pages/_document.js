import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Pi Network SDK v2.0 - loaded asynchronously via next/script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                // Pi SDK Configuration
                window.piConfig = {
                  appId: '${process.env.NEXT_PUBLIC_PI_APP_ID || "tec-titan-elite-commerce-04d84accdca2487c"}',
                  sandbox: ${JSON.stringify(process.env.NEXT_PUBLIC_PI_SANDBOX === "true")}
                };
                
                console.log('🌐 Pi SDK Config:', window.piConfig);
                
                // Secure random ID generator helper
                function generateSecureId() {
                  const array = new Uint8Array(16);
                  crypto.getRandomValues(array);
                  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
                }
                
                // Pi Sandbox Implementation (immediate fallback)
                window.PiSandbox = function() {
                  this.authenticated = false;
                  this.user = null;
                  this.scopes = [];
                };
                
                window.PiSandbox.prototype.init = function(config) {
                  console.log('🧪 [Sandbox] Initializing with config:', config);
                  this.config = config || { version: "2.0", sandbox: true };
                  console.log('✅ [Sandbox] Pi SDK initialized (sandbox mode)');
                  return Promise.resolve();
                };
                
                window.PiSandbox.prototype.authenticate = function(scopes, onIncompletePaymentFound) {
                  console.log('🧪 [Sandbox] Authenticating with scopes:', scopes);
                  this.authenticated = true;
                  this.scopes = scopes || [];
                  this.user = {
                    uid: 'sandbox_user_' + generateSecureId(),
                    username: 'sandbox_user',
                    wallet_address: null
                  };
                  console.log('✅ [Sandbox] Authentication successful:', this.user);
                  return Promise.resolve({
                    accessToken: 'sandbox_token_' + generateSecureId(),
                    user: this.user
                  });
                };
                
                window.PiSandbox.prototype.createPayment = function(paymentData, callbacks) {
                  const self = this;
                  console.log('🧪 [Sandbox] Creating payment:', paymentData);
                  
                  if (!self.authenticated) {
                    const error = new Error('User must authenticate first');
                    console.error('❌ [Sandbox]', error.message);
                    if (callbacks.onError) callbacks.onError(error, null);
                    return Promise.reject(error);
                  }
                  
                  if (!self.scopes.includes('payments')) {
                    const error = new Error('Cannot create a payment without "payments" scope');
                    console.error('❌ [Sandbox]', error.message);
                    if (callbacks.onError) callbacks.onError(error, null);
                    return Promise.reject(error);
                  }
                  
                  const paymentId = 'sandbox_payment_' + generateSecureId();
                  const txid = 'sandbox_txid_' + generateSecureId();
                  
                  setTimeout(function() {
                    console.log('✅ [Sandbox] Payment ready for approval:', paymentId);
                    if (callbacks.onReadyForServerApproval) {
                      callbacks.onReadyForServerApproval(paymentId);
                    }
                  }, 1000);
                  
                  setTimeout(function() {
                    console.log('✅ [Sandbox] Payment completed:', { paymentId: paymentId, txid: txid });
                    if (callbacks.onReadyForServerCompletion) {
                      callbacks.onReadyForServerCompletion(paymentId, txid);
                    }
                  }, 2000);
                  
                  return Promise.resolve({
                    identifier: paymentId,
                    amount: paymentData.amount,
                    memo: paymentData.memo,
                    metadata: paymentData.metadata
                  });
                };
                
                // Initialize sandbox immediately
                console.log('🧪 Initializing Pi Sandbox...');
                window.Pi = new window.PiSandbox();
                window.piSandboxMode = true;
                console.log('✅ Pi Sandbox ready');
                
                // Try to load real Pi SDK (will override if available)
                (function() {
                  let piCheckAttempts = 0;
                  const maxAttempts = 30; // 3 seconds
                  
                  const checkPi = setInterval(function() {
                    piCheckAttempts++;
                    
                    // Check if real Pi SDK loaded (has different structure than our sandbox)
                    if (window.Pi && window.Pi.constructor.name !== 'PiSandbox') {
                      clearInterval(checkPi);
                      console.log('✅ Real Pi SDK loaded (attempt ' + piCheckAttempts + ')');
                      console.log('📱 App ID:', window.piConfig.appId);
                      window.piSandboxMode = false;
                      
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
                      console.log('🧪 Using Sandbox mode (Pi SDK not detected)');
                    }
                  }, 100);
                  
                  // Timeout after 10 seconds
                  setTimeout(function() {
                    clearInterval(checkPi);
                    if (!window.Pi) {
                      console.warn('⚠️ Pi SDK not loaded. Using sandbox mode.');
                      // Create mock Pi object for sandbox
                      let authenticatedScopes = [];
                      let isAuthenticated = false;
                      
                      window.Pi = {
                        init: function(config) {
                          console.log('🧪 Sandbox: Mock init with config:', config);
                          return Promise.resolve();
                        },
                        authenticate: function(scopes, onIncompletePaymentFound) {
                          console.log('🧪 Sandbox: Mock authentication with scopes:', scopes);
                          authenticatedScopes = scopes || [];
                          isAuthenticated = true;
                          return Promise.resolve({
                            accessToken: 'sandbox_token_' + generateSecureId(),
                            user: {
                              uid: 'sandbox_user_' + generateSecureId(),
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
                          var paymentId = 'sandbox_payment_' + generateSecureId();
                          var txid = 'sandbox_txid_' + generateSecureId();
                          
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
              `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
        />
      </body>
    </Html>
  );
}
