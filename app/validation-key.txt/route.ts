import { NextResponse } from 'next/server';

export const GET = () => {
  const key = '9e290f5d10d73d17d8b0ba27cd00222348ebcac8470527d0fc5beff372aaa2f1affcf0da5a85c72dd8e5a3454e9fc3b76e4cb7fa7e89f1cd806f6cc5bccd7e18'; // الكي بتاعك

  return new NextResponse(key, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
    },
  });
};

export const dynamic = 'force-static'; // مهم لـ Vercel caching
