import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Supprimer les données existantes
    await prisma.user.deleteMany();

    // Créer les utilisateurs de test
    const users = [
        {
            email: 'john.doe@example.com',
            password: await bcrypt.hash('password123', 10),
            firstName: 'John',
            lastName: 'Doe',
            provider: 'email',
            roleId: 'user',
            photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            emailVerified: true
        },
        {
            email: 'augustin.cathy@cooptme.com',
            password: await bcrypt.hash('password123', 10),
            firstName: 'Cathy',
            lastName: 'Augustin',
            provider: 'email',
            roleId: 'user',
            photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
            emailVerified: true
        },
        {
            email: 'michael.brown@example.com',
            firstName: 'Michael',
            lastName: 'Brown',
            provider: 'google',
            providerId: 'google123',
            roleId: 'user',
            photoUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
            emailVerified: true
        },
        {
            email: 'emma.garcia@example.com',
            firstName: 'Emma',
            lastName: 'Garcia',
            provider: 'linkedin',
            providerId: 'linkedin123',
            roleId: 'user',
            photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
            emailVerified: true
        },
        {
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 10),
            firstName: 'Admin',
            lastName: 'User',
            provider: 'email',
            roleId: 'admin',
            photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
            emailVerified: true
        }
    ];

    for (const user of users) {
        await prisma.user.create({
            data: user
        });
    }

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });