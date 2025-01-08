import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Linking,
    Alert,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { ArrowLeft, Search, MapPin, Briefcase } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { IndeedService } from '../services/indeedService';
import type { JobOffer } from '../types/job';

export default function JobListScreen() {
    const navigation = useNavigation();
    const [jobs, setJobs] = useState<JobOffer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedJobs = await IndeedService.fetchJobs();
            setJobs(fetchedJobs);
        } catch (e) {
            setError('Impossible de charger les offres. Veuillez réessayer.');
            Alert.alert('Erreur', 'Impossible de charger les offres. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const searchJobs = async () => {
        if (!searchTerm && !location) {
            Alert.alert('Attention', 'Veuillez saisir au moins un critère de recherche');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const searchResults = await IndeedService.searchJobs(searchTerm, location);
            setJobs(searchResults);
        } catch (e) {
            setError('Erreur lors de la recherche. Veuillez réessayer.');
            Alert.alert('Erreur', 'Erreur lors de la recherche. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadJobs().finally(() => setRefreshing(false));
    }, []);

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

    const JobCard = ({ job }: { job: JobOffer }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => job.url && handleOpenJob(job.url)}
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
                        <Briefcase size={16} color="#666666" />
                        <Text style={styles.metadataText}>{job.salary}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.description} numberOfLines={3}>
                {job.description}
            </Text>

            <Text style={styles.postedDate}>{job.postedDate}</Text>

            <View style={styles.cardFooter}>
                <Text style={styles.seeMoreText}>
                    Appuyez pour voir les détails →
                </Text>
            </View>
        </TouchableOpacity>
    );

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
                    <Text style={styles.headerTitle}>Offres d'emploi Actual</Text>
                    <Briefcase color="#FFFFFF" size={24} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.searchSection}>
                        <View style={styles.searchInputContainer}>
                            <Search
                                size={20}
                                color="#9CA3AF"
                                style={styles.searchIcon}
                            />
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
                            <MapPin
                                size={20}
                                color="#9CA3AF"
                                style={styles.searchIcon}
                            />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#4c51c6',
    },
    backButton: {
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
    },
    searchInputContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        top: 12,
    },
    input: {
        backgroundColor: '#FFFFFF',
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
    },
    errorText: {
        color: '#DC2626',
        textAlign: 'center',
        marginBottom: 12,
    },
    noResultsText: {
        color: '#6B7280',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#4c51c6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        marginTop: 12,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
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
});