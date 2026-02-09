import { useEffect, useState } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div
          className="w-10 h-10 border-4 border-r-transparent rounded-full animate-spin"
          style={{ borderColor: "#d97706", borderRightColor: "transparent" }}
        />
        <p className="mt-4" style={{ color: "#6b5b3a" }}>
          Loading jobs...
        </p>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <div className="error-box">{error}</div>
        <button onClick={fetchJobs} className="btn mt-4 max-w-xs">
          Retry
        </button>
      </div>
    );
  }

  /* Empty */
  if (jobs.length === 0) {
    return (
      <div className="p-10 text-center min-h-screen flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#6b5b3a" }}>
          No jobs available
        </h2>
        <p style={{ color: "#8b7a55" }}>
          Check back later for more opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-8">Available Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onClick={() => setSelected(job.id)} />
        ))}
      </div>

      {selected && (
        <JobModal jobId={selected} close={() => setSelected(null)} />
      )}
    </div>
  );
}
