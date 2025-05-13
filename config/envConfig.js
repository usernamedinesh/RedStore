require("dotenv").config();
const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: str(),
  ACCESS_TOKEN_SECRET: str(),
  MAIL_EMAIL: str(),
  MAIL_PASSWORD: str(),
  REFRESH_TOKEN_SECRET: str(),
  REDIS_HOST: str(),
  REDIS_PORT: str(),
  REDIS_PASSWORD: str(),
});

module.exports = env;
