import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PostJob() {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", description: "", location: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: "#6b5b3a" }}>
            You need to login to post a job
          </p>
          <button onClick={() => nav("/login")} className="btn px-6 py-2">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  async function postJob() {
    setError("");

    if (!form.title || !form.description || !form.location) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const txHash = "0xTEST_TRANSACTION_" + Date.now();
      await API.post("/jobs", { ...form, payment_tx_hash: txHash });
      nav("/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-10 px-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-2">Post a Job</h2>
          <p className="mb-6" style={{ color: "#6b5b3a" }}>
            Fill in the details below to post a new job listing
          </p>

          {error && <div className="error-box">{error}</div>}

          <div className="mb-6">
            <label className="block font-medium mb-2 text-[#6b5b3a]">
              Job Title
            </label>
            <input
              className="input"
              placeholder="e.g., Senior React Developer"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2 text-[#6b5b3a]">
              Description
            </label>
            <textarea
              className="input"
              rows={6}
              placeholder="Describe responsibilities, requirements, benefits..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="mb-8">
            <label className="block font-medium mb-2 text-[#6b5b3a]">
              Location
            </label>
            <input
              className="input"
              placeholder="e.g., Remote or Bangalore"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={postJob}
              className="btn flex-1 py-3"
              disabled={loading}
            >
              {loading ? "Posting Job..." : "💰 Pay & Post Job"}
            </button>

            <button
              onClick={() => nav("/jobs")}
              className="flex-1 py-3 rounded-lg font-semibold"
              style={{
                border: "2px solid #b45309",
                color: "#b45309",
                background: "transparent",
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          <p className="text-sm mt-6 text-center" style={{ color: "#8b7a55" }}>
            This posting will be verified via blockchain payment and displayed to all users.
          </p>
        </div>
      </div>
    </div>
  );
}
