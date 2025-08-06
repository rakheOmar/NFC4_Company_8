import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import Toast from 'react-native-toast-message';
import axios from '../lib/axios'; // Update if needed
import { Picker } from '@react-native-picker/picker';

const formSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  employeeId: z.string().min(1, "Employee ID is required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const SignUp = () => {
  const navigation = useNavigation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
      employeeId: '',
      role: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/users/register", data);
      Toast.show({ type: 'success', text1: 'Registration Successful!' });
      setTimeout(() => navigation.navigate('Login'), 1500);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Registration failed.'
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={styles.card}
      >
        <Text style={styles.title}>Sign Up</Text>

        <Controller
          control={control}
          name="fullname"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.fullname && <Text style={styles.error}>{errors.fullname.message}</Text>}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="employeeId"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Employee ID"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.employeeId && <Text style={styles.error}>{errors.employeeId.message}</Text>}

        <Text style={styles.label}>Role</Text>
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Select Role" value="" />
                <Picker.Item label="Worker" value="Worker" />
                <Picker.Item label="Admin" value="Admin" />
              </Picker>
            </View>
          )}
        />
        {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.underline}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </MotiView>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
    justifyContent: 'center'
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827"
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8
  },
  error: {
    color: "#dc2626",
    fontSize: 12,
    marginBottom: 8
  },
  label: {
    fontWeight: "600",
    marginBottom: 4
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    marginBottom: 8
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: "#1d4ed8",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#6b7280"
  },
  underline: {
    textDecorationLine: "underline"
  }
});

export default SignUp;
