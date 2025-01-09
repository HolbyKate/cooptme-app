import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useAuthRequest } from "expo-auth-session";
import { profileService } from "../services/profileService";

const CLIENT_ID = "YOUR_LINKEDIN_CLIENT_ID";
const REDIRECT_URI = "YOUR_REDIRECT_URI"; // Replace with your redirect URI
const AUTHORIZATION_ENDPOINT = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_ENDPOINT = "https://www.linkedin.com/oauth/v2/accessToken";

export default function LinkedInLoginScreen() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: CLIENT_ID,
            redirectUri: REDIRECT_URI,
            scopes: ["r_liteprofile", "r_emailaddress"],
            responseType: "code",
        },
        { authorizationEndpoint: AUTHORIZATION_ENDPOINT }
    );

    useEffect(() => {
        const fetchAccessToken = async (code: string) => {
            try {
                const accessToken = await profileService.getAccessToken(code);
                Alert.alert("Succès", "Authentification réussie !");
                console.log("Access Token :", accessToken);
            } catch (error) {
                Alert.alert("Erreur", "Échec de l'authentification.");
                console.error("Erreur lors de l'obtention du token :", error);
            }
        };

        if (response?.type === "success") {
            const { code } = response.params;
            fetchAccessToken(code);
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Connectez-vous à LinkedIn</Text>
            <Button
                title="Se connecter"
                onPress={() => promptAsync()}
                disabled={!request}
                color="#0077B5"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 18, marginBottom: 20, textAlign: "center" },
});
