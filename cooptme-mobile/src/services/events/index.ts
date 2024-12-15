import { EventDTO } from './types';

// Plus tard, ces imports seront décommentés
// import { fetchEventbriteEvents } from './apis/eventbrite';
// import { fetchMeetupEvents } from './apis/meetup';
// import { scrapeDigital113 } from './scrapers/digital113';
// import { scrapeLaMelee } from './scrapers/lamelee';

// Données de test qui simulent ce qui viendra des différentes sources
const mockEvents: EventDTO[] = [
  {
    id: '1',
    title: 'Salon Tech Jobs Toulouse',
    date: '2024-03-15',
    time: '09:00 - 18:00',
    location: 'Centre des Congrès Pierre Baudis, Toulouse',
    type: 'job_fair',
    description: 'Le plus grand salon de recrutement IT en Occitanie',
    source: 'ToulouseJobIT',
    url: 'https://example.com/event1',
    organizer: 'Digital 113',
  },
  {
    id: '2',
    title: 'DevFest Toulouse 2024',
    date: '2024-04-20',
    time: '09:00 - 19:00',
    location: 'Centre de Congrès Diagora, Labège',
    type: 'conference',
    description: 'Conférence annuelle des développeurs',
    source: 'GDG Toulouse',
    url: 'https://example.com/event2',
    organizer: 'Google Developer Group',
  },
  {
    id: '3',
    title: 'Meetup React Native Toulouse',
    date: '2024-03-28',
    time: '19:00 - 22:00',
    location: 'At Home, Toulouse',
    type: 'meetup',
    description: 'Soirée développement mobile avec React Native',
    source: 'Meetup',
    url: 'https://example.com/event3',
    organizer: 'Toulouse JS',
  }
];

export class EventService {
  // Cette méthode sera utilisée pour combiner toutes les sources plus tard
  private static async fetchFromAllSources(): Promise<EventDTO[]> {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Plus tard, ce sera remplacé par :
      // const [eventbriteEvents, meetupEvents, digital113Events, laMeleeEvents] = await Promise.all([
      //   fetchEventbriteEvents(),
      //   fetchMeetupEvents(),
      //   scrapeDigital113(),
      //   scrapeLaMelee(),
      // ]);
      // return [...eventbriteEvents, ...meetupEvents, ...digital113Events, ...laMeleeEvents];

      return mockEvents;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      return [];
    }
  }

  static async getAllEvents(): Promise<EventDTO[]> {
    const events = await this.fetchFromAllSources();
    // Trier par date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  static async refreshEvents(): Promise<EventDTO[]> {
    return this.getAllEvents();
  }

  // Méthode utilitaire pour plus tard
  static async searchEvents(query: string): Promise<EventDTO[]> {
    const events = await this.getAllEvents();
    const searchTerm = query.toLowerCase();

    return events.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm)
    );
  }
}
