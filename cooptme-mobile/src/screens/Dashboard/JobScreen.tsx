import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import { ArrowLeft, Upload } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';

type JobOffer = {
    id: string;
    title: string;
    company: string;
    location: string;
    contractType: string;
    salary?: string;
    experience: string;
    description: string;
    profile: string;
};

export default function JobListScreen() {
    const navigation = useNavigation();
    const [jobs, setJobs] = useState<JobOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets[0]) {
                setLoading(true);
                const response = await fetch(result.assets[0].uri);
                const text = await response.text();

                Papa.parse(text, {
                    header: true,
                    delimiter: ',',
                    complete: (results) => {
                        const parsedJobs: JobOffer[] = results.data.map((job: any, index) => ({
                            id: index.toString(),
                            title: job['Titre Offre'] || '',
                            company: job['Nom Entreprise'] || '',
                            location: job['Localisation'] || '',
                            contractType: job['Type de Contrat'] || '',
                            salary: job['Salaire'],
                            experience: job['Expérience'] || '',
                            description: job['Descriptif du Poste'] || '',
                            profile: job['Profil Recherché'] || '',
                        })).filter(job => job.title); // Filtre les lignes vides

                        console.log('Parsed jobs:', parsedJobs);
                        setJobs(parsedJobs);
                        Alert.alert('Succès', `${parsedJobs.length} offres importées`);
                    },
                    error: (error: any) => {
                        console.error('CSV Parse Error:', error);
                        Alert.alert('Erreur', 'Erreur lors de la lecture du fichier CSV');
                    }
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Erreur', 'Erreur lors de l\'importation du fichier');
        } finally {
            setLoading(false);
        }
    };

    const handleJobPress = (jobId: string) => {
        setSelectedJobId(selectedJobId === jobId ? null : jobId);
    };

    const renderJobCard = useCallback((job: JobOffer) => {
        const isSelected = job.id === selectedJobId;

        return (
            <TouchableOpacity
                key={job.id}
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => handleJobPress(job.id)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>{job.title}</Text>
                        <Text style={styles.cardCompany}>{job.company}</Text>
                    </View>
                    <View style={styles.contractTypeBadge}>
                        <Text style={styles.contractTypeText}>{job.contractType}</Text>
                    </View>
                </View>

                <View style={styles.cardMetadata}>
                    <Text style={styles.metadataText}>{job.location}</Text>
                    {job.salary && (
                        <Text style={styles.metadataText}>{job.salary}</Text>
                    )}
                </View>

                {isSelected && (
                    <>
                        {job.experience && (
                            <>
                                <Text style={styles.sectionTitle}>Expérience requise</Text>
                                <Text style={styles.description}>{job.experience}</Text>
                            </>
                        )}

                        {job.description && (
                            <>
                                <Text style={styles.sectionTitle}>Description du poste</Text>
                                <Text style={styles.description}>{job.description}</Text>
                            </>
                        )}

                        {job.profile && (
                            <>
                                <Text style={styles.sectionTitle}>Profil recherché</Text>
                                <Text style={styles.description}>{job.profile}</Text>
                            </>
                        )}
                    </>
                )}
            </TouchableOpacity>
        );
    }, [selectedJobId]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Offres d'emploi</Text>
            </View>

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleFileUpload}
                disabled={loading}
            >
                <Upload size={24} color="#4c51c6" />
                <Text style={styles.uploadText}>Importer un CSV</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#4c51c6" style={styles.loader} />
            ) : (
                <ScrollView style={styles.jobList}>
                    {jobs.map(renderJobCard)}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#4c51c6',
        paddingTop: Platform.OS === 'android' ? 40 : 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 16,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 2,
        borderColor: '#4c51c6',
        borderStyle: 'dashed',
        margin: 16,
        borderRadius: 8,
    },
    uploadText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#4c51c6',
        fontWeight: '600',
    },
    loader: {
        marginTop: 20,
    },
    jobList: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    selectedCard: {
        borderColor: '#4c51c6',
        borderWidth: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitleContainer: {
        flex: 1,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    cardCompany: {
        fontSize: 14,
        color: '#6B7280',
    },
    contractTypeBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    contractTypeText: {
        color: '#4c51c6',
        fontSize: 12,
        fontWeight: '500',
    },
    cardMetadata: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 16,
    },
    metadataText: {
        color: '#666666',
        fontSize: 14,
    },
    description: {
        marginTop: 12,
        color: '#374151',
        lineHeight: 20,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    skillBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    skillText: {
        color: '#4B5563',
        fontSize: 12,
        fontWeight: '500',
    },
    remoteBadge: {
        backgroundColor: '#DEF7EC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    remoteText: {
        color: '#057A55',
        fontSize: 12,
        fontWeight: '500',
    },
    applyButton: {
        backgroundColor: '#4c51c6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4c51c6',
        marginTop: 16,
        marginBottom: 8,
    },
});