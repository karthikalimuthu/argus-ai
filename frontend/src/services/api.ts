import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const getInvestigations = async () => {
    const response = await api.get('/investigations');
    return response.data;
};

export const triggerAlert = async (alertData: any) => {
    const response = await api.post('/webhook/billing', alertData);
    return response.data;
};
