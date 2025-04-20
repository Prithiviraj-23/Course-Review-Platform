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

    if (existingReview) {
      // Update review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.sentiment = sentimentScore;
      await existingReview.save();
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
      review: existingReview || newReview,
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

// const updateReview = async (req, res) => {
//   const { reviewId, rating, comment } = req.body;

//   if (!reviewId || !rating || !comment) {
//     return res.status(400).json({ message: "Please provide all fields" });
//   }

//   try {
//     // Find the review to update
//     const review = await Review.findById(reviewId);
//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // Ensure the review belongs to the current user
//     if (review.student.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "You can only update your own review" });
//     }

//     // Update the review fields
//     review.rating = rating;
//     review.comment = comment;

//     // Analyze sentiment and extract the numeric score
//     const sentimentResult = sentiment.analyze(comment);
//     const sentimentScore = sentimentResult.score; // Integer score (e.g., -3, 0, 4)
//     review.sentiment = sentimentScore; // Update the sentiment score

//     await review.save(); // Save the updated review

//     // Find the course associated with the review
//     const courseToReview = await Course.findById(review.course);
//     if (!courseToReview) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Recalculate the average rating and average sentiment
//     const { averageRating, averageSentiment } =
//       await courseToReview.calculateAverages();

//     // Update the course with the new averages
//     courseToReview.averageRating = averageRating;
//     courseToReview.averageSentiment = averageSentiment;

//     await courseToReview.save(); // Save the updated course

//     res.status(200).json({
//       message: "Review updated successfully",
//       review,
//       sentimentScore,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error updating review",
//       error: err.message,
//     });
//   }
// };

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

module.exports = {
  submitReview,
  getReviewsForCourse,
  getCourseRating,
  checkUserReview,
  // updateReview,
};
