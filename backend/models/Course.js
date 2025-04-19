const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    department: String,
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    prerequisites: [String],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
