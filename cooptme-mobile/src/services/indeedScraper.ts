import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobOffer } from '../types/job';

function formatPostedDate(date: string): string {
    if (!date) return 'Date non spécifiée';
    return date
        .replace('PostedPosted', 'Publié')
        .replace('Posted', 'Publié')
        .replace('il y a', '')
        .replace('aujourd\'hui', 'Aujourd\'hui')
        .trim();
}

function formatContractType(type: string): string {
    if (!type) return 'Type non spécifié';
    
    // Standardisation des types de contrat
    const typeFormatted = type.toLowerCase();
    if (typeFormatted.includes('cdi')) return 'CDI';
    if (typeFormatted.includes('cdd')) return 'CDD';
    if (typeFormatted.includes('interim')) return 'Intérim';
    if (typeFormatted.includes('stage')) return 'Stage';
    if (typeFormatted.includes('alternance')) return 'Alternance';
    
    return type.trim();
}

export async function scrapeIndeedJobs(): Promise<JobOffer[]> {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
        };

        const response = await axios.get('https://fr.indeed.com/cmp/Actual-2/jobs', { 
            headers,
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const jobs: JobOffer[] = [];
        
        $('div[class*="job-card"]').each((index, element) => {
            try {
                // Extraction des données avec vérification
                const titleElement = $(element).find('h2[class*="jobTitle"]');
                const title = titleElement.text().trim();
                const urlPath = titleElement.find('a').attr('href');
                
                const locationElement = $(element).find('div[class*="companyLocation"]');
                const location = locationElement.text().trim() || 'Lieu non spécifié';
                
                const snippetElement = $(element).find('div[class*="job-snippet"]');
                const description = snippetElement.text().trim() || 'Description non disponible';
                
                const metadataElement = $(element).find('div[class*="metadata"]');
                const contractType = formatContractType(metadataElement.first().text().trim());
                
                const dateElement = $(element).find('span[class*="date"]');
                const postedDate = formatPostedDate(dateElement.text().trim());

                // Vérification complète des données requises
                if (title && urlPath) {
                    const url = urlPath.startsWith('http') ? urlPath : `https://fr.indeed.com${urlPath}`;
                    
                    const jobOffer: JobOffer = {
                        id: `actual-${index}-${Date.now()}`,
                        title,
                        company: 'Actual',
                        location,
                        description,
                        url,
                        postedDate,
                        contractType,
                        salary: 'Non spécifié', // Champ ajouté pour correspondre à l'interface
                        isActive: true
                    };

                    // Vérification finale de l'intégrité des données
                    const isValidJob = Object.values(jobOffer).every(value => 
                        value !== undefined && value !== null && value !== ''
                    );

                    if (isValidJob) {
                        jobs.push(jobOffer);
                    } else {
                        console.warn(`Offre d'emploi invalide ignorée:`, jobOffer);
                    }
                }
            } catch (err) {
                console.error(`Erreur lors du parsing de l'offre ${index}:`, err);
            }
        });

        if (jobs.length === 0) {
            console.warn('Aucune offre trouvée. HTML reçu:', response.data.slice(0, 1000));
            throw new Error('Aucune offre trouvée');
        }

        return jobs;
    } catch (error) {
        console.error('Erreur lors du scraping Indeed:', error);
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Response:', error.response?.data?.slice(0, 1000));
        }
        throw error;
    }
}