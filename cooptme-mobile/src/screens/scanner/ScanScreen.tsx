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
  Linking
} from "react-native";
import { Overlay } from "./Overlay";

type Props = {
  navigation: any;
};

export default function ScanScreen({ navigation }: Props) {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
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

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    console.log("QR Code détecté :", { type, data });

    if (data && !qrLock.current) {
      qrLock.current = true;

      try {
        if (data.includes("linkedin.com/in/")) {
          Alert.alert(
            "Profil LinkedIn détecté",
            "Voulez-vous ouvrir ce profil ?",
            [
              {
                text: "Annuler",
                onPress: () => {
                  qrLock.current = false;
                },
                style: "cancel"
              },
              {
                text: "Ouvrir",
                onPress: async () => {
                  try {
                    await Linking.openURL(data);
                  } catch (error) {
                    Alert.alert("Erreur", "Impossible d'ouvrir le lien LinkedIn");
                  } finally {
                    qrLock.current = false;
                  }
                }
              }
            ]
          );
        } else {
          throw new Error("Ce QR code ne contient pas de profil LinkedIn valide");
        }
      } catch (error: any) {
        console.error("Erreur lors du traitement du QR Code :", error);
        Alert.alert("Erreur", error.message || "QR Code invalide");
        qrLock.current = false;
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Demande d'autorisation de la caméra...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Accès à la caméra refusé</Text>;
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