import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return <p>Please log in to view the dashboard</p>;
  }

  return <div>Welcome, {user?.name || "User"}!</div>;
};

export default Dashboard;
