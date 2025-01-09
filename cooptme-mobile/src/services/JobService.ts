import { jobsApi } from '../api/jobs';
import type { JobOffer } from '../types/job';

export const JobService = {
    async fetchJobs(searchParams?: { term?: string; location?: string }): Promise<JobOffer[]> {
        try {
            return await jobsApi.getJobs(searchParams);
        } catch (error) {
            console.error('JobService fetchJobs error:', error);
            throw error;
        }
    },

    async uploadCsv(file: FormData): Promise<{ message: string }> {
        try {
            return await jobsApi.uploadJobsCsv(file);
        } catch (error) {
            console.error('JobService uploadCsv error:', error);
            throw error;
        }
    }
};