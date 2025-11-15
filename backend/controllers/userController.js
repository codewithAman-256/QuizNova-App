import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// @desc register new user
export const registerUser = async (req,res)=>{
    const {name,email,password} =req.body;
    try {
        const userExist =await User.findOne({email});
        if(userExist) return res.status(400).json({message:"user already exists"});

        const user = await User.create({name,email,password,role: "user"});
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
             avatar: user.avatar,
            role:"user",
            token:generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};


// @desc login user
export const loginUser =async (req,res)=>{

    const{email,password}=req.body;
    try {
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                avatar: user.avatar,
                role:user.role,
                token:generateToken(user._id),
            });
        } else{
            res.status(401).json({message:"invalid email or password"});
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//Admin Gets All Requests
export const getAdminRequests = async (req, res) => {
  const requests = await User.find({ adminRequestStatus: "pending" }).select("-password");
  res.json(requests);
};

//toggleAdmin controller
export const toggleAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = user.role === "admin" ? "user" : "admin";
  await user.save();

  res.json({ message: "Role updated", user });
};

//Controller: User Sends Admin Request
export const requestAdminRole = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "admin")
    return res.status(400).json({ message: "You are already an admin" });

  if (user.adminRequestStatus === "pending")
    return res.status(400).json({ message: "Request already pending" });

  user.adminRequestStatus = "pending";
  await user.save();

  res.json({ message: "Admin request submitted!" });
};

//Admin Approves or Rejects Request
export const handleAdminRequest = async (req, res) => {
  const { decision } = req.body; // approve / reject
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (decision === "approve") {
    user.role = "admin";
    user.adminRequestStatus = "approved";
  } else {
    user.adminRequestStatus = "rejected";
  }

  await user.save();
  res.json({ message: "Admin request processed", user });
};
