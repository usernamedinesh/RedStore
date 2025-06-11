const s3 = require("../config/awsConfig");
const fs = require("fs/promises");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);
const env = require("../config/envConfig");

/**
 * Uploads a single file to S3.
 * Automatically cleans up the local temporary file after upload or on error.
 *
 * @param {object} file - The file object from Multer (e.g., req.file).
 * @param {string} uniqueFileName - The unique name for the file on S3 (e.g., userId-timestamp-originalName).
 * @param {string} [folder=""] - Optional S3 folder prefix (e.g., "profile_pics", "chat_files").
 * @returns {Promise<string>} The public URL of the uploaded file (via CloudFront).
 * @throws {Error} If the S3 upload fails.
 */
async function uploadToS3(file, uniqueFileName, folder = "") {
  let fileContent;
  const s3Key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;
  let cloudFrontUrl = ""; // Initialize to empty string

  try {
    if (!file || !file.path || !file.mimetype) {
      throw new Error("Invalid file object provided for S3 upload.");
    }

    fileContent = await fs.readFile(file.path);

    // console.log(
    //   `[S3 Upload] Preparing to upload file: ${file.originalname} to S3 Key: ${s3Key}`,
    // );

    const params = {
      Bucket: env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: file.mimetype,
      // ACL: "public-read", // Removed ACL. Better to manage public access via Bucket Policy + CloudFront OAC/OAI
    };

    const s3UploadResult = await s3.upload(params).promise(); // Ensure you're using AWS SDK v2 or handle v3 differently

    // console.log("[S3 Upload] S3 upload successful. Response:", s3UploadResult);

    // Use S3's returned Location or construct with CloudFront URL
    // It's generally safer to rely on your CloudFront URL structure
    cloudFrontUrl = `${env.CLOUDFRONT_URL}/${s3Key}`;
    // console.log("[S3 Upload] Generated CloudFront URL:", cloudFrontUrl);

    return cloudFrontUrl;
  } catch (error) {
    console.error(
      `[S3 Upload] Error uploading file to S3: ${error.message}`,
      error,
    );
    throw error; // Re-throw the original error to be handled by the route's error middleware
  } finally {
    // Always attempt to delete the local temporary file
    if (file && file.path) {
      await fs.unlink(file.path).catch((unlinkError) => {
        console.error(
          `[S3 Upload] Error cleaning up temporary file ${file.path}:`,
          unlinkError,
        );
      });
      // console.log(`[S3 Upload] Cleaned up temporary file: ${file.path}`);
    }
  }
}

async function uploadMultipleToS3(files, folder = "") {
  try {
    const uploadResults = await Promise.all(
      files.map((file) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const s3key = `${uniqueSuffix}-${file.originalname}`;
        return uploadToS3(file, s3key, folder); // handles cleanup
      }),
    );
    return uploadResults;
  } catch (error) {
    console.error("Error uploading multiple files to S3", error);
    throw error;
  }
}

module.exports = { uploadToS3, uploadMultipleToS3 };
