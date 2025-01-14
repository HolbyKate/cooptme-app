import { NavigatorScreenParams } from '@react-navigation/native';

// Types pour le Tab Navigator principal
export type MainTabParamList = {
    Dashboard: undefined;
    Events: undefined;
    JobList: undefined;
    Calendar: undefined;
    Chat: undefined;
    Profiles: undefined;
    Contacts: undefined;
    Scan: undefined;
    MyAccount: undefined;
};

// Types pour le Drawer
export type DrawerParamList = {
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    Settings: undefined;
    Help: undefined;
    Logout: undefined;
    MyAccount: undefined;
};

// Types pour le Root Stack
export type RootStackParamList = {
    MainApp: NavigatorScreenParams<DrawerParamList>;
    Dashboard: undefined;
    Events: undefined;
    JobList: undefined;
    Calendar: undefined;
    Chat: undefined;
    Profiles: undefined;
    Contacts: undefined;
    Scan: undefined;
    ProfileDetail: { profileId: string };
    ChatConversation: { chatId: string; name: string };
    Home: undefined;
    Login: undefined;
    MyAccount: undefined;
};