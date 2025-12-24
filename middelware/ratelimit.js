const rateStore = new Map();

export function withRateLimit(handler, options = {}) {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000 } = options;

  return async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = `${ip}-${req.url}`;
    
    const now = Date.now();
    const record = rateStore.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests'
      });
    }
    
    record.count++;
    rateStore.set(key, record);
    
    return handler(req, res);
  };
}
