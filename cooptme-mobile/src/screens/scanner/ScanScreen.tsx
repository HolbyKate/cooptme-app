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
  Linking,
  TouchableOpacity
} from "react-native";
import { Overlay } from "./Overlay";

interface ScanScreenProps {
  navigation: any;
}

export default function ScanScreen({ navigation }: ScanScreenProps) {
  const qrLock = useRef(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isDevMode] = useState(__DEV__);

  useEffect(() => {
    ExpoCamera.requestCameraPermissionsAsync().then(({ status }) => {
      setHasPermission(status === "granted");
    });
  }, []);

  const simulateQRScan = () => {
    handleBarCodeScanned({ type: 'qr', data: "https://cooptme.com" });
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      try {
        await Linking.openURL(data);
      } catch (error) {
        Alert.alert("Erreur", "Impossible d'ouvrir le lien");
      }
      qrLock.current = false;
    }
  };

  if (hasPermission === null) return <Text>Demande d'autorisation de la caméra...</Text>;
  if (hasPermission === false) return <Text>Accès à la caméra refusé</Text>;

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === "android" && <StatusBar hidden />}
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
  testButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  testButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});