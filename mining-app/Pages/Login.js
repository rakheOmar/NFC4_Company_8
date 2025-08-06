import React from "react";
import { View, Text, TextInput, TouchableOpacity, Linking } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { AnimatePresence, MotiView } from "moti";
import Toast from "react-native-toast-message";
import axios from "../lib/axios"; // Adjust path if needed
import { useAuth } from "../context/AuthContext"; // Adjust path

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUser } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/users/login", data);
      const user = res.data?.data?.user;
      setUser(user);
      Toast.show({ type: "success", text1: "Logged in successfully!" });

      if (user?.role === "Admin") {
        navigation.navigate("AdminDashboard");
      } else if (user?.role === "Worker") {
        navigation.navigate("WorkerDashboard");
      } else {
        navigation.navigate("Home");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed.";
      Toast.show({ type: "error", text1: msg });
      console.error("Login error:", msg);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" }}>
      <AnimatePresence>
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600 }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
            Login to CoalGuard
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text>Email</Text>
                <TextInput
                  placeholder="Enter email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={{
                    borderWidth: 1,
                    borderColor: errors.email ? "red" : "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                  }}
                />
                {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text>Password</Text>
                <TextInput
                  placeholder="Enter password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry
                  style={{
                    borderWidth: 1,
                    borderColor: errors.password ? "red" : "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                  }}
                />
                {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}
              </>
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={{
              backgroundColor: "#10b981",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Continue with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={{ marginTop: 16 }}
          >
            <Text style={{ textAlign: "center", color: "gray" }}>
              Don't have an account? <Text style={{ textDecorationLine: "underline" }}>Sign Up!</Text>
            </Text>
          </TouchableOpacity>
        </MotiView>
      </AnimatePresence>

      <Toast />
    </View>
  );
}
