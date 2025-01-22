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
    StyleSheet,
    Platform,
} from 'react-native';
import {
    ArrowLeft,
    Search,
    MapPin,
    Upload,
    Calendar,
    Euro,
    ChevronDown,
    ChevronUp,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { jobService } from '../../api/services/jobs/job.service';
import type { JobOffer, JobSearchParams } from '../../types/index';


// Composant JobCard séparé
interface JobCardProps {
    job: JobOffer;
    isSelected: boolean;
    onSelect: () => void;
    onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onSelect, onApply }) => (
    <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={onSelect}
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
            {job.remote && (
                <View style={styles.remoteBadge}>
                    <Text style={styles.remoteText}>Remote</Text>
                </View>
            )}
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
                isSelected ? styles.expandedDescription : styles.collapsedDescription
            ]}
            numberOfLines={isSelected ? undefined : 3}
        >
            {job.description}
        </Text>

        {isSelected && (
            <>
                <View style={styles.skillsContainer}>
                    {job.skills.map((skill, index) => (
                        <View key={index} style={styles.skillBadge}>
                            <Text style={styles.skillText}>{skill}</Text>
                        </View>
                    ))}
                </View>

                {job.url && (
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={onApply}
                    >
                        <Text style={styles.applyButtonText}>Voir l'offre complète</Text>
                    </TouchableOpacity>
                )}
            </>
        )}
    </TouchableOpacity>
);

interface CategorySectionProps {
    category: string;
    jobs: JobOffer[];
    isExpanded: boolean;
    onToggle: () => void;
    selectedJobId: string | null;
    onJobSelect: (id: string) => void;
    onJobApply: (url: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
    category,
    jobs,
    isExpanded,
    onToggle,
    selectedJobId,
    onJobSelect,
    onJobApply
}) => (
    <View style={styles.categorySection}>
        <TouchableOpacity onPress={onToggle} style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{jobs.length}</Text>
            </View>
            {isExpanded ? (
                <ChevronUp size={24} color="#4B5563" />
            ) : (
                <ChevronDown size={24} color="#4B5563" />
            )}
        </TouchableOpacity>

        {isExpanded && (
            <View>
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        isSelected={job.id === selectedJobId}
                        onSelect={() => onJobSelect(job.id)}
                        onApply={() => job.url && onJobApply(job.url)}
                    />
                ))}
            </View>
        )}
    </View>
);

interface FileDropZoneProps {
    onFileSelect: () => void;
    uploading: boolean;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileSelect, uploading }) => {
    return (
        <TouchableOpacity
            style={styles.dropZone}
            onPress={onFileSelect}
            disabled={uploading}
        >
            <Upload size={32} color="#4B5563" />
            <Text style={styles.dropZoneText}>
                Importer des offres d'emploi
            </Text>
            <Text style={styles.dropZoneSubText}>
                Format accepté : CSV
            </Text>
            {uploading && (
                <ActivityIndicator
                    style={styles.uploadingIndicator}
                    size="small"
                    color="#4c51c6"
                />
            )}
        </TouchableOpacity>
    );
};

// Composant principal
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
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const loadJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const searchParams: JobSearchParams = {
                term: searchTerm,
                location: location,
            };
            const fetchedJobs = await jobService.fetchJobs(searchParams);
            setJobs(fetchedJobs);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue';
            setError(errorMessage);
            Alert.alert('Erreur', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, location]);

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

                const uploadResult = await jobService.uploadJobsCSV(formData);
                if (uploadResult.success) {
                    Alert.alert('Succès', 'Les offres ont été importées avec succès');
                    loadJobs();
                } else {
                    throw new Error('Échec de l\'import');
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            Alert.alert('Erreur', `Erreur lors de l'importation du fichier : ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadJobs().finally(() => setRefreshing(false));
    }, [loadJobs]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const groupedJobs = jobs.reduce((acc, job) => {
        const category = job.category || 'Autres';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(job);
        return acc;
    }, {} as Record<string, JobOffer[]>);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Gestion des offres d'emploi</Text>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <FileDropZone onFileSelect={handleFileUpload} uploading={uploading} />

                    {/* Search Section */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchInputContainer}>
                            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Rechercher un poste..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                onSubmitEditing={loadJobs}
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
                                onSubmitEditing={loadJobs}
                                returnKeyType="search"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={loadJobs}
                        >
                            <Text style={styles.searchButtonText}>Rechercher</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
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
                        <View style={styles.categoriesContainer}>
                            {Object.entries(groupedJobs).map(([category, categoryJobs]) => (
                                <CategorySection
                                    key={category}
                                    category={category}
                                    jobs={categoryJobs}
                                    isExpanded={expandedCategories.includes(category)}
                                    onToggle={() => {
                                        setExpandedCategories(prev =>
                                            prev.includes(category)
                                                ? prev.filter(c => c !== category)
                                                : [...prev, category]
                                        );
                                    }}
                                    selectedJobId={selectedJobId}
                                    onJobSelect={setSelectedJobId}
                                    onJobApply={handleOpenJob}
                                />
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
    },
    dropZone: {
        margin: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropZoneText: {
        fontSize: 16,
        color: '#4B5563',
        marginTop: 12,
        textAlign: 'center',
    },
    dropZoneSubText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    uploadingIndicator: {
        marginTop: 12,
    },
    categorySection: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 8,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    categoryCount: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    categoryCountText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    categoriesContainer: {
        padding: 16,
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
    }
});