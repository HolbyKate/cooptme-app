import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const app = express();

// Middleware avec logging
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use((req, _res, next) => {
    console.log('🔍 Nouvelle requête:');
    console.log('URL:', req.url);
    console.log('Méthode:', req.method);
    console.log('Corps:', req.body);
    console.log('Headers:', req.headers);
    next();
});

const router = express.Router();

// Route de login
router.post("/auth/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log("👤 Tentative de connexion pour:", email);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log("❌ Utilisateur non trouvé:", email);
            return res.status(404).json({
                success: false,
                error: "Utilisateur non trouvé"
            });
        }

        // Pour le moment, acceptons n'importe quel mot de passe
        console.log("✅ Connexion réussie pour:", email);
        res.json({
            success: true,
            token: "token-test",
            email: user.email
        });
    } catch (error) {
        console.error('🚨 Erreur de login:', error);
        res.status(500).json({
            success: false,
            error: "Erreur lors de la connexion"
        });
    }
});

// Route pour récupérer les contacts triés par ordre alphabétique
router.get("/contacts", async (req: Request, res: Response) => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { lastName: 'asc' }, // Tri par ordre alphabétique
        });

        res.json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        console.error("🚨 Erreur lors de la récupération des contacts :", error);
        res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
        });
    }
});

app.use('/api', router);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running at http://localhost:${PORT}/api`);
});