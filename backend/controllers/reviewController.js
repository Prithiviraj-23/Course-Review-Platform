// backend/controllers/reviewController.js
const Review = require("../models/Review");
const Course = require("../models/Course");

// Function to submit a review
const submitReview = async (req, res) => {
  const { course, rating, comment } = req.body;

  if (!course || !rating || !comment) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const courseToReview = await Course.findById(course);
    if (!courseToReview) {
      return res.status(404).json({ message: "Course not found" });
    }

    const review = new Review({
      course,
      student: req.user._id, // Attach logged-in student
      rating,
      comment,
    });

    await review.save();

    // Calculate average rating for the course
    const reviews = await Review.find({ course: courseToReview._id });

    // Handle case where no reviews exist
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    // Update course rating
    courseToReview.averageRating = averageRating;
    await courseToReview.save();

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting review", error: err.message });
  }
};

// Fetch reviews for a specific course
const getReviewsForCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({ course: req.params.id }).populate(
      "student",
      "username"
    );

    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
};

// Get average rating for a course
const getCourseRating = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Fetch all reviews for the course
    const reviews = await Review.find({ course: req.params.id });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    res.json({ averageRating });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching course rating", error: err.message });
  }
};

// Check if a user has already reviewed a course
const checkUserReview = async (req, res) => {
  try {
    console.log("check the course id", req.user._id); // Debugging line to check user ID
    const { courseId } = req.params; // Extract courseId from URL params

    // Check if the user has already reviewed the course
    const existingReview = await Review.findOne({
      course: courseId,
      student: req.user._id, // Use the logged-in user's ID
    });

    if (existingReview) {
      // If a review exists, return a message indicating the review exists
      return res.json({
        hasReviewed: true,
        review: existingReview, // Optional: You can return review details if you want
      });
    }

    // If no review is found, return that the user hasn't reviewed the course
    res.json({ hasReviewed: false });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error checking review", error: err.message });
  }
};

module.exports = {
  submitReview,
  getReviewsForCourse,
  getCourseRating,
  checkUserReview,
};
