// const AWS = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");
const env = require("./envConfig");

// AWS.config.update({
//   region: env.AWS_REGION,
//   accessKeyId: env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
// });
//
// const s3 = new AWS.S3();
const s3 = new S3Client({
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});
module.exports = s3;
