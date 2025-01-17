import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importCsv() {
    const filePath = path.join(__dirname, 'scripts', 'data', 'linkedin_exports', 'Profiles.csv');
    console.log('Chemin complet vers le fichier CSV :', filePath);

    const results = [];

    try {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => {
                // Validation des champs critiques
                if (!data['First Name']?.trim() || !data['Last Name']?.trim()) {
                    console.warn('Profil avec des noms vides ignoré :', data);
                    return; // Ignorer cette ligne
                }

                // Ajout des données valides
                results.push({
                    firstName: data['First Name'].trim() || null,
                    lastName: data['Last Name'].trim() || null,
                    linkedinUrl: data['URL']?.trim() || null,
                    emailAddress: data['Email Address']?.trim() || null,
                    company: data['Company']?.trim() || null,
                    position: data['Position']?.trim() || null,
                });
            })
            .on('end', async () => {
                console.log(`${results.length} profils valides trouvés.`);
                for (const row of results) {
                    try {
                        await prisma.profile.create({
                            data: row,
                        });
                        console.log(`Profil ajouté : ${row.firstName} ${row.lastName}`);
                    } catch (error) {
                        console.error(`Erreur lors de l'ajout du profil ${row.firstName} ${row.lastName} :`, error.message);
                    }
                }
                console.log('Import terminé avec succès.');
                await prisma.$disconnect();
            });
    } catch (error) {
        console.error('Erreur lors de l\'importation du CSV :', error);
        await prisma.$disconnect();
    }
}

importCsv();

