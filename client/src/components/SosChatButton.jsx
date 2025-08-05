import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Send, AlertTriangle, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";

const SosChatButton = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "How do I make a payment?",
    "Take me to my profile",
    "Explain the blockchain feature",
    "How does the video call work?",
  ];

  const handleSend = async (prompt) => {
    const currentInput = (typeof prompt === "string" ? prompt : input).trim();
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

      const res = await axios.post("/chat", { message: currentInput, history });

      let botReply = res.data?.data?.reply || "Sorry, I couldn't get a response.";
      const navRegex = /NAVIGATE_TO::(\/\S*)/;
      const navMatch = botReply.match(navRegex);

      if (navMatch) {
        const path = navMatch[1];
        const cleanReply = botReply.replace(navRegex, "").trim();
        if (cleanReply) setMessages((prev) => [...prev, { from: "bot", text: cleanReply }]);
        navigate(path);
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { from: "bot", text: "Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSOS = () => {
    alert("🚨 SOS Triggered! Emergency team notified!");
    // TODO: integrate backend or socket event
  };

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([{ from: "bot", text: "Hi! I'm Nexus. How can I help you today?" }]);
    }
  }, [isChatOpen]);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-50">
      {isMenuOpen && (
        <div className="flex flex-col items-end space-y-3 mb-2 transition-all duration-300">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white rounded-full h-12 w-12 shadow-lg animate-pulse"
            onClick={handleSOS}
            title="SOS Emergency"
          >
            <AlertTriangle className="w-5 h-5" />
          </Button>
          <Popover open={isChatOpen} onOpenChange={setIsChatOpen}>
            <PopoverTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full h-12 w-12 shadow-lg">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              sideOffset={12}
              className="w-[360px] h-[520px] flex flex-col p-0 rounded-xl shadow-xl"
            >
              <div className="border-b px-4 py-2 text-sm font-semibold flex justify-between items-center">
                Nexus Assistant
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsChatOpen(false)}
                >
                  &times;
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-wrap ${
                      msg.from === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-3 py-2 rounded-lg max-w-[85%]">
                      ...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 1 && !isLoading && (
                <div className="p-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    Or try one of these prompts:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-1.5"
                        onClick={() => handleSend(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t p-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask Nexus anything..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="sm" disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Button
        className="rounded-full h-14 w-14 p-0 shadow-xl bg-gray-800 hover:bg-gray-900 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Plus
          className={`w-6 h-6 transform transition-transform duration-300 ${
            isMenuOpen ? "rotate-45" : ""
          }`}
        />
      </Button>
    </div>
  );
};

export default SosChatButton;
