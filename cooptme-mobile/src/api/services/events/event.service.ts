export interface EventDTO {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    organizer?: string;
    type: 'job_fair' | 'conference' | 'meetup' | 'school' | 'other';
    source: string;
    url?: string;
}

const mockEvents: EventDTO[] = [
    {
        id: '1',
        title: 'Demodays C#21',
        description: 'Présentation du projet cooptme',
        date: '2025-01-30',
        time: '14:00 - 16:00',
        location: 'Holberton School Toulouse, 37 Rue des Marchands, 31000 Toulouse',
        organizer: 'Holberton School',
        type: 'school',
        source: 'Holberton School',
        url: 'https://www.holbertonschool.fr/demoday'
    },
    {
        id: '2',
        title: 'Salon de l’Apprentissage et de l’Alternance',
        description: 'Deux journées pour tout connaître des atouts et des contrats en l’alternance. Un salon organisé par la Chambre de commerce et d’industrie de Lyon, FormaSup, l’IFIR et l’Etudiant.',
        date: '2025-02-08',
        time: '09:00 - 18:00',
        location: 'Centre de congrès Pierre Baudis',
        organizer: 'TechRecruit',
        type: 'job_fair',
        source: 'JobTech',
        url: 'https://example.com/forum-tech'
    },
    {
        id: '3',
        title: 'Vivatech',
        description: 'This is where business meets innovation',
        date: '2025-06-11',
        time: '10:00 - 12:00',
        location: 'La Défense',
        organizer: 'Vivatech',
        type: 'conference',
        source: 'Vivatech',
        url: 'https://www.vivatech.com/'
    }
];

export const EventService = {
    getAllEvents: async (): Promise<EventDTO[]> => {
    console.log("Chargement des événements mockés...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Événements:", mockEvents);
    return mockEvents;
},

    // Ajout de la méthode refreshEvents
    refreshEvents: async (): Promise<EventDTO[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockEvents;
    },

    getEventById: async (id: string): Promise<EventDTO | null> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockEvents.find(event => event.id === id) || null;
    },

    getEventsByDate: async (date: Date): Promise<EventDTO[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockEvents.filter(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    },

    getEventsByMonth: async (year: number, month: number): Promise<EventDTO[]> => {
        await new Promise(resolve => setTimeout(resolve, 700));
        return mockEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });
    }
};