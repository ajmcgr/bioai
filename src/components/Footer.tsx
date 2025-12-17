import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div>
            <h4 className="font-sans font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><a href="https://blog.works.xyz/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="https://discord.gg/zH5GjPDT" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:alex@trybio.ai" className="hover:text-foreground transition-colors">Support</a></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4">Platforms</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/platforms/instagram" className="hover:text-foreground transition-colors">Instagram</Link></li>
              <li><Link to="/platforms/youtube" className="hover:text-foreground transition-colors">YouTube</Link></li>
              <li><Link to="/platforms/tiktok" className="hover:text-foreground transition-colors">TikTok</Link></li>
              <li><Link to="/platforms/twitter" className="hover:text-foreground transition-colors">X (Twitter)</Link></li>
              <li><Link to="/platforms/facebook" className="hover:text-foreground transition-colors">Facebook</Link></li>
              <li><Link to="/platforms/whatsapp" className="hover:text-foreground transition-colors">WhatsApp</Link></li>
              <li><Link to="/platforms/telegram" className="hover:text-foreground transition-colors">Telegram</Link></li>
              <li><Link to="/platforms/threads" className="hover:text-foreground transition-colors">Threads</Link></li>
              <li><Link to="/platforms/snapchat" className="hover:text-foreground transition-colors">Snapchat</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4">Free Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/tools/hashtag-generator" className="hover:text-foreground transition-colors">Hashtag Generator</Link></li>
              <li><Link to="/tools/content-planner" className="hover:text-foreground transition-colors">Content Planner</Link></li>
              <li><Link to="/tools/influencer-rate-calculator" className="hover:text-foreground transition-colors">Influencer Rate Calculator</Link></li>
              <li><Link to="/tools/bio-text-generator" className="hover:text-foreground transition-colors">Bio Text Generator</Link></li>
              <li><Link to="/tools/caption-generator" className="hover:text-foreground transition-colors">Caption Generator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://discord.gg/jYyQHNS2" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a></li>
              <li><a href="http://x.com/trybioai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">X</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          Copyright © 2025 Works App, Inc. Built with 🫶🏻 by <a href="https://works.xyz/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Works</a>.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
