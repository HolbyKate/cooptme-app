import { apiService, JobSearchParams, JobOffer } from './api';

export const jobService = {
    fetchJobs: async (searchParams?: JobSearchParams): Promise<JobOffer[]> => {
        return await apiService.jobs.fetchJobs(searchParams);
    },

    uploadJobsCSV: async (file: FormData): Promise<{ success: boolean }> => {
        return await apiService.jobs.uploadJobsCSV(file);
    }
};

export default jobService;