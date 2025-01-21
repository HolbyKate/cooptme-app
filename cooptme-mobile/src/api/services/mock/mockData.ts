export const mockData = {
    locations: [
        "Paris, France",
        "Lyon, France",
        "Marseille, France",
        "Bordeaux, France",
        "Nantes, France",
        "Lille, France",
        "Toulouse, France"
    ],

    companies: [
        "Tech Solutions",
        "Digital Agency",
        "StartupLab",
        "Innovation Corp",
        "Data Analytics",
        "Web Services",
        "Mobile Apps",
        "Cloud Computing"
    ],

    firstNames: {
        male: [
            'Thomas', 'Lucas', 'Jules', 'Hugo', 'Antoine',
            'Nicolas', 'Alexandre', 'Maxime', 'Paul', 'Pierre'
        ],
        female: [
            'Marie', 'Sophie', 'Emma', 'Léa', 'Sarah',
            'Julie', 'Laura', 'Lucie', 'Alice', 'Émilie'
        ]
    },

    lastNames: [
        'Martin', 'Bernard', 'Dubois', 'Robert', 'Richard',
        'Petit', 'Durand', 'Laurent', 'Lefebvre', 'Michel'
    ],

    jobTitles: {
        "IT": [
            "Développeur Full Stack",
            "Frontend Developer",
            "Backend Developer",
            "DevOps Engineer",
            "Data Scientist",
            "UI/UX Designer"
        ],
        "Marketing": [
            "Chef de Produit",
            "Responsable Marketing",
            "Growth Hacker",
            "Community Manager"
        ],
        "Sales": [
            "Business Developer",
            "Account Manager",
            "Sales Representative",
            "Key Account Manager"
        ]
    }
};

// Utilitaires pour générer des données aléatoires
export const mockUtils = {
    getRandomItem<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    },

    getRandomFullName(gender?: 'male' | 'female'): string {
        const selectedGender = gender || (Math.random() > 0.5 ? 'male' : 'female');
        const firstName = this.getRandomItem(mockData.firstNames[selectedGender]);
        const lastName = this.getRandomItem(mockData.lastNames);
        return `${firstName} ${lastName}`;
    },

    getRandomLocation(): string {
        return this.getRandomItem(mockData.locations);
    },

    getRandomCompany(): string {
        return this.getRandomItem(mockData.companies);
    },

    getRandomJobTitle(category?: keyof typeof mockData.jobTitles): string {
        const categories = category ? [category] : Object.keys(mockData.jobTitles);
        const selectedCategory = this.getRandomItem(categories);
        return this.getRandomItem(mockData.jobTitles[selectedCategory as keyof typeof mockData.jobTitles]);
    }
};