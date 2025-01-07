// screens/HelpScreen.tsx
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { ArrowLeft, Mail, Phone, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

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
            answer: "Vous pouvez nous contacter par email à support@app.com ou par téléphone au +33 1 23 45 67 89."
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft color="#4247BD" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Aide</Text>
                <View style={styles.placeholder} />
            </View>

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
                        <Text style={styles.contactText}>support@app.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem}>
                        <Phone color="#4247BD" size={24} />
                        <Text style={styles.contactText}>+33 1 23 45 67 89</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem}>
                        <Globe color="#4247BD" size={24} />
                        <Text style={styles.contactText}>www.app.com</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4247BD',
        marginBottom: 16,
    },
    faqItem: {
        marginBottom: 20,
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    contactText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
});