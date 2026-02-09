import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.name || !form.email || !form.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      await API.post("/auth/register", form);
      nav("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form onSubmit={handleSignup} className="p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create your account ✨
        </h2>

        {error && <div className="error-box">{error}</div>}

        <div className="mb-4">
          <label className="block font-medium mb-2 text-[#6b5b3a]">
            Full Name
          </label>
          <input
            className="input"
            placeholder="Enter your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2 text-[#6b5b3a]">
            Email
          </label>
          <input
            className="input"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2 text-[#6b5b3a]">
            Password
          </label>
          <input
            className="input"
            type="password"
            placeholder="Enter password (min 6 characters)"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn mb-4" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="text-center">
          <p className="text-[#7c6a44]">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 font-semibold text-[#b45309] hover:text-[#92400e]"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
