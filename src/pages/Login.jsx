import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleLogin(e) {
    e.preventDefault();
    const res = await API.post("/auth/login", form);
    login(res.data.token);
    nav("/jobs");
  }

  return (
    <form onSubmit={handleLogin} className="p-10 max-w-md mx-auto bg-white mt-10">
      <h2 className="text-2xl mb-4">Login</h2>
      <input className="input" placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}/>
      <input className="input mt-3" type="password" placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}/>
      <button className="btn mt-4">Login</button>
    </form>
  );
}
