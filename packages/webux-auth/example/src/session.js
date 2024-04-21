import expressSession from 'express-session';
import { redisStore } from './redis-store.js';

const { EXPRESS_SESSION_SECRET, NODE_ENV } = process.env;

/**
 * Setup the Express Session Middleware
 * @param {Object} app ExpressJS Application
 */
export function initSession(app) {
  // TODO: Not great for production, should use persistent storage...
  // const memoryStore = new expressSession.MemoryStore();
  app.use(
    expressSession({
      secret: EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      // store: memoryStore,
      store: redisStore,
      cookie: { secure: NODE_ENV === 'production' ? true : false }
    })
  );
}
