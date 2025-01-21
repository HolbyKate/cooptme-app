import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient, Profile } from '@prisma/client';

const prisma = new PrismaClient();

async function importCSV(filePath: string) {
    const profiles: Omit<Profile, 'id'>[] = [];

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                profiles.push({
                    firstName: row['First Name'],
                    lastName: row['Last Name'],
                    url: row['URL'],
                    company: row['Company'],
                    job: row['Job'],
                    category: row['Category']
                });
            })
            .on('end', async () => {
                try {
                    await prisma.profile.createMany({
                        data: profiles,
                        skipDuplicates: true
                    });
                    console.log('Importation réussie !');
                    resolve();
                } catch (error) {
                    console.error('Erreur lors de l\'importation :', error);
                    reject(error);
                } finally {
                    await prisma.$disconnect();
                }
            });
    });
}

// Appelez la fonction d'importation avec le chemin du fichier
importCSV('./data/profiles.csv').catch((error) => {
    console.error('Erreur lors de l\'exécution du script :', error);
});
