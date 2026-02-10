export default function JobCard({ job, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer"
    >
      <h3 className="text-xl font-bold mb-2" style={{ color: "#3f2f1d" }}>
        {job.title}
      </h3>

      <p className="mb-2 flex items-center" style={{ color: "#6b5b3a" }}>
        <span className="text-lg mr-2">•</span>
        {job.location}
      </p>

      <p className="text-sm mb-3" style={{ color: "#7c6a44" }}>
        {job.description?.slice(0, 100)}...
      </p>

      <div className="flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="font-semibold"
          style={{ color: "#b45309" }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
