import { NavigatorScreenParams } from '@react-navigation/native';

// Types pour le Tab Navigator principal
export type MainTabParamList = {
    Dashboard: undefined;
    MyAccount: undefined;
    Chat: undefined;
    Scan: undefined;
    Profiles: { userId?: string };
    Contacts: undefined;
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
    Home: undefined;
    Login: undefined;
    MainApp: NavigatorScreenParams<DrawerParamList>;
    Events: undefined;
    JobList: undefined;
    Scan: undefined;
    ProfileDetail: { profileId: string };
    ChatConversation: { chatId: string; name: string };
};
