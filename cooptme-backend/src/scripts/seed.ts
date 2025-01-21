import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Lieux de rencontre possibles
const meetingPlaces = [
    'Holberton',
    'Actual',
    'La mêlée',
    'La French Tech',
    'Salon emploi',
    'Aerospace Valley'
];

// Obtenir un lieu de rencontre aléatoire
const getRandomMeetingPlace = () => {
    return meetingPlaces[Math.floor(Math.random() * meetingPlaces.length)];
};

async function main() {
    console.log('💾 Initialisation des données de seed...');

    try {
        // Seed des rôles
        await prisma.role.createMany({
            data: [
                { id: 1, name: 'User' },
                { id: 2, name: 'Admin' },
            ],
            skipDuplicates: true,
        });

        // Utilisateurs de seed
        const users = [
            {
                email: 'cathy.augustin@gmail.com',
                password: await bcrypt.hash('password123', 12),
                firstName: 'Cathy',
                lastName: 'Augustin',
                provider: 'email',
                roleId: 1,
                photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
                emailVerified: true,
            },
            {
                email: 'admin@example.com',
                password: await bcrypt.hash('admin123', 12),
                firstName: 'Admin',
                lastName: 'User',
                provider: 'email',
                roleId: 2,
                photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
                emailVerified: true,
            },
        ];

        // Insère les utilisateurs
        await prisma.user.createMany({
            data: users,
            skipDuplicates: true,
        });

        console.log('✅ Utilisateurs créés avec succès !');

        // Profils de test
        const profiles = [
            {
                firstName: 'John',
                lastName: 'Doe',
                url: 'https://linkedin.com/in/johndoe',
                company: 'Tech Corp',
                job: 'Developer',
                category: 'Tech',
                meetAt: getRandomMeetingPlace(),
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                url: 'https://linkedin.com/in/janesmith',
                company: 'Design Studio',
                job: 'Designer',
                category: 'Creative',
                meetAt: getRandomMeetingPlace(),
            },
            {
                firstName: 'Alice',
                lastName: 'Johnson',
                url: 'https://linkedin.com/in/alicejohnson',
                company: 'Marketing Pro',
                job: 'Marketing Manager',
                category: 'Marketing',
                meetAt: getRandomMeetingPlace(),
            },
            {
                firstName: 'Bob',
                lastName: 'Wilson',
                url: 'https://linkedin.com/in/bobwilson',
                company: 'Legal Corp',
                job: 'Lawyer',
                category: 'Legal',
                meetAt: getRandomMeetingPlace(),
            },
        ];

        // Insère les profils
        for (const profile of profiles) {
            await prisma.profile.upsert({
                where: { url: profile.url },
                update: profile,
                create: profile,
            });
        }

        console.log('✅ Profils créés avec succès !');
        console.log('✅ Seed exécuté avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors du seed :', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error('❌ Une erreur inattendue s\'est produite :', e);
    process.exit(1);
});