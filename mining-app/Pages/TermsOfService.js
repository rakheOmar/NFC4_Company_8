import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { MotiView } from "moti";

const sections = [
  {
    heading: "1. Acceptance of Terms",
    content:
      "By accessing or using CoalGuard, you confirm your agreement to be bound by these Terms of Service. If you do not agree, please discontinue use of the platform immediately.",
  },
  {
    heading: "2. Use of Platform",
    content:
      "You are responsible for your activities on CoalGuard. You agree to use it only for lawful purposes related to safety monitoring and sustainability in mining operations. Any abuse, unauthorized access attempts, or misuse will result in account termination.",
  },
  {
    heading: "3. Intellectual Property",
    content:
      "All content, software, logos, and features on CoalGuard are owned by us or our partners. You may not copy, modify, distribute, or reverse-engineer any part of the platform without prior written consent.",
  },
  {
    heading: "4. User Accounts",
    content:
      "You must provide accurate and complete registration information. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.",
  },
  {
    heading: "5. Limitation of Liability",
    content:
      "CoalGuard is provided 'as is'. We do not guarantee uninterrupted access or error-free functionality. We are not liable for any losses or damages resulting from your use or inability to use the platform.",
  },
  {
    heading: "6. Data Usage and Privacy",
    content:
      "We collect and use your data in accordance with our Privacy Policy. Continued use of CoalGuard implies consent to such data practices. Please refer to the Privacy Policy for more details.",
  },
  {
    heading: "7. Termination",
    content:
      "We may suspend or terminate your access to the platform without prior notice if you breach these terms, misuse the service, or violate applicable laws.",
  },
  {
    heading: "8. Changes to the Terms",
    content:
      "We reserve the right to modify these Terms of Service at any time. We will notify users via email or dashboard alerts when significant changes are made. Your continued use of the platform after updates indicates your acceptance.",
  },
  {
    heading: "9. Governing Law",
    content:
      "These terms are governed by and construed in accordance with the laws of India. Any disputes shall be resolved in the jurisdiction of the courts of Maharashtra.",
  },
  {
    heading: "10. Contact",
    content:
      "For any questions about these Terms, please contact us at support@coalguard.tech.",
  },
];

const TermsOfService = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
      >
        <Text style={styles.heading}>Terms of Service</Text>
      </MotiView>

      {sections.map((section, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 200, duration: 800 }}
          style={styles.section}
        >
          <Text style={styles.subheading}>{section.heading}</Text>
          <Text style={styles.content}>{section.content}</Text>
        </MotiView>
      ))}

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: sections.length * 200, duration: 600 }}
      >
        <Text style={styles.footer}>Last updated: August 2025</Text>
      </MotiView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ea580c",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ea580c",
    marginBottom: 4,
  },
  content: {
    fontSize: 15,
    color: "#374151",
    textAlign: "justify",
    lineHeight: 22,
  },
  footer: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 32,
    fontSize: 14,
  },
});

export default TermsOfService;
