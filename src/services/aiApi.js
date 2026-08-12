import axios from 'axios';

// The AI copilot runs as its own small Express service (src/server), separate
// from the main LinkLite backend that `api.js` talks to — they don't share a
// port, so they don't share a baseURL either.
const aiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

aiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default aiApi;
