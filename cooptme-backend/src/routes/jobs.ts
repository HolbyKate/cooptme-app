import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Routes pour Job Offers
router.get('/', async (req, res) => {
    const jobs = await prisma.jobOffer.findMany();
    res.json(jobs);
});

export default router;