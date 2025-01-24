import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
} from 'react-native';
import { contactsApi } from '../../api/config/axios';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharedHeader } from '../../components/SharedHeader';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList, DrawerParamList } from '../../navigation/types';

type Contact = {
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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    const getCategoryColor = useCallback((category: string): string => ({
        Tech: '#4c51c6',
        Creative: '#10b981',
        Management: '#f59e0b',
        Education: '#3b82f6',
        Healthcare: '#ef4444',
        Legal: '#8b5cf6',
        default: '#6b7280'
    }[category] || '#6b7280'), []);

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
        } catch (error: any) {
            Alert.alert('Erreur', error.response?.data?.message || 'Impossible de récupérer les contacts.');
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
            <SharedHeader
                title="Contacts"
                showBackButton
                onBackPress={navigation.goBack}
            />
            <SectionList
                sections={contacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => {
                            setSelectedContact(item);
                            setModalVisible(true);
                        }}
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
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled
            />

            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedContact && (
                            <>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalTitleContainer}>
                                        <Text style={styles.modalTitle}>
                                            {selectedContact.firstName} {selectedContact.lastName}
                                        </Text>
                                        <Text style={styles.modalSubtitle}>
                                            {selectedContact.company}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalBody}>
                                    <Text style={styles.modalText}>{selectedContact.job}</Text>
                                    <View style={[styles.modalTag, {
                                        backgroundColor: `${getCategoryColor(selectedContact.category)}20`
                                    }]}>
                                        <Text style={[styles.modalTagText, {
                                            color: getCategoryColor(selectedContact.category)
                                        }]}>
                                            {selectedContact.category}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
    listContainer: {
        padding: 16,
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
        alignItems: 'center',
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
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: '40%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    modalTitleContainer: {
        flex: 1,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 28,
        color: '#9CA3AF',
    },
    modalBody: {
        flex: 1,
    },
    modalText: {
        fontSize: 18,
        color: '#4B5563',
        marginBottom: 16,
    },
    modalTag: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    modalTagText: {
        fontSize: 14,
        fontWeight: '500',
    },
});