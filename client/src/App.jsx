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

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
