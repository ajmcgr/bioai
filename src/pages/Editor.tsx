import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Eye, Settings, Palette, Sparkles, Link as LinkIcon, Trash2, GripVertical, Upload, Image as ImageIcon, Edit2, ExternalLink, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SocialHandlesManager } from "@/components/SocialHandlesManager";
import { SocialIconCustomizer, IconSettings } from "@/components/SocialIconCustomizer";
import { SocialIconsDisplay } from "@/components/SocialIconsDisplay";

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  font: string;
}

const Editor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscribed, plan } = useSubscription();
  const [searchParams] = useSearchParams();
  const rawProfileId = searchParams.get('id');
  const profileId = rawProfileId && rawProfileId !== 'undefined' && rawProfileId !== 'null' ? rawProfileId : null;
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [currentProfileKey, setCurrentProfileKey] = useState<'id' | 'user_id'>('id');
  
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    font: "font-sans",
  });
  
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [buttonStyle, setButtonStyle] = useState<"solid" | "glass" | "outline">("solid");
  const [buttonCorners, setButtonCorners] = useState<"square" | "round">("round");
  const [supportsButtonFields, setSupportsButtonFields] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState<"normal" | "medium" | "semibold" | "bold">("normal");
  const [socialIconPosition, setSocialIconPosition] = useState<'above' | 'below'>('below');
  const [iconPreviewHandles, setIconPreviewHandles] = useState<any[] | null>(null);
  const [iconPreviewSettings, setIconPreviewSettings] = useState<any | null>(null);
  const [liveIconSettings, setLiveIconSettings] = useState<IconSettings | null>(null);

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editLinkData, setEditLinkData] = useState({ title: "", url: "" });
  const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null);

  const fontOptions = [
    { value: "font-sans", label: "Inter (Sans Serif)" },
    { value: "font-display", label: "Reckless (Display)" },
    { value: "font-playfair", label: "Playfair Display (Elegant)" },
    { value: "font-poppins", label: "Poppins (Modern)" },
    { value: "font-montserrat", label: "Montserrat (Clean)" },
    { value: "font-raleway", label: "Raleway (Sophisticated)" },
    { value: "font-lora", label: "Lora (Classic)" },
    { value: "font-openSans", label: "Open Sans (Friendly)" },
    { value: "font-roboto", label: "Roboto (Professional)" },
    { value: "font-merriweather", label: "Merriweather (Traditional)" },
    { value: "font-bebas", label: "Bebas Neue (Bold)" },
    { value: "font-lobster", label: "Lobster (Playful)" },
    { value: "font-pacifico", label: "Pacifico (Fun)" },
    { value: "font-dancing", label: "Dancing Script (Handwritten)" },
    { value: "font-mono", label: "Monospace (Code)" },
    { value: "font-serif", label: "Serif (Classic)" },
  ];

  // Get plan limits
  const getPlanLimits = () => {
    if (subscribed && plan === 'pro') {
      return { maxLinks: Infinity };
    } else { // Free
      return { maxLinks: 10 };
    }
  };

  const handleAddLink = () => {
    const limits = getPlanLimits();
    
    if (links.length >= limits.maxLinks) {
      toast({
        title: "Link limit reached",
        description: `Your plan allows up to ${limits.maxLinks} links. Upgrade to add more.`,
        variant: "destructive",
      });
      return;
    }
    
    if (newLink.title && newLink.url) {
      setLinks([...links, { id: Date.now().toString(), ...newLink }]);
      setNewLink({ title: "", url: "" });
      setIsAddingLink(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleEditLink = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      setEditingLink(id);
      setEditLinkData({ title: link.title, url: link.url });
    }
  };

  const handleSaveEdit = () => {
    if (editingLink && editLinkData.title && editLinkData.url) {
      setLinks(links.map(link => 
        link.id === editingLink 
          ? { ...link, title: editLinkData.title, url: editLinkData.url }
          : link
      ));
      setEditingLink(null);
      setEditLinkData({ title: "", url: "" });
    }
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    setEditLinkData({ title: "", url: "" });
  };

  const handleLinkDragStart = (index: number) => {
    setDraggedLinkIndex(index);
  };

  const handleLinkDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedLinkIndex === null || draggedLinkIndex === index) return;

    const newLinks = [...links];
    const draggedLink = newLinks[draggedLinkIndex];
    newLinks.splice(draggedLinkIndex, 1);
    newLinks.splice(index, 0, draggedLink);

    setLinks(newLinks);
    setDraggedLinkIndex(index);
  };

  const handleLinkDragEnd = () => {
    setDraggedLinkIndex(null);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWallpaperUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let data: any = null;
        let error: any = null;
        
        if (profileId) {
          // Load all profiles for the user, then find match by id or user_id
          const q1 = await supabase
            .from('profiles_api')
            .select('*')
            .eq('user_id', user.id);

          let profiles: any[] = q1.data || [];
          if (q1.error) {
            const q2 = await supabase
              .from('profiles_api')
              .select('*')
              .eq('id', user.id);
            profiles = q2.data || [];
            error = q2.error;
          }

          if (!q1.error) {
            error = null;
          }

          data = profiles?.find((p: any) => p.id === profileId) || profiles?.[0] || null;
        } else {
          const q = await supabase
            .from('profiles_api')
            .select('*')
            .eq('user_id', user.id);

          let profiles = q.data || [];
          if (q.error) {
            const q2 = await supabase
              .from('profiles_api')
              .select('*')
              .eq('id', user.id);
            profiles = q2.data || [];
          }

          if (profiles && profiles.length > 0) {
            const primaryProfile = profiles.find(p => p.is_primary) || profiles[0];
            data = primaryProfile;
            error = null;
          }
        }

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading profile:', error);
          setIsLoaded(true);
          return;
        }

        if (data) {
          setCurrentProfileId(data.id);
          setCurrentProfileKey('id');
          setProfile({
            name: data.full_name || '',
            username: data.username || '',
            bio: data.bio || '',
            avatarUrl: data.avatar_url || '',
            font: data.font || 'font-sans',
          });
          setLinks(data.links || []);
          setWallpaperUrl(data.wallpaper_url || '');
          setTextColor(data.text_color || '#000000');
          setButtonColor(data.button_color || '#000000');
          setButtonTextColor(data.button_text_color || '#ffffff');
          setBackgroundColor(data.background_color || '#ffffff');
          setButtonStyle(data.button_style || 'solid');
          setButtonCorners(data.button_corners || 'round');
          setSupportsButtonFields('button_style' in data && 'button_corners' in data);
          setFontSize(data.font_size || 16);
          setFontWeight(data.font_weight || 'normal');
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading profile:', error);
        setIsLoaded(true);
      }
    };

    loadProfile();
  }, [profileId]);

  const fetchIconData = useCallback(async () => {
    if (!currentProfileId) return;
    const { data: handlesData } = await supabase
      .from('social_handles')
      .select('*')
      .eq('profile_id', currentProfileId)
      .eq('is_visible', true)
      .order('position', { ascending: true });
    setIconPreviewHandles(handlesData || []);

    const { data: settingsData } = await supabase
      .from('profiles')
      .select('social_icon_position, social_icon_style, social_icon_shape, social_icon_size, social_icon_spacing, social_icon_alignment, social_icon_hover, social_icon_color')
      .eq('id', currentProfileId)
      .single();

    if (settingsData) {
      setIconPreviewSettings({
        position: settingsData.social_icon_position || 'below',
        style: settingsData.social_icon_style || 'brand',
        shape: settingsData.social_icon_shape || 'circle',
        size: settingsData.social_icon_size || 32,
        spacing: settingsData.social_icon_spacing || 12,
        alignment: settingsData.social_icon_alignment || 'center',
        hover: settingsData.social_icon_hover || 'scale',
        color: settingsData.social_icon_color || '#000000',
      });
    } else {
      setIconPreviewSettings(null);
    }
  }, [currentProfileId]);

  // Keep social icon preview data in sync for the live preview panel
  useEffect(() => {
    if (!currentProfileId) return;
    fetchIconData();

    const channel = supabase
      .channel(`editor-profile-${currentProfileId}-social`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_handles', filter: `profile_id=eq.${currentProfileId}` }, () => {
        fetchIconData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${currentProfileId}` }, () => {
        fetchIconData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProfileId, fetchIconData]);

  // Auto-save with debouncing - only after data is loaded
  useEffect(() => {
    // Don't auto-save until the profile data has been loaded
    if (!isLoaded) return;
    
    // Don't auto-save if creating new profile and no data entered yet
    if (!currentProfileId && !profile.name && !profile.username && !profile.bio) return;

    const saveData = async () => {
      try {
        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const profileData: any = {
          user_id: user.id,
          full_name: profile.name,
          username: profile.username?.trim() || null,
          bio: profile.bio,
          avatar_url: profile.avatarUrl,
          font: profile.font,
          links,
          wallpaper_url: wallpaperUrl,
          text_color: textColor,
          button_color: buttonColor,
          button_text_color: buttonTextColor,
          background_color: backgroundColor,
          updated_at: new Date().toISOString(),
        };

        if (supportsButtonFields) {
          profileData.button_style = buttonStyle;
          profileData.button_corners = buttonCorners;
        }
        
        profileData.font_size = fontSize;
        profileData.font_weight = fontWeight;

        let error;
        if (currentProfileId) {
          // Update existing profile
          ({ error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', currentProfileId));
        } else {
          // Create new profile
          const { data, error: insertError } = await supabase
            .from('profiles')
            .insert(profileData)
            .select('id')
            .single();
          
          error = insertError;
          if (data) {
            setCurrentProfileId(data.id);
            setCurrentProfileKey('id');
          }
        }

        if (error) throw error;

        toast({
          title: "Saved",
          description: "Your changes have been saved automatically.",
          duration: 2000,
        });
      } catch (error) {
        console.error('Auto-save error:', error);
        toast({
          title: "Error saving",
          description: "Could not save your changes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [isLoaded, profile, links, wallpaperUrl, textColor, buttonColor, buttonTextColor, backgroundColor, buttonStyle, buttonCorners, fontSize, fontWeight]);

  const handlePreview = async () => {
    try {
      let previewHandles: any[] | null = null;
      let previewSettings: any | null = null;

      if (currentProfileId) {
        const { data: handlesData } = await supabase
          .from('social_handles')
          .select('*')
          .eq('profile_id', currentProfileId)
          .eq('is_visible', true)
          .order('position', { ascending: true });

        previewHandles = handlesData || null;

        const { data: settingsData } = await supabase
          .from('profiles')
          .select('social_icon_position, social_icon_style, social_icon_shape, social_icon_size, social_icon_spacing, social_icon_alignment, social_icon_hover, social_icon_color')
          .eq('id', currentProfileId)
          .single();

        if (settingsData) {
          previewSettings = {
            position: settingsData.social_icon_position || 'below',
            style: settingsData.social_icon_style || 'brand',
            shape: settingsData.social_icon_shape || 'circle',
            size: settingsData.social_icon_size || 32,
            spacing: settingsData.social_icon_spacing || 12,
            alignment: settingsData.social_icon_alignment || 'center',
            hover: settingsData.social_icon_hover || 'scale',
            color: settingsData.social_icon_color || '#000000',
          };
        }
      }

      localStorage.setItem('previewData', JSON.stringify({
        profile,
        links,
        wallpaperUrl,
        textColor,
        buttonColor,
        buttonTextColor,
        backgroundColor,
        buttonStyle,
        buttonCorners,
        fontSize,
        fontWeight,
        profileId: currentProfileId,
        previewHandles,
        previewSettings,
      }));
      window.open('/profile?preview=true', '_blank');
    } catch (e) {
      console.error('Failed to prepare preview data', e);
      localStorage.setItem('previewData', JSON.stringify({
        profile,
        links,
        wallpaperUrl,
        textColor,
        buttonColor,
        buttonTextColor,
        backgroundColor,
        buttonStyle,
        buttonCorners,
        fontSize,
        fontWeight,
        profileId: currentProfileId,
      }));
      window.open('/profile?preview=true', '_blank');
    }
  };


  const themeColors = [
    { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#ffffff", buttonBg: "#5a67d8", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", text: "#ffffff", buttonBg: "#e53e3e", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", text: "#ffffff", buttonBg: "#3182ce", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", text: "#ffffff", buttonBg: "#38a169", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", text: "#ffffff", buttonBg: "#ed8936", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", text: "#ffffff", buttonBg: "#2c5282", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", text: "#2d3748", buttonBg: "#4299e1", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", text: "#2d3748", buttonBg: "#f687b3", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", text: "#2d3748", buttonBg: "#ed8936", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)", text: "#ffffff", buttonBg: "#e53e3e", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", text: "#2d3748", buttonBg: "#805ad5", buttonText: "#ffffff" },
    { bg: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", text: "#2d3748", buttonBg: "#9f7aea", buttonText: "#ffffff" },
  ];

  const applyTheme = (index: number) => {
    const theme = themeColors[index];
    setBackgroundColor(theme.bg);
    setTextColor(theme.text);
    setButtonColor(theme.buttonBg);
    setButtonTextColor(theme.buttonText);
    setSelectedTheme(index);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center">
              <img src={logo} alt="trybio.ai" className="h-8" />
            </Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Return to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-sm text-muted-foreground">Saving...</span>
            )}
            <Button variant="ghost" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            {profile.username && (
              <a 
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="flex-1 overflow-y-auto p-6 border-r border-border">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Bio Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your Name" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="yourname" 
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    trybio.ai/{profile.username || "yourname"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="What you do in one line"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="font">Font</Label>
                  <Select value={profile.font} onValueChange={(value) => setProfile({ ...profile, font: value })}>
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback className="bg-muted">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </span>
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Elements Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design Elements
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Wallpaper/Background Image</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {wallpaperUrl && (
                      <div className="h-20 w-20 rounded-lg overflow-hidden border border-border">
                        <img src={wallpaperUrl} alt="Wallpaper" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label htmlFor="wallpaper-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {wallpaperUrl ? "Change" : "Upload"} Wallpaper
                        </span>
                      </Button>
                      <input
                        id="wallpaper-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleWallpaperUpload}
                      />
                    </label>
                    {wallpaperUrl && (
                      <Button variant="ghost" size="sm" onClick={() => setWallpaperUrl("")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        id="textColor"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        id="backgroundColor"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="buttonColor">Button Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        id="buttonColor"
                        type="color"
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="buttonTextColor">Button Text Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        id="buttonTextColor"
                        type="color"
                        value={buttonTextColor}
                        onChange={(e) => setButtonTextColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
                    <Slider
                      id="fontSize"
                      min={12}
                      max={24}
                      step={1}
                      value={[fontSize]}
                      onValueChange={([value]) => setFontSize(value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Font Weight</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <Button
                        type="button"
                        variant={fontWeight === "normal" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFontWeight("normal")}
                      >
                        Normal
                      </Button>
                      <Button
                        type="button"
                        variant={fontWeight === "medium" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFontWeight("medium")}
                      >
                        Medium
                      </Button>
                      <Button
                        type="button"
                        variant={fontWeight === "semibold" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFontWeight("semibold")}
                      >
                        Semibold
                      </Button>
                      <Button
                        type="button"
                        variant={fontWeight === "bold" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFontWeight("bold")}
                      >
                        Bold
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Button Style</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant={buttonStyle === "solid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setButtonStyle("solid")}
                        className="flex-1"
                      >
                        Solid
                      </Button>
                      <Button
                        type="button"
                        variant={buttonStyle === "glass" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setButtonStyle("glass")}
                        className="flex-1"
                      >
                        Glass
                      </Button>
                      <Button
                        type="button"
                        variant={buttonStyle === "outline" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setButtonStyle("outline")}
                        className="flex-1"
                      >
                        Outline
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Button Corners</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant={buttonCorners === "square" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setButtonCorners("square")}
                        className="flex-1"
                      >
                        Square
                      </Button>
                      <Button
                        type="button"
                        variant={buttonCorners === "round" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setButtonCorners("round")}
                        className="flex-1"
                      >
                        Round
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Presets
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {themeColors.map((theme, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-xl border-2 transition-colors ${
                      selectedTheme === i ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                    style={{ background: theme.bg }}
                    onClick={() => applyTheme(i)}
                  />
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Links
                </h2>
                <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby="add-link-desc">
                    <DialogHeader>
                      <DialogTitle>Add New Link</DialogTitle>
                      <DialogDescription id="add-link-desc">
                        Add a new link to your bio page
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="link-title">Title</Label>
                        <Input
                          id="link-title"
                          placeholder="My Website"
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                          id="link-url"
                          placeholder="https://example.com"
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddLink} className="w-full">
                        Add Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-3">
                {links.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No links yet. Click "Add Link" to get started!
                  </div>
                ) : (
                  links.map((link, index) => (
                    <div 
                      key={link.id} 
                      draggable={editingLink !== link.id}
                      onDragStart={() => handleLinkDragStart(index)}
                      onDragOver={(e) => handleLinkDragOver(e, index)}
                      onDragEnd={handleLinkDragEnd}
                      className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-move"
                    >
                      {editingLink === link.id ? (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`edit-title-${link.id}`}>Title</Label>
                            <Input
                              id={`edit-title-${link.id}`}
                              value={editLinkData.title}
                              onChange={(e) => setEditLinkData({ ...editLinkData, title: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-url-${link.id}`}>URL</Label>
                            <Input
                              id={`edit-url-${link.id}`}
                              value={editLinkData.url}
                              onChange={(e) => setEditLinkData({ ...editLinkData, url: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} size="sm" className="flex-1">
                              Save
                            </Button>
                            <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <LinkIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{link.title}</p>
                            <p className="text-sm text-muted-foreground">{link.url}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLink(link.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Social Media Section */}
            {currentProfileId && (
              <>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Social Media Icons
                  </h2>
                  <SocialHandlesManager profileId={currentProfileId} onChange={fetchIconData} />
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <SocialIconCustomizer 
                    profileId={currentProfileId} 
                    onSettingsChange={setLiveIconSettings}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-[480px] bg-white p-8 flex flex-col items-center sticky top-0 h-screen overflow-hidden">
          <div className="text-sm text-muted-foreground mb-4">Live Preview</div>
          <div 
            className="w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden" 
            style={{ height: '600px', backgroundColor: backgroundColor }}
          >
            <div 
              className={`h-full overflow-y-auto p-6 space-y-4 ${profile.font}`}
              style={{ 
                backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="text-center mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="bg-muted">
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                {profile.name && (
                  <h2 
                    className={`font-bold text-xl mb-1 ${profile.font}`} 
                    style={{ 
                      color: textColor,
                      fontSize: `${fontSize + 4}px`,
                      fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700
                    }}
                  >
                    {profile.name}
                  </h2>
                )}
                {profile.username && (
                  <h3 
                    className={`font-medium text-base mb-2 ${profile.font}`} 
                    style={{ 
                      color: textColor, 
                      opacity: 0.9,
                      fontSize: `${fontSize}px`,
                      fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700
                    }}
                  >
                    @{profile.username}
                  </h3>
                )}
                <p 
                  className={`text-sm ${profile.font}`} 
                  style={{ 
                    color: textColor, 
                    opacity: 0.8,
                    fontSize: `${fontSize - 2}px`,
                    fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700
                  }}
                >
                  {profile.bio || "Your bio goes here"}
                </p>
              </div>
              <SocialIconsDisplay 
                profileId={currentProfileId || 'preview-editor'} 
                displayPosition="above"
                isPreview={true}
                previewHandles={iconPreviewHandles || undefined}
                previewSettings={iconPreviewSettings || undefined}
                settingsOverride={liveIconSettings || undefined}
              />
              <div className="space-y-3">
                {links.map((link) => {
                  const getButtonStyle = () => {
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
                    <button
                      key={link.id}
                      className={`w-full py-3 px-4 transition-colors ${
                        buttonCorners === "round" ? "rounded-full" : "rounded-lg"
                      }`}
                      style={getButtonStyle()}
                    >
                      {link.title}
                    </button>
                  );
                })}
              </div>
              <SocialIconsDisplay 
                profileId={currentProfileId || 'preview-editor'} 
                displayPosition="below"
                isPreview={true}
                previewHandles={iconPreviewHandles || undefined}
                previewSettings={iconPreviewSettings || undefined}
                settingsOverride={liveIconSettings || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
