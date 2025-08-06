import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { MotiView } from "moti";

const sections = [
  {
    heading: "1. Introduction",
    content:
      "CoalGuard is committed to protecting your personal information and your right to privacy. This Privacy Policy outlines how we collect, use, store, and protect your data when you interact with our platform.",
  },
  {
    heading: "2. Information We Collect",
    content:
      "We collect information you provide directly (such as name, email, organization), and data automatically through your usage of the platform (like IP address, device info, and usage behavior).",
  },
  {
    heading: "3. How We Use Your Information",
    content:
      "Your information is used to provide platform services, monitor mining safety, personalize dashboards, improve analytics, and send real-time alerts relevant to coal mining operations.",
  },
  {
    heading: "4. Data Sharing",
    content:
      "We do not sell your personal information. We may share data with third-party services only to enhance platform functionality (e.g., analytics or alert systems), and only if they meet our security standards.",
  },
  {
    heading: "5. Security Measures",
    content:
      "We employ strong encryption protocols and security practices to protect your information. Access to your data is restricted and monitored to prevent unauthorized usage.",
  },
  {
    heading: "6. Data Retention",
    content:
      "Your data is retained only for as long as necessary to fulfill the purposes outlined in this policy. You can request deletion of your data at any time by contacting our support.",
  },
  {
    heading: "7. Cookies and Tracking",
    content:
      "We use cookies and tracking technologies for improving user experience, analytics, and functionality. You can manage cookie settings from your browser.",
  },
  {
    heading: "8. Your Rights",
    content:
      "You have the right to access, update, delete, or restrict the processing of your data. To exercise these rights, please contact us at support@coalguard.tech.",
  },
  {
    heading: "9. Changes to This Policy",
    content:
      "We may update this privacy policy from time to time. Changes will be reflected on this page and, where appropriate, notified to you.",
  },
  {
    heading: "10. Contact Us",
    content:
      "If you have any questions, concerns, or requests regarding this privacy policy or your personal data, contact us at support@coalguard.tech.",
  },
];

const PrivacyPolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
      >
        <Text style={styles.title}>Privacy Policy</Text>
      </MotiView>

      {sections.map((section, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            delay: index * 200,
            duration: 600,
          }}
          style={styles.section}
        >
          <Text style={styles.heading}>{section.heading}</Text>
          <Text style={styles.content}>{section.content}</Text>
        </MotiView>
      ))}

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2000, duration: 800 }}
      >
        <Text style={styles.footer}>
          This policy is effective as of August 2025.
        </Text>
      </MotiView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937", // Tailwind gray-800
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ea580c", // Tailwind orange-600
    marginBottom: 6,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151", // Tailwind gray-700
    textAlign: "justify",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280", // Tailwind gray-500
  },
});

export default PrivacyPolicy;
