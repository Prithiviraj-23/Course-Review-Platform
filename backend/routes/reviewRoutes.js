// backend/routes/reviewRoutes.js
const express = require("express");

const {
  submitReview,
  getReviewsForCourse,
  getCourseRating,
  checkUserReview,
} = require("../controllers/reviewController");

const { auth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/course/:courseId/check-review", auth, checkUserReview);

router.post("/submit", auth, authorizeRoles("student"), submitReview);
router.get("/course/:id", getReviewsForCourse);

router.get("/course/:id/rating", getCourseRating);

module.exports = router;
