import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { connectWallet } from "../web3/wallet";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function handleConnectWallet() {
    try {
      setConnecting(true);
      const res = await connectWallet();
      if (res) setWallet(res.address);
    } catch (err) {
      alert("Wallet connection failed");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
      <Link to="/" className="font-bold text-2xl" style={{ color: "#b45309" }}>
        RizeJobs
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/jobs" className="nav-link">Jobs</Link>

        {user && (
          <>
            <Link to="/post-job" className="nav-link">Post Job</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        )}

        {wallet ? (
          <span
            className="px-3 py-1 rounded-lg text-sm font-medium"
            style={{ background: "#fff7ed", color: "#b45309" }}
          >
            {wallet.slice(0,6)}...{wallet.slice(-4)}
          </span>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            className="px-4 py-2 rounded-lg font-medium"
            style={{ border: "2px solid #b45309", color: "#b45309" }}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {!user ? (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg font-medium"
              style={{ border: "2px solid #b45309", color: "#b45309" }}
            >
              Login
            </Link>

            <Link to="/signup" className="btn px-4 py-2 font-medium">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span style={{ color: "#6b5b3a" }}>{user.name}</span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-white"
              style={{ background: "#b91c1c" }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
