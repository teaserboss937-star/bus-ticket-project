import { generatedToken } from "../token/generatedToken.js";
import User from "../models/user.js";
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    generatedToken(newUser._id, newUser.role, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generatedToken(user._id, user.role, res);

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    return res.status(500).json({ error: "Server error during login" });
  }
};


export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Error in logout:", error.message);
    res.status(500).json({ error: "Server error in logout" });
  }
};

// Get current user/admin
export const getme = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "Unauthorized: No user attached" });
    }

    let account = await User.findById(req.user._id).select("-password");
    if (!account) {
      account = await Admin.findById(req.user._id).select("-password");
    }

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json({
      _id: account._id,
      username: account.username,
      email: account.email,
      role: account.role,
    });
  } catch (error) {
    console.error("Error in getme:", error.message);
    res.status(500).json({ error: "Server error in getme" });
  }
};
