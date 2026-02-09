import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"" });

  async function handleSignup(e) {
    e.preventDefault();
    await API.post("/auth/register", form);
    nav("/login");
  }

  return (
    <form onSubmit={handleSignup} className="p-10 max-w-md mx-auto bg-white mt-10">
      <h2 className="text-2xl mb-4">Signup</h2>
      <input className="input" placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}/>
      <input className="input mt-3" placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}/>
      <input className="input mt-3" type="password" placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}/>
      <button className="btn mt-4">Create Account</button>
    </form>
  );
}
