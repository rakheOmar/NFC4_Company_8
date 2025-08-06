// Footer.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { FontAwesome5, MaterialIcons, Entypo } from "@expo/vector-icons";

const Footer = () => {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Company Info */}
        <View style={styles.section}>
          <View style={styles.header}>
            <FontAwesome5 name="shield-alt" size={18} color="#a44406" />
            <Text style={styles.companyName}>CoalGuard</Text>
          </View>
          <Text style={styles.textGray}>
            Advanced safety and sustainability platform for modern coal mining operations.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.iconRow}>
            <MaterialIcons name="email" size={16} color="gray" />
            <Text style={styles.textGray}>contact@coalguard.tech</Text>
          </View>
          <View style={styles.iconRow}>
            <FontAwesome5 name="phone-alt" size={14} color="gray" />
            <Text style={styles.textGray}>+91 98765 43210</Text>
          </View>
        </View>

        {/* Take Our Survey */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Take Our Survey</Text>
          <Text style={styles.textGray}>Help us improve by sharing your feedback.</Text>
          <TouchableOpacity
            onPress={() => openLink("https://coalguard.tech/survey")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Take Our Survey</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <TouchableOpacity onPress={() => openLink("https://coalguard.tech/privacy-policy")}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink("https://coalguard.tech/terms-of-service")}>
            <Text style={styles.link}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink("https://coalguard.tech/careers")}>
            <Text style={styles.link}>Careers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink("https://coalguard.tech/support")}>
            <Text style={styles.link}>Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Text style={styles.copy}>&copy; 2024 CoalGuard. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#000",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  content: {
    flexGrow: 1,
    gap: 20,
  },
  section: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  companyName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 16,
  },
  textGray: {
    color: "#aaa",
    marginBottom: 4,
    fontSize: 14,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#fb923c",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
  link: {
    color: "#aaa",
    marginBottom: 4,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  copy: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 12,
    marginTop: 16,
  },
});

export default Footer;
