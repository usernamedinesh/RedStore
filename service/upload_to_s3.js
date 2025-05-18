const s3 = require("../config/awsConfig");
const fs = require("fs/promises");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);
const env = require("../config/envConfig");

async function uploadToS3(file, s3key, folder = "") {
  try {
    const fullKey = folder ? `${folder}/${s3key}` : s3key;
    const fileContent = await fs.readFile(file.path);
    console.log("From uploadToS3: ", fileContent, fullKey);
    const params = {
      Bucket: env.S3_BUCKET_NAME,
      Key: fullKey,
      Body: fileContent,
      ContentType: file.mimetype,
      ACL: "public-read", // or remove if using private bucket + CloudFront
    };
    console.log("params: ", params);
    const fileURL = await s3.upload(params).promise();
    console.log("url", fileURL);

    console.log("is upload working ?");
    await unlink(file.path);
    console.log("is unlink working .");
    return `${env.CLOUDFRONT_URL}/${fullKey}`;
  } catch (error) {
    // if (fs.existsSync(file.path)) {
    //   await unlink(file.path).catch(console.error);
    // }
    console.error("Error uploading file to S3", error);
    throw error;
  }
}

async function uploadMultipleToS3(files, folder = "") {
  try {
    const uploadResults = await Promise.all(
      files.map((file) => {
        const s3key = `${Date.now()}-${file.originalname}`;
        return uploadToS3(file, s3key, folder);
      }),
    );
    return uploadResults;
  } catch (error) {
    console.error("Error uploading multiple files to S3", error);
    throw error;
  }
}

module.exports = { uploadToS3, uploadMultipleToS3 };
