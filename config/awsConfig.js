const AWS = require("aws-sdk");
const env = require("./envConfig");

const s3 = new AWS.S3({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3;
