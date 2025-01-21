import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import MyAccountScreen from '../screens/User/MyAccountScreen';
import SettingsScreen from '../screens/Drawer/SettingsScreen';
import HelpScreen from '../screens/Drawer/HelpScreen';
import LogoutScreen from '../screens/Drawer/LogoutScreen';
import CustomDrawer from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="BottomTabNavigator"
                component={BottomTabNavigator}
                options={{ title: 'Accueil' }}
            />
            <Drawer.Screen name="MyAccount" component={MyAccountScreen} options={{ title: 'Mon compte' }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres' }} />
            <Drawer.Screen name="Help" component={HelpScreen} options={{ title: 'Aide' }} />
            <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: 'Déconnexion' }} />
        </Drawer.Navigator>
    );
}


