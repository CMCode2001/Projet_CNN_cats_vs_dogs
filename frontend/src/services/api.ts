import axios from 'axios';

// Get base URL from env if needed, otherwise default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const predictImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await api.post('/predict', formData);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.detail || error.message || "Erreur réseau";
        console.error("Prediction Error:", message, error);
        throw new Error(message);
    }
};

export const checkHealth = async () => {
    try {
        const response = await api.get('/health'); // Assuming a health endpoint exists or similar
        return response.status === 200;
    } catch {
        return false;
    }
}
