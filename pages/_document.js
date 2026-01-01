import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Pi Network SDK v2.0 */}
          <script src="https://sdk.minepi.com/pi-sdk.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Pi SDK Configuration
                window.piConfig = {
                  appId: '${process.env.NEXT_PUBLIC_PI_APP_ID || "tec-titan-elite-commerce-04d84accdca2487c"}',
                  sandbox: ${process.env.NEXT_PUBLIC_PI_SANDBOX || "true"}
                };
                
                // Pi Sandbox Implementation (immediate fallback)
                window.PiSandbox = function() {
                  this.authenticated = false;
                  this.user = null;
                  this.scopes = [];
                  this.onIncompletePaymentFound = null;
                  this.initialized = false;
                };
                
                window.PiSandbox.prototype.init = function(config) {
                  console.log('🧪 [Sandbox] Initializing with config:', config);
                  this.initialized = true;
                  this.sandbox = config && config.sandbox !== undefined ? config.sandbox : true;
                  return Promise.resolve();
                };
                
                window.PiSandbox.prototype.authenticate = function(scopes, onIncompletePaymentFound) {
                  var self = this;
                  console.log('🧪 [Sandbox] Authenticating with scopes:', scopes);
                  this.authenticated = true;
                  this.scopes = scopes || [];
                  this.onIncompletePaymentFound = onIncompletePaymentFound;
                  this.user = {
                    uid: 'sandbox_user_' + Date.now(),
                    username: 'sandbox_user',
                    wallet_address: null
                  };
                  console.log('✅ [Sandbox] Authentication successful:', this.user);
                  
                  // Simulate checking for incomplete payments (in real SDK this would check Pi Network)
                  // For sandbox, we can optionally trigger this with stored incomplete payments
                  if (typeof onIncompletePaymentFound === 'function') {
                    console.log('🧪 [Sandbox] onIncompletePaymentFound handler registered');
                  }
                  
                  return Promise.resolve({
                    accessToken: 'sandbox_token_' + Date.now(),
                    user: this.user
                  });
                };
                
                window.PiSandbox.prototype.createPayment = function(paymentData, callbacks) {
                  var self = this;
                  console.log('🧪 [Sandbox] Creating payment:', paymentData);
                  
                  if (!self.authenticated) {
                    var error = new Error('User must authenticate first');
                    console.error('❌ [Sandbox]', error.message);
                    if (callbacks.onError) callbacks.onError(error, null);
                    return Promise.reject(error);
                  }
                  
                  if (!self.scopes.includes('payments')) {
                    var error = new Error('Cannot create a payment without "payments" scope');
                    console.error('❌ [Sandbox]', error.message);
                    if (callbacks.onError) callbacks.onError(error, null);
                    return Promise.reject(error);
                  }
                  
                  var paymentId = 'sandbox_payment_' + Date.now();
                  var txid = 'sandbox_txid_' + Date.now();
                  
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
                  var piCheckAttempts = 0;
                  var maxAttempts = 30; // 3 seconds
                  
                  var checkPi = setInterval(function() {
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
                      var authenticatedScopes = [];
                      var isAuthenticated = false;
                      var incompletePaymentHandler = null;
                      
                      window.Pi = {
                        init: function(config) {
                          console.log('🧪 Sandbox: Mock init with config:', config);
                          return Promise.resolve();
                        },
                        authenticate: function(scopes, onIncompletePaymentFound) {
                          console.log('🧪 Sandbox: Mock authentication with scopes:', scopes);
                          authenticatedScopes = scopes || [];
                          isAuthenticated = true;
                          incompletePaymentHandler = onIncompletePaymentFound;
                          if (typeof onIncompletePaymentFound === 'function') {
                            console.log('🧪 Sandbox: onIncompletePaymentFound handler registered');
                          }
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
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
