// models/Enrollment.js
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }, // Optional, for tracking
    completed: { type: Boolean, default: false }, // Optional
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true }); // Prevent duplicates

module.exports = mongoose.model("Enrollment", enrollmentSchema);
