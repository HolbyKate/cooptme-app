import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { ArrowLeft, Plus, Briefcase } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

type JobFormData = {
    title: string;
    company: string;
    location: string;
    contractType: string;
    salary: string;
    description: string;
    requirements: string[];
    benefits: string[];
};

export default function JobScreen() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        company: '',
        location: '',
        contractType: '',
        salary: '',
        description: '',
        requirements: [''],
        benefits: [''],
    });

    const addRequirement = () => {
        setFormData({
            ...formData,
            requirements: [...formData.requirements, ''],
        });
    };

    const addBenefit = () => {
        setFormData({
            ...formData,
            benefits: [...formData.benefits, ''],
        });
    };

    const updateRequirement = (index: number, value: string) => {
        const updatedRequirements = [...formData.requirements];
        updatedRequirements[index] = value;
        setFormData({
            ...formData,
            requirements: updatedRequirements,
        });
    };

    const updateBenefit = (index: number, value: string) => {
        const updatedBenefits = [...formData.benefits];
        updatedBenefits[index] = value;
        setFormData({
            ...formData,
            benefits: updatedBenefits,
        });
    };

    const handleSubmit = () => {
        // Ici, vous pouvez ajouter la logique pour envoyer les données
        console.log('Form Data:', formData);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft color="#4247BD" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Créer une offre d'emploi</Text>
                    <Briefcase color="#4247BD" size={24} />
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.formSection}>
                        <Text style={styles.label}>Titre du poste</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.title}
                            onChangeText={(value) => setFormData({ ...formData, title: value })}
                            placeholder="Ex: Développeur Full-Stack"
                        />

                        <Text style={styles.label}>Entreprise</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.company}
                            onChangeText={(value) => setFormData({ ...formData, company: value })}
                            placeholder="Nom de l'entreprise"
                        />

                        <Text style={styles.label}>Localisation</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.location}
                            onChangeText={(value) => setFormData({ ...formData, location: value })}
                            placeholder="Ex: Paris, France"
                        />

                        <Text style={styles.label}>Type de contrat</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.contractType}
                            onChangeText={(value) => setFormData({ ...formData, contractType: value })}
                            placeholder="Ex: CDI, CDD, Freelance"
                        />

                        <Text style={styles.label}>Rémunération</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.salary}
                            onChangeText={(value) => setFormData({ ...formData, salary: value })}
                            placeholder="Ex: 45-55k€ annuel"
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Description du poste</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.description}
                            onChangeText={(value) => setFormData({ ...formData, description: value })}
                            placeholder="Décrivez le poste en détail..."
                            multiline
                            numberOfLines={6}
                        />

                        <Text style={styles.label}>Prérequis</Text>
                        {formData.requirements.map((req, index) => (
                            <TextInput
                                key={index}
                                style={styles.input}
                                value={req}
                                onChangeText={(value) => updateRequirement(index, value)}
                                placeholder={`Prérequis ${index + 1}`}
                            />
                        ))}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addRequirement}
                        >
                            <Plus color="#4247BD" size={20} />
                            <Text style={styles.addButtonText}>Ajouter un prérequis</Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Avantages</Text>
                        {formData.benefits.map((benefit, index) => (
                            <TextInput
                                key={index}
                                style={styles.input}
                                value={benefit}
                                onChangeText={(value) => updateBenefit(index, value)}
                                placeholder={`Avantage ${index + 1}`}
                            />
                        ))}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addBenefit}
                        >
                            <Plus color="#4247BD" size={20} />
                            <Text style={styles.addButtonText}>Ajouter un avantage</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Publier l'offre</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        color: '#4247BD',
    },
    content: {
        flex: 1,
    },
    formSection: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 8,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginTop: 8,
    },
    addButtonText: {
        color: '#4247BD',
        fontSize: 16,
        marginLeft: 8,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    submitButton: {
        backgroundColor: '#4247BD',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});