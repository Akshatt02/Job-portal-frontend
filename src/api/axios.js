import axios from "axios";

/**
 * Axios instance for backend API communication
 * 
 * Configuration:
 * - Base URL: Loaded from VITE_API_URL environment variable
 * - Fallback: http://localhost:8080 (development)
 * - Auto-includes JWT token in Authorization header
 * - Handles error responses uniformly
 * 
 * Usage:
 * - const res = await API.get("/me");
 * - const res = await API.post("/jobs", { title, description });
 * - const res = await API.put("/profile", { bio, skills });
 * 
 * Environment Variables:
 * - VITE_API_URL: Backend API base URL (e.g., https://api.example.com)
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

/**
 * Request Interceptor: Adds JWT token to outgoing requests
 * 
 * Flow:
 * 1. Check localStorage for "token" (set after login)
 * 2. If token exists, add it to Authorization header
 * 3. Format: "Bearer <token>"
 * 4. All subsequent API calls include this header
 * 
 * This ensures protected endpoints receive valid authentication
 */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/**
 * Export configured axios instance
 * 
 * Import in components:
 * import API from "../api/axios";
 */
export default API;
