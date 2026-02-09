import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
      
      {/* Logo */}
      <Link
        to="/"
        className="font-bold text-2xl transition"
        style={{ color: "#b45309" }}
      >
        RizeJobs
      </Link>

      <div className="flex gap-6 items-center">
        
        {/* Main links */}
        <Link to="/jobs" className="nav-link">Jobs</Link>

        {user && (
          <>
            <Link to="/post-job" className="nav-link">Post Job</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        )}

        {!user ? (
          <div className="flex gap-3">
            {/* Outline login */}
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                border: "2px solid #b45309",
                color: "#b45309",
                background: "transparent",
              }}
            >
              Login
            </Link>

            {/* Primary signup */}
            <Link
              to="/signup"
              className="btn px-4 py-2 font-medium"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium" style={{ color: "#6b5b3a" }}>
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium text-white"
              style={{
                background: "#b91c1c",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
