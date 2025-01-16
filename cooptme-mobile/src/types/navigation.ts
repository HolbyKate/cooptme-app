import { NavigatorScreenParams } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type MainTabParamList = {
    Dashboard: undefined;
    Events: undefined;
    JobList: undefined;
    Calendar: { selectedDate?: string };
    Chat: undefined;
    Profiles: { userId?: string };
    Contacts: undefined;
    Scan: undefined;
    MyAccount: undefined;
};

export type DrawerParamList = {
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    Settings: undefined;
    Help: undefined;
    Logout: undefined;
    MyAccount: undefined;
};

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    MainApp: NavigatorScreenParams<DrawerParamList>;
    MyAccount: undefined;
    Contacts: undefined;
    Profiles: { userId?: string };
    Events: undefined;
    Calendar: { selectedDate?: string };
    JobList: undefined;
    Scan: undefined;
    ProfileDetail: { profileId: string };
    ChatConversation: { chatId: string; name: string };
};

export type DashboardScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    CompositeNavigationProp<
        DrawerNavigationProp<DrawerParamList>,
        NativeStackNavigationProp<RootStackParamList>
    >
>;