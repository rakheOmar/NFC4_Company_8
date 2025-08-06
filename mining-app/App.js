import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Dashboard from './screens/MineOpsDashboard';
import Survey from './screens/SurveyPage';
import Support from './screens/Support';
import TermsOfService from './screens/TermsOfService';
import ThankYou from './screens/ThankYou';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Survey" component={Survey} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="TermsOfService" component={TermsOfService} />
        <Stack.Screen name="ThankYou" component={ThankYou} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
