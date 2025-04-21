const Course = require("../models/Course");

// CREATE COURSE
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      difficulty,
      tags,
      videoUrl,
      prerequisites,
    } = req.body;

    const course = new Course({
      title,
      description,
      department,
      difficulty,
      videoUrl,
      prerequisites: prerequisites?.split(",") || [],
      tags: tags?.split(",") || [],
      instructor: req.user?.id, // Must match from auth middleware
      imageUrl: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : undefined,
    });

    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL COURSES
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET COURSE BY ID
const getCourseById = async (req, res) => {
  try {
    console.log(req.params.id);
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/courseController.js

// controllers/courseController.js
// controllers/courseController.js
const getCoursesByInstructor = async (req, res) => {
  try {
    // Fetch courses where the instructor ID matches the logged-in user's ID
    console.log("Instrutor", req.user.id);
    const courses = await Course.find({ instructor: req.user.id }).populate(
      "instructor",
      "name email"
    );

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this instructor" });
    }

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET COURSES NOT CREATED BY CURRENT USER
const getCoursesNotByCurrentUser = async (req, res) => {
  try {
    // Find courses where the instructor is NOT the current user
    const courses = await Course.find({ 
      instructor: { $ne: req.user.id } 
    }).populate("instructor", "name email");
    
    if (courses.length === 0) {
      return res.status(200).json({ 
        message: "No courses found created by other users",
        courses: []
      });
    }

    res.json(courses);
  } catch (err) {
    console.error("Error fetching other users' courses:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ EXPORTING ALL CONTROLLERS
module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  getCoursesByInstructor,
  getCoursesNotByCurrentUser  // Add this new controller to the exports
};
