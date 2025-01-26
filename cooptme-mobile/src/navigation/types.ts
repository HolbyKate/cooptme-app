import { Contact } from '@/types';
import type { NavigatorScreenParams } from '@react-navigation/native';

export interface NewEventParams {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  categoryId: string;
}

// Bottom Tabs (navigation principale du bas)
export type BottomTabParamList = {
  Dashboard: undefined;
  MyAccount: undefined;
  Calendar: { selectedDate?: string };
  Chat: undefined;
  Scan: undefined;
};

// Drawer (menu latéral)
export type DrawerParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
  MyAccount: undefined;
  Settings: undefined;
  Help: undefined;
  Logout: undefined;
};

// Root Stack (navigation globale avec modales)
export type RootStackParamList = {
  // Auth Stack
  Home: undefined;
  Login: undefined;
  Register: undefined;

  // Main Stack (Drawer)
  DrawerRoot: NavigatorScreenParams<DrawerParamList>;

  // Modals (écrans accessibles depuis n'importe où)
  Dashboard: undefined;
  Contacts: undefined;
  Profiles: undefined;
  Events: undefined;
  Calendar: {
    selectedDate?: string;
    newEvent?: NewEventParams;
  };
  Job: undefined;
  Chat: undefined;
  ChatConversation: { chatId: string };
  Scan: undefined;
  ContactDetail: { contact: Contact };
};
