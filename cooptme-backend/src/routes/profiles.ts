import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


// Récupérer les profils par catégorie
router.get('/profiles/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID invalide. Il doit être un nombre.' });
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: { id: Number(id) },
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profil introuvable.' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
});

router.get('/profiles/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const profile = await prisma.profile.findUnique({
            where: { id: Number(id) },
        });

        if (!profile) {
            res.status(404).json({ error: 'Profil introuvable.' });
            return;
        }

        res.json(profile);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
});

export default router;
