import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ dashboardType = "Worker" }) => {
  const [time, setTime] = useState(new Date());
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>CoalMine Pro</Text>
        <Text style={styles.subtitle}>{dashboardType} Dashboard</Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formattedTime}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {dashboardType === "Worker" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Admin")} // screen name in navigator
            style={styles.adminButton}
          >
            <FontAwesome5 name="user-shield" size={14} color="#fff" />
            <Text style={styles.adminText}> Admin Panel</Text>
          </TouchableOpacity>
        )}

        <View style={styles.icons}>
          <FontAwesome5 name="bell" size={18} color="#333" style={styles.icon} />
          <FontAwesome5 name="cog" size={18} color="#333" style={styles.icon} />
          <FontAwesome5 name="expand" size={18} color="#333" style={styles.icon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  timeContainer: {
    marginBottom: 6,
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  icons: {
    flexDirection: "row",
    marginTop: 6,
  },
  icon: {
    marginHorizontal: 5,
  },
  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a44406",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 6,
  },
  adminText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
});

export default Header;
