import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config(); // .env file load karta hai

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,       // ✅ no quotes
    api_key: process.env.CLOUDINARY_API_KEY,       // ✅ no quotes
    api_secret: process.env.CLOUDINARY_SECRET_KEY, // ✅ no quotes
  });
  console.log("✅ Cloudinary connected successfully");
};

export default connectCloudinary;
export { cloudinary }; 