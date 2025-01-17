export interface JobOffer {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    contractType: string;
    salary?: string;
    postedDate: string;
    url?: string;
}

export interface JobSearchParams {
    term?: string;
    location?: string;
}