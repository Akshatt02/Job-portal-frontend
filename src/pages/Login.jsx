import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/login", form);
      login(res.data.token);
      nav("/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form onSubmit={handleLogin} className="p-8 max-w-md w-full">
        
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome back
        </h2>

        {error && <div className="error-box">{error}</div>}

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
            placeholder="Enter your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn mb-4" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <p className="text-[#7c6a44]">
            Don't have an account?
            <Link
              to="/signup"
              className="ml-2 font-semibold text-[#b45309] hover:text-[#92400e]"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
