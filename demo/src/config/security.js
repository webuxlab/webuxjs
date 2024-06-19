export default {
  bodyParser: {
    limit: '1mb',
    extended: false,
  },
  cookieParser: {
    secret: process.env.COOKIE_SECRET || 'CookieSecret',
  },
  cors: {
    whitelist: ['https://webuxlab.com', 'http://127.0.0.1'], // or [] to disable cors
  },
  server: {
    trustProxy: true,
    allowedMethods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    allowedCredentials: false,
    allowedHeaders:
      'Origin, X-Requested-with, Accept, Authorization, Content-Type, Accept-Language',
  },
  rateLimiters: [
    {
      name: 'Authentication',
      time: 3600, // blocked for 1 hour
      maxReq: 10, // after 3 tries
      pattern: '/auth', // The route prefix to apply this limiter
    },
    {
      name: 'Global',
      time: 60, // blocked for 1 minute
      maxReq: 150, // after 5 tries the requester will be blocked for 1 minute
      pattern: '', // It applies globally
    },
  ],
};
