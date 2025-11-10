import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Setup Cloudinary storage for avatars
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "quiz-app/avatars", // You can name the folder anything
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }],
  },
});

export const upload = multer({ storage });
