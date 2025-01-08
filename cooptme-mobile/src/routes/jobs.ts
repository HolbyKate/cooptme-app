import express from 'express';
import { scrapeIndeedJobs } from '../services/indeedScraper';

const router = express.Router();

router.get('/jobs/actual', async (req, res) => {
    try {
        const jobs = await scrapeIndeedJobs();
        res.json(jobs);
    } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
    }
});

export default router;