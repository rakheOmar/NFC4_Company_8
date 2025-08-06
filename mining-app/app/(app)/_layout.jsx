import { Stack } from 'expo-router';
// Import your custom header/footer components if you have them
// import Navbar from '../../components/Navbar'; 
// import Footer from '../../components/Footer';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="worker-dashboard" options={{ title: 'Worker Dashboard' }} />
      <Stack.Screen name="admin" options={{ title: 'Admin Dashboard' }} />
      {/* ... Add Stack.Screen for all other main app routes ... */}
      <Stack.Screen name="careers" options={{ title: 'Careers' }} />
      <Stack.Screen name="survey" options={{ title: 'Survey' }} />
      <Stack.Screen name="thank-you" options={{ title: 'Thank You' }} />
      <Stack.Screen name="sentiment-summary" options={{ title: 'Sentiment Summary' }} />
      <Stack.Screen name="privacy-policy" options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="terms-of-service" options={{ title: 'Terms of Service' }} />
      <Stack.Screen name="support" options={{ title: 'Support' }} />
      <Stack.Screen name="log-verify" options={{ title: 'Log Explorer' }} />
    </Stack>
  );
}