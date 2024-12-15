export type EventDTO = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  type: 'job_fair' | 'conference' | 'meetup' | 'other';
  description: string;
  source: string;
  url?: string;
  organizer?: string;
};

// Types pour les futures intégrations API
export type EventbriteEvent = {
  // À compléter avec la structure de l'API Eventbrite
};

export type MeetupEvent = {
  // À compléter avec la structure de l'API Meetup
};

// Configuration pour les futurs services
export type EventServiceConfig = {
  eventbriteApiKey?: string;
  meetupApiKey?: string;
  region?: string;
  maxResults?: number;
};