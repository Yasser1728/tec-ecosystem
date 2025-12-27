// Jest setup file
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
  push: jest.fn(),
}));

// Mock Next.js head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>;
    },
  };
});

// Mock next-auth (virtual mock since package may not be installed)
jest.mock(
  'next-auth/react',
  () => ({
    useSession: jest.fn(() => ({
      data: null,
      status: 'unauthenticated',
    })),
    getSession: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
  { virtual: true }
);

// Filter console output to suppress only known library warnings
// while preserving application-specific logs
const originalWarn = console.warn;
const originalError = console.error;

// Suppress specific React and testing library warnings
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const message = args[0]?.toString() || '';
    // Only suppress known library warnings
    if (
      message.includes('ReactDOMTestUtils.act') ||
      message.includes('componentWillReceiveProps') ||
      message.includes('componentWillUpdate')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  });

  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const message = args[0]?.toString() || '';
    // Only suppress known library errors
    if (
      message.includes('Warning: ReactDOM.render') ||
      message.includes('Warning: An update to')
    ) {
      return;
    }
    originalError.apply(console, args);
  });
});

afterAll(() => {
  console.warn.mockRestore?.();
  console.error.mockRestore?.();
});
