// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

// Handle user signup
const signup = async (req, res) => {
  const { name, email, password, role, preferences } = req.body;

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
      preferences: preferences || {}, // Include preferences if provided
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

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    // Exclude the password from the response
    const { password: _, ...userData } = user.toObject();

    res.json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is extracted from the authenticated token

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    const { name, email, role, preferences } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (preferences) user.preferences = preferences;

    // Save updated user
    const updatedUser = await user.save();

    // Exclude the password from the response
    const { password: _, ...userData } = updatedUser.toObject();

    res.json({ message: "User updated successfully", user: userData });
  } catch (error) {
    res.status(500).json({ message: "Error updating user details" });
  }
};
// Change user password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

module.exports = { signup, login, getUserDetails, updateUser, changePassword };


