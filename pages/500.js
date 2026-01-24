export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-tec-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
        <h2 className="text-2xl text-white mb-4">Server Error</h2>
        <p className="text-gray-400 mb-8">Something went wrong on our end.</p>
        <a
          href="/"
          className="px-6 py-3 bg-tec-green text-tec-dark rounded-lg font-semibold hover:bg-tec-green/90 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
