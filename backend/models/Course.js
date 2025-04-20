// backend/models/Course.js
const mongoose = require("mongoose");
const Review = require("./Review"); // ✅ Add this line

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    department: String,
    difficulty: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    averageRating: { type: Number, default: 0 },
    averageSentiment: { type: Number, default: 0 },
    prerequisites: [String],
    tags: [String],
    videoUrl: String,
    imageUrl: String,
  },
  { timestamps: true }
);

// Calculate both avg rating and avg sentiment together
courseSchema.methods.calculateAverages = async function () {
  try {
    const reviews = await Review.find({ course: this._id });

    if (reviews.length === 0) {
      return { averageRating: 0, averageSentiment: 0 };
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const totalSentiment = reviews.reduce(
      (acc, review) => acc + (review.sentiment || 0),
      0
    );

    const averageRating = totalRating / reviews.length;
    const averageSentiment = totalSentiment / reviews.length;

    return { averageRating, averageSentiment };
  } catch (error) {
    console.error("Error calculating averages:", error);
    return { averageRating: 0, averageSentiment: 0 };
  }
};

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
