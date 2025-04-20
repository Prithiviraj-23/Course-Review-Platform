  // backend/models/Course.js
  const mongoose = require("mongoose");

  const courseSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: String,
      department: String,
      difficulty: String,
      instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      averageRating: { type: Number, default: 0 }, // Store average rating here
      prerequisites: [String],
      tags: [String],
      videoUrl: String,
      imageUrl: String,
    },
    { timestamps: true }
  );

  const Course = mongoose.model("Course", courseSchema);

  module.exports = Course;
