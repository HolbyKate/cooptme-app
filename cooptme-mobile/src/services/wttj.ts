import axios from 'axios';

const WTTJ_API_URL = 'https://api.welcometothejungle.com/api/v1';

export const wttjService = {
    fetchJobs: async () => {
        const response = await axios.get(`${WTTJ_API_URL}/jobs`, {
            headers: {
                'Authorization': `Bearer ${process.env.WTTJ_API_KEY}`
            }
        });
        // Transformer et sauvegarder les données dans votre BD
        return response.data;
    }
};