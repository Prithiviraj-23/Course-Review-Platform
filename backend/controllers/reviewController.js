// backend/controllers/reviewController.js
const Review = require("../models/Review");
const Course = require("../models/Course");

// Function to submit a review
// Function to submit a review
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const submitReview = async (req, res) => {
  const { course, rating, comment } = req.body;

  if (!course || !rating || !comment) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    let courseToReview = await Course.findById(course);
    if (!courseToReview) {
      return res.status(404).json({ message: "Course not found" });
    }

    const sentimentResult = sentiment.analyze(comment);
    const sentimentScore = sentimentResult.score;

    const existingReview = await Review.findOne({
      course,
      student: req.user._id,
    });

    let reviewDoc; // Declare a variable outside the if-else to store the review

    if (existingReview) {
      // Update review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.sentiment = sentimentScore;
      await existingReview.save();
      reviewDoc = existingReview;
    } else {
      // New review
      const newReview = new Review({
        course,
        student: req.user._id,
        rating,
        comment,
        sentiment: sentimentScore,
      });
      await newReview.save();
      reviewDoc = newReview;
    }

    // ✅ Re-fetch the course to get the latest review data
    courseToReview = await Course.findById(course);

    // ✅ Recalculate the average rating and sentiment
    const { averageRating, averageSentiment } =
      await courseToReview.calculateAverages();
    courseToReview.averageRating = averageRating;
    courseToReview.averageSentiment = averageSentiment;

    await courseToReview.save();

    return res.status(existingReview ? 200 : 201).json({
      message: existingReview
        ? "Review updated successfully"
        : "Review submitted successfully",
      review: reviewDoc,
      sentimentScore,
    });
  } catch (err) {
    console.error("Submit review error:", err);
    res.status(500).json({
      message: "Error submitting review",
      error: err.message,
    });
  }
};

// Fetch reviews for a specific course
const getReviewsForCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Modify the populate to include additional fields from the student model
    const reviews = await Review.find({ course: req.params.id })
      .populate("student", "username name email profileImage") // Add more fields here if needed
      .exec();

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
    const { courseId } = req.params; // Extract courseId from URL params
    const userId = req.user._id; // Use the logged-in user's ID

    // Debugging line to check user ID
    console.log("Checking review for user ID:", userId);

    // Check if the user has already reviewed the course
    const existingReview = await Review.findOne({
      course: courseId,
      student: userId, // Match the logged-in user's ID with the review's student field
    });

    if (existingReview) {
      // If a review exists, return the review details and set hasReviewed to true
      return res.json({
        hasReviewed: true,
        review: existingReview, // Optional: You can return review details if you want
      });
    }

    // If no review is found, return that the user hasn't reviewed the course
    res.json({ hasReviewed: false });
  } catch (err) {
    // Handle any errors and return an error message
    console.error("Error checking review:", err); // Optional: Log the error for debugging
    res.status(500).json({
      message: "Error checking review",
      error: err.message,
    });
  }
};

// Get all reviews posted by the current user
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all reviews posted by this user
    const reviews = await Review.find({ student: userId })
      .populate({
        path: "course",
        select: "title department imageUrl instructor",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .sort({ createdAt: -1 }); // Most recent reviews first

    if (reviews.length === 0) {
      return res.status(200).json({
        message: "You haven't posted any reviews yet",
        reviews: [],
      });
    }

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({
      message: "Error fetching your reviews",
      error: err.message,
    });
  }
};

module.exports = {
  submitReview,
  getReviewsForCourse,
  getCourseRating,
  checkUserReview,
  getUserReviews,
  // updateReview,
};
