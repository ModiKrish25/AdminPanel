// Use VITE_API_URL from environment variables, fallback to localhost for development
const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
export const API_BASE_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
