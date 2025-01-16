import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SharedHeader, HeaderProps } from './SharedHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
    headerProps: HeaderProps;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    headerProps,
    children,
    style
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, style]}>
            <SharedHeader {...headerProps} />
            <View style={[
                styles.content,
                {
                    paddingBottom: insets.bottom + 80,
                }
            ]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingBottom: 0,
    },
});