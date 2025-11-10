import User from "../models/User.js";
import Result from "../models/Result.js";

// 📘 Get profile + results
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const results = await Result.find({ userId: req.user.id });
    res.json({ user, results });
  } catch (error) {
    res.status(500).json({ message: "server error :", error });
  }
};

// 🖼 Upload avatar
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const imageUrl = req.file.path; // Cloudinary auto gives URL

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl },
      { new: true }
    );

    res.json({
      message: "✅ Avatar uploaded successfully",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("❌ Avatar upload error:", error);
    res.status(500).json({ message: "Error uploading avatar" });
  }
};

// ✏️ Update name/email
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
