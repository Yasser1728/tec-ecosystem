// Page to serve validation key as plain text
export async function getServerSideProps({ res }) {
  const validationKey = '9e290f5d10d73d17d8b0ba27cd00222348ebcac8470527d0fc5beff372aaa2f1affcf0da5a85c72dd8e5a3454e9fc3b76e4cb7fa7e89f1cd806f6cc5bccd7e18';
  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.write(validationKey);
  res.end();
  
  return { props: {} };
}

export default function ValidationKey() {
  return null;
}
