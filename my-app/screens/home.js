import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Chatbot from './chatbot';
import FacialAnalysis from './facialanalysis';
import TextAnalysis from './textanalysis';
import Dashboard from './dashboard';
import MeditationExercises from './meditation';

const Tab = createBottomTabNavigator();

export default function Home(){
    return (
        <Tab.Navigator
        initialRouteName="Chatbot"
        tabBarOptions={{
            activeTintColor: '#e91e63',
        }}
        screenOptions={{headerShown: false}}
        >
        <Tab.Screen
            name="Chatbot"
            component={Chatbot}
            options={{
            tabBarLabel: 'Chatbot',
            tabBarLabelStyle: {fontSize: 12,fontWeight: 'bold'},
            tabBarIcon: ({ color, size }) => (
                <Icon name="chat" color={"#787198"} size={30} />
            ),
            }}
        />
        <Tab.Screen
            name="Stats"
            component={Dashboard}
            options={{
            tabBarLabel: 'Stats',
            tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
            tabBarIcon: ({ color, size }) => (
                <Icon name="text" color={"#787198"} size={30} />
            ),
            }}
        />
        <Tab.Screen
            name='Meditation'
            component={MeditationExercises}
            options={{
            tabBarLabel: 'Meditation',
            tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
            tabBarIcon: ({ color, size }) => (
                <Icon name="meditation" color={"#787198"} size={30} />
            ),
            }}
        />
        </Tab.Navigator>
    );
}