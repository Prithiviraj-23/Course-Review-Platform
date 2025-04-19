// backend/routes/reviewRoutes.js

const express = require("express");

const {
  submitReview,
  getReviewsForCourse,
} = require("../controllers/reviewController");
const { auth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Submit a review (students only)
router.post(
  "/submit",
  auth, // auth is a middleware function
  authorizeRoles("student"), // authorizeRoles is also a middleware
  submitReview // This should be the correct function from your reviewController
);

// Fetch reviews for a specific course
router.get("/course/:id", getReviewsForCourse); // This is correct

module.exports = router;
