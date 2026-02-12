const isProduction = import.meta.env.PROD;
export const API_BASE_URL = isProduction ? '/api' : 'http://127.0.0.1:5000';
