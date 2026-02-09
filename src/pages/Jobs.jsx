import { useEffect, useState } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get("/jobs").then(res => setJobs(res.data));
  }, []);

  return (
    <div className="p-10 grid grid-cols-3 gap-6">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} onClick={() => setSelected(job.id)} />
      ))}
      {selected && <JobModal jobId={selected} close={() => setSelected(null)} />}
    </div>
  );
}
