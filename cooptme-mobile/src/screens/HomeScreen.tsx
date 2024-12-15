import React, { useRef, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const video = useRef<Video>(null);
  const contactUrl = "https://www.linkedin.com/in/cathyaugustin/";
  const qrSlideAnim = useRef(new Animated.Value(200)).current;
  const qrOpacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const [isQRVisible, setIsQRVisible] = useState(false);

  const toggleQRCode = () => {
    if (!isQRVisible) {
      setIsQRVisible(true);
      Animated.parallel([
        Animated.timing(qrSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(qrOpacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(qrSlideAnim, {
          toValue: 200,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(qrOpacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setIsQRVisible(false));
    }
  };

  const handleQRPress = () => {
    Linking.openURL(contactUrl);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4247BD", "#4247BD", "#4247BD"]}
        locations={[0, 0.5, 1]}
        style={styles.background}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("MainApp")}
      >
        <Text style={styles.loginButtonText}>Login / Sign In</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Video
            ref={video}
            style={styles.logo}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            isLooping={true}
            isMuted={true}
            useNativeControls={false}
            source={require("../../assets/logo_bleu_video.mp4")}
          />
        </View>

        <Animated.Text style={[styles.text, { opacity: textOpacityAnim }]}>
          Scan it, you'll be coopted
        </Animated.Text>

        <TouchableOpacity style={styles.qrButton} onPress={toggleQRCode}>
          <Text style={styles.qrButtonText}>
            {isQRVisible ? "Hide QR Code" : "Show QR Code"}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.qrContainer,
            {
              transform: [{ translateX: qrSlideAnim }],
              opacity: qrOpacityAnim,
            },
          ]}
        >
          <TouchableOpacity onPress={handleQRPress}>
            <View style={styles.qrBackground}>
              <QRCode
                value={contactUrl}
                size={120}
                color="black"
                backgroundColor="white"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  logoContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#FFFFFF",
    position: "absolute",
    top: "65%",
  },
  loginButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fef9f9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    fontFamily: "Quicksand-Bold",
    color: "#4247BD",
    fontSize: 14,
  },
  qrButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#FF8F66",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  qrButtonText: {
    fontFamily: "Quicksand-Bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  qrContainer: {
    position: "absolute",
    bottom: 100,
    zIndex: 3,
  },
  qrBackground: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
