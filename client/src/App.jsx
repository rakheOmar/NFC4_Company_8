import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "@/components/blocks/Navbar/Navbar";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/ChatBotButton";

import WorkerDashboard from "@/components/Dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import MineOpsDashboard from "@/pages/MineOpsDashboard";
import Careers from "./pages/Careers";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import SurveyPage from "@/pages/SurveyPage";

import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Support from "@/pages/Support";
import SimulationDashboard from "@/pages/SimulationDashboard";

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
          throw new Error(`API call failed with status ${response.status}. Retrying...`);
        }
      }
      return response;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed: ${error.message}`);
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      } else {
        throw error;
      }
    }
  }
};

const hiddenLayoutRoutes = ["/login", "/signup"];

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = hiddenLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" richColors />
      {!hideLayout && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
      {!hideLayout && <ChatBotButton />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/mine-dashboard" element={<MineOpsDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sim" element={<SimulationDashboard />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
