export type CategoryTitle =
    | 'IT'
    | 'Marketing'
    | 'RH'
    | 'Finance'
    | 'Communication'
    | 'Students'
    | 'Project Manager'
    | 'Product Owner'
    | 'Customer Care Manager'
    | 'Other';

export interface Category {
    id: string;
    title: CategoryTitle;
    count: number;
}

export const categories: Category[] = [
    { id: "1", title: "IT", count: 145 },
    { id: "2", title: "Marketing", count: 89 },
    { id: "3", title: "RH", count: 67 },
    { id: "4", title: "Finance", count: 54 },
    { id: "5", title: "Communication", count: 78 },
    { id: "6", title: "Students", count: 234 },
    { id: "7", title: "Project Manager", count: 45 },
    { id: "8", title: "Product Owner", count: 32 },
    { id: "9", title: "Customer Care Manager", count: 28 },
    { id: "10", title: "Other", count: 28 }
];

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
    gender: 'male' | 'female';
    photoId: number;
}