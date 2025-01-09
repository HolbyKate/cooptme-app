import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenWidth = width;
export const screenHeight = height;
export const isIOS = Platform.OS === 'ios';

export const scale = (size: number) => {
    const baseWidth = 375;
    return (width / baseWidth) * size;
};

export const verticalScale = (size: number) => {
    const baseHeight = 812;
    return (height / baseHeight) * size;
};