export type JobOffer = {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    contractType: string;
    salary?: string;
    postedDate: string;
    url?: string;
};

export type JobApiResponse = {
    data: JobOffer[];
    message?: string;
};