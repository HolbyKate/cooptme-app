/**
 * Script for importing job offers from a CSV file into the database using Prisma.
 *
 * This script reads a CSV file containing job offer data, processes each row, and either creates 
 * or updates entries in the database. It uses Prisma's upsert functionality to avoid duplicates.
 *
 * Usage:
 * - Place the CSV file in the `../data/` directory with the name `job.csv`.
 * - Run this script to import the data into the database.
 *
 * Key Features:
 * - Handles missing data by assigning default values for non-critical fields.
 * - Logs successful and skipped rows for easy debugging.
 * - Disconnects the Prisma client after processing.
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();
//Interface for representing a job offer
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

/**
 * Imports job offers from a CSV file and upserts them into the database.
 *
 * @param {string} filePath - The path to the CSV file containing job offers.
 * @returns {Promise<void>} Resolves when the import process is complete.
 */
async function importJobOffers(filePath: string): Promise<void> {
    const results: JobOffer[] = [];

    return new Promise((resolve, reject) => {
        // Read the CSV file and parse its content.
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                // Only process rows with a job title and company name.
                if (row['Titre Offre'] && row['Nom Entreprise']) {
                    results.push({
                        title: row['Titre Offre'],
                        company: row['Nom Entreprise'],
                        location: row['Localisation'] || 'Non spécifiée', // Default location if missing
                        contractType: row['Type de Contrat'] || 'Non spécifié', // Default contract type if missing
                        salary: row['Salaire'] || 'Non spécifié', // Default salary if missing
                        experience: row['Expérience'] || 'Non spécifiée', // Default experience if missing
                        description: row['Descriptif du Poste'] || 'Non spécifié', // Default description if missing
                        profile: row['Profil Recherché'] || 'Non spécifié', // Default profile if missing
                    });
                } else {
                    console.warn('⚠️ Missing data, row skipped:', row);
                }
            })
            .on('end', async () => {
                try {
                    // Iterate through each job offer and upsert it into the database.
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
                        console.log(`✅ Job offer imported: ${jobOffer.title} at ${jobOffer.company}`);
                    }
                    resolve();
                } catch (error) {
                    console.error('❌ Import error:', error);
                    reject(error);
                } finally {
                    // Ensure the Prisma client is disconnected after processing.
                    await prisma.$disconnect();
                }
            })
            .on('error', (error) => {
                console.error('❌ Error reading the CSV file:', error);
                reject(error);
            });
    });
}

(async () => {
    // Define the path to the job offers CSV file.
    const filePath = path.join(__dirname, '../data/job.csv');

    // Check if the file exists before proceeding.
    if (!fs.existsSync(filePath)) {
        console.error('❌ The CSV file is missing.');
        process.exit(1);
    }

    console.log('🚀 Starting job offers import...');
    try {
        await importJobOffers(filePath);
        console.log('✨ Import completed successfully.');
    } catch (error) {
        console.error('💥 Error during the import process:', error);
    }
})();
