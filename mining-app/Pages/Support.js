import React from "react";
import { ScrollView, View, Text, Linking, StyleSheet } from "react-native";
import { MotiView, MotiText } from "moti";
import { InView } from "react-native-intersection-observer";

const sections = [
  {
    heading: "1. General Support",
    content:
      "For common issues regarding login, account settings, or dashboard usage, visit our FAQs or use the live chat on the bottom-right of the screen.",
  },
  {
    heading: "2. Technical Help",
    content:
      "If you're facing platform errors, data issues, or integration problems, please reach out to our technical support team. Attach screenshots or error logs if possible for faster resolution.",
  },
  {
    heading: "3. Contact Methods",
    content: `📧 Email: support@coalguard.tech\n📞 Phone: +91-XXXXXXXXXX\n🕒 Hours: Mon–Fri, 9AM–6PM IST`,
    isList: true,
  },
  {
    heading: "4. On-site Help",
    content:
      "For enterprise clients, we offer on-site training and support in coordination with your safety and IT departments. Please contact us to schedule a visit.",
  },
];

const Support = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MotiText
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1000 }}
        style={styles.title}
      >
        Support
      </MotiText>

      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 800 }}
        style={styles.description}
      >
        Need help? Our team is here to support you with everything from technical assistance to
        understanding carbon tracking and compliance.
      </MotiText>

      {sections.map((section, index) => (
        <InView triggerOnce key={index}>
          {({ inView }) => (
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={inView ? { opacity: 1, translateY: 0 } : {}}
              transition={{ delay: index * 200, duration: 800 }}
              style={styles.section}
            >
              <Text style={styles.heading}>{section.heading}</Text>

              {section.isList ? (
                <View style={styles.list}>
                  {section.content.split("\n").map((line, i) => {
                    if (line.includes("support@coalguard.tech")) {
                      return (
                        <Text key={i} style={styles.listItem}>
                          📧 Email:{" "}
                          <Text
                            style={styles.link}
                            onPress={() => Linking.openURL("mailto:support@coalguard.tech")}
                          >
                            support@coalguard.tech
                          </Text>
                        </Text>
                      );
                    }
                    return (
                      <Text key={i} style={styles.listItem}>
                        {line}
                      </Text>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.content}>{section.content}</Text>
              )}
            </MotiView>
          )}
        </InView>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ea580c",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    color: "#374151",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ea580c",
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "justify",
    color: "#1f2937",
  },
  list: {
    paddingLeft: 12,
  },
  listItem: {
    fontSize: 15,
    color: "#1f2937",
    marginBottom: 6,
  },
  link: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
});

export default Support;
