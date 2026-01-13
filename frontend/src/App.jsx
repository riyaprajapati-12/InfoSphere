import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerification from "./pages/OtpVerification"; 
import Dashboard from "./pages/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import ArticleDetail from "./pages/ArticleDetail";
import TelegramConnect from "./pages/TelegramConnect";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
     
      <Router>
         <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp/:email" element={<OtpVerificationWrapper />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/connect-telegram" element={<TelegramConnect />} />

        </Routes>
        </AuthProvider>
      </Router>
  
    </GoogleOAuthProvider>
  );
}

// Wrapper to extract email from URL and pass as prop
import { useParams } from "react-router-dom";
function OtpVerificationWrapper() {
  const { email } = useParams();
  return <OtpVerification email={email} />;
}

export default App;
