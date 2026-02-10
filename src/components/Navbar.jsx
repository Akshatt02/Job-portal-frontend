import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { connectWallet } from "../web3/wallet";
import API from "../api/axios";

export default function Navbar() {
  const { user, logout, refreshUser } = useContext(AuthContext);
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
      if (!res) return;

      const addr = res.address;

      // If user is logged in, save wallet address to backend and refresh profile
      if (user) {
        try {
          await API.put("/profile", { wallet_address: addr });
          await refreshUser();
          setWallet(null);
          return;
        } catch (err) {
          console.error("Failed to save wallet to profile:", err);
          // fallthrough to set local wallet
        }
      }

      // If not logged in, keep local connected address (won't be saved)
      setWallet(addr);
    } catch (err) {
      alert(err.message || "Wallet connection failed");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
      <Link to="/" className="font-bold text-2xl" style={{ color: "#b45309" }}>
        Job Portal
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/jobs" className="nav-link">Jobs</Link>
        <Link to="/feed" className="nav-link">Feed</Link>

        {user && (
          <>
            <Link to="/post-job" className="nav-link">Post Job</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        )}

        {(user && user.wallet_address) || wallet ? (
          <span
            className="px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ background: "#ecfdf5", color: "#065f46", cursor: "default" }}
          >
            Wallet Connected
          </span>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            className="px-4 py-2 rounded-lg font-medium cursor-pointer"
            style={{
              border: "2px solid #b45309",
              color: "#fff",
              background: "linear-gradient(90deg,#f97316,#b45309)",
              boxShadow: "0 2px 8px rgba(180,83,9,0.15)",
              cursor: connecting ? "not-allowed" : "pointer",
            }}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {!user ? (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md nav-link"
              style={{ border: "2px solid #b45309", color: "#b45309", cursor: "pointer" }}
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
              className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-md hover:scale-105"
              style={{ background: "#b91c1c", cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
