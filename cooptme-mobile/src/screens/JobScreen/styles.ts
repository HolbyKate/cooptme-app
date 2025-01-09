import { StyleSheet, Platform } from 'react-native';

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