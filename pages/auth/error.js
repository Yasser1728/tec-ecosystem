import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  AccountInactive: 'Your account is inactive. Please contact support.',
  Default: 'An error occurred during authentication.',
};

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <>
      <Head>
        <title>Authentication Error - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent cursor-pointer">
                TEC Ecosystem
              </h1>
            </Link>
          </div>

          {/* Error Card */}
          <div className="bg-gray-800 border border-red-500/50 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Authentication Error
              </h2>
              <p className="text-gray-400">{errorMessage}</p>
            </div>

            {/* Error Code */}
            {error && (
              <div className="mb-6 p-4 bg-gray-900 rounded-lg">
                <p className="text-gray-500 text-xs text-center">
                  Error Code: <span className="text-red-400">{error}</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="block w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center"
              >
                Try Again
              </Link>

              <Link
                href="/"
                className="block w-full border border-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 text-center"
              >
                Back to Home
              </Link>
            </div>

            {/* Support */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Need help?{' '}
                <Link href="/support" className="text-[#00ff9d] hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
