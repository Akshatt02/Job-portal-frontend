import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";

export default function JobModal({ jobId, close }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/jobs/${jobId}`);
      setData(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load job details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const Overlay = ({ children }) => (
    <div
      onClick={close}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
      >
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Overlay>
        <div className="flex justify-center py-10">
          <div
            className="w-10 h-10 border-4 border-r-transparent rounded-full animate-spin"
            style={{ borderColor: "#d97706", borderRightColor: "transparent" }}
          />
        </div>
      </Overlay>
    );
  }

  if (error || !data) {
    return (
      <Overlay>
        <div className="error-box">{error || "Job not found"}</div>
        <button onClick={close} className="btn mt-4">Close</button>
      </Overlay>
    );
  }

  const job = data.job || data;

  return (
    <Overlay>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold" style={{ color: "#3f2f1d" }}>
          {job.title}
        </h2>

        <button
          onClick={close}
          className="text-2xl"
          style={{ color: "#8b7a55" }}
        >
          ✕
        </button>
      </div>

      {/* Match score */}
      {data.match_score !== undefined && (
        <div className="success-box inline-block mb-4">
          <strong>Match Score: {data.match_score}%</strong>
        </div>
      )}

      {/* Info */}
      <div className="mb-4" style={{ color: "#6b5b3a" }}>
        <p className="mb-2">
          <span className="font-semibold">Location:</span> {job.location}
        </p>
        {job.salary && (
          <p className="mb-2">
            <span className="font-semibold">Salary:</span> {job.salary}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Description</h3>
        <p style={{ color: "#6b5b3a" }} className="leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="btn flex-1">Apply Now</button>

        <button
          onClick={close}
          className="flex-1 py-2 rounded-lg font-medium"
          style={{
            border: "2px solid #b45309",
            color: "#b45309",
            background: "transparent",
          }}
        >
          Close
        </button>
      </div>
    </Overlay>
  );
}
