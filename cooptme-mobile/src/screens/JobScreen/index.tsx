import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Platform,
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
import { styles } from './styles';

// Type pour les offres d'emploi
type JobOfferType = {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    contractType: string;
    salary?: string;
    postedDate: string;
    url?: string;
};

// Service pour gérer les appels API
const JobService = {
    async fetchJobs(searchParams?: { term?: string; location?: string }) {
        const queryParams = new URLSearchParams();
        if (searchParams?.term) queryParams.append('term', searchParams.term);
        if (searchParams?.location) queryParams.append('location', searchParams.location);

        const response = await fetch(`/api/jobs?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        return response.json();
    },

    async uploadJobsCSV(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/jobs/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload CSV');
        return response.json();
    }
};

export default function JobListScreen() {
    const navigation = useNavigation();
    const [jobs, setJobs] = useState<JobOfferType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    // Charger les offres d'emploi
    const loadJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedJobs = await JobService.fetchJobs();
            setJobs(fetchedJobs);
        } catch (e) {
            setError('Impossible de charger les offres. Veuillez réessayer.');
            Alert.alert('Erreur', 'Impossible de charger les offres. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Gérer l'upload de fichier CSV
    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets[0]) {
                const { uri, name } = result.assets[0];
                setUploading(true);

                const response = await fetch(uri);
                const blob = await response.blob();
                const file = new File([blob], name, { type: 'text/csv' });

                await JobService.uploadJobsCSV(file);
                Alert.alert('Succès', 'Les offres ont été importées avec succès');
                loadJobs();
            }
        } catch (error) {
            Alert.alert('Erreur', "Erreur lors de l'importation du fichier CSV");
        } finally {
            setUploading(false);
        }
    };

    // Recherche des offres
    const searchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const searchResults = await JobService.fetchJobs({
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

    // Rafraîchir la liste
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadJobs().finally(() => setRefreshing(false));
    }, [loadJobs]);

    // Ouvrir l'URL de l'offre
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
    const JobCard = ({ job }: { job: JobOfferType }) => (
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