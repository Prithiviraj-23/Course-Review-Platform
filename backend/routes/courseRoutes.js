const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  getCoursesByInstructor,
} = require("../controllers/courseController");
const upload = require("../middleware/upload");
const { authorizeRoles, auth } = require("../middleware/authMiddleware");

// Route to create a new course - accessible only by instructors
router.post(
  "/",
  auth,
  authorizeRoles("instructor"),
  upload.single("image"),
  createCourse
);

// Route to get all courses - accessible by everyone
router.get("/", getAllCourses);

router.get(
  "/instructor-courses",
  auth, // Ensures the user is authenticated
  authorizeRoles("instructor"), // Ensure the user is an instructor
  getCoursesByInstructor // Calls the controller function to get instructor's courses
);
// Route to get a specific course by ID - accessible by everyone
router.get("/:id", getCourseById);

// Route to delete a course - accessible only by instructors who created the course or admins
router.delete(
  "/:id",
  auth,
  authorizeRoles("admin", "instructor"),
  deleteCourse
);

module.exports = router;
