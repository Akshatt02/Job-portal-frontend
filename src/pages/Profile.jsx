import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [bio, setBio] = useState("");

  async function extractSkills() {
    const res = await API.post("/ai/extract-skills", { bio });
    alert("Skills updated: " + res.data.skills.join(", "));
  }

  if (!user) return <div className="p-10">Login required</div>;

  return (
    <div className="p-10">
      <h2 className="text-2xl">{user.name}</h2>
      <p>{user.email}</p>

      <textarea
        placeholder="Paste bio to extract skills"
        className="input mt-5"
        onChange={(e)=>setBio(e.target.value)}
      />

      <button onClick={extractSkills} className="btn mt-3">
        Extract Skills (AI)
      </button>
    </div>
  );
}
