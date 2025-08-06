// app/_layout.jsx
import { Stack } from 'expo-router';
import React from 'react';

// This is a placeholder for your actual authentication state
// You would replace this with a context or a global state management solution
const isLoggedIn = false; 

export default function RootLayout() {
  if (isLoggedIn) {
    return <Stack />;
  } else {
    return <Stack screenOptions={{ headerShown: false }} />;
  }
}