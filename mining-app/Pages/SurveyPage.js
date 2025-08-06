import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

const SurveyPage = () => {
  const [language, setLanguage] = useState("en");
  const [usesTools, setUsesTools] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const labels = {
    en: {
      heading: "Mining Area Safety & Sustainability Survey",
      name: "Name",
      phone: "Phone Number",
      location: "Your Location",
      q1: "Do you live near or work in the mining area?",
      q2: "Do you notice dust, smoke, or pollution around the mine?",
      q3: "Do you use any tools for safety or sustainability?",
      q3a: "Please specify the tools you use:",
      q4: "How safe do you feel around or inside the mining area?",
      q5: "How clean or environmentally friendly does the mine seem?",
      submit: "Submit Survey",
      yes: "Yes",
      no: "No",
      thankYou: "Thank you for submitting the survey!",
    },
    hi: {
      heading: "खनन क्षेत्र सुरक्षा और स्थिरता सर्वेक्षण",
      name: "नाम",
      phone: "फ़ोन नंबर",
      location: "आपका स्थान",
      q1: "क्या आप खान क्षेत्र के पास रहते हैं या काम करते हैं?",
      q2: "क्या आपको खान के आसपास धूल, धुआं या प्रदूषण दिखाई देता है?",
      q3: "क्या आप सुरक्षा या स्थिरता के लिए कोई उपकरण उपयोग करते हैं?",
      q3a: "कृपया उपयोग किए गए उपकरणों को निर्दिष्ट करें:",
      q4: "आप खान क्षेत्र के आसपास या अंदर कितनी सुरक्षित महसूस करते हैं?",
      q5: "खान आपको कितना स्वच्छ या पर्यावरण के अनुकूल लगता है?",
      submit: "सर्वेक्षण सबमिट करें",
      yes: "हाँ",
      no: "नहीं",
      thankYou: "सर्वेक्षण सबमिट करने के लिए धन्यवाद!",
    },
  }[language];

  const handleSubmit = () => {
    setSubmitted(true);
    Alert.alert("✅", labels.thankYou);
  };

  if (submitted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.thankYou}>✅ {labels.thankYou}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Picker
        selectedValue={language}
        onValueChange={(value) => setLanguage(value)}
        style={styles.picker}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="हिन्दी" value="hi" />
      </Picker>

      <Text style={styles.heading}>{labels.heading}</Text>

      <TextInput placeholder={labels.name} style={styles.input} />
      <TextInput placeholder={labels.phone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder={labels.location} style={styles.input} />

      {/* Q1 */}
      <Text style={styles.label}>{labels.q1}</Text>
      <View style={styles.radioRow}>
        <RadioButton label={labels.yes} />
        <RadioButton label={labels.no} />
      </View>

      {/* Q2 - Slider */}
      <Text style={styles.label}>{labels.q2}</Text>
      <SliderQuestion emojis={["😐 Slight", "😷 Moderate", "🤢 Heavy"]} />

      {/* Q3 */}
      <Text style={styles.label}>{labels.q3}</Text>
      <View style={styles.radioRow}>
        <RadioButton label={labels.yes} onPress={() => setUsesTools(true)} />
        <RadioButton label={labels.no} onPress={() => setUsesTools(false)} />
      </View>
      {usesTools && <TextInput placeholder={labels.q3a} style={[styles.input, { width: "80%" }]} />}

      {/* Q4 */}
      <Text style={styles.label}>{labels.q4}</Text>
      <SliderQuestion emojis={["😟 Unsafe", "😐 Okay", "😌 Very Safe"]} />

      {/* Q5 */}
      <Text style={styles.label}>{labels.q5}</Text>
      <SliderQuestion emojis={["💨 Polluted", "😐 Normal", "🌿 Clean"]} />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>{labels.submit}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const RadioButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.radio} onPress={onPress}>
    <View style={styles.radioCircle} />
    <Text style={{ marginLeft: 6 }}>{label}</Text>
  </TouchableOpacity>
);

const SliderQuestion = ({ emojis }) => (
  <View style={styles.sliderBlock}>
    <Slider
      style={{ width: "100%" }}
      minimumValue={1}
      maximumValue={5}
      step={1}
      minimumTrackTintColor="#6b7280"
      maximumTrackTintColor="#ccc"
    />
    <View style={styles.emojiRow}>
      {emojis.map((e, i) => (
        <Text key={i} style={styles.emoji}>
          {e}
        </Text>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f6",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 60,
    alignItems: "center",
    gap: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  thankYou: {
    fontSize: 18,
    color: "#10b981",
    fontWeight: "bold",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#374151",
    marginBottom: 20,
  },
  picker: {
    width: "60%",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "500",
    fontSize: 16,
    color: "#1f2937",
  },
  radioRow: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 8,
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#1f2937",
  },
  sliderBlock: {
    width: "100%",
    marginTop: 8,
    marginBottom: 4,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  emoji: {
    fontSize: 12,
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#64748b",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SurveyPage;
