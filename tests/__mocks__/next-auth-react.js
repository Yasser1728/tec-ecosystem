// Mock for next-auth/react
module.exports = {
  getSession: jest.fn(() => Promise.resolve(null)),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
};
