import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { Search } from 'lucide-react-native';
import { contactsApi } from '../../api/config/axios';

type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    company: string;
    job: string;
    category: string;
    url: string;
};

export default function ContactsScreen() {
    const [contacts, setContacts] = useState<{ title: string; data: Contact[] }[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<{ title: string; data: Contact[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const sectionListRef = React.useRef<SectionList>(null);

    const handleProfilePress = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible d\'ouvrir le profil LinkedIn');
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (!text.trim()) {
            setFilteredContacts(contacts);
            return;
        }

        const searchResults = contacts.reduce((acc, section) => {
            const filteredData = section.data.filter(contact => 
                `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(text.toLowerCase()) ||
                contact.company.toLowerCase().includes(text.toLowerCase()) ||
                contact.job.toLowerCase().includes(text.toLowerCase())
            );
            
            if (filteredData.length > 0) {
                acc.push({ ...section, data: filteredData });
            }
            return acc;
        }, [] as typeof contacts);

        setFilteredContacts(searchResults);
    };

    const fetchContacts = useCallback(async () => {
        try {
            const response = await contactsApi.get('/contacts');
            const dbContacts: Contact[] = response.data.data;

            const sections = Object.entries(
                dbContacts.reduce((acc, contact) => {
                    const letter = contact.lastName[0].toUpperCase();
                    return { ...acc, [letter]: [...(acc[letter] || []), contact] };
                }, {} as { [key: string]: Contact[] })
            )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([title, data]) => ({
                    title,
                    data: data.sort((a, b) => a.lastName.localeCompare(b.lastName))
                }));

            setContacts(sections);
            setFilteredContacts(sections);
        } catch (error: any) {
            Alert.alert('Erreur', 'Impossible de récupérer les contacts');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4247BD" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <SharedHeader title="Contacts" />
            <View style={styles.searchContainer}>
                <Search size={20} color="#6B7280" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un contact..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor="#9CA3AF"
                />
            </View>
            <SectionList
                ref={sectionListRef}
                sections={filteredContacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => handleProfilePress(item.url)}
                    >
                        <View style={styles.avatar}>
                            <Text style={styles.initials}>
                                {`${item.firstName[0]}${item.lastName[0]}`}
                            </Text>
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                            <Text style={styles.details}>{item.job} • {item.company}</Text>
                            <Text style={styles.linkedInText}>Voir sur LinkedIn</Text>
                        </View>
                    </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                stickySectionHeadersEnabled
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
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
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#1F2937',
        paddingVertical: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    card: {
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
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4247BD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
    contactInfo: {
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    linkedInText: {
        color: '#4247BD',
        fontSize: 14,
        fontWeight: '500',
    },
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#FF8f66',
        borderRadius: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});