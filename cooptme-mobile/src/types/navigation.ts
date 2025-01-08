import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
    Dashboard: undefined;
    Contacts: undefined;
    Chat: undefined;
    Profiles: { userId?: string };
};

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    MainApp: NavigatorScreenParams<TabParamList>;
    Events: undefined;
    JobList: undefined;
    Scan: undefined;
    Settings: undefined;
    Help: undefined;
    ProfileDetail: { profileId: string };
    ChatConversation: { chatId: string; name: string };
};

export type DrawerParamList = {
    MainTabs: undefined;
    Settings: undefined;
    Help: undefined;
    Logout: undefined;
};

export type JobListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'JobList'>;
export type EventsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Events'
>;
