import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SocialIcon } from './SocialIcon';

interface SocialHandle {
  id: string;
  platform: string;
  url: string;
  is_visible: boolean;
  position: number;
}

interface IconSettings {
  position: 'above' | 'below';
  style: 'brand' | 'monochrome' | 'outline';
  shape: 'circle' | 'rounded' | 'square';
  size: number;
  spacing: number;
  alignment: 'left' | 'center' | 'right';
  hover: 'scale' | 'underline' | 'none';
  color: string;
}

interface SocialIconsDisplayProps {
  profileId: string;
  displayPosition: 'above' | 'below';
  isPreview?: boolean;
  previewHandles?: Partial<SocialHandle>[];
  previewSettings?: Partial<IconSettings>;
  settingsOverride?: Partial<IconSettings>;
}

export const SocialIconsDisplay: React.FC<SocialIconsDisplayProps> = ({ 
  profileId, 
  displayPosition,
  isPreview = false,
  previewHandles,
  previewSettings,
  settingsOverride,
}) => {
  const [handles, setHandles] = useState<SocialHandle[]>([]);
  const [settings, setSettings] = useState<IconSettings>({
    position: 'below',
    style: 'brand',
    shape: 'circle',
    size: 32,
    spacing: 12,
    alignment: 'center',
    hover: 'scale',
    color: '#000000',
  });

  useEffect(() => {
    if (isPreview) {
      // Use preview data when provided; otherwise fetch once from DB
      let seeded = false;
      if (previewHandles && previewHandles.length) {
        const sorted = [...previewHandles]
          .filter((h) => h.is_visible !== false)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) as SocialHandle[];
        setHandles(sorted as SocialHandle[]);
        seeded = true;
      }

      if (previewSettings) {
        setSettings((prev) => ({
          ...prev,
          ...previewSettings,
        }));
      }

      if (!seeded) {
        // Fallback: fetch current data from database (no realtime subscribe)
        fetchData();
      }
      return;
    }

    fetchData();
    
    // Set up real-time subscription for changes
    const channel = supabase
      .channel(`profile-${profileId}-social-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_handles',
          filter: `profile_id=eq.${profileId}`
        },
        () => {
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profileId}`
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, isPreview, previewHandles, previewSettings]);

  // Apply settings override for instant preview updates
  useEffect(() => {
    if (settingsOverride) {
      setSettings(prev => ({
        ...prev,
        ...settingsOverride,
      }));
    }
  }, [settingsOverride]);

  const fetchData = async () => {
    // Fetch handles and settings in parallel
    const [handlesResult, profileResult] = await Promise.all([
      supabase
        .from('social_handles')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_visible', true)
        .order('position', { ascending: true }),
      supabase
        .from('profiles')
        .select('social_icon_position, social_icon_style, social_icon_shape, social_icon_size, social_icon_spacing, social_icon_alignment, social_icon_hover, social_icon_color')
        .eq('id', profileId)
        .maybeSingle()
    ]);

    if (handlesResult.data) {
      setHandles(handlesResult.data);
    }

    if (profileResult.data) {
      setSettings({
        position: profileResult.data.social_icon_position || 'below',
        style: profileResult.data.social_icon_style || 'brand',
        shape: profileResult.data.social_icon_shape || 'circle',
        size: profileResult.data.social_icon_size || 32,
        spacing: profileResult.data.social_icon_spacing || 12,
        alignment: profileResult.data.social_icon_alignment || 'center',
        hover: profileResult.data.social_icon_hover || 'scale',
        color: profileResult.data.social_icon_color || '#000000',
      });
    }
  };

  const handleIconClick = async (handle: SocialHandle) => {
    // Track click
    if (!isPreview) {
      await supabase.from('social_handle_clicks').insert({
        social_handle_id: handle.id,
        profile_id: profileId,
        platform: handle.platform,
      });
    }
    
    // Open link
    window.open(handle.url, '_blank', 'noopener,noreferrer');
  };

  // Only render if position matches
  if (settings.position !== displayPosition || handles.length === 0) {
    return null;
  }

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[settings.alignment];

  // Key to force remount on structural changes
  const structuralKey = `${settings.position}-${settings.style}-${settings.shape}`;

  return (
    <div 
      key={structuralKey}
      className={`flex flex-wrap ${alignmentClass} my-6`}
      style={{ gap: `${settings.spacing}px` }}
    >
      {handles.map(handle => (
        <SocialIcon
          key={handle.id}
          platform={handle.platform}
          size={settings.size}
          style={settings.style}
          shape={settings.shape}
          hover={settings.hover}
          color={settings.color}
          onClick={() => handleIconClick(handle)}
        />
      ))}
    </div>
  );
};
