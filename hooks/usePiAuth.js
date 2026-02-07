/**
 * usePiAuth Hook (UI-only)
 * Centralizes Pi Network authentication state for UI rendering.
 * 
 * READS ONLY — Does NOT modify payment logic, auth logic, or Pi SDK.
 * Provides auth state, wallet info, network mode, and payment readiness
 * for conditional UI rendering across components.
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Auth UI States
 * STATE_A: Logged Out
 * STATE_B: Loading (connecting)
 * STATE_C: Logged In
 * STATE_D: Pi SDK Missing
 */
export const AUTH_STATES = {
  LOGGED_OUT: "LOGGED_OUT",
  LOADING: "LOADING",
  LOGGED_IN: "LOGGED_IN",
  SDK_MISSING: "SDK_MISSING",
};

/**
 * Payment Status States
 * MAINNET_READY: Real Pi payments available
 * TEST_MODE: Sandbox/testnet mode
 * CONNECTION_FAILED: Pi SDK failed to connect
 * WALLET_MISSING: No wallet address
 */
export const PAYMENT_STATUS = {
  MAINNET_READY: "MAINNET_READY",
  TEST_MODE: "TEST_MODE",
  CONNECTION_FAILED: "CONNECTION_FAILED",
  WALLET_MISSING: "WALLET_MISSING",
};

export function usePiAuth() {
  const [authState, setAuthState] = useState(AUTH_STATES.LOGGED_OUT);
  const [user, setUser] = useState(null);
  const [piAvailable, setPiAvailable] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.CONNECTION_FAILED);

  // Check Pi SDK availability
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPiSDK = () => {
      if (window.Pi) {
        setPiAvailable(true);
      } else {
        setPiAvailable(false);
        setAuthState(AUTH_STATES.SDK_MISSING);
      }
    };

    checkPiSDK();
    const timer = setTimeout(checkPiSDK, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Derive payment status from auth state + environment
  useEffect(() => {
    if (!piAvailable) {
      setPaymentStatus(PAYMENT_STATUS.CONNECTION_FAILED);
      return;
    }

    if (!user) {
      setPaymentStatus(PAYMENT_STATUS.CONNECTION_FAILED);
      return;
    }

    if (!user.walletAddress) {
      setPaymentStatus(PAYMENT_STATUS.WALLET_MISSING);
      return;
    }

    // Check if sandbox/testnet mode
    const isSandbox =
      typeof window !== "undefined" && window.piSandboxMode === true;
    const envSandbox =
      typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

    if (isSandbox || envSandbox) {
      setPaymentStatus(PAYMENT_STATUS.TEST_MODE);
    } else {
      setPaymentStatus(PAYMENT_STATUS.MAINNET_READY);
    }
  }, [piAvailable, user]);

  // Check if user session expired (auto-logout detection)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (authState !== AUTH_STATES.LOGGED_IN) return;

    const checkSession = () => {
      // If Pi SDK becomes unavailable, trigger logout
      if (!window.Pi) {
        setAuthState(AUTH_STATES.LOGGED_OUT);
        setUser(null);
      }
    };

    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, [authState]);

  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setAuthState(AUTH_STATES.LOGGED_IN);
  }, []);

  const handleAuthError = useCallback(() => {
    setAuthState(AUTH_STATES.LOGGED_OUT);
    setUser(null);
  }, []);

  const handleAuthLoading = useCallback(() => {
    setAuthState(AUTH_STATES.LOADING);
  }, []);

  const handleSignOut = useCallback(() => {
    setUser(null);
    setAuthState(AUTH_STATES.LOGGED_OUT);
  }, []);

  const isMainnetReady = paymentStatus === PAYMENT_STATUS.MAINNET_READY;
  const isTestMode = paymentStatus === PAYMENT_STATUS.TEST_MODE;
  const isLoggedIn = authState === AUTH_STATES.LOGGED_IN;
  const canPay = isLoggedIn && (isMainnetReady || isTestMode);

  return {
    authState,
    user,
    piAvailable,
    paymentStatus,
    isMainnetReady,
    isTestMode,
    isLoggedIn,
    canPay,
    handleAuthSuccess,
    handleAuthError,
    handleAuthLoading,
    handleSignOut,
  };
}

export default usePiAuth;
