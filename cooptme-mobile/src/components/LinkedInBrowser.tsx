import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import WebView from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { LinkedInProfile, Gender } from '../types/linkedinProfile';
import { CategoryTitle } from '../types/contacts';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    isVisible: boolean;
    profileUrl: string;
    onClose: () => void;
    onProfileScraped: (profile: LinkedInProfile) => void;
}

export const LinkedInBrowser: React.FC<Props> = ({
    isVisible,
    profileUrl,
    onClose,
    onProfileScraped,
}) => {
    const webViewRef = useRef<WebView>(null);
    const [currentUrl, setCurrentUrl] = useState<string>(profileUrl);

    const LINKEDIN_SCRAPING_SCRIPT = `
    function extractProfileData() {
      try {
        // Attendre que les éléments se chargent
        if (!document.querySelector('.pv-top-card')) {
          console.log("Elements LinkedIn non trouvés, réessai dans 1 seconde");
          setTimeout(() => extractProfileData(), 1000);
          return;
        }

        // Extraction du nom complet
        const nameElement = document.querySelector('.text-heading-xlarge');
        const fullName = nameElement ? nameElement.textContent.trim() : '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Extraction du titre et de l'entreprise
        const titleElement = document.querySelector('.text-body-medium');
        const titleText = titleElement ? titleElement.textContent.trim() : '';
        
        // Séparation du titre et de l'entreprise (si format "Titre chez Entreprise")
        let title = titleText;
        let company = '';
        
        const chezIndex = titleText.toLowerCase().indexOf(' chez ');
        if (chezIndex !== -1) {
          title = titleText.substring(0, chezIndex).trim();
          company = titleText.substring(chezIndex + 6).trim();
        }

        // Extraction de la localisation
        const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
        const location = locationElement ? locationElement.textContent.trim() : '';

        const profileData = {
          firstName,
          lastName,
          title,
          company,
          location,
          profileUrl: window.location.href.split('?')[0],
          scannedAt: new Date().toISOString()
        };

        // Log pour le débogage
        console.log("Données extraites:", JSON.stringify(profileData));

        if (profileData.firstName && profileData.lastName) {
          window.ReactNativeWebView.postMessage(JSON.stringify(profileData));
        } else {
          console.log("Données incomplètes, réessai dans 1 seconde");
          setTimeout(() => extractProfileData(), 1000);
        }
      } catch (error) {
        console.error('Erreur lors de l\\'extraction:', error);
        setTimeout(() => extractProfileData(), 1000);
      }
    }

    // Démarrer l'extraction
    extractProfileData();
  `;

    const handleNavigationStateChange = (newNavState: WebViewNavigation) => {
        console.log("Navigation vers:", newNavState.url);
        setCurrentUrl(newNavState.url);

        if (newNavState.url.includes('linkedin.com/in/')) {
            // Attendre que la page soit complètement chargée
            setTimeout(() => {
                console.log("Injection du script de scraping");
                webViewRef.current?.injectJavaScript(LINKEDIN_SCRAPING_SCRIPT);
            }, 2000);
        }
    };

    const handleMessage = (event: { nativeEvent: { data: string } }) => {
        try {
            const scrapedData = JSON.parse(event.nativeEvent.data);
            console.log("Données reçues:", scrapedData);

            // Construction du profil complet avec les valeurs par défaut
            const profileData: LinkedInProfile = {
                id: uuidv4(),
                firstName: scrapedData.firstName,
                lastName: scrapedData.lastName,
                title: scrapedData.title,
                company: scrapedData.company,
                location: scrapedData.location,
                category: 'À qualifier' as CategoryTitle,
                profileUrl: scrapedData.profileUrl,
                scannedAt: scrapedData.scannedAt,
                photoId: null,
                gender: 'unknown' as Gender
            };

            console.log("Profil extrait:", profileData);

            if (profileData.firstName && profileData.lastName) {
                onProfileScraped(profileData);
            }
        } catch (error) {
            console.error('Erreur lors du parsing des données:', error);
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <WebView
                    ref={webViewRef}
                    source={{ uri: profileUrl }}
                    style={styles.webview}
                    onNavigationStateChange={handleNavigationStateChange}
                    onMessage={handleMessage}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    )}
                    userAgent={
                        Platform.select({
                            android: 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
                            ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                        })
                    }
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 40 : 0,
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});