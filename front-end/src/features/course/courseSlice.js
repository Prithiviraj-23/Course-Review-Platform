import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action for fetching all courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_HOST}/api/courses`
      );
      return res.data || []; // Assuming response contains the list of courses
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

// Async action for fetching instructor's courses
export const fetchInstructorCourses = createAsyncThunk(
  "courses/fetchInstructorCourses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      const res = await axios.get(
        `${import.meta.env.VITE_API_HOST}/api/courses/instructor-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data || []; // Assuming response contains the list of courses
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

// Async action for deleting a course
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      await axios.delete(
        `${import.meta.env.VITE_API_HOST}/api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return courseId; // Return the deleted course's ID to remove it from the state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete course"
      );
    }
  }
);

const initialState = {
  courses: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    resetCourses: (state) => {
      state.courses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching all courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.courses = []; // <- Clear courses if fetch fails
      })
      // Fetching instructor's courses
      .addCase(fetchInstructorCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.courses = []; // <- Clear courses if fetch fails
      })
      // Deleting a course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted course from the state
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
