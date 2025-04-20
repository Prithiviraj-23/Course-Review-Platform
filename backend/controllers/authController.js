// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

// Handle user signup
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student", // Default to 'student' if not specified
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.role);

    // Exclude the password from the response
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: "Error in signup" });
  }
};

// Handle user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Exclude the password from the response
    const { password: _, ...userData } = user.toObject();

    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: "Error in login" });
  }
};

module.exports = { signup, login };
