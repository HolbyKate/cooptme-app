import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    job: string;
    company: string;
    url?: string;
    category?: string;
}

const prisma = new PrismaClient();
const app = express();
const meetingPlaces = ['Holberton', 'Actual', 'La mêlée', 'La French Tech', 'Salon emploi', 'Aerospace Valley'];

const determineCategory = (job: string): string => {
    const jobMapping: { [key: string]: string } = {
        'Developer': 'Tech',
        'Engineer': 'Tech',
        'Designer': 'Creative',
        'Manager': 'Management',
        'Teacher': 'Education',
        'Doctor': 'Healthcare',
        'Lawyer': 'Legal',
        'Consultant': 'Consulting',
        'Entrepreneur': 'Entrepreneurship',
        'Investor': 'Investing',
        'Sales': 'Sales',
        'Marketing': 'Marketing',
        'Product': 'Product',
        'Operations': 'Operations',
    };
    for (const key in jobMapping) {
        if (job.toLowerCase().includes(key.toLowerCase())) {
            return jobMapping[key];
        }
    }
    return 'Other';
};

// Middleware
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
        return res.json({
            success: true,
            token: "token-test",
            email: user.email
        });
    } catch (error) {
        console.error('🚨 Erreur de login:', error);
        return res.status(500).json({
            success: false,
            error: "Erreur lors de la connexion"
        });
    }
});

// Route pour récupérer les contacts
router.get("/contacts", async (req: Request, res: Response) => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { lastName: 'asc' },
        });

        return res.json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        console.error("🚨 Erreur lors de la récupération des contacts:", error);
        return res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
        });
    }
});

// Routes pour les profils
router.get("/profiles", async (_req: Request, res: Response) => {
    try {
        const profiles = await prisma.profile.findMany();
        const enhancedProfiles = profiles.map((profile: Profile) => ({
            ...profile,
            category: determineCategory(profile.job),
            meetAt: meetingPlaces[Math.floor(Math.random() * meetingPlaces.length)]
        }));

        res.json({ success: true, data: enhancedProfiles });
    } catch (error) {
        console.error("🚨 Erreur lors de la récupération des profils:", error);
        res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.get("/profiles/category/:category", async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const profiles = await prisma.profile.findMany({
            where: {
                job: { contains: category },
            },
            orderBy: {
                lastName: 'asc'
            }
        });

        res.json({ success: true, data: profiles });
    } catch (error) {
        console.error("🚨 Erreur lors de la récupération des profils par catégorie:", error);
        res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});


app.use('/api', router);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API running at http://192.168.23.27:${PORT}/api`);
});