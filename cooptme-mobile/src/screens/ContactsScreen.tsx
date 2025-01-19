import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Papa from 'papaparse';
import { Menu } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';

type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    function: string;
    meetingPlace: string;
    photo: string | null;
};

export default function ContactsScreen() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const navigation = useNavigation();

    // Fonction pour charger et analyser le fichier CSV
    const loadCSV = async (): Promise<Contact[]> => {
    try {
        const asset = Asset.fromModule(require('../../assets/contacts.csv'));
        await asset.downloadAsync();

        const fileUri = asset.localUri || asset.uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);

        console.log("Contenu brut du fichier CSV :", fileContent);

        return new Promise<Contact[]>((resolve, reject) => {
            Papa.parse(fileContent, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    console.log("Résultat du parsing :", result);

                    if (result.errors.length > 0) {
                        console.error('Erreurs dans le CSV :', result.errors);
                        reject(result.errors);
                    } else {
                        const parsedData = result.data as any[];
                        const contacts: Contact[] = parsedData
                            .filter((item) => item['First Name'] && item['Last Name']) // Valider les lignes
                            .map((item, index) => ({
                                id: `${index + 1}`,
                                firstName: item['First Name'] || '',
                                lastName: item['Last Name'] || '',
                                function: item['Job'] || '',
                                meetingPlace: item['Company'] || '',
                                photo: item['URL'] || null,
                            }));
                        resolve(contacts);
                    }
                },
                error: (error: any) => {
                    console.error('Erreur lors du parsing du CSV :', error);
                    reject(error);
                },
            });
        });
    } catch (error) {
        console.error('Erreur lors du chargement du fichier CSV :', error);
        throw error;
    }
};

    // Charger les contacts au démarrage du composant
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const parsedContacts = await loadCSV();
                parsedContacts.sort((a, b) =>
                    a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase())
                );
                setContacts(parsedContacts);
            } catch (error) {
                console.error('Erreur lors du chargement des contacts :', error);
            }
        };

        fetchContacts();
    }, []);

    // Fonction pour rendre un contact
    const renderItem = ({ item }: { item: Contact }) => (
        <TouchableOpacity style={styles.contactCard}>
            <View style={styles.photoContainer}>
                {item.photo ? (
                    <Image source={{ uri: item.photo }} style={styles.photo} />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Text style={styles.photoPlaceholderText}>
                            {item.firstName[0]}
                            {item.lastName[0]}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.function}>{item.function}</Text>
                <Text style={styles.meetingPlace}>{item.meetingPlace}</Text>
            </View>
        </TouchableOpacity>
    );

    const rightContent = (
        <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
            <Menu color="#FFFFFF" size={24} />
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper
            headerProps={{
                title: "Contacts",
                rightContent: rightContent,
            }}
        >
            <View style={styles.content}>
                <FlatList
                    data={contacts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    menuButton: {
        padding: 8,
    },
    listContainer: {
        padding: 20,
    },
    contactCard: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FF8F66',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    photoContainer: {
        marginRight: 15,
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    photoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4247BD',
    },
    contactInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    function: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    meetingPlace: {
        fontSize: 12,
        color: '#999',
    },
});

