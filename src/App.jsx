import { useState } from 'react'
import { AuthProvider } from './context/AuthContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";

export default function App() {

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-job" element={<PostJob />} />
      </Routes>
    </AuthProvider>
  )
}
