// API route to serve validation key
export default function handler(req, res) {
  // Get validation key from environment variable or use default
  const validationKey = process.env.PI_VALIDATION_KEY || '9e290f5d10d73d17d8b0ba27cd00222348ebcac8470527d0fc5beff372aaa2f1affcf0da5a85c72dd8e5a3454e9fc3b76e4cb7fa7e89f1cd806f6cc5bccd7e18';
  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(validationKey);
}
