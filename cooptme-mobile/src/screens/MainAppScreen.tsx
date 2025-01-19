import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from '../../src/screens/TabNavigator';
import CustomDrawer from '../components/CustomDrawer';
import SettingsScreen from './drawer/SettingsScreen';
import HelpScreen from './drawer/HelpScreen';
import LogoutScreen from './drawer/LogoutScreen';

const Drawer = createDrawerNavigator();

export default function MainAppScreen() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: 280,
                }
            }}
        >
            <Drawer.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{
                    title: 'Accueil'
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Paramètres'
                }}
            />
            <Drawer.Screen
                name="Help"
                component={HelpScreen}
                options={{
                    title: 'Aide'
                }}
            />
            <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{
                    title: 'Déconnexion'
                }}
            />
        </Drawer.Navigator>
    );
}