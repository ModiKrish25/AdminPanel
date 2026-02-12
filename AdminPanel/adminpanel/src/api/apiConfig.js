const isProduction = import.meta.env.PROD;
export const API_BASE_URL = isProduction ? 'https://adminpanel1-i9v3.onrender.com/api' : 'http://127.0.0.1:5000';
