require("dotenv").config();
const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  MAIL_EMAIL: str(),
  MAIL_PASSWORD: str(),
});

module.exports = env;
