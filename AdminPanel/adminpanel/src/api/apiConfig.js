// Use the Render backend URL in production (Vercel), localhost in development
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_BASE_URL = isLocalhost ? 'http://127.0.0.1:5000' : 'https://adminpanel1-i9v3.onrender.com/api';
