// src/utils/qrGenerator.ts
import RNFS from 'react-native-fs';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

const prisma = new PrismaClient();

async function generateQRWithLogo(data: any, outputPath: string, logoPath: string) {
    const qrOptions = {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300
    };

    const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(data), qrOptions);

    // Sauvegarder le QR code
    await RNFS.writeFile(outputPath, qrCodeBuffer.toString('base64'), 'base64');
}

export async function processCSVAndGenerateQRCodes() {
    try {
        const csvContent = await RNFS.readFile(`${RNFS.DocumentDirectoryPath}/data/profiles.csv`, 'utf8');
        const qrCodesDir = `${RNFS.DocumentDirectoryPath}/generated/qrcodes`;
        const logoPath = `${RNFS.MainBundlePath}/assets/logo-blue.png`;

        await RNFS.mkdir(qrCodesDir);

        const { data } = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

        for (const row of data) {
            const profileData = {
                firstName: row.firstName,
                lastName: row.lastName,
                url: row.linkedinUrl,
                company: row.company,
                job: row.job,
                event: row.event,
                eventDate: new Date(row.eventDate)
            };

            const qrFileName = `${profileData.firstName}_${profileData.lastName}_qr.png`;
            const qrFilePath = `${qrCodesDir}/${qrFileName}`;

            await generateQRWithLogo(profileData, qrFilePath, logoPath);

            await prisma.$transaction(async (tx) => {
                await tx.newProfile.create({ data: profileData });
                await tx.contact.create({
                    data: {
                        firstName: profileData.firstName,
                        lastName: profileData.lastName,
                        url: profileData.url,
                        company: profileData.company,
                        job: profileData.job
                    }
                });
            });
        }

        return qrCodesDir;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}