import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { IconButton, Portal, Modal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "../lib/axios"; // Adjust based on your folder structure
import { Ionicons } from "@expo/vector-icons";

const ChatBotButton = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef();

  const suggestedPrompts = [
    "How do I make a payment?",
    "Take me to my profile",
    "Explain the blockchain feature",
    "How does the video call work?",
  ];

  const handleSend = async (prompt) => {
    const currentInput = typeof prompt === "string" ? prompt : input.trim();
    if (!currentInput) return;

    const userMsg = { from: "user", text: currentInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.from === "bot" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      const res = await axios.post("/chat", {
        message: currentInput,
        history,
      });

      let botReply = res.data?.data?.reply || "Sorry, I couldn't get a response.";
      const navRegex = /NAVIGATE_TO::(\/\S*)/;
      const navMatch = botReply.match(navRegex);

      if (navMatch) {
        const path = navMatch[1];
        const cleanReply = botReply.replace(navRegex, "").trim();

        if (cleanReply) {
          setMessages((prev) => [...prev, { from: "bot", text: cleanReply }]);
        }

        navigation.navigate(path.replace("/", ""));
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible && messages.length === 0) {
      setMessages([{ from: "bot", text: "Hi! I'm Nexus. How can I help you today?" }]);
    }
  }, [visible]);

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>Nexus Assistant</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.message,
                  msg.from === "user" ? styles.userMsg : styles.botMsg,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
            {isLoading && (
              <View style={styles.botMsg}>
                <Text style={styles.messageText}>...</Text>
              </View>
            )}
          </ScrollView>

          {messages.length <= 1 && !isLoading && (
            <View style={styles.suggestions}>
              {suggestedPrompts.map((prompt, index) => (
                <TouchableOpacity key={index} onPress={() => handleSend(prompt)} style={styles.prompt}>
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inputRow}
          >
            <TextInput
              style={styles.input}
              placeholder="Ask Nexus anything..."
              value={input}
              onChangeText={setInput}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => handleSend()} disabled={isLoading}>
              <Ionicons name="send" size={24} color="#007AFF" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>

      <IconButton
        icon="message"
        size={28}
        style={styles.fab}
        onPress={() => setVisible(true)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#007AFF",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    maxHeight: "90%",
    paddingBottom: 10,
  },
  header: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  closeText: {
    fontSize: 20,
    color: "#888",
  },
  messageList: {
    padding: 10,
  },
  message: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    maxWidth: "85%",
  },
  userMsg: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  botMsg: {
    backgroundColor: "#f1f1f1",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 8,
  },
  prompt: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },
  promptText: {
    fontSize: 12,
  },
});

export default ChatBotButton;
