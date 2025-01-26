import { PrismaClient } from '@prisma/client';
import { Profile, ProfileCategory } from '../types/profile.types';

const prisma = new PrismaClient();

export class ProfilesController {
    async getAllProfiles() {
        try {
            const profiles = await prisma.profile.findMany({
                orderBy: {
                    lastName: 'asc',
                },
            });
            return profiles;
        } catch (error) {
            console.error('Erreur lors de la récupération des profils:', error);
            throw error;
        }
    }

    async getProfilesByCategory(category: ProfileCategory) {
        try {
            const profiles = await prisma.profile.findMany({
                where: {
                    category: category,
                },
                orderBy: {
                    lastName: 'asc',
                },
            });
            return profiles;
        } catch (error) {
            console.error('Erreur lors de la récupération des profils par catégorie:', error);
            throw error;
        }
    }
}