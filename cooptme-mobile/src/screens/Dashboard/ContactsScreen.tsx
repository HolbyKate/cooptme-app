import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import axios from 'axios';

type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    function: string;
    meetingPlace: string;
    photo: string | null;
};

export default function ContactsScreen() {
    const [contacts, setContacts] = useState<{ title: string; data: Contact[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('/contacts'); // Vérifiez que l'API retourne les contacts
            const dbContacts: Contact[] = response.data.data;

            const groupedContacts: { [key: string]: Contact[] } = dbContacts.reduce(
                (acc, contact) => {
                    const firstLetter = contact.lastName[0].toUpperCase();
                    if (!acc[firstLetter]) acc[firstLetter] = [];
                    acc[firstLetter].push(contact);
                    return acc;
                },
                {} as { [key: string]: Contact[] }
            );

            const sections = Object.keys(groupedContacts)
                .sort()
                .map((letter) => ({
                    title: letter,
                    data: groupedContacts[letter].sort((a, b) => a.lastName.localeCompare(b.lastName)),
                }));

            setContacts(sections);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de récupérer les contacts.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const renderContact = ({ item }: { item: Contact }) => (
        <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
            <View style={styles.contactInfo}>
                <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.function}>{item.function}</Text>
                <Text style={styles.meetingPlace}>{item.meetingPlace}</Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4247BD" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SectionList
                sections={contacts}
                keyExtractor={(item) => item.id}
                renderItem={renderContact}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    listContainer: {
        padding: 16,
    },
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    contactCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    contactInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    function: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    meetingPlace: {
        fontSize: 12,
        color: '#999999',
    },
});
