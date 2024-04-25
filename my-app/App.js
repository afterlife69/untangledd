import * as React from 'react';
import { Button, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/login';
import Signup from './screens/signup';
import FacialAnalysis from './screens/facialanalysis';
import TextAnalysis from './screens/textanalysis';
import Chatbot from './screens/chatbot';
import { NavigationContainer } from '@react-navigation/native';
import Loading from './screens/loading';
import Home from './screens/home';
import Dashboard from './screens/dashboard';
import QuoteComponent from './screens/questionnaire';
import Questionnaire from './screens/questionnaire';
// import { createDrawerNavigator } from '@react-navigation/drawer'
const Stack = createStackNavigator();
export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Loading" component={Loading} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="FacialAnalysis" component={FacialAnalysis} />
          <Stack.Screen name="TextAnalysis" component={TextAnalysis} />
          <Stack.Screen name="Chatbot" component={Chatbot} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Questionnaire" component={Questionnaire} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}
