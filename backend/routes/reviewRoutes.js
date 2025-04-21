// backend/routes/reviewRoutes.js
const express = require("express");

const {
  submitReview,
  getReviewsForCourse,
  getCourseRating,
  checkUserReview,
  updateReview,
  getUserReviews,
} = require("../controllers/reviewController");

const { auth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/course/:courseId/check-review", auth, checkUserReview);

router.post("/submit", auth, submitReview);
// Add this line to support both endpoint names
router.get("/user-reviews", auth, getUserReviews);
// Add to your reviewRoutes.js file
router.get("/my-reviews", auth, getUserReviews);
// router.put("/update", auth, updateReview);
router.get("/course/:id", getReviewsForCourse);

router.get("/course/:id/rating", getCourseRating);

module.exports = router;
