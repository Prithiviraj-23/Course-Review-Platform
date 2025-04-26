const express = require("express");

const {
  submitReview,
  getReviewsForCourse,
  getCourseRating,
  checkUserReview,
  updateReview,
  getUserReviews,
  getCourseReviewStats,
} = require("../controllers/reviewController");

const { auth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/course/:courseId/check-review", auth, checkUserReview);

router.post("/submit", auth, submitReview);
router.get("/user-reviews", auth, getUserReviews);
router.get("/my-reviews", auth, getUserReviews);
router.get("/course/:id", getReviewsForCourse);

router.get("/course/:id/rating", getCourseRating);
// Add to reviewRoutes.js
router.get("/course/:id/stats", getCourseReviewStats);

module.exports = router;
