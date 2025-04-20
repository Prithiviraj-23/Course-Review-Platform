// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getUserEnrollments,
} = require("../controllers/enrollmentController");
const { auth } = require("../middleware/authMiddleware");

router.post("/enroll", auth, enrollInCourse);
router.get("/", auth, getUserEnrollments);

module.exports = router;
