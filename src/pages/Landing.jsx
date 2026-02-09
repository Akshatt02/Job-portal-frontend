import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">Web3 Job Portal</h1>
      <p className="mb-6">AI powered job matching + blockchain payments</p>
      <Link to="/jobs" className="bg-black text-white px-6 py-3 rounded">
        Explore Jobs
      </Link>
    </div>
  );
}
