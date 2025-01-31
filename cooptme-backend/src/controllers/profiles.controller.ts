import { PrismaClient } from '@prisma/client';
import { ProfileCategory } from '../types/profile.types';

const prisma = new PrismaClient();

export class ProfilesController {
    /**
     * Retrieve all profiles sorted by last name in ascending order.
     */
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

    /**
     * Retrieve profiles filtered by category.
     *
     * @param {ProfileCategory} profileCategory - The category to filter profiles by.
     * @returns {Promise<Profile[]>}
     */
    async getProfilesByCategory(profileCategory: ProfileCategory) {
        try {
            const profiles = await prisma.profile.findMany({
                where: {
                    category: profileCategory,
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