export interface MockUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user';
    token: string; // Token simulé
}

export const mockUsers: MockUser[] = [
    {
        id: '1',
        email: 'test@cooptme.com',
        password: 'test123',
        firstName: 'User',
        lastName: 'Test',
        role: 'user',
        token: 'mock_token_user_1'
    },
    {
        id: '2',
        email: 'admin@cooptme.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'Test',
        role: 'admin',
        token: 'mock_token_admin_1'
    },
    {
        id: '3',
        email: 'augustin.cathy@gmail.com',
        password: 'augustin123',
        firstName: 'Augustin',
        lastName: 'Cathy',
        role: 'admin',
        token: 'mock_token_admin_1'
    },
];

export const findUserByEmailAndPassword = (email: string, password: string) => {
    return mockUsers.find(user => user.email === email && user.password === password);
};

export const findUserByToken = (token: string) => {
    return mockUsers.find(user => user.token === token);
};