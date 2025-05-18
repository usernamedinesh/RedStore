const AWS = require("aws-sdk");
const env = require("./envConfig");

AWS.config.update({
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
module.exports = s3;
