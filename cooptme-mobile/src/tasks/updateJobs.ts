import cron from 'node-cron';
import { scrapeIndeedJobs } from '../services/indeedScraper';
import { jobsCache } from '../utils/cache';

// Mise à jour toutes les 30 minutes
cron.schedule('*/30 * * * *', async () => {
    try {
        const jobs = await scrapeIndeedJobs();
        jobsCache.set('actual-jobs', jobs);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du cache:', error);
    }
});