import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient, Profile } from '@prisma/client';

const prisma = new PrismaClient();

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
    'Non-Profit': 'Non-Profit',
    'Executive': 'Executive',
    'Sales': 'Sales',
    'Marketing': 'Marketing',
    'Product': 'Product',
    'Operations': 'Operations',
    'Default': 'Other'
};

function determineCategory(job: string): string {
    return jobCategoryMapping[job] || jobCategoryMapping['Default'];
}

async function importProfiles(filePath: string) {
    const profiles: Omit<Profile, 'id'>[] = [];

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ',' })) // Utilisation de la virgule comme séparateur
            .on('data', (row) => {
                // Validation des données obligatoires
                if (row['First Name'] && row['Last Name'] && row['URL'] && row['Company'] && row['Job']) {
                    profiles.push({
                        firstName: row['First Name'],
                        lastName: row['Last Name'],
                        url: row['URL'],
                        company: row['Company'],
                        job: row['Job'],
                        category: determineCategory(row['Job']),
                    });
                } else {
                    console.warn('Données manquantes dans la ligne ignorée :', row);
                }
            })
            .on('end', async () => {
                try {
                    if (profiles.length === 0) {
                        console.log('Aucun profil valide trouvé dans le fichier.');
                        resolve();
                        return;
                    }

                    // Insérer les profils dans la base de données
                    await prisma.profile.createMany({
                        data: profiles,
                        skipDuplicates: true,
                    });
                    console.log(`✅ ${profiles.length} profils importés avec succès !`);
                    resolve();
                } catch (error) {
                    console.error('❌ Erreur lors de l\'importation des profils :', error);
                    reject(error);
                } finally {
                    await prisma.$disconnect();
                }
            })
            .on('error', (error) => {
                console.error('❌ Erreur lors de la lecture du fichier CSV :', error);
                reject(error);
            });
    });
}

// Appeler la fonction avec le chemin du fichier CSV
importProfiles('./data/profiles.csv').catch((error) => {
    console.error('❌ Erreur lors de l\'exécution du script :', error);
});

