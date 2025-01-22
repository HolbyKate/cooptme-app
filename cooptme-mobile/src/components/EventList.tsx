import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EventDTO, EventListProps } from '../types/index';

export const EventList: React.FC<EventListProps> = ({ events, onEventPress }) => {
    const renderItem = ({ item }: { item: EventDTO }) => (
        <TouchableOpacity 
            style={styles.eventItem}
            onPress={() => onEventPress?.(item)}
        >
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
            {item.organizer && (
                <Text style={styles.eventOrganizer}>{item.organizer}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    eventItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    eventDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    eventLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    eventOrganizer: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});