import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Jobs Page - Browse and filter job listings
 * 
 * Features:
 * - Display all available jobs
 * - Filter by skill, location
 * - Click job card to view details (requires login)
 * - Job match scoring based on user skills
 */
export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Filter state
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [skill, location]);

  async function fetchJobs() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (skill) params.append("skill", skill);
      if (location) params.append("location", location);

      const url = `/jobs${params.toString() ? "?" + params.toString() : ""}`;
      const res = await API.get(url);
      setJobs(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleClearFilters = () => {
    setSkill("");
    setLocation("");
  };

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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Available Jobs</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary"
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div style={{
          background: "#fffaf0",
          border: "1px solid #fcd34d",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          marginBottom: "2rem"
        }}>
          <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#92400e" }}>
            Filter Jobs
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Filter by skill (e.g., go, react)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="input"
              style={{ width: "100%" }}
            />
            <input
              type="text"
              placeholder="Filter by location (e.g., remote, NYC)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button 
              onClick={handleClearFilters}
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
            >
              Clear Filters
            </button>
            <span style={{ color: "#6b7280", fontSize: "0.9rem", alignSelf: "center" }}>
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => {
              // protected: require login to view details
              if (!user) {
                navigate("/login");
                return;
              }
              setSelected(job.id);
            }}
          />
        ))}
      </div>

      {selected && (
        <JobModal jobId={selected} close={() => setSelected(null)} />
      )}
    </div>
  );
}

