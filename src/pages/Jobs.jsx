import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    fetchJobs();
  }, [debouncedLocation]);

  async function fetchJobs() {
    try {
      if (initialLoad) setLoading(true);

      const params = new URLSearchParams();
      if (debouncedLocation.trim()) {
        params.append("location", debouncedLocation.trim());
      }

      const url = `/jobs${params.toString() ? "?" + params.toString() : ""}`;
      const res = await API.get(url);

      setJobs(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }

  const handleClearFilters = () => {
    setLocation("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div
          className="w-10 h-10 border-4 border-r-transparent rounded-full animate-spin"
          style={{ borderColor: "#d97706", borderRightColor: "transparent" }}
        />
        <p className="mt-4 text-[#6b5b3a]">Loading jobs...</p>
      </div>
    );
  }

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

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Available Jobs</h2>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 shadow-sm
          ${showFilters
            ? "bg-amber-500 text-white shadow-md scale-105"
            : "bg-white text-amber-700 border border-amber-300 hover:bg-amber-50 hover:shadow-md"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          {showFilters ? "Filters On" : "Filter by Location"}
        </button>
      </div>

      {showFilters && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            Filter by Location
          </h3>

          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Remote, Bangalore, Hyderabad..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input w-full"
            />

            {location && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
              >
                Clear
              </button>
            )}

            <span className="text-sm text-gray-500 whitespace-nowrap">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No jobs match this location yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                setSelected(job.id);
              }}
            />
          ))}
        </div>
      )}

      {selected && (
        <JobModal jobId={selected} close={() => setSelected(null)} />
      )}
    </div>
  );
}
