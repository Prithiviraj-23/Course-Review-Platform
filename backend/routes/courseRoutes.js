const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  getCoursesByInstructor,
  getCoursesNotByCurrentUser,
  updateCourse,
} = require("../controllers/courseController");
const upload = require("../middleware/upload");
const { authorizeRoles, auth } = require("../middleware/authMiddleware");

router.post(
  "/",
  auth,
  authorizeRoles("instructor"),
  upload.single("image"),
  createCourse
);

router.put("/:id", auth, upload.single("image"), updateCourse);

router.get("/", getAllCourses);

router.get(
  "/instructor-courses",
  auth,
  authorizeRoles("instructor"),
  getCoursesByInstructor
);

router.get("/other-courses", auth, getCoursesNotByCurrentUser);

router.get("/:id", getCourseById);

router.delete(
  "/:id",
  auth,
  authorizeRoles("admin", "instructor"),
  deleteCourse
);

module.exports = router;
