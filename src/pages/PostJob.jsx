import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { payPlatformFee } from "../web3/wallet";

export default function PostJob() {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: ""
  });

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

    try {
      setLoading(true);

      let txHash;
      try {
        txHash = await payPlatformFee();
      } catch (paymentErr) {
        setError(paymentErr.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      if (!txHash) {
        setError("Failed to get transaction hash. Please try again.");
        setLoading(false);
        return;
      }

      const response = await API.post("/jobs", {
        ...form,
        payment_tx_hash: txHash
      });

      if (response.status === 201 || response.status === 200) {
        nav("/jobs");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to post job";
      setError(errorMsg);
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
            A small blockchain payment is required before posting.
          </p>

          {error && <div className="error-box">{error}</div>}

          <div className="mb-6">
            <label className="block font-medium mb-2 text-[#6b5b3a]">
              Job Title
            </label>
            <input
              className="input"
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
              rows={6}
              className="input"
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
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              disabled={loading}
            />
          </div>

          <button onClick={postJob} className="btn w-full py-3" disabled={loading}>
            {loading ? "Waiting for blockchain confirmation..." : "💰 Pay & Post Job"}
          </button>

          <p className="text-sm mt-6 text-center" style={{ color: "#8b7a55" }}>
            MetaMask will open to confirm the payment.
          </p>
        </div>
      </div>
    </div>
  );
}
