import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { SocialIconsDisplay } from "@/components/SocialIconsDisplay";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const { username } = useParams();
  const isPreview = searchParams.get('preview') === 'true';
  
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    font: "font-sans",
  });
  const [profileId, setProfileId] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [buttonStyle, setButtonStyle] = useState<"solid" | "glass" | "outline">("solid");
  const [buttonCorners, setButtonCorners] = useState<"square" | "round">("round");
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState<"normal" | "medium" | "semibold" | "bold">("normal");
  const [iconPreviewHandles, setIconPreviewHandles] = useState<any[] | null>(null);
  const [iconPreviewSettings, setIconPreviewSettings] = useState<any | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (isPreview) {
        // Load from localStorage for preview
        const previewData = localStorage.getItem('previewData');
        if (previewData) {
          const data = JSON.parse(previewData);
          setProfile(data.profile);
          setLinks(data.links);
          setWallpaperUrl(data.wallpaperUrl);
          setTextColor(data.textColor);
          setButtonColor(data.buttonColor);
          setButtonTextColor(data.buttonTextColor || '#ffffff');
          setBackgroundColor(data.backgroundColor);
          setButtonStyle(data.buttonStyle || 'solid');
          setButtonCorners(data.buttonCorners || 'round');
          setFontSize(data.fontSize || 16);
          setFontWeight(data.fontWeight || 'normal');
          setProfileId(data.profileId || null);
          setIconPreviewHandles(data.previewHandles || null);
          setIconPreviewSettings(data.previewSettings || null);
        }
      } else if (username) {
        // Load from Supabase by username for public profile
        try {
          // Try profiles_api first (case-insensitive username lookup)
          const q1 = await supabase
            .from('profiles_api')
            .select('*')
            .ilike('username', username)
            .maybeSingle();

          let row: any = q1.data || null;
          if (q1.error) {
            console.warn('[Profile] profiles_api read error', q1.error);
          }

          // Fallback: non-single fetch if maybeSingle fails to coerce
          if (!row && !q1.error) {
            const q2 = await supabase
              .from('profiles_api')
              .select('*')
              .ilike('username', username)
              .limit(1);
            if (q2.error) console.warn('[Profile] profiles_api list error', q2.error);
            row = q2.data?.[0] || null;
          }

          if (!row) {
            console.warn('[Profile] No profile found for username', username);
            return;
          }

          setProfileId(row.id);
          setProfile({
            name: row.full_name || row.username || '',
            username: row.username || '',
            bio: row.bio || '',
            avatarUrl: row.avatar_url || '',
            font: row.font || 'font-sans',
          });
          setLinks(row.links || []);
          setWallpaperUrl(row.wallpaper_url || '');
          setTextColor(row.text_color || '#000000');
          setButtonColor(row.button_color || '#000000');
          setButtonTextColor(row.button_text_color || '#ffffff');
          setBackgroundColor(row.background_color || '#ffffff');
          setButtonStyle(row.button_style || 'solid');
          setButtonCorners(row.button_corners || 'round');
          setFontSize(row.font_size || 16);
          setFontWeight(row.font_weight || 'normal');

          // Check if this profile has a paid subscription (non-blocking)
          supabase
            .from('pro_status')
            .select('plan')
            .eq('email', row.email || '')
            .maybeSingle()
            .then(({ data }) => {
              setIsPaidUser(!!data && data.plan === 'pro');
            }, () => setIsPaidUser(false));

          // Track profile view (non-blocking, fire-and-forget)
          void supabase
            .from('profile_views')
            .insert({
              profile_id: row.id,
              user_agent: navigator.userAgent,
              referrer: document.referrer
            });
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [isPreview, username]);

  const handleLinkClick = async (link: any) => {
    // Track link click (only for public profiles, not previews)
    if (!isPreview && profileId) {
      try {
        await supabase
          .from('link_clicks')
          .insert({
            profile_id: profileId,
            link_title: link.title,
            link_url: link.url,
            user_agent: navigator.userAgent,
            referrer: document.referrer
          });
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start md:justify-center md:p-6"
      style={{ backgroundColor }}
    >
      <div className="w-full md:max-w-lg flex-shrink-0 md:mx-auto">
        {/* Profile Card */}
        <div 
          className={`md:rounded-3xl p-8 md:shadow-2xl ${profile.font}`}
          style={{ 
            backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Avatar & Info */}
          <div className="text-center mb-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback className="bg-muted text-2xl">
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {profile.name && (
              <h1 
                className={`text-2xl font-bold mb-2 ${profile.font}`} 
                style={{ 
                  color: textColor,
                  fontSize: `${fontSize + 8}px`,
                  fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700
                }}
              >
                {profile.name}
              </h1>
            )}
            {profile.username && (
              <h2 
                className={`text-lg font-medium mb-3 ${profile.font}`} 
                style={{ 
                  color: textColor, 
                  opacity: 0.9,
                  fontSize: `${fontSize + 2}px`,
                  fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700
                }}
              >
                @{profile.username}
              </h2>
            )}
            {profile.bio && (
              <p 
                className={`text-sm ${profile.font}`} 
                style={{ 
                  color: textColor, 
                  opacity: 0.8,
                  fontSize: `${fontSize}px`,
                  fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700
                }}
              >
                {profile.bio}
              </p>
            )}
          </div>

          {/* Social Icons - Above Links */}
          {(isPreview || profileId) && (
            <SocialIconsDisplay
              profileId={profileId || 'preview'}
              displayPosition="above"
              isPreview={isPreview}
              previewHandles={iconPreviewHandles || undefined}
              previewSettings={iconPreviewSettings || undefined}
            />
          )}

          {/* Links */}
          <div className="space-y-3">
            {links.map((link) => {
              const getButtonStyle = (): React.CSSProperties => {
                const baseStyle: React.CSSProperties = {
                  color: buttonTextColor,
                  fontSize: `${fontSize}px`,
                  fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700,
                };
                
                if (buttonStyle === "solid") {
                  return {
                    ...baseStyle,
                    backgroundColor: buttonColor,
                  };
                } else if (buttonStyle === "glass") {
                  return {
                    ...baseStyle,
                    backgroundColor: `${buttonColor}33`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${buttonColor}66`,
                  };
                } else {
                  return {
                    ...baseStyle,
                    backgroundColor: "transparent",
                    border: `2px solid ${buttonColor}`,
                    color: buttonColor,
                  };
                }
              };

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  className={`block w-full py-4 px-6 hover:opacity-90 transition-opacity group ${
                    buttonCorners === "round" ? "rounded-full" : "rounded-lg"
                  }`}
                  style={getButtonStyle()}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.title}</span>
                    <LinkIcon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Social Icons - Below Links */}
          {(isPreview || profileId) && (
            <SocialIconsDisplay
              profileId={profileId || 'preview'}
              displayPosition="below"
              isPreview={isPreview}
              previewHandles={iconPreviewHandles || undefined}
              previewSettings={iconPreviewSettings || undefined}
            />
          )}
        </div>

        {/* Footer - only show for free users */}
        {!isPaidUser && (
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Create your own with <span className="font-semibold">trybio.ai →</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
