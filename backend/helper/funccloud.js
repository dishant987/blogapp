import { v4 as uuid } from "uuid";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const uploadFileToCloudinary = async (file) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
          folder: "blogs",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err) {
    throw new Error(`Error uploading file to Cloudinary: ${err.message}`);
  }
};

const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(
        publicId,
        { resource_type: "image", folder: "blogs" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    return result;
  } catch (err) {
    throw new Error(`Error deleting file from Cloudinary: ${err.message}`);
  }
};

export { uploadFileToCloudinary, deleteFileFromCloudinary };
