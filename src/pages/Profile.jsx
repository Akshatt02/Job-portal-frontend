import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: "#6b5b3a" }}>
            You need to login to view your profile
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn px-6 py-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  async function extractSkills() {
    if (!bio.trim()) {
      setError("Please paste a bio or resume text");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await API.post("/ai/extract-skills", { bio });
      setMessage("Skills extracted successfully: " + res.data.skills.join(", "));
      setBio("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to extract skills");
    } finally {
      setLoading(false);
    }
  }

  const hasSkills =
    user.skills && Array.isArray(user.skills) && user.skills.length > 0;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div
            className="h-32"
            style={{
              background:
                "linear-gradient(90deg,#f59e0b,#d97706)",
            }}
          />
          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-16 mb-6">
              <div
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold"
                style={{
                  background:
                    "linear-gradient(135deg,#f59e0b,#b45309)",
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-4xl font-bold">{user.name}</h2>
                <p style={{ color: "#6b5b3a" }} className="text-lg">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {hasSkills && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Your Skills</h3>
              <button
                onClick={() =>
                  document
                    .getElementById("extractor")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 rounded-lg font-medium"
                style={{
                  background: "#fff7ed",
                  color: "#b45309",
                }}
              >
                Add More Skills
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg,#f59e0b,#d97706)",
                  }}
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Extractor */}
        <div id="extractor" className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🤖</span>
            <h3 className="text-2xl font-bold">AI Skill Extractor</h3>
          </div>

          <p className="mb-6" style={{ color: "#6b5b3a" }}>
            {hasSkills
              ? "Add more skills by pasting resume/bio."
              : "Paste your resume or bio below and AI will extract skills."}
          </p>

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: "#6b5b3a" }}>
              Paste your resume or bio
            </label>

            <textarea
              className="input"
              rows={6}
              placeholder="I have experience in React, Node.js, Python..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            onClick={extractSkills}
            disabled={loading}
            className="btn w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? "Extracting Skills..." : "✨ Extract Skills with AI"}
          </button>

          <p className="text-sm mt-6 text-center" style={{ color: "#6b5b3a" }}>
            💡 The more detailed your text, the better the extraction.
          </p>
        </div>
      </div>
    </div>
  );
}
