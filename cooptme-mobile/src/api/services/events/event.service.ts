// src/services/events/event.service.ts
import api from '../../config/axios';

export interface EventDTO {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    type: 'job_fair' | 'conference' | 'meetup' | 'school' | 'other';
    url?: string;
    source: string;
    organizer?: string;
}

class EventService {
    async getAllEvents(): Promise<EventDTO[]> {
        try {
            const response = await api.get('/events');
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération des événements');
        }
    }

    async refreshEvents(): Promise<EventDTO[]> {
        return this.getAllEvents();
    }

    async getEventById(id: string): Promise<EventDTO> {
        try {
            const response = await api.get(`/events/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération de l\'événement');
        }
    }

    async getEventsByDate(date: Date): Promise<EventDTO[]> {
        try {
            const response = await api.get('/events/date', {
                params: { date: date.toISOString() }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération des événements par date');
        }
    }

    async getEventsByMonth(year: number, month: number): Promise<EventDTO[]> {
        try {
            const response = await api.get('/events/month', {
                params: { year, month }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération des événements par mois');
        }
    }
}

export const eventService = new EventService();