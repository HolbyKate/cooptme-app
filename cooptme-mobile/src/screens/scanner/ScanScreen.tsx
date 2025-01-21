import React, { useState, useRef, useEffect } from "react";
import { CameraView, Camera as ExpoCamera } from 'expo-camera';
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  Text,
} from "react-native";
import { Overlay } from "../../screens/Scanner/Overlay";
import { profileService } from '../../api/services/profiles/profileService';
import { CategoryTitle } from '../../types/index';
import { LinkedInBrowser } from "../../components/LinkedInBrowser";
import { Gender, LinkedInProfile } from '../../types/index';

type Props = {
  navigation: any;
};

export default function ScanScreen({ navigation }: Props) {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [isLinkedInBrowserVisible, setLinkedInBrowserVisible] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermission();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleProfileScraped = async (scrapedProfile: LinkedInProfile) => {
    try {
      const completeProfile = {
        ...scrapedProfile,
        category: 'À qualifier' as CategoryTitle,
        photoId: null,
        gender: 'unknown' as Gender
      };

      await profileService.saveProfile(completeProfile);
      Alert.alert(
        "Succès",
        "Le profil a été ajouté avec succès",
        [
          {
            text: "Voir les profils",
            onPress: () => navigation.navigate('Profiles', { userId: undefined })
          },
          {
            text: "Scanner un autre",
            onPress: () => {
              setLinkedInBrowserVisible(false);
              qrLock.current = false;
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'enregistrer le profil. Veuillez réessayer."
      );
      qrLock.current = false;
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
  console.log("QR Code détecté :", { type, data });
  if (data && !qrLock.current) {
    qrLock.current = true;
    if (data.includes("linkedin.com/in/") || data.includes("eqrco.de")) {
      setProfileUrl(data);
      setLinkedInBrowserVisible(true);
    } else {
      Alert.alert(
        "QR Code invalide",
        "Ce QR code ne contient pas de profil LinkedIn valide.",
        [
          {
            text: "OK",
            onPress: () => {
              qrLock.current = false;
            }
          }
        ]
      );
    }
  }
};

  if (hasPermission === null) {
    return <Text>Demande d'autorisation de la caméra...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Accès à la caméra refusé.</Text>;
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />
      <Overlay />

      <LinkedInBrowser
        isVisible={isLinkedInBrowserVisible}
        profileUrl={profileUrl}
        onClose={() => {
          setLinkedInBrowserVisible(false);
          qrLock.current = false;
        }}
        onProfileScraped={handleProfileScraped}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  testButtonContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});