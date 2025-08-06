import React, { useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "./ThemeProvider"; // Update path if different

const ModeToggle = () => {
  const { setTheme } = useTheme();
  const [visible, setVisible] = useState(false);

  const options = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ];

  const handleSelect = (value) => {
    setTheme(value);
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.iconButton}>
        <Feather name="sun" size={24} color="black" />
      </TouchableOpacity>

      <Modal transparent={true} visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            {options.map((option) => (
              <Pressable key={option.value} onPress={() => handleSelect(option.value)} style={styles.menuItem}>
                <Text style={styles.menuText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#eee",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    marginHorizontal: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
  },
});

export default ModeToggle;
