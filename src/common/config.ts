import { config } from "dotenv";

config();

export default {
  port: Number(process.env.PORT) || 3000,
  feOrigin: process.env.FE_ORIGIN,
  meetOrigin: process.env.MEET_ORIGIN,
  nodeEnv: process.env.NODE_ENV,
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
  },
  redis: {
    url: process.env.REDIS_URL
  },
  jwt: {
    secretOrKey: process.env.JWT_SIGN_SECRET,
  },
  googleEmail: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: process.env.REFRESH_TOKEN,
    companyEmail: process.env.COMPANY_EMAIL,
  },
};
