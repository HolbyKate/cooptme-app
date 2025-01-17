import express from 'express';
import { PrismaClient } from '@prisma/client';
import type { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import type { CorsOptions } from 'cors';

// Chargement des variables d'environnement
dotenv.config();

// Initialisation des instances
const prisma = new PrismaClient();
const app = express();

// Configuration CORS
const corsOptions: CorsOptions = {
    origin: '*', // Ou spécifiez les URL de vos applications frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

const profileRoutes: Router = require('./routes/profiles').default;
app.use('/api', profileRoutes);

// Import dynamique des routes
const authRoutes: Router = require('./routes/auth').default;

// Routes
app.use('/api/auth', authRoutes);

// Configuration du serveur
const PORT = parseInt(process.env.PORT || '3000', 10); // Convertit en nombre
const HOST = '0.0.0.0'; // Écoute sur toutes les interfaces réseau

app.listen(PORT, HOST, () => {
    console.log(`Serveur en cours d'exécution sur http://${HOST}:${PORT}`);
});

const startServer = async () => {
    try {
        const server = await app.listen(PORT);

        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Le port ${PORT} est déjà utilisé. Veuillez utiliser un autre port.`);
            } else {
                console.error('Erreur du serveur:', error);
            }
            process.exit(1);
        });

        console.log(`Serveur démarré avec succès sur:
        - http://localhost:${PORT}
        - http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

startServer();

// Gestion des erreurs globale
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({
        success: false,
        error: 'Une erreur interne est survenue'
    });
});

// Gestion des rejets non gérés
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export pour les tests (optionnel)
export default app;