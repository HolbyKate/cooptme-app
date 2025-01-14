export interface EventDTO {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  organizer?: string;
  type: 'job_fair' | 'conference' | 'meetup' | 'school' |'other';
  source: string;
  url?: string;
}

const mockEvents: EventDTO[] = [
   {
    id: '1',
    title: 'DEMODAY C#21 Spécialisation FullStack',
    description: 'Jury afin de découvrir de nouveaux talents',
    date: '2025-01-30',
    time: '14:00 - 16:00',
    location: 'Village by CA, 31 Allée Jules Guesde à Toulouse',
    organizer: 'Holberton School',
    type: 'school',
    source: 'Holberton School',
    url: 'https://www.holbertonschool.fr/campus/toulouse'
  },
  {
    id: '2',
    title: 'AI & Apéro',
    description: 'Troisième Rencontre des Innovateurs Toulousains',
    date: '2025-02-06',
    time: '18:00 - 21:00',
    location: 'Microsoft Lab (La Cité, Montaudran, 55 Av. Louis Breguet, 31400 Toulouse)',
    organizer: 'Toulouse IA Innovateurs',
    type: 'meetup',
    source: 'Meet up',
    url: 'https://www.meetup.com/fr-FR/ia-innovateurs/events/305048720/?recId=8b67e7a6-d413-44da-85e7-f9a7f35f9c9b&recSource=ml-popular-events-nearby-offline&searchId=2f457a07-1a72-417b-8599-241e2728172e&eventOrigin=find_page$all'
  },
  {
    id: '3',
    title: 'Mobile World Congress Barcelona 2025',
    description: 'Rencontrez les entreprises qui recrutent',
    date: '2025-03-03',
    time: '09:00 - 18:00',
    location: 'Fira Barcelona',
    organizer: 'MWC',
    type: 'job_fair',
    source: 'MWC',
    url: 'https://www.mwcbarcelona.com/'
  },
  {
    id: '4',
    title: 'Tech’Innov Sport',
    description: 'Innovation & sport : découvrez les dernières tendances à la Conférence Tech’Innov Sport 2024. 300 participants, experts & networking !',
    date: '2025-03-27',
    time: '09:00 - 17:00',
    location: '42 rue seveso 31150 Toulouse',
    organizer: 'Eventbrite',
    type: 'conference',
    source: 'Eventbrite',
    url: 'https://www.eventbrite.fr/e/conference-techinnov-sport-2024-tickets-1117772560819?aff=ebdssbdestsearch&keep_tld=1'
  }
];

export const EventService = {
  getAllEvents: async (): Promise<EventDTO[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
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
