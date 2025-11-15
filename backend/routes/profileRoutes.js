import express from "express";
import { getProfile, updateProfile, updateAvatar } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import {upload} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/update", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), updateAvatar);

export default router;
