export default function JobCard({ job, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-5 shadow cursor-pointer">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p>{job.location}</p>
      <p className="text-sm mt-2">{job.description.slice(0,80)}...</p>
    </div>
  );
}
