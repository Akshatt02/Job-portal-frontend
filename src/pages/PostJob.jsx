import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const nav = useNavigate();
  const [form, setForm] = useState({ title:"", description:"", location:"" });

  async function postJob() {
    // fake tx hash for now
    const txHash = "0xTEST_TRANSACTION";

    await API.post("/jobs", { ...form, payment_tx_hash: txHash });
    nav("/jobs");
  }

  return (
    <div className="p-10 max-w-xl mx-auto bg-white mt-10">
      <h2 className="text-2xl mb-4">Post Job</h2>
      <input className="input" placeholder="Title"
        onChange={e=>setForm({...form,title:e.target.value})}/>
      <textarea className="input mt-3" placeholder="Description"
        onChange={e=>setForm({...form,description:e.target.value})}/>
      <input className="input mt-3" placeholder="Location"
        onChange={e=>setForm({...form,location:e.target.value})}/>
      <button onClick={postJob} className="btn mt-4">Pay & Post Job</button>
    </div>
  );
}
