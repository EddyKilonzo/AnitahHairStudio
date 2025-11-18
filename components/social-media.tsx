'use client';

import { useEffect, useRef, useState } from 'react';
import { InstagramIcon } from './icons/instagram-icon';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { TikTokIcon } from './icons/tiktok-icon';
import Image from 'next/image';

// Lazy-loaded iframe component for Instagram embeds
const LazyInstagramEmbed = ({ embedUrl, index, isTabActive }: { embedUrl: string; index: number; isTabActive: boolean }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false); // Track if embed has been loaded once

  useEffect(() => {
    // If already loaded, keep it loaded even when tab becomes inactive
    if (hasLoadedRef.current) {
      setShouldLoad(true);
      return;
    }

    // Only observe if the tab is active
    if (!isTabActive) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad && !hasLoadedRef.current) {
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before it's visible
        threshold: 0.1,
      }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, [shouldLoad, isTabActive]);

  return (
    <div ref={iframeRef} className="w-full h-full relative">
      {shouldLoad ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <div className="flex flex-col items-center gap-2">
                <InstagramIcon className="w-8 h-8 text-primary animate-pulse" />
                <p className="text-xs text-foreground/60">Loading...</p>
              </div>
            </div>
          )}
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            scrolling="no"
            onLoad={() => {
              setIsLoading(false);
              hasLoadedRef.current = true; // Mark as loaded
            }}
            style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in' }}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-2">
            <InstagramIcon className="w-8 h-8 text-primary/50" />
            <p className="text-xs text-foreground/40">Instagram post</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Lazy-loaded iframe component for TikTok embeds
const LazyTikTokEmbed = ({ embedUrl, caption, isTabActive }: { embedUrl: string; caption?: string; isTabActive?: boolean }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false); // Track if embed has been loaded once

  useEffect(() => {
    // If already loaded, keep it loaded even when tab becomes inactive
    if (hasLoadedRef.current) {
      setShouldLoad(true);
      return;
    }

    // Only observe if the tab is active (or if isTabActive is not provided, always observe)
    if (isTabActive === false) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad && !hasLoadedRef.current) {
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, [shouldLoad, isTabActive]);

  return (
    <div ref={iframeRef} className="w-full h-full relative">
      {shouldLoad ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse z-10">
              <div className="flex flex-col items-center gap-2">
                <TikTokIcon className="w-12 h-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          )}
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              setIsLoading(false);
              hasLoadedRef.current = true; // Mark as loaded
            }}
            style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in' }}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center p-6">
            <TikTokIcon className="w-12 h-12 mx-auto mb-3 text-primary/50" />
            <p className="text-muted-foreground">TikTok video</p>
          </div>
        </div>
      )}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm font-medium">{caption}</p>
        </div>
      )}
    </div>
  );
};

interface SocialMediaItem {
  id: string;
  type: 'video' | 'image';
  embedUrl?: string;
  imageUrl?: string;
  caption?: string;
}

// Sample data - replace with your actual social media embeds
const socialMediaData = {
  tiktok: [
    {
      id: '1',
      type: 'video' as const,
      embedUrl: 'https://www.tiktok.com/embed/v2/your-video-id',
      caption: 'Latest hairstyle trends'
    },
    {
      id: '2',
      type: 'video' as const,
      embedUrl: 'https://www.tiktok.com/embed/v2/your-video-id-2',
      caption: 'Hair transformation'
    },
    {
      id: '3',
      type: 'video' as const,
      embedUrl: 'https://www.tiktok.com/embed/v2/your-video-id-3',
      caption: 'Coloring tutorial'
    },
  ],
  instagram: [
    {
      id: '1',
      type: 'image' as const,
      // Prefer iframe embed when available
      embedUrl: 'https://www.instagram.com/p/DP6dadTCKYj/embed?hidecaption=true',
      caption: 'Beautiful balayage work'
    },
    {
      id: '2',
      type: 'image' as const,
      embedUrl: 'https://www.instagram.com/p/DOvLo_dDRbY/embed?hidecaption=true',
      caption: 'Fresh cut and style'
    },
    {
      id: '3',
      type: 'image' as const,
      embedUrl: 'https://www.instagram.com/p/DOtfVctDdnP/embed?hidecaption=true',
      caption: 'Summer hair vibes'
    },
    {
      id: '4',
      type: 'image' as const,
      embedUrl: 'https://www.instagram.com/p/DPWqitQDewi/embed?hidecaption=true',
      caption: 'Stunning color transformation'
    },
  ],
  whatsapp: [
    {
      id: '1',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Client testimonial'
    },
    {
      id: '2',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Before & After'
    },
    {
      id: '3',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Happy client'
    },
  ],
};

type Platform = 'tiktok' | 'instagram' | 'whatsapp';

export default function SocialMedia() {
  const [activeTab, setActiveTab] = useState<Platform>('instagram');
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const tabs = [
    {
      id: 'instagram' as Platform,
      label: 'Instagram',
      icon: InstagramIcon,
      color: 'oklch(0.67 0.16 290)',
      bgColor: 'oklch(0.95 0.04 290)',
    },
    {
      id: 'tiktok' as Platform,
      label: 'TikTok',
      icon: TikTokIcon,
      color: 'oklch(0.72 0.14 285)',
      bgColor: 'oklch(0.94 0.04 285)',
    },
    {
      id: 'whatsapp' as Platform,
      label: 'WhatsApp',
      icon: WhatsAppIcon,
      color: 'oklch(0.75 0.12 280)',
      bgColor: 'oklch(0.93 0.03 280)',
    },
  ];

  const currentData = socialMediaData[activeTab];

  return (
    <section 
      ref={sectionRef}
      id="social-media" 
      className="py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-background to-muted/20 transition-all duration-700"
    >
      <div 
        className="max-w-7xl mx-auto bg-background/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 lg:p-12"
        style={{
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
        }}
      >
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Follow Our <span className="text-primary">Journey</span>
          </h2>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            Stay connected with our latest styles, transformations, and hair inspiration
          </p>
        </div>

        {/* Tabs */}
        <div 
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 lg:mb-12" 
          data-aos="fade-up" 
          data-aos-delay="100"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 rounded-full
                  font-semibold text-sm md:text-base
                  transition-all duration-500 ease-out
                  border-2 backdrop-blur-sm
                  ${isActive 
                    ? 'shadow-lg scale-105 shadow-purple-500/20' 
                    : 'bg-transparent hover:scale-105 hover:shadow-md hover:bg-purple-500/5'
                  }
                `}
                style={{
                  backgroundColor: isActive ? tab.color : 'transparent',
                  borderColor: tab.color,
                  color: isActive ? 'oklch(1 0 0)' : tab.color,
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                }}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 ${isActive ? 'rotate-12 scale-110' : ''}`} />
                <span className="transition-all duration-300">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div 
          className="relative"
          data-aos="fade-up" 
          data-aos-delay="200"
        >
          {/* TikTok Videos - keep mounted, toggle visibility */}
          <div 
            key="tiktok"
            className={`${
              activeTab === 'tiktok' ? 'block' : 'hidden'
            } grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700`}
            aria-hidden={activeTab !== 'tiktok'}
          >
            {socialMediaData.tiktok.map((item, index) => (
              <div
                key={item.id}
                className={`group relative rounded-2xl overflow-hidden glass-card transition-all duration-300 hover:scale-105 ${hasEntered ? 'animate-fade-in-up' : 'opacity-0 translate-y-6'}`}
                style={{ 
                  aspectRatio: '9 / 16',
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                  animationDelay: `${index * 260}ms`,
                  animationDuration: '1200ms',
                  animationFillMode: 'both'
                }}
              >
                {item.type === 'video' && item.embedUrl ? (
                  <LazyTikTokEmbed embedUrl={item.embedUrl} caption={item.caption} isTabActive={activeTab === 'tiktok'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center p-6">
                      <TikTokIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <p className="text-muted-foreground">Add your TikTok video</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Instagram Posts - keep mounted, toggle visibility */}
          <div 
            key="instagram"
            className={`${
              activeTab === 'instagram' ? 'grid' : 'hidden'
            } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700`}
            aria-hidden={activeTab !== 'instagram'}
          >
            {socialMediaData.instagram.map((item, index) => (
                <div
                  key={item.id}
                  className={`group relative rounded-xl overflow-hidden glass-card transition-all duration-300 hover:scale-105 ${hasEntered ? 'animate-fade-in-up' : 'opacity-0 translate-y-6'}`}
                  style={{ 
                    aspectRatio: '4 / 5',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                    animationDelay: `${index * 260}ms`,
                    animationDuration: '1200ms',
                    animationFillMode: 'both'
                  }}
                >
                  {item.embedUrl ? (
                    <LazyInstagramEmbed embedUrl={item.embedUrl} index={index} isTabActive={activeTab === 'instagram'} />
                  ) : item.type === 'image' && item.imageUrl ? (
                    <>
                      <Image
                        src={item.imageUrl}
                        alt={item.caption || 'Instagram post'}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full">
                          <p className="text-white text-sm font-medium">{item.caption}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center p-4">
                        <InstagramIcon className="w-10 h-10 mx-auto mb-2 text-primary" />
                        <p className="text-muted-foreground text-xs">Add Instagram post</p>
                      </div>
                    </div>
                  )}
                </div>
            ))}
          </div>

          {/* WhatsApp Content - keep mounted, toggle visibility */}
          <div 
            key="whatsapp"
            className={`${activeTab === 'whatsapp' ? 'grid' : 'hidden'} grid-cols-1 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700`}
            aria-hidden={activeTab !== 'whatsapp'}
          >
            <div
              className={`group relative rounded-2xl overflow-hidden glass-card transition-all duration-300 hover:scale-[1.02] ${hasEntered ? 'animate-fade-in-up' : 'opacity-0 translate-y-6'}`}
              style={{ 
                minHeight: '260px',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                animationDelay: `120ms`,
                animationDuration: '1200ms',
                animationFillMode: 'both'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-primary/10" />
              <div className="relative h-full w-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex items-center justify-center gap-3">
                  <WhatsAppIcon className="w-8 h-8 text-primary" />
                  <h3 className="text-xl md:text-2xl font-bold">Join our WhatsApp Group</h3>
                </div>
                <p className="text-foreground/70 max-w-xl">
                  Follow this link to join my WhatsApp group.
                </p>
                <a
                  href="https://chat.whatsapp.com/GGSXLi8O8b6BDtoKee6pvC?mode=wwt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary bg-primary text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Join Group</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className="text-center mt-12 lg:mt-16 px-2 sm:px-0" 
          data-aos="fade-up" 
          data-aos-delay="300"
        >
          <p className="text-foreground/70 mb-4 px-2">Want to see more? Follow us on social media!</p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 w-full">
            <a
              href="https://www.instagram.com/anitahshair_studio1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-primary bg-transparent text-primary font-semibold hover:bg-primary/10 hover:scale-105 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto max-w-full"
            >
              <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Follow on Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com/@anita.hair.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-primary bg-transparent text-primary font-semibold hover:bg-primary/10 hover:scale-105 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto max-w-full"
            >
              <TikTokIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Follow on TikTok</span>
            </a>
            <a
              href="https://chat.whatsapp.com/GGSXLi8O8b6BDtoKee6pvC?mode=wwt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-primary bg-primary text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto max-w-full"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Join WhatsApp Group</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

