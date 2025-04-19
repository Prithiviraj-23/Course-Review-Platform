const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    comment: String,
    sentiment: String, // For later sentiment analysis
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
