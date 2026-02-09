import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">RizeJobs</Link>
      <div className="flex gap-4">
        <Link to="/jobs">Jobs</Link>
        {user && <Link to="/post-job">Post Job</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  );
}
