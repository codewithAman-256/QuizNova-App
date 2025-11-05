import User from "../models/User.js";
import Result from "../models/Result.js";


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const results = await Result.find({ userId: req.user.id });
    res.json({ user, results });
  } catch (error) {
    res.status(500).json({ message: "server error :", error });
  }
};

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
    res.status(500).json({ message: "server error " });
  }
};
