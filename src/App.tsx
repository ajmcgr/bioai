import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import CrispLoader from "@/lib/CrispLoader";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import BioStats from "./pages/BioStats";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Upgrade from "./pages/Upgrade";
import Settings from "./pages/Settings";
import DomainSettings from "./pages/DomainSettings";
import UpgradeSuccess from "./pages/upgrade/Success";
import UpgradeCancel from "./pages/upgrade/Cancel";
import NotFound from "./pages/NotFound";
import HashtagGenerator from "./pages/tools/HashtagGenerator";
import ContentPlanner from "./pages/tools/ContentPlanner";
import InfluencerRateCalculator from "./pages/tools/InfluencerRateCalculator";
import BioTextGenerator from "./pages/tools/BioTextGenerator";
import CaptionGenerator from "./pages/tools/CaptionGenerator";
import Instagram from "./pages/platforms/Instagram";
import YouTube from "./pages/platforms/YouTube";
import TikTok from "./pages/platforms/TikTok";
import Twitter from "./pages/platforms/Twitter";
import Facebook from "./pages/platforms/Facebook";
import WhatsApp from "./pages/platforms/WhatsApp";
import Telegram from "./pages/platforms/Telegram";
import Threads from "./pages/platforms/Threads";
import Snapchat from "./pages/platforms/Snapchat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SubscriptionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CrispLoader />
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/bio/stats" element={<BioStats />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/upgrade/success" element={<UpgradeSuccess />} />
          <Route path="/upgrade/cancel" element={<UpgradeCancel />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/domain" element={<DomainSettings />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
          <Route path="/tools/content-planner" element={<ContentPlanner />} />
          <Route path="/tools/influencer-rate-calculator" element={<InfluencerRateCalculator />} />
          <Route path="/tools/bio-text-generator" element={<BioTextGenerator />} />
          <Route path="/tools/caption-generator" element={<CaptionGenerator />} />
          <Route path="/platforms/instagram" element={<Instagram />} />
          <Route path="/platforms/youtube" element={<YouTube />} />
          <Route path="/platforms/tiktok" element={<TikTok />} />
          <Route path="/platforms/twitter" element={<Twitter />} />
          <Route path="/platforms/facebook" element={<Facebook />} />
          <Route path="/platforms/whatsapp" element={<WhatsApp />} />
          <Route path="/platforms/telegram" element={<Telegram />} />
          <Route path="/platforms/threads" element={<Threads />} />
          <Route path="/platforms/snapchat" element={<Snapchat />} />
          <Route path="/:username" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SubscriptionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
