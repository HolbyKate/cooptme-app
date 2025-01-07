import { CategoryTitle } from './contacts';

export interface LinkedInProfile {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    company: string;
    location: string;
    category: CategoryTitle;
    profileUrl: string;
    scannedAt: string;
    photoId: number;
    gender: 'male' | 'female';
}