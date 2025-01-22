import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

interface JobOffer {
    title: string;
    company: string;
    location: string;
    contractType: string;
    salary: string;
    experience: string;
    description: string;
    profile: string;
}

async function importJobOffers(filePath: string): Promise<void> {
    const results: JobOffer[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                if (row['Titre Offre'] && row['Nom Entreprise']) {
                    results.push({
                        title: row['Titre Offre'],
                        company: row['Nom Entreprise'],
                        location: row['Localisation'] || 'Non spécifiée',
                        contractType: row['Type de Contrat'] || 'Non spécifié',
                        salary: row['Salaire'] || 'Non spécifié',
                        experience: row['Expérience'] || 'Non spécifiée',
                        description: row['Descriptif du Poste'] || 'Non spécifié',
                        profile: row['Profil Recherché'] || 'Non spécifié',
                    });
                } else {
                    console.warn('⚠️ Données manquantes, ligne ignorée :', row);
                }
            })
            .on('end', async () => {
                try {
                    for (const jobOffer of results) {
                        await prisma.jobOffer.upsert({
                            where: { title_company: { title: jobOffer.title, company: jobOffer.company } },
                            update: {
                                location: jobOffer.location,
                                contractType: jobOffer.contractType,
                                salary: jobOffer.salary,
                                experience: jobOffer.experience,
                                description: jobOffer.description,
                                profile: jobOffer.profile,
                            },
                            create: {
                                title: jobOffer.title,
                                company: jobOffer.company,
                                location: jobOffer.location,
                                contractType: jobOffer.contractType,
                                salary: jobOffer.salary,
                                experience: jobOffer.experience,
                                description: jobOffer.description,
                                profile: jobOffer.profile,
                            },
                        });
                        console.log(`✅ Offre importée : ${jobOffer.title} chez ${jobOffer.company}`);
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
    const filePath = path.join(__dirname, '../data/job.csv');

    if (!fs.existsSync(filePath)) {
        console.error('❌ Le fichier CSV est manquant.');
        process.exit(1);
    }

    console.log('🚀 Début de l\'importation des offres d\'emploi...');
    try {
        await importJobOffers(filePath);
        console.log('✨ Importation terminée avec succès.');
    } catch (error) {
        console.error('💥 Erreur lors de l\'importation :', error);
    }
})();
