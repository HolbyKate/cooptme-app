import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

// Mapping des catégories en fonction du job
const jobCategoryMapping: { [key: string]: string } = {
    engineer: 'Tech',
    developer: 'Tech',
    designer: 'Creative',
    manager: 'Management',
    teacher: 'Education',
    doctor: 'Healthcare',
    lawyer: 'Legal',
    consultant: 'Consulting',
    entrepreneur: 'Entrepreneurship',
    investor: 'Investing',
    sales: 'Sales',
    marketing: 'Marketing',
    product: 'Product',
    operations: 'Operations',
    default: 'Other',
};

// Détermine la catégorie à partir du job
function determineCategory(job: string): string {
    if (!job) return jobCategoryMapping.default;

    const lowerJob = job.toLowerCase();
    for (const [key, value] of Object.entries(jobCategoryMapping)) {
        if (lowerJob.includes(key)) {
            return value;
        }
    }
    return jobCategoryMapping.default;
}

async function importData(filePath: string, type: 'profile' | 'contact'): Promise<void> {
    const results: any[] = [];

    // Lire le fichier CSV
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                if (row['First Name'] && row['Last Name'] && row['URL']) {
                    results.push({
                        firstName: row['First Name'],
                        lastName: row['Last Name'],
                        url: row['URL'],
                        company: row['Company'] || 'Unknown',
                        job: row['Job'] || 'Unspecified',
                        category: determineCategory(row['Job']), // Catégorie calculée dynamiquement
                    });
                } else {
                    console.warn('⚠️ Données manquantes, ligne ignorée :', row);
                }
            })
            .on('end', async () => {
                try {
                    for (const data of results) {
                        if (type === 'profile') {
                            await prisma.profile.upsert({
                                where: { url: data.url },
                                update: {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    company: data.company,
                                    job: data.job,
                                },
                                create: {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    url: data.url,
                                    company: data.company,
                                    job: data.job,
                                },
                            });
                            console.log(`✅ Profil importé : ${data.firstName} ${data.lastName}`);
                        } else if (type === 'contact') {
                            await prisma.contact.upsert({
                                where: { firstName_lastName: { firstName: data.firstName, lastName: data.lastName } },
                                update: {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    company: data.company,
                                    job: data.job,
                                },
                                create: {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    url: data.url,
                                    company: data.company,
                                    job: data.job,
                                },
                            });
                            console.log(`✅ Contact importé : ${data.firstName} ${data.lastName}`);
                        }
                    }
                    resolve();
                } catch (error) {
                    console.error('❌ Erreur d\'importation :', error);
                    reject(error);
                } finally {
                    await prisma.$disconnect();
                }
            })
            .on('error', (error) => {
                console.error('❌ Erreur de lecture du fichier CSV :', error);
                reject(error);
            });
    });
}

(async () => {
    const profileFilePath = path.join(__dirname, '../data/profiles.csv');
    const contactFilePath = path.join(__dirname, '../data/profiles.csv');

    if (!fs.existsSync(profileFilePath) || !fs.existsSync(contactFilePath)) {
        console.error('❌ Les fichiers CSV nécessaires sont manquants.');
        process.exit(1);
    }

    console.log('🚀 Début de l\'importation des données...');
    try {
        console.log('📥 Import des profils...');
        await importData(profileFilePath, 'profile');

        console.log('📥 Import des contacts...');
        await importData(contactFilePath, 'contact');

        console.log('✨ Importation terminée avec succès.');
    } catch (error) {
        console.error('💥 Erreur lors de l\'importation :', error);
    }
})();

