import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import MyAccountScreen from '../screens/User/MyAccountScreen';
import SettingsScreen from '../screens/Drawer/SettingsScreen';
import HelpScreen from '../screens/Drawer/HelpScreen';
import CustomDrawer from '../components/CustomDrawer';
import { Settings, HelpCircle, User, LogOut } from 'lucide-react-native';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import type { DrawerParamList } from './types';


const Drawer = createDrawerNavigator<DrawerParamList>();
const LogoutScreen: React.FC = () => null;


export default function DrawerNavigator() {
    const navigation = useNavigation();
    const { signOut } = useAuth();
    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Déconnecter',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' as never }]
                        }); // Redirige vers l'écran Home après déconnexion
                    }
                }
            ]
        );
    };

    return (
        <Drawer.Navigator
            drawerContent={props => (
                <CustomDrawer {...props} onLogout={handleLogout} /> // Passe la fonction handleLogout au composant CustomDrawer
            )}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="BottomTabs"
                component={BottomTabNavigator}
                options={{
                    title: 'Accueil',
                    headerTitle: 'CooptMe',
                }}
            />
            <Drawer.Screen
                name="MyAccount"
                component={MyAccountScreen}
                options={{
                    title: 'Mon compte',
                    drawerIcon: ({ color, size }) => <User size={size} color={color} />
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Paramètres',
                    drawerIcon: ({ color, size }) => <Settings size={size} color={color} />
                }}
            />
            <Drawer.Screen
                name="Help"
                component={HelpScreen}
                options={{
                    title: 'Aide',
                    drawerIcon: ({ color, size }) => <HelpCircle size={size} color={color} />
                }}
            />

            <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{
                    title: 'Déconnexion',
                    drawerIcon: ({ color, size }) => <LogOut size={size} color={color} />,
                    drawerItemStyle: { display: 'none' },
                }}
            />
        </Drawer.Navigator>
    );
}
