import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    RefreshControl,
    KeyboardAvoidingView,
    Linking,
} from 'react-native';
import {
    ArrowLeft,
    Search,
    MapPin,
    Upload,
    Calendar,
    Euro
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { jobService } from '../api/services/jobs/job.service';
import type { JobOffer } from '../api/services/api';
import { StyleSheet, Platform } from 'react-native';


export default function JobListScreen() {
    const navigation = useNavigation();
    const [jobs, setJobs] = useState<JobOffer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    const loadJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedJobs = await jobService.fetchJobs();
            setJobs(fetchedJobs);
        } catch (e) {
            setError('Impossible de charger les offres. Veuillez réessayer.');
            Alert.alert('Erreur', 'Impossible de charger les offres. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets[0]) {
                setUploading(true);
                const { uri, name, mimeType } = result.assets[0];

                const formData = new FormData();
                formData.append('file', {
                    uri,
                    name,
                    type: mimeType,
                } as any);

                await jobService.uploadJobsCSV(formData);
                Alert.alert('Succès', 'Les offres ont été importées avec succès');
                loadJobs();
            }
        } catch (error) {
            Alert.alert('Erreur', "Erreur lors de l'importation du fichier CSV");
        } finally {
            setUploading(false);
        }
    };

    const searchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const searchResults = await jobService.fetchJobs({
                term: searchTerm,
                location: location,
            });
            setJobs(searchResults);
        } catch (e) {
            setError('Erreur lors de la recherche. Veuillez réessayer.');
            Alert.alert('Erreur', 'Erreur lors de la recherche. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadJobs().finally(() => setRefreshing(false));
    }, [loadJobs]);

    const handleOpenJob = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Erreur', "Impossible d'ouvrir cette offre");
            }
        } catch (error) {
            Alert.alert('Erreur', "Une erreur s'est produite");
        }
    };

    // Composant pour afficher une offre
    const JobCard = ({ job }: { job: JobOffer }) => (
        <TouchableOpacity
            style={[
                styles.card,
                selectedJobId === job.id && styles.selectedCard
            ]}
            onPress={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
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
                <View style={styles.metadataItem}>
                    <MapPin size={16} color="#666666" />
                    <Text style={styles.metadataText}>{job.location}</Text>
                </View>
                {job.salary && (
                    <View style={styles.metadataItem}>
                        <Euro size={16} color="#666666" />
                        <Text style={styles.metadataText}>{job.salary}</Text>
                    </View>
                )}
                <View style={styles.metadataItem}>
                    <Calendar size={16} color="#666666" />
                    <Text style={styles.metadataText}>{job.postedDate}</Text>
                </View>
            </View>

            <Text
                style={[
                    styles.description,
                    selectedJobId === job.id ? styles.expandedDescription : styles.collapsedDescription
                ]}
                numberOfLines={selectedJobId === job.id ? undefined : 3}
            >
                {job.description}
            </Text>

            {job.url && selectedJobId === job.id && (
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleOpenJob(job.url!)}
                >
                    <Text style={styles.applyButtonText}>Voir l'offre sur Indeed</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Gestion des offres d'emploi</Text>
                    <TouchableOpacity
                        onPress={handleFileUpload}
                        disabled={uploading}
                        style={styles.uploadButton}
                    >
                        {uploading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Upload color="#FFFFFF" size={24} />
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.searchSection}>
                        <View style={styles.searchInputContainer}>
                            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Rechercher un poste..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                onSubmitEditing={searchJobs}
                                returnKeyType="search"
                            />
                        </View>

                        <View style={styles.searchInputContainer}>
                            <MapPin size={20} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Lieu"
                                value={location}
                                onChangeText={setLocation}
                                onSubmitEditing={searchJobs}
                                returnKeyType="search"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={searchJobs}
                        >
                            <Text style={styles.searchButtonText}>Rechercher</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.centerContent}>
                            <ActivityIndicator size="large" color="#4c51c6" />
                        </View>
                    ) : error ? (
                        <View style={styles.centerContent}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={loadJobs}
                            >
                                <Text style={styles.retryButtonText}>Réessayer</Text>
                            </TouchableOpacity>
                        </View>
                    ) : jobs.length === 0 ? (
                        <View style={styles.centerContent}>
                            <Text style={styles.noResultsText}>Aucune offre trouvée</Text>
                        </View>
                    ) : (
                        <View style={styles.jobList}>
                            {jobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 50,
        paddingBottom: 15,
        backgroundColor: '#4c51c6',
    },
    backButton: {
        padding: 8,
    },
    uploadButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    searchSection: {
        padding: 16,
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchInputContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        top: 12,
        zIndex: 1,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingVertical: 12,
        paddingLeft: 40,
        paddingRight: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    searchButton: {
        backgroundColor: '#4c51c6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: 200,
    },
    jobList: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
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
    metadataItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
    postedDate: {
        marginTop: 12,
        color: '#6B7280',
        fontSize: 14,
    },
    cardFooter: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    seeMoreText: {
        color: '#4c51c6',
        fontSize: 14,
        textAlign: 'center',
    },
    expandedDescription: {
        maxHeight: undefined,
    },
    collapsedDescription: {
        maxHeight: 60,
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
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#4c51c6',
        borderRadius: 8,
        padding: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    noResultsText: {
        color: '#6B7280',
        fontSize: 16,
        textAlign: 'center',
    }
});