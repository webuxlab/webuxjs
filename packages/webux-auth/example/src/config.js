export default {
  session: {
    express_session_secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    save_uninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' ? true : false }
  },
  redis: {
    url: process.env.REDIS_URL,
    prefix: process.env.REDIS_PREFIX
  },
  keycloak: {
    keycloak_issuer: process.env.KEYCLOAK_ISSUER,
    keycloak_client_id: process.env.KEYCLOAK_CLIENT_ID,
    keycloak_client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
    keycloak_redirect_uris: process.env.KEYCLOAK_REDIRECT_URIS,
    keycloak_logout_redirect_uris: process.env.KEYCLOAK_LOGOUT_REDIRECT_URIS,
    keycloak_response_types: process.env.KEYCLOAK_RESPONSE_TYPES,
    keycloak_response_mode: process.env.KEYCLOAK_RESPONSE_MODE
  }
};
