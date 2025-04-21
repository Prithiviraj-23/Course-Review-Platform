// routes/authRoutes.js
const express = require("express");
const {
  signup,
  login,
  getUserDetails,
  updateUser,
  changePassword,
} = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

// User signup route
router.post("/signup", signup);

// User login route
router.post("/login", login);

router.get("/getuser", auth, getUserDetails);

router.put("/update", auth, updateUser);
// Add to routes/authRoutes.js
router.post("/change-password", auth, changePassword);
module.exports = router;
