function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-tec-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">
          {statusCode || 'Error'}
        </h1>
        <p className="text-gray-400 mb-8">
          {statusCode === 404
            ? 'Page not found'
            : statusCode === 500
            ? 'Server error occurred'
            : 'An error occurred'}
        </p>
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

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
