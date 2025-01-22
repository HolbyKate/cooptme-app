import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importContacts(filePath: string) {
    const contacts: { firstName: string; lastName: string; url: string; company: string; job: string }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
    .pipe(csv({ separator: ',' })) // Utilisation de la virgule comme séparateur
    .on('data', (row) => {
        // Validation des données obligatoires
        if (row['First Name'] && row['Last Name'] && row['URL'] && row['Company'] && row['Job']) {
            contacts.push({
                firstName: row['First Name'],
                lastName: row['Last Name'],
                url: row['URL'],
                company: row['Company'],
                job: row['Job'],
            });
        } else {
            console.warn('Données manquantes dans la ligne ignorée :', row);
        }
    })
    .on('end', async () => {
        try {
            if (contacts.length === 0) {
                console.log('Aucun contact valide trouvé dans le fichier.');
                resolve();
                return;
            }

            // Insérer les contacts dans la base de données
            await prisma.contact.createMany({
                data: contacts,
                skipDuplicates: true,
            });
            console.log(`✅ ${contacts.length} contacts importés avec succès !`);
            resolve();
        } catch (error) {
            console.error('❌ Erreur lors de l\'importation des contacts :', error);
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
importContacts('./data/profiles.csv').catch((error) => {
    console.error('❌ Erreur lors de l\'exécution du script :', error);
});
