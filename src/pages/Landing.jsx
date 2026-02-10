import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Landing() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-4" style={{ color: "#b45309" }}>
          Job Portal
        </h1>
        <h2 className="text-3xl font-semibold mb-4" style={{ color: "#d97706" }}>
          AI-Powered Job Matching
        </h2>
        <p className="text-xl mb-8" style={{ color: "#6b5b3a" }}>
          Find your perfect job with AI-powered matching and blockchain-secured payments
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <p className="mb-6" style={{ color: "#6b5b3a" }}>
            <strong>Smart Matching:</strong> Our AI analyzes your skills and preferences to find the best job opportunities tailored just for you.
          </p>
          <p className="mb-8" style={{ color: "#6b5b3a" }}>
            <strong>Secure Payments:</strong> All transactions are verified via blockchain technology, ensuring trust and transparency.
          </p>

          <div className="flex flex-col gap-4">
            {!user ? (
              <>
                <Link
                  to="/jobs"
                  className="btn text-lg font-semibold py-3 rounded-lg"
                  aria-label="Explore Jobs"
                >
                  Explore Jobs
                </Link>

                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="font-semibold py-3 rounded-lg"
                    style={{
                      border: "2px solid #b45309",
                      color: "#b45309",
                      background: "transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="btn font-semibold py-3 rounded-lg"
                    aria-label="Sign Up"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg mb-4" style={{ color: "#6b5b3a" }}>
                  Welcome back, <strong>{user.name}</strong>!
                </p>

                <Link
                  to="/jobs"
                  className="btn text-lg font-semibold py-3 rounded-lg"
                  aria-label="Browse Jobs"
                >
                  Browse Jobs
                </Link>

                <Link
                  to="/post-job"
                  className="font-semibold py-3 rounded-lg"
                  style={{
                    border: "2px solid #b45309",
                    color: "#b45309",
                    background: "transparent",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </div>

        <div style={{ color: "#6b5b3a" }}>
          <p className="text-sm">
            Thousands of opportunities awaiting you | AI-powered precision matching
          </p>
        </div>
      </div>
    </div>
  );
}
