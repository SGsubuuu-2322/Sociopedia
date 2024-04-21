import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      friends,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const User = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      picturePath,
      location,
      friends,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100000),
      impressions: Math.floor(Math.random() * 100000),
    });

    const savedUser = await User.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};
