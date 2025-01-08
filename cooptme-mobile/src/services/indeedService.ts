// src/services/indeedService.ts
import { JobOffer } from '../types/job';
import { API_URL } from '../config';

export class IndeedService {
    static async fetchJobs(): Promise<JobOffer[]> {
        try {
            const response = await fetch(`${API_URL}/jobs/actual`);
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            const jobs = await response.json();
            return jobs;
        } catch (error) {
            console.error('Erreur lors de la récupération des offres:', error);
            throw error;
        }
    }

    static async searchJobs(query: string, location: string): Promise<JobOffer[]> {
        try {
            const params = new URLSearchParams({ query, location });
            const response = await fetch(`${API_URL}/jobs/actual/search?${params}`);
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            const jobs = await response.json();
            return jobs;
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            throw error;
        }
    }
}