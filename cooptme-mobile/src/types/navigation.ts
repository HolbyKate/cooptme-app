import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
    Dashboard: undefined;
    Events: undefined;
    Job: undefined;
    Calendar: { selectedDate?: string };
    Chat: undefined;
    Profiles: { userId?: string };
    Contacts: undefined;
    Scan: undefined;
    MyAccount: undefined;
};

export type DrawerParamList = {
    TabNavigator: NavigatorScreenParams<MainTabParamList>;
    MyAccount: undefined;
    Logout: undefined;
    Settings: undefined;
    Help: undefined;
};

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainApp: undefined;
    ChatConversation: { chatId: string; name: string };
    Profiles: { userId?: string };
    Contacts: undefined;
    Scan: undefined;
    Home: undefined;
    Events: undefined;
    Calendar: { selectedDate?: string };
    Job: undefined;
    TabNavigator: NavigatorScreenParams<MainTabParamList>;
    MyAccount: undefined;
    Settings: undefined;
    Help: undefined;
};
