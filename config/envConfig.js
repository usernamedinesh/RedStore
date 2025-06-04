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
  JWT_SECRET_TOKEN: str(),
  JWT_SECRET_TOKEN_EXPIRES_IN: str(),
  FRONTEND_URL: str(),
  SECRET_KEY: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_REGION: str(),
  S3_BUCKET_NAME: str(),
  CLOUDFRONT_URL: str(),
  ORIGIN: str(),

  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
});

module.exports = env;
