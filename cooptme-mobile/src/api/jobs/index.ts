const API_URL = 'https://votre-backend-url.com/api';  // URL de votre backend

export const jobsApi = {
    async getJobs(params?: { term?: string; location?: string }) {
        try {
            const queryParams = new URLSearchParams();
            if (params?.term) queryParams.append('term', params.term);
            if (params?.location) queryParams.append('location', params.location);

            const response = await fetch(`${API_URL}/jobs?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch jobs');

            return await response.json();
        } catch (error) {
            throw new Error('Error fetching jobs');
        }
    },

    async uploadJobsCsv(file: FormData) {
        try {
            const response = await fetch(`${API_URL}/jobs/upload`, {
                method: 'POST',
                body: file,
                headers: {
                    'Accept': 'application/json',
                    // Ne pas définir Content-Type, il sera automatiquement défini avec FormData
                },
            });

            if (!response.ok) throw new Error('Failed to upload CSV');

            return await response.json();
        } catch (error) {
            throw new Error('Error uploading CSV');
        }
    }
};