import api from '../../config/axios';
import type { JobOffer, JobSearchParams } from '../../../types/index';

class JobService {
    async fetchJobs(searchParams?: JobSearchParams): Promise<JobOffer[]> {
        try {
            const queryParams = new URLSearchParams();
            if (searchParams?.term) queryParams.append('term', searchParams.term);
            if (searchParams?.location) queryParams.append('location', searchParams.location);

            const response = await api.get<JobOffer[]>(`/jobs?${queryParams}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la récupération des offres');
        }
    }

    async getJobById(id: string): Promise<JobOffer> {
        try {
            const response = await api.get<JobOffer>(`/jobs/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la récupération de l\'offre');
        }
    }

    async uploadJobsCSV(file: FormData): Promise<{ success: boolean }> {
        try {
            const response = await api.post('/jobs/upload', file, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de l\'upload du fichier');
        }
    }

    async createJob(jobData: Partial<JobOffer>): Promise<JobOffer> {
        try {
            const response = await api.post<JobOffer>('/jobs', jobData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la création de l\'offre');
        }
    }

    async updateJob(id: string, jobData: Partial<JobOffer>): Promise<JobOffer> {
        try {
            const response = await api.put<JobOffer>(`/jobs/${id}`, jobData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la mise à jour de l\'offre');
        }
    }

    async deleteJob(id: string): Promise<void> {
        try {
            await api.delete(`/jobs/${id}`);
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la suppression de l\'offre');
        }
    }
}

export const jobService = new JobService();