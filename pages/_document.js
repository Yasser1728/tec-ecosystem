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
                
                // Detect if we're in Pi Browser or should use real Pi SDK
                // Real Pi SDK should be used when:
                // 1. Running on deployed URL (not localhost)
                // 2. Running in Pi Browser app
                // 3. In testnet/production mode
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                
                // For localhost: Use local mock (fast testing without Pi Browser)
                // For deployed URLs: Use real Pi SDK (proper Pi Network integration)
                const shouldUseRealSDK = !isLocalhost;
                
                console.log('🔍 Environment detection:', {
                  hostname: window.location.hostname,
                  isLocalhost: isLocalhost,
                  shouldUseRealSDK: shouldUseRealSDK,
                  sandboxMode: window.piConfig.sandbox
                });
                
                // Pi Sandbox Implementation (local development fallback only)
                window.PiSandbox = function() {
                  this.authenticated = false;
                  this.user = null;
                  this.scopes = [];
                };
                
                window.PiSandbox.prototype.init = function(config) {
                  console.log('🧪 [Local Mock] Initializing with config:', config);
                  this.config = config || { version: "2.0", sandbox: true };
                  console.log('✅ [Local Mock] Pi SDK initialized (local dev mode)');
                  return Promise.resolve();
                };
                
                window.PiSandbox.prototype.authenticate = function(scopes, onIncompletePaymentFound) {
                  console.log('🧪 [Local Mock] Authenticating with scopes:', scopes);
                  this.authenticated = true;
                  this.scopes = scopes || [];
                  this.user = {
                    uid: 'sandbox_user_' + generateSecureId(),
                    username: 'sandbox_user',
                    wallet_address: null
                  };
                  console.log('✅ [Local Mock] Authentication successful:', this.user);
                  return Promise.resolve({
                    accessToken: 'sandbox_token_' + generateSecureId(),
                    user: this.user
                  });
                };
                
                window.PiSandbox.prototype.createPayment = function(paymentData, callbacks) {
                  const self = this;
                  console.log('🧪 [Local Mock] Creating payment:', paymentData);
                  
                  if (!self.authenticated) {
                    const error = new Error('User must authenticate first');
                    console.error('❌ [Local Mock]', error.message);
                    if (callbacks.onError) callbacks.onError(error, null);
                    return Promise.reject(error);
                  }
                  
                  if (!self.scopes.includes('payments')) {
                    const error = new Error('Cannot create a payment without "payments" scope');
                    console.error('❌ [Local Mock]', error.message);
                    if (callbacks.onError) callbacks.onError(error, null);
                    return Promise.reject(error);
                  }
                  
                  const paymentId = 'sandbox_payment_' + generateSecureId();
                  const txid = 'sandbox_txid_' + generateSecureId();
                  
                  setTimeout(function() {
                    console.log('✅ [Local Mock] Payment ready for approval:', paymentId);
                    if (callbacks.onReadyForServerApproval) {
                      callbacks.onReadyForServerApproval(paymentId);
                    }
                  }, 1000);
                  
                  setTimeout(function() {
                    console.log('✅ [Local Mock] Payment completed:', { paymentId: paymentId, txid: txid });
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
                
                // Only use local mock in local development
                if (!shouldUseRealSDK) {
                  console.log('🧪 Using local mock (localhost development)');
                  window.Pi = new window.PiSandbox();
                  window.piSandboxMode = true;
                  console.log('✅ Local Pi mock ready');
                } else {
                  // Wait for real Pi SDK to load (testnet/production)
                  console.log('⏳ Waiting for real Pi SDK to load (testnet/production)...');
                  window.piSandboxMode = false;
                  
                  (function() {
                    const SDK_LOAD_TIMEOUT_MS = 10000; // Total timeout: 10 seconds
                    const POLL_INTERVAL_MS = 100; // Check every 100ms
                    const maxAttempts = Math.floor(SDK_LOAD_TIMEOUT_MS / POLL_INTERVAL_MS); // Integer division
                    let piCheckAttempts = 0;
                    
                    const checkPi = setInterval(function() {
                      piCheckAttempts++;
                      
                      // Check if real Pi SDK loaded from external script
                      if (window.Pi && typeof window.Pi.init === 'function') {
                        clearInterval(checkPi);
                        console.log('✅ Real Pi SDK loaded successfully (attempt ' + piCheckAttempts + ')');
                        console.log('📱 Initializing with App ID:', window.piConfig.appId);
                        console.log('🔧 Sandbox mode:', window.piConfig.sandbox);
                        
                        try {
                          // Initialize the real Pi SDK
                          window.Pi.init({ version: "2.0", sandbox: window.piConfig.sandbox })
                            .then(function() {
                              console.log('✅ Pi SDK initialized successfully');
                            })
                            .catch(function(e) {
                              console.error('❌ Pi SDK initialization failed:', e);
                            });
                        } catch (e) {
                          console.error('❌ Pi SDK init error:', e);
                        }
                        return;
                      }
                      
                      if (piCheckAttempts >= maxAttempts) {
                        clearInterval(checkPi);
                        console.error('❌ Pi SDK failed to load after ' + (SDK_LOAD_TIMEOUT_MS / 1000) + ' seconds');
                        console.error('⚠️ This may cause payment functionality to fail');
                        console.error('💡 Ensure you are running in Pi Browser or the Pi SDK script loaded correctly');
                      }
                    }, 100);
                  })();
                }
              `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* 
          Load Pi SDK eagerly in production/testnet to ensure it's ready before payments.
          Uses afterInteractive to not block initial page load, but loads as soon as page is interactive.
          In localhost dev, the local mock is used instead (see inline script above).
        */}
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
          onLoad={() => console.log('📦 Pi SDK script loaded')}
          onError={(e) => console.error('❌ Pi SDK script failed to load:', e)}
        />
      </body>
    </Html>
  );
}
