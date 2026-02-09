import { useEffect, useState } from "react";
import API from "../api/axios";

export default function JobModal({ jobId, close }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${jobId}`).then(res => setData(res.data));
  }, []);

  if (!data) return null;

  const job = data.job || data;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 w-[600px]">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        {data.match_score && (
          <div className="bg-green-200 p-2 mt-2 inline-block">
            Match Score: {data.match_score}%
          </div>
        )}
        <p className="mt-4">{job.description}</p>
        <button onClick={close} className="btn mt-4">Close</button>
      </div>
    </div>
  );
}
