import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { contactsApi } from '../../api/config/axios';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList, DrawerParamList } from '../../navigation/types';

// Types moved to separate types file
export type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    company: string;
    job: string;
    category: string;
};

type ContactsScreenNavigationProp = CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;

export default function ContactsScreen() {
    const navigation = useNavigation<ContactsScreenNavigationProp>();
    const [contacts, setContacts] = useState<{ title: string; data: Contact[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    const getCategoryColor = useCallback((category: string): string => {
        const colors: { [key: string]: string } = {
            Tech: '#4c51c6',
            Creative: '#10b981',
            Management: '#f59e0b',
            Education: '#3b82f6',
            Healthcare: '#ef4444',
            Legal: '#8b5cf6',
            default: '#6b7280'
        };
        return colors[category] || colors.default;
    }, []);

    const fetchContacts = useCallback(async () => {
        try {
            const response = await contactsApi.get('/contacts');
            const dbContacts: Contact[] = response.data.data;

            const groupedContacts = dbContacts.reduce((acc, contact) => {
                const firstLetter = contact.lastName[0].toUpperCase();
                if (!acc[firstLetter]) acc[firstLetter] = [];
                acc[firstLetter].push(contact);
                return acc;
            }, {} as { [key: string]: Contact[] });

            const sections = Object.keys(groupedContacts)
                .sort()
                .map(letter => ({
                    title: letter,
                    data: groupedContacts[letter].sort((a, b) =>
                        a.lastName.localeCompare(b.lastName)
                    ),
                }));

            setContacts(sections);
            setIsLoading(false);
        } catch (error: any) {
            console.error('Erreur fetchContacts:', error);
            if (retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    fetchContacts();
                }, 2000 * (retryCount + 1));
            } else {
                const errorMessage = error.response?.data?.message || 'Impossible de récupérer les contacts.';
                Alert.alert('Erreur', errorMessage);
                setIsLoading(false);
            }
        }
    }, [retryCount]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const renderContactCard = useCallback(({ item }: { item: Contact }) => (
        <TouchableOpacity
            style={styles.ContactCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ContactDetail', { contact: item })}
        >
            <View style={[styles.avatar, { backgroundColor: getCategoryColor(item.category) }]}>
                <Text style={styles.initials}>
                    {`${item.firstName[0]}${item.lastName[0]}`}
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.details}>{item.job} • {item.company}</Text>
                <View style={[styles.tag, { backgroundColor: `${getCategoryColor(item.category)}20` }]}>
                    <Text style={[styles.tagText, { color: getCategoryColor(item.category) }]}>
                        {item.category}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    ), [getCategoryColor, navigation]);

    const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    ), []);

    return (
        <SafeAreaView style={styles.container}>
            <SharedHeader
                title="Contacts"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4247BD" />
                </View>
            ) : (
                <SectionList
                    sections={contacts}
                    keyExtractor={useCallback((item: Contact) => item.id, [])}
                    renderItem={renderContactCard}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={true}
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    windowSize={5}
                />
            )}
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
        backgroundColor: '#FFFFFF',
    },
    listContainer: {
        padding: 16,
    },
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
    },
    ContactCard: {
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
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
    content: {
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
        marginBottom: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    }
});
