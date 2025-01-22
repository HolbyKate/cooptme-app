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

interface ErrorResponse {
    message: string;
    status?: number;
    data?: any;
}

class EventService {
    private handleError(error: any): never {
        console.error('Event Service Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        const errorResponse: ErrorResponse = {
            message: 'Une erreur est survenue',
            status: error.response?.status,
            data: error.response?.data
        };

        if (error.response?.status === 404) {
            errorResponse.message = 'Ressource non trouvée';
        } else if (error.response?.status === 401) {
            errorResponse.message = 'Non autorisé';
        } else if (error.response?.status === 403) {
            errorResponse.message = 'Accès refusé';
        }

        throw errorResponse;
    }

    async getAllEvents(): Promise<EventDTO[]> {
        try {
            const response = await api.get<EventDTO[]>('/events');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async refreshEvents(): Promise<EventDTO[]> {
        try {
            console.log('🔄 Rafraîchissement des événements...');
            const events = await this.getAllEvents();
            console.log(`✅ ${events.length} événements récupérés`);
            return events;
        } catch (error) {
            console.error('❌ Erreur lors du rafraîchissement:', error);
            this.handleError(error);
        }
    }

    async getEventById(id: string): Promise<EventDTO> {
        try {
            console.log(`🔍 Recherche de l'événement ${id}...`);
            const response = await api.get<EventDTO>(`/events/${id}`);
            console.log('✅ Événement trouvé');
            return response.data;
        } catch (error) {
            console.error(`❌ Erreur lors de la recherche de l'événement ${id}:`, error);
            this.handleError(error);
        }
    }

    async getEventsByDate(date: Date): Promise<EventDTO[]> {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            console.log(`🔍 Recherche des événements pour la date ${formattedDate}...`);
            const response = await api.get<EventDTO[]>('/events/byDate', {
                params: { date: formattedDate }
            });
            console.log(`✅ ${response.data.length} événements trouvés`);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de la recherche par date:', error);
            this.handleError(error);
        }
    }

    async getEventsByMonth(year: number, month: number): Promise<EventDTO[]> {
        try {
            console.log(`🔍 Recherche des événements pour ${month}/${year}...`);
            const response = await api.get<EventDTO[]>('/events/byMonth', {
                params: { year, month }
            });
            console.log(`✅ ${response.data.length} événements trouvés`);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de la recherche par mois:', error);
            this.handleError(error);
        }
    }
}

export const eventService = new EventService();