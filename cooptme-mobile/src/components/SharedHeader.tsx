import React from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
    title: string;
    rightContent?: React.ReactNode;
}

export const SharedHeader: React.FC<HeaderProps> = ({ title, rightContent }) => {
    const insets = useSafeAreaInsets();
    const statusBarHeight = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;

    return (
        <View style={[styles.headerContainer, { paddingTop: statusBarHeight }]}>
            <StatusBar
                backgroundColor="#4247BD"
                barStyle="light-content"
            />
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Image
                    source={require('../../assets/logo_blue.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#4247BD',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
    },
    title: {
        position: 'absolute',
        marginLeft: 100,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    rightContent: {
        position: 'absolute',
        marginLeft: 16,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: 40,
        width: 100,
        marginLeft: 'auto',
        marginRight: 10,
    },
});