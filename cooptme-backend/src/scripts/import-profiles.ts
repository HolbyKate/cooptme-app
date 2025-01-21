// src/scripts/import-profiles.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

interface CsvRow {
    'First Name': string;
    'Last Name': string;
    'URL': string;
    'Company': string;
    'Job': string;
    [key: string]: string;
}

const meetingPlaces = [
    'Holberton',
    'Actual',
    'La mêlée',
    'La French Tech',
    'Salon emploi',
    'Aerospace Valley'
];

const getRandomMeetingPlace = (): string => {
    return meetingPlaces[Math.floor(Math.random() * meetingPlaces.length)];
};

const jobCategoryMapping: { [key: string]: string } = {
    'Engineer': 'Tech',
    'Developer': 'Tech',
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
    'Default': 'Other'
};

function determineCategory(job: string): string {
    const jobLower = job.toLowerCase();
    for (const [key, value] of Object.entries(jobCategoryMapping)) {
        if (jobLower.includes(key.toLowerCase())) {
            return value;
        }
    }
    return jobCategoryMapping['Default'];
}

async function importProfiles(filePath: string): Promise<void> {
    const results: CsvRow[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row: CsvRow) => {
                results.push(row);
            })
            .on('end', async () => {
                try {
                    console.log(`📊 ${results.length} lignes trouvées dans le CSV`);

                    for (const row of results) {
                        const profileData = {
                            firstName: row['First Name'],
                            lastName: row['Last Name'],
                            url: row['URL'],
                            company: row['Company'],
                            job: row['Job'],
                            category: determineCategory(row['Job']),
                            meetAt: getRandomMeetingPlace()
                        };

                        // Vérification des données requises
                        if (!profileData.firstName || !profileData.lastName || !profileData.url ||
                            !profileData.company || !profileData.job) {
                            console.warn('⚠️ Données manquantes pour la ligne:', row);
                            continue;
                        }

                        try {
                            await prisma.profile.upsert({
                                where: { url: profileData.url },
                                update: profileData,
                                create: profileData
                            });
                            console.log(`✅ Profil créé/mis à jour: ${profileData.firstName} ${profileData.lastName}`);
                        } catch (error) {
                            console.error(`❌ Erreur pour le profil ${profileData.firstName} ${profileData.lastName}:`, error);
                        }
                    }

                    console.log('✅ Import terminé avec succès !');
                    resolve();
                } catch (error) {
                    console.error('❌ Erreur lors de l\'import:', error);
                    reject(error);
                } finally {
                    await prisma.$disconnect();
                }
            })
            .on('error', (error: Error) => {
                console.error('❌ Erreur lors de la lecture du CSV:', error);
                reject(error);
            });
    });
}

// Chemin vers votre fichier CSV
const csvFilePath = path.join(__dirname, '../../data/profiles.csv');

// Vérification de l'existence du fichier
if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ Le fichier ${csvFilePath} n'existe pas!`);
    process.exit(1);
}

console.log('🚀 Début de l\'import des profils...');
console.log('📂 Fichier source:', csvFilePath);

importProfiles(csvFilePath)
    .then(() => {
        console.log('✨ Import terminé avec succès');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Erreur lors de l\'import:', error);
        process.exit(1);
    });