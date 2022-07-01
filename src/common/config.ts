import { config } from "dotenv";

config();

export default {
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN,
  nodeEnv: process.env.NODE_ENV,
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
  },
  jwt: {
    secretOrKey: process.env.JWT_SIGN_SECRET,
  },
  soketi: {
    appId: process.env.SOKETI_APP_ID,
    key: process.env.SOKETI_APP_KEY,
    secret: process.env.SOKETI_APP_SECRET,
    host: process.env.SOKETI_HOST,
    port: process.env.SOKETI_PORT,
  },
  googleEmail: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: process.env.REFRESH_TOKEN,
    companyEmail: process.env.COMPANY_EMAIL,
  },
};
