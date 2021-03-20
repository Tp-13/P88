import React, { Component} from 'react';
import { Settings } from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import MyBartersScreen from '../screens/MyBartersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import NotificationsScreen from '../screens/NotificationsScreen';

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {screen: AppTabNavigator},
    Settings: {screen: SettingsScreen},
    MyBarters: {screen: MyBartersScreen},
    MyNotifications: {screen: NotificationsScreen}
  },
  { contentComponent: CustomSideBarMenu },
  { initialRouteName: 'Home' }
);
