// controllers/enrollmentController.js
const Enrollment = require("../models/Enrollment");

const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id; // Assuming you're using JWT middleware

  try {
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }
    res.status(500).json({ message: "Enrollment failed" });
  }
};

const getUserEnrollments = async (req, res) => {
  const userId = req.user.id;

  try {
    const enrollments = await Enrollment.find({ user: userId }).populate(
      "course"
    );
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

module.exports = { enrollInCourse, getUserEnrollments };
