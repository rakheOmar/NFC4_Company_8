import React from "react";
import { View, Text, ScrollView, Linking, StyleSheet } from "react-native";
import { MotiView, MotiText } from "moti";

const sections = [
  {
    heading: "1. Why Work With Us?",
    content:
      "You'll work alongside passionate engineers, researchers, and designers who are committed to making coal mining safer and greener. We value innovation, ethics, and impact.",
  },
  {
    heading: "2. Open Positions",
    content: `- Frontend Developer (React, Tailwind)\n- Data Analyst (AI/ML, Carbon Metrics)\n- Field Safety Engineer (Mining Tech)\n- Government Liaison (Sustainability Policy)`,
    isList: true,
  },
  {
    heading: "3. How to Apply",
    content:
      'Send your resume and a short cover letter to careers@coalguard.tech. We review applications on a rolling basis.',
  },
];

const Careers = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MotiText
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1000 }}
        style={styles.heading}
      >
        Careers at CoalGuard
      </MotiText>

      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 800 }}
        style={styles.subtext}
      >
        At CoalGuard, we’re building the future of safe, sustainable mining. Join us in
        transforming an industry using technology, data, and purpose-driven design.
      </MotiText>

      {sections.map((section, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 200, duration: 800 }}
          style={styles.section}
        >
          <Text style={styles.sectionHeading}>{section.heading}</Text>

          {section.isList ? (
            <View style={styles.list}>
              {section.content.split("\n").map((item, i) => (
                <Text key={i} style={styles.listItem}>• {item.replace(/^- /, "")}</Text>
              ))}
            </View>
          ) : section.heading.includes("Apply") ? (
            <Text style={styles.sectionText}>
              Send your resume and a short cover letter to{" "}
              <Text
                style={styles.emailLink}
                onPress={() => Linking.openURL("mailto:careers@coalguard.tech")}
              >
                careers@coalguard.tech
              </Text>
              . We review applications on a rolling basis.
            </Text>
          ) : (
            <Text style={styles.sectionText}>{section.content}</Text>
          )}
        </MotiView>
      ))}
    </ScrollView>
  );
};

export default Careers;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ea580c", // orange-600
    textAlign: "center",
    marginBottom: 20,
  },
  subtext: {
    fontSize: 16,
    color: "#1f2937", // gray-800
    textAlign: "justify",
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ea580c",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: "#374151", // gray-700
    lineHeight: 22,
    textAlign: "justify",
  },
  list: {
    paddingLeft: 12,
  },
  listItem: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
  emailLink: {
    color: "#2563eb", // blue-600
    textDecorationLine: "underline",
  },
});
