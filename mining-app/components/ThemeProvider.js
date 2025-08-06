import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "rn-ui-theme",
}) => {
  const [theme, setThemeState] = useState(defaultTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(storageKey);
        if (storedTheme) {
          setThemeState(storedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const resolvedTheme =
    theme === "system" ? Appearance.getColorScheme() || "light" : theme;

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
