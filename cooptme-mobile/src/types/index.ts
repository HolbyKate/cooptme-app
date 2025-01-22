// User & Auth types
export type User = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    provider?: 'email' | 'google' | 'linkedin';
    providerId?: string;
    photoUrl?: string;
    emailVerified: boolean;
    roleId: string;
};

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roleId?: string;
        photoUrl?: string;
        emailVerified: boolean;
    };
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface SocialLoginPayload {
    type: 'google' | 'linkedin';
    token: string;
    email: string;
}

export interface LoginError {
    message: string;
    code?: string;
}

// Job types
export interface JobOffer {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    salary?: string;
    contractType: string;
    postedDate: string;
    category: string;
    skills: string[];
    experienceLevel: string;
    remote: boolean;
    url?: string;
}
export interface JobSearchParams {
    term?: string;
    location?: string;
    category?: string;
    skills?: string[];
    experienceLevel?: string;
    remote?: boolean;
}

// Contact types
export type CategoryTitle = 'À qualifier' | 'Prospect' | 'Client' | 'Partenaire';

export interface Category {
    id: string;
    title: CategoryTitle;
    count: number;
}

export type Gender = 'male' | 'female' | 'unknown';

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    function: string;
    meetingPlace: string;
    company: string;
    email: string;
    photo: string;
    category: CategoryTitle;
    gender: Gender;
    photoId: number;
}

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    url: string;
    company: string;
    job: string;
    category: string;
    meetAt?: string;
}

export type CategoryCard = {
    id: string;
    title: string;
    icon: any;
    color: string;
};

// Event types
export interface EventDTO {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    type: 'job_fair' | 'conference' | 'meetup' | 'school' | 'other';
    url?: string;
    source: string;
    organizer?: string;
}

export interface Event extends EventDTO {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    type: 'job_fair' | 'conference' | 'meetup' | 'school' | 'other';
    url?: string;
    source: string;
    organizer?: string;
}

export interface EventListProps {
    events: Event[];
    onEventPress: (event: Event) => void;
}

// Environment types
export interface Environment {
    GOOGLE_WEB_CLIENT_ID: string;
    GOOGLE_IOS_CLIENT_ID: string;
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    DATABASE_URL: string;
}

export type SocialLoginData = {
    provider: 'google' | 'linkedin';
    token: string;
};

export * from '../navigation/navigation';