import puppeteer from 'puppeteer';
import { prisma } from '../db/prismaClient';
import { LinkedInProfile } from '../types/LinkedIn';

async function scrapeLinkedIn() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Connectez-vous à LinkedIn
    await page.goto('https://www.linkedin.com/login');
    await page.type('#username', 'augustin.cathy@gmail.com');
    await page.type('#password', 'Fraggle81');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Aller à la page des connexions
    await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');
    await page.waitForSelector('.mn-connection-card__details');

    // Scraper les données des contacts
    const contacts = await page.$$eval('.mn-connection-card__details', elements =>
        elements.map(el => ({
            firstName: el.querySelector('.mn-connection-card__name')?.textContent?.trim().split(' ')[0] || '',
            lastName: el.querySelector('.mn-connection-card__name')?.textContent?.trim().split(' ')[1] || '',
            linkedinUrl: el.querySelector('a')?.getAttribute('href') || '',
            company: el.querySelector('.mn-connection-card__occupation')?.textContent?.split(' at ')[1] || '',
            position: el.querySelector('.mn-connection-card__occupation')?.textContent?.split(' at ')[0] || '',
        }))
    );

    await browser.close();
    return contacts;
}

async function main() {
    const contacts = await scrapeLinkedIn();

    for (const contact of contacts) {
        try {
            await prisma.profile.upsert({
                where: { linkedinUrl: contact.linkedinUrl },
                update: {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    company: contact.company,
                    position: contact.position,
                },
                create: contact,
            });
            console.log(`Profil ajouté/mis à jour : ${contact.firstName} ${contact.lastName}`);
        } catch (error) {
            console.error(`Erreur lors de l'ajout du profil ${contact.firstName}:`, error);
        }
    }

    console.log('Importation terminée.');
    await prisma.$disconnect();
}

main().catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
