import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup"; // Correct if Signup is inside 'Pages' folder
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import { useSelector } from "react-redux";
import CourseDetailPage from "./components/CourseDetailPage ";
import EditCoursePage from "./components/EditCoursePage";

// import InstructorDashboard from "./Pages/InstructorDashboard";
import Profile from "./Pages/Profile";
function App() {
  const { token } = useSelector((state) => state.auth);
  console.log("App is rendering");
  return (
    <Routes>
      {/* <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      /> */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/course/:courseId"
        element={token ? <CourseDetailPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={token ? <Profile /> : <Navigate to="/login" />}
      />
      // Add this import
      <Route path="/edit-course/:courseId" element={<EditCoursePage />} />
    </Routes>
  );
}

export default App;
