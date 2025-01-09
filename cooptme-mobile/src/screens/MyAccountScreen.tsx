import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Platform,
    Image,
    Dimensions,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Linking from 'expo-linking';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;

export default function MyAccountScreen() {
    const navigation = useNavigation();
    const [userData] = useState({
        name: 'Cathy Augustin',
        title: 'Full Stack Developer Student',
        company: 'Holberton School',
        linkedinUrl: 'https://www.linkedin.com/in/cathyaugustin',
        photo: require('../../assets/default-avatar.png'),
    });

    const qrSlideAnim = useRef(new Animated.Value(200)).current;
    const qrOpacityAnim = useRef(new Animated.Value(0)).current;
    const [isQRVisible, setIsQRVisible] = useState(false);

    const handleMenuPress = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

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
            ]).start(() => setIsQRVisible(false));
        }
    };

    const handleQRPress = () => {
        if (userData.linkedinUrl) {
            Linking.openURL(userData.linkedinUrl);
        }
    };

    const renderAvatar = () => {
        if (userData.photo) {
            return (
                <Image
                    source={userData.photo}
                    style={styles.avatar}
                    defaultSource={require('../../assets/default-avatar.png')}
                />
            );
        }

        return (
            <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                    {userData.name.split(' ').map(n => n[0]).join('')}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#4247BD', '#4c51c6']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity
                    onPress={handleMenuPress}
                    style={styles.menuButton}
                >
                    <Menu color="#fef9f9" size={24} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <View style={styles.avatarContainer}>
                        {renderAvatar()}
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{userData.name}</Text>
                        <Text style={styles.title}>{userData.title}</Text>
                        <Text style={styles.company}>{userData.company}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.qrButton}
                        onPress={toggleQRCode}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.qrButtonText}>
                            {isQRVisible ? "Thanks" : "Cooptme"}
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
                        <TouchableOpacity
                            onPress={handleQRPress}
                            activeOpacity={0.9}
                        >
                            <View style={styles.qrBackground}>
                                <QRCode
                                    value={userData.linkedinUrl}
                                    size={120}
                                    color="#4247BD"
                                    backgroundColor="white"
                                />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    menuButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        zIndex: 100,
        padding: 8,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    avatarContainer: {
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        width: windowWidth * 0.3,
        height: windowWidth * 0.3,
        borderRadius: (windowWidth * 0.3) / 2,
        backgroundColor: '#fef9f9',
    },
    avatarPlaceholder: {
        width: windowWidth * 0.3,
        height: windowWidth * 0.3,
        borderRadius: (windowWidth * 0.3) / 2,
        backgroundColor: '#fef9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: windowWidth * 0.1,
        color: '#4247BD',
        fontWeight: 'bold',
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fef9f9',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        color: '#fef9f9',
        opacity: 0.8,
        marginBottom: 4,
    },
    company: {
        fontSize: 14,
        color: '#fef9f9',
        opacity: 0.7,
    },
    qrButton: {
        backgroundColor: '#FF8F66',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    qrButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    qrContainer: {
        position: 'absolute',
        bottom: 100,
        zIndex: 3,
    },
    qrBackground: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});