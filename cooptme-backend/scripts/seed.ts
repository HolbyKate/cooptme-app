import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('💾 Initialisation des données de seed...');

    // Seed des rôles
    await prisma.role.createMany({
        data: [
            { id: 1, name: 'User' },
            { id: 2, name: 'Admin' },
        ],
        skipDuplicates: true, // Évite les erreurs si les rôles existent déjà
    });

    // Utilisateurs de seed
    const users = [
        {
            email: 'cathy.augustin@gmail.com',
            password: await bcrypt.hash('password123', 12),
            firstName: 'Cathy',
            lastName: 'Augustin',
            provider: 'email',
            roleId: 1, // 1 = User
            photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
            emailVerified: true,
        },
        {
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 12),
            firstName: 'Admin',
            lastName: 'User',
            provider: 'email',
            roleId: 2, // 2 = Admin
            photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
            emailVerified: true,
        },
    ];

    try {
        // Insère les utilisateurs
        await prisma.user.createMany({
            data: users,
            skipDuplicates: true,
        });

        console.log('✅ Seed exécuté avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l’insertion des utilisateurs :', error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error('❌ Une erreur inattendue s’est produite :', e);
    process.exit(1);
});
