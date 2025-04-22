const Course = require("../models/Course");

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
      instructor: req.user?.id,
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

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const getCoursesByInstructor = async (req, res) => {
  try {
    console.log("Instrutor", req.user.id);
    const courses = await Course.find({ instructor: req.user.id }).populate(
      "instructor",
      "name email"
    );

    if (courses.length === 0) {
      return res
        .status(200)
        .json({ message: "No courses found for this instructor" });
    }

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getCoursesNotByCurrentUser = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: { $ne: req.user.id },
    }).populate("instructor", "name email");

    if (courses.length === 0) {
      return res.status(200).json({
        message: "No courses found created by other users",
        courses: [],
      });
    }

    res.json(courses);
  } catch (err) {
    console.error("Error fetching other users' courses:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const {
      title,
      description,
      department,
      difficulty,
      tags,
      videoUrl,
      prerequisites,
    } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this course" });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (department) course.department = department;
    if (difficulty) course.difficulty = difficulty;
    if (videoUrl) course.videoUrl = videoUrl;

    if (prerequisites) {
      course.prerequisites = prerequisites.split
        ? prerequisites.split(",")
        : prerequisites;
    }

    if (tags) {
      course.tags = tags.split ? tags.split(",") : tags;
    }

    if (req.file) {
      course.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedCourse = await course.save();

    res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
  getCoursesNotByCurrentUser,
};
