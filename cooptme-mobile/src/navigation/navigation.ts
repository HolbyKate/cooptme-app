import { NavigatorScreenParams } from '@react-navigation/native';

// Type pour le Tab Navigator principal
export type MainTabParamList = {
    Dashboard: undefined;
    Contacts: undefined;
    Profiles: { userId?: string };
    Events: undefined;
    Calendar: { selectedDate?: string };
    Job: undefined;
    Chat: undefined;
    Scan: undefined;
    MyAccount: undefined;
};

export type DrawerParamList = {
    TabNavigator: NavigatorScreenParams<MainTabParamList>;
    MyAccount: undefined;
    Settings: undefined;
    Help: undefined;
    Logout: undefined;
};

// Type pour le Root Stack Navigator
export type RootStackParamList = {
    // Auth
    Home: undefined;
    Login: undefined;
    Register: undefined;

    // Main
    MainApp: NavigatorScreenParams<DrawerParamList>;

    // Modals
    Contacts: undefined;
    Profiles: { userId?: string };
    Events: undefined;
    Calendar: { selectedDate?: string };
    Job: undefined;
    Chat: undefined;
    Scan: undefined;
    ChatConversation: { chatId: string; name: string };
};

// Types helpers pour la navigation
export type CompositeScreenParams<T extends keyof MainTabParamList> = {
    screen: T;
    params: MainTabParamList[T];
};

export type MainAppScreenParams = {
    screen: 'TabNavigator';
    params: CompositeScreenParams<keyof MainTabParamList>;
};
