// Always use Render backend in production, localhost in development
export const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:5000' : 'https://adminpanel1-i9v3.onrender.com/api';
