import { Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup"; // Correct if Signup is inside 'Pages' folder
import Login from "./Pages/Login";

function App() {
  console.log("App is rendering");
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
