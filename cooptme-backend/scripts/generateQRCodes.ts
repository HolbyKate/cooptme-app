import QRCode from 'qrcode';
import fs from 'fs';

const profiles = [
  {
    firstName: "Léa",
    lastName: "Doe",
    url: "https://linkedin.com/in/johndoe",
    company: "Tech Corp",
    job: "Software Engineer",
    event: "Tech Conference",
    eventDate: "2025-02-15",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    url: "https://linkedin.com/in/janesmith",
    company: "Innovate Inc.",
    job: "Product Manager",
    event: "Startup Meetup",
    eventDate: "2025-02-16",
  },
];

async function generateQRCodes() {
  for (const [index, profile] of profiles.entries()) {
    const jsonProfile = JSON.stringify(profile);
    const filePath = `./qrcodes/profile_${index + 1}.png`;

    try {
      await QRCode.toFile(filePath, jsonProfile);
      console.log(`QR Code généré pour ${profile.firstName} ${profile.lastName}: ${filePath}`);
    } catch (error) {
      console.error("Erreur lors de la génération du QR Code :", error);
    }
  }
}

generateQRCodes();