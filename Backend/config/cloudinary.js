// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

let isCloudinaryConnected = false;

const connectCloudinary = () => {
  if (isCloudinaryConnected) {
    console.log("Cloudinary already connected");
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  isCloudinaryConnected = true;
  console.log("Cloudinary connected");
};

export default connectCloudinary;
