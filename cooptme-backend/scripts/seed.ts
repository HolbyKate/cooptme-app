import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('💾 Initialisation des données de seed...');

    try {
        // Seed des rôles
        await prisma.role.createMany({
            data: [
                { name: 'User' },
                { name: 'Admin' },
            ],
            skipDuplicates: true, // Évite les doublons
        });

        console.log('✅ Rôles créés avec succès.');

        // Seed des utilisateurs
        const users = [
            {
                email: 'cathy.augustin@gmail.com',
                password: await bcrypt.hash('password123', 12),
                firstName: 'Cathy',
                lastName: 'Augustin',
                provider: 'email',
                roleId: 1, // ID du rôle "User"
                photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
                emailVerified: true,
            },
            {
                email: 'admin@example.com',
                password: await bcrypt.hash('admin123', 12),
                firstName: 'Admin',
                lastName: 'User',
                provider: 'email',
                roleId: 2, // ID du rôle "Admin"
                photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
                emailVerified: true,
            },
        ];

        await prisma.user.createMany({
            data: users,
            skipDuplicates: true, // Évite les doublons
        });

        console.log('✅ Utilisateurs créés avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors du seed :', error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error('❌ Une erreur inattendue s\'est produite :', e);
    process.exit(1);
});
