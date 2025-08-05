import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// COMPONENTS
import Navbar from "@/components/blocks/Navbar/Navbar";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/ChatBotButton";
import { Toaster } from "sonner";

// PAGES
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Home from "@/pages/Home";
import SimulationDashboard from "@/pages/SimulationDashboard";

const hiddenLayoutRoutes = ["/login", "/signup"];

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = hiddenLayoutRoutes.includes(location.pathname);

  const shouldHideLayout = hideLayout;

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" richColors />
      {!shouldHideLayout && <Navbar />}
      <main className={`flex-1 ${shouldHideLayout ? "" : ""}`}>{children}</main>
      {!shouldHideLayout && <Footer />}
      {!shouldHideLayout && <ChatBotButton />}
    </div>
  );
};

function pcmToWav(pcmData, sampleRate) {
  const numChannels = 1;
  const bytesPerSample = 2;

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + pcmData.byteLength, true);
  writeString(view, 8, "WAVE");

  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, bytesPerSample * 8, true);

  writeString(view, 36, "data");
  view.setUint32(40, pcmData.byteLength, true);

  const combined = new Uint8Array(wavHeader.byteLength + pcmData.byteLength);
  combined.set(new Uint8Array(wavHeader), 0);
  combined.set(new Uint8Array(pcmData.buffer), wavHeader.byteLength);

  return new Blob([combined], { type: "audio/wav" });
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const callApiWithBackoff = async (apiCall, maxRetries = 5, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          throw new Error(
            `API call failed with status ${response.status}. Retrying...`
          );
        }
      }
      return response;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed: ${error.message}`);
      if (i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      } else {
        throw error;
      }
    }
  }
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sim" element={<SimulationDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
