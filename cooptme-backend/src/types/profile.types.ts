// Define the possible categories for profiles
export type ProfileCategory =
    | 'New'
    | 'Tech'
    | 'Creative'
    | 'Management'
    | 'Education'
    | 'Healthcare'
    | 'Legal'
    | 'Consulting'
    | 'Entrepreneurship'
    | 'Investing'
    | 'Sales'
    | 'Marketing'
    | 'Product'
    | 'Operations'
    | 'Other';

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    job: string;
    company: string;
    url?: string;
    category: ProfileCategory;
}