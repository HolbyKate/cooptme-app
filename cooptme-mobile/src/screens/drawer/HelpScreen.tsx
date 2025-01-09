import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Platform,
    Image,
} from 'react-native';
import { ArrowLeft, Mail, Phone, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HelpScreen() {
    const navigation = useNavigation();

    const faqItems = [
        {
            question: "Comment scanner un QR code ?",
            answer: "Accédez à l'écran Scanner depuis le dashboard et pointez votre caméra vers le QR code. L'application détectera automatiquement le code et traitera les informations."
        },
        {
            question: "Comment modifier mon profil ?",
            answer: "Allez dans l'onglet Profil, puis cliquez sur le bouton modifier en haut à droite de l'écran. Vous pourrez alors mettre à jour vos informations."
        },
        {
            question: "Comment contacter le support ?",
            answer: "Vous pouvez nous contacter par email à contact@cooptme.com ou par téléphone au +33 1 23 45 67 89."
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#4247BD', '#4c51c6']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Aide</Text>
                <Image
                    source={require('../../../assets/logo_blue.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </LinearGradient>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FAQ</Text>
                    {faqItems.map((item, index) => (
                        <View key={index} style={styles.faqItem}>
                            <Text style={styles.question}>{item.question}</Text>
                            <Text style={styles.answer}>{item.answer}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nous contacter</Text>

                    <TouchableOpacity style={styles.contactItem}>
                        <Mail color="#4247BD" size={24} />
                        <Text style={styles.contactText}>contact@cooptme.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem}>
                        <Phone color="#4247BD" size={24} />
                        <Text style={styles.contactText}>+33 1 23 45 67 89</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem}>
                        <Globe color="#4247BD" size={24} />
                        <Text style={styles.contactText}>www.cooptme.com</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    logo: {
        width: 100,
        height: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4247BD',
        marginBottom: 16,
    },
    faqItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    answer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    contactText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
});