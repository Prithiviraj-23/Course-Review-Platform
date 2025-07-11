const Review = require("../models/Review");
const Course = require("../models/Course");

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

    let reviewDoc;

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.sentiment = sentimentScore;
      await existingReview.save();
      reviewDoc = existingReview;
    } else {
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

    courseToReview = await Course.findById(course);

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

const getReviewsForCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({ course: req.params.id })
      .populate("student", "username name email profileImage")
      .exec();

    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
};

const getCourseRating = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({ course: req.params.id });

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

const checkUserReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    console.log("Checking review for user ID:", userId);

    const existingReview = await Review.findOne({
      course: courseId,
      student: userId,
    });

    if (existingReview) {
      return res.json({
        hasReviewed: true,
        review: existingReview,
      });
    }

    res.json({ hasReviewed: false });
  } catch (err) {
    console.error("Error checking review:", err);
    res.status(500).json({
      message: "Error checking review",
      error: err.message,
    });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ student: userId })
      .populate({
        path: "course",
        select: "title department imageUrl instructor",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

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

// Course review statistics controller
const getCourseReviewStats = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get all reviews for this course
    const reviews = await Review.find({ course: courseId });

    // Calculate basic statistics
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Count positive, negative and neutral reviews based on sentiment
    const positiveReviews = reviews.filter(
      (review) => review.sentiment > 0
    ).length;
    const negativeReviews = reviews.filter(
      (review) => review.sentiment < 0
    ).length;
    const neutralReviews = reviews.filter(
      (review) => review.sentiment === 0
    ).length;

    // Count reviews by rating (0-5)
    const ratingDistribution = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      const rating = Math.floor(review.rating);
      if (rating >= 0 && rating <= 5) {
        ratingDistribution[rating]++;
      }
    });

    // Return the aggregated statistics
    res.json({
      courseId,
      totalReviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      sentiment: {
        positive: positiveReviews,
        negative: negativeReviews,
        neutral: neutralReviews,
      },
      ratingDistribution,
    });
  } catch (err) {
    console.error("Error getting course review statistics:", err);
    res.status(500).json({
      message: "Error fetching course review statistics",
      error: err.message,
    });
  }
};

// Add to module.exports
module.exports = {
  submitReview,
  getReviewsForCourse,
  getCourseRating,
  checkUserReview,
  getUserReviews,
  getCourseReviewStats, // Add the new controller
};
