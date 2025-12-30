// Jest setup file
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
  push: jest.fn(),
}));

// Mock Next.js head
jest.mock("next/head", () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>;
    },
  };
});

// Mock next-auth (only if module exists)
try {
  jest.mock("next-auth/react", () => ({
    useSession: jest.fn(() => ({
      data: null,
      status: "unauthenticated",
    })),
    getSession: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }));
} catch (e) {
  // Module doesn't exist, skip mock
}

// Mock window.Pi for Pi Network SDK
if (typeof window !== "undefined") {
  window.Pi = {
    createPayment: jest.fn(),
    authenticate: jest.fn(),
    init: jest.fn(),
  };
}

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
