import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc register new user
export const registerUser = async (req,res)=>{
    const {name,email,password,role} =req.body;
    try {
        const userExist =await User.findOne({email});
        if(userExist) return res.status(400).json({message:"user already exists"});

        const user = await User.create({name,email,password,role});
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
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