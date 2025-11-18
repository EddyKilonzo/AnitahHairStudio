'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

type TabType = 'all' | 'images' | 'videos';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  thumbnail?: string;
}

// Helper function to encode file paths for URLs
const encodeFilePath = (path: string): string => {
  const parts = path.split('/');
  const directory = parts.slice(0, -1).join('/');
  const filename = parts[parts.length - 1];
  // Encode only the filename, keep directory as is
  return directory + '/' + encodeURIComponent(filename);
};

const galleryItems: GalleryItem[] = [
  // Images
  { id: 'img-1', type: 'image', src: encodeFilePath('/Gallery/WhatsApp Image 2025-11-16 at 8.42.19 PM.jpeg'), alt: 'Beautiful Hair Styling' },
  { id: 'img-2', type: 'image', src: encodeFilePath('/Gallery/download (10).jpeg'), alt: 'Hair Transformation' },
  { id: 'img-3', type: 'image', src: encodeFilePath('/Gallery/download (6).jpeg'), alt: 'Hair Styling' },
  { id: 'img-4', type: 'image', src: encodeFilePath('/Gallery/download.jpeg'), alt: 'Professional Hair Service' },
  { id: 'img-5', type: 'image', src: encodeFilePath('/Gallery/Knotless braids💆🏾_♀️.jpeg'), alt: 'Knotless Braids' },
  { id: 'img-6', type: 'image', src: encodeFilePath('/Gallery/WhatsApp Image 2025-11-16 at 6.38.00 PM.jpeg'), alt: 'Hair Design' },
  { id: 'img-7', type: 'image', src: encodeFilePath('/Gallery/WhatsApp Image 2025-11-16 at 8.29.36 PM.jpeg'), alt: 'Hair Artistry' },
  { id: 'img-8', type: 'image', src: encodeFilePath('/Gallery/WhatsApp Image 2025-11-16 at 8.29.38 PM.jpeg'), alt: 'Beautiful Hair Styles' },
  { id: 'img-9', type: 'image', src: encodeFilePath('/Gallery/WhatsApp Image 2025-11-16 atw 8.29.38 PM.jpeg'), alt: 'Hair Transformation Showcase' },
  
  // Videos
  { id: 'vid-1', type: 'video', src: encodeFilePath('/Gallery/#butterflylocs #retouch #chuka #anitahhairstudio.mp4'), alt: 'Butterfly Locs Retouch' },
  { id: 'vid-2', type: 'video', src: encodeFilePath('/Gallery/#frenchcurls #frenchcurls❤️❤️❤️.mp4'), alt: 'French Curls' },
  { id: 'vid-3', type: 'video', src: encodeFilePath('/Gallery/#mini twists.mp4'), alt: 'Mini Twists' },
  { id: 'vid-4', type: 'video', src: encodeFilePath('/Gallery/WhatsApp Viadeo 2025-11-16 at 8.29.48 PM.mp4'), alt: 'Hair Styling Video' },
  { id: 'vid-5', type: 'video', src: encodeFilePath('/Gallery/WhatsApp Video 2025-11-16 at 8.29.43 PMa.mp4'), alt: 'Hair Service Video' },
  { id: 'vid-6', type: 'video', src: encodeFilePath('/Gallery/WhatsApp Video 2025-11-16 at 8.29.47 PMq.mp4'), alt: 'Professional Hair Styling' },
  { id: 'vid-7', type: 'video', src: encodeFilePath('/Gallery/WhatsApp Video 202s5-11-16 at 8.29.40 PM.mp4'), alt: 'Hair Transformation Video' },
  { id: 'vid-8', type: 'video', src: encodeFilePath('/Gallery/WhatsApp Videow 2025-11-16 at 8.29.45 PM.mp4'), alt: 'Creative Hair Design' },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [videoLoading, setVideoLoading] = useState<Set<string>>(new Set());
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState<Set<string>>(new Set());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const touchUsedRef = useRef<{ id: string; timestamp: number } | null>(null);

  // Handle tab change with animation reset
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    
    // Pause all videos when tab changes
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    setPlayingVideoId(null);
    setActiveCardId(null); // Reset active card when switching tabs

    // Refresh AOS animations when tab changes
    if (typeof window !== 'undefined' && (window as any).AOS) {
      setTimeout(() => {
        (window as any).AOS.refresh();
      }, 100);
    }
  };

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Refresh AOS when filtered items change (tab switching)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AOS) {
      setTimeout(() => {
        (window as any).AOS.refresh();
      }, 100);
    }
  }, [activeTab]);

  const filteredItems = galleryItems.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'images') return item.type === 'image';
    if (activeTab === 'videos') return item.type === 'video';
    return true;
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="gallery" 
      className={`py-20 px-4 md:px-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">Our Gallery</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore our portfolio of stunning transformations and creative hair designs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-muted/50 p-1.5 gap-2 backdrop-blur-sm border border-border/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square transition-shadow duration-300 ${
                  activeCardId === item.id ? 'active' : ''
                }`}
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay={index * 30}
                data-aos-offset="50"
                data-aos-easing="ease-out-cubic"
                style={{ 
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                  zIndex: playingVideoId === item.id ? 10 : 1,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(50, 50, 93, 0.35) 0px 60px 120px -20px, rgba(0, 0, 0, 0.4) 0px 40px 80px -30px, rgba(10, 37, 64, 0.45) 0px -2px 8px 0px inset, 0 0 30px rgba(169, 127, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset';
                  // Only clear activeCardId on mouse leave if it's not a touch device
                  if (window.matchMedia('(pointer: fine)').matches) {
                    setActiveCardId(null);
                  }
                }}
                onTouchStart={(e) => {
                  // Toggle active state on touch for mobile devices
                  // Only toggle if not clicking on a video element directly
                  if (item.type === 'image' || (e.target as HTMLElement).tagName !== 'VIDEO') {
                    setActiveCardId(prev => prev === item.id ? null : item.id);
                    // Mark that touch was used to prevent onClick from also firing
                    touchUsedRef.current = { id: item.id, timestamp: Date.now() };
                    // Clear the ref after a short delay
                    setTimeout(() => {
                      if (touchUsedRef.current?.id === item.id) {
                        touchUsedRef.current = null;
                      }
                    }, 300);
                  }
                }}
                onClick={(e) => {
                  // Skip if this click was triggered by a touch event
                  if (touchUsedRef.current?.id === item.id && Date.now() - touchUsedRef.current.timestamp < 500) {
                    return;
                  }
                  // For non-touch devices or when clicking on non-video areas, toggle text
                  // Skip if clicking directly on video element (video handles its own click)
                  if ((e.target as HTMLElement).tagName === 'VIDEO') {
                    return;
                  }
                  // Only handle click on desktop devices
                  if (window.matchMedia('(pointer: fine)').matches) {
                    setActiveCardId(prev => prev === item.id ? null : item.id);
                  }
                }}
              >
                {item.type === 'image' ? (
                  <>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 300px"
                      quality={90}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                      activeCardId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                    <div className="absolute inset-0 flex items-end justify-start p-3 md:p-4">
                      <div className={`transform transition-all duration-300 ${
                        activeCardId === item.id 
                          ? 'translate-y-0 opacity-100' 
                          : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                      }`}>
                        <p className="text-white text-xs md:text-sm font-medium drop-shadow-lg">
                          {item.alt}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {videoErrors.has(item.id) ? (
                      // Fallback when video fails to load
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center mb-4">
                          <Play className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="currentColor" />
                        </div>
                        <p className="text-xs md:text-sm text-foreground/70 text-center font-medium">
                          {item.alt}
                        </p>
                        <p className="text-[10px] md:text-xs text-foreground/50 text-center mt-2">
                          Video unavailable
                        </p>
                </div>
                    ) : (
                      <>
                        <video
                          ref={(el) => {
                            if (el) {
                              videoRefs.current.set(item.id, el);
                            }
                          }}
                          src={item.src}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          disablePictureInPicture
                          controlsList="nodownload nofullscreen noremoteplayback"
                          onLoadStart={() => {
                            setVideoLoading((prev) => new Set(prev).add(item.id));
                          }}
                          onLoadedMetadata={(e) => {
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(item.id);
                              return newSet;
                            });
                            setVideoReady((prev) => new Set(prev).add(item.id));
                            setVideoErrors((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(item.id);
                              return newSet;
                            });
                          }}
                          onCanPlay={(e) => {
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(item.id);
                              return newSet;
                            });
                            setVideoReady((prev) => new Set(prev).add(item.id));
                          }}
                          onMouseEnter={async (e) => {
                            const video = e.currentTarget;
                            if (!videoErrors.has(item.id) && video.paused && video.readyState >= 2) {
                              // Stop other playing videos
                              videoRefs.current.forEach((v, id) => {
                                if (id !== item.id && !v.paused) {
                                  v.pause();
                                  v.currentTime = 0;
                                  setPlayingVideoId((prev) => prev === id ? null : prev);
                                }
                              });
                              
                              setPlayingVideoId(item.id);
                              try {
                                await video.play();
                              } catch (error) {
                                console.warn('Video play failed on hover:', error);
                              }
                            }
                          }}
                          onMouseLeave={(e) => {
                            const video = e.currentTarget;
                            if (playingVideoId === item.id && !video.paused) {
                              setPlayingVideoId(null);
                              video.pause();
                              video.currentTime = 0;
                            }
                          }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            const video = e.currentTarget;
                            if (videoErrors.has(item.id)) return;
                            
                            console.log('Video clicked:', item.id, 'Paused:', video.paused, 'ReadyState:', video.readyState);
                            
                            // Stop other playing videos
                            videoRefs.current.forEach((v, id) => {
                              if (id !== item.id && !v.paused) {
                                v.pause();
                                v.currentTime = 0;
                                setPlayingVideoId((prev) => prev === id ? null : prev);
                              }
                            });
                            
                            if (video.paused) {
                              setPlayingVideoId(item.id);
                              // Load if needed, then play
                              if (video.readyState === 0) {
                                console.log('Loading video:', item.id);
                                video.load();
                                video.addEventListener('canplay', () => {
                                  console.log('Video can play:', item.id);
                                  video.play().then(() => {
                                    console.log('Video playing:', item.id);
                                  }).catch((error) => {
                                    console.error('Video play failed:', error);
                                    setVideoErrors((prev) => new Set(prev).add(item.id));
                                    setPlayingVideoId(null);
                                  });
                                }, { once: true });
                              } else {
                                console.log('Playing video directly:', item.id);
                                try {
                                  await video.play();
                                  console.log('Video playing:', item.id);
                                } catch (error) {
                                  console.error('Video play failed:', error);
                                  setVideoErrors((prev) => new Set(prev).add(item.id));
                                  setPlayingVideoId(null);
                                }
                              }
                            } else {
                              setPlayingVideoId(null);
                              video.pause();
                              video.currentTime = 0;
                            }
                          }}
                          onTouchStart={async (e) => {
                            e.stopPropagation();
                            const video = e.currentTarget;
                            if (videoErrors.has(item.id)) return;
                            
                            // Stop other playing videos
                            videoRefs.current.forEach((v, id) => {
                              if (id !== item.id && !v.paused) {
                                v.pause();
                                v.currentTime = 0;
                                setPlayingVideoId((prev) => prev === id ? null : prev);
                              }
                            });
                            
                            if (video.paused) {
                              setPlayingVideoId(item.id);
                              // Load if needed, then play
                              if (video.readyState === 0) {
                                video.load();
                                video.addEventListener('canplay', () => {
                                  video.play().catch((error) => {
                                    console.error('Video play failed:', error);
                                    setVideoErrors((prev) => new Set(prev).add(item.id));
                                    setPlayingVideoId(null);
                                  });
                                }, { once: true });
                              } else {
                                try {
                                  await video.play();
                                } catch (error) {
                                  console.error('Video play failed:', error);
                                  setVideoErrors((prev) => new Set(prev).add(item.id));
                                  setPlayingVideoId(null);
                                }
                              }
                            } else {
                              setPlayingVideoId(null);
                              video.pause();
                              video.currentTime = 0;
                            }
                          }}
                          onError={(e) => {
                            const video = e.currentTarget;
                            console.error('Video load error:', item.src, video.error);
                            setVideoErrors((prev) => new Set(prev).add(item.id));
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(item.id);
                              return newSet;
                            });
                          }}
                          onPlay={() => {
                            setPlayingVideoId(item.id);
                          }}
                          onPause={() => {
                            if (playingVideoId === item.id) {
                              setPlayingVideoId(null);
                            }
                          }}
                        />
                        {/* Loading indicator - only show for a limited time */}
                        {videoLoading.has(item.id) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                      activeCardId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                    {!videoErrors.has(item.id) && !videoLoading.has(item.id) && (
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                          playingVideoId === item.id ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                        }`}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const video = videoRefs.current.get(item.id);
                          if (!video || videoErrors.has(item.id)) return;
                          
                          // Stop other playing videos
                          videoRefs.current.forEach((v, id) => {
                            if (id !== item.id && !v.paused) {
                              v.pause();
                              v.currentTime = 0;
                              setPlayingVideoId((prev) => prev === id ? null : prev);
                            }
                          });
                          
                          if (video.paused) {
                            setPlayingVideoId(item.id);
                            // Load if needed, then play
                            if (video.readyState === 0) {
                              video.load();
                              video.addEventListener('canplay', () => {
                                video.play().catch((error) => {
                                  console.error('Video play failed:', error);
                                  setVideoErrors((prev) => new Set(prev).add(item.id));
                                  setPlayingVideoId(null);
                                });
                              }, { once: true });
                            } else {
                              try {
                                await video.play();
                              } catch (error) {
                                console.error('Video play failed:', error);
                                setVideoErrors((prev) => new Set(prev).add(item.id));
                                setPlayingVideoId(null);
                              }
                            }
                          }
                        }}
                        style={{ zIndex: 20 }}
                      >
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 cursor-pointer pointer-events-auto">
                          <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-end justify-start p-3 md:p-4">
                      <div className={`transform transition-all duration-300 ${
                        activeCardId === item.id 
                          ? 'translate-y-0 opacity-100' 
                          : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                      }`}>
                        <p className="text-white text-xs md:text-sm font-medium drop-shadow-lg">
                          {item.alt}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Glass border effect */}
                <div className={`absolute inset-0 rounded-xl md:rounded-2xl glass pointer-events-none transition-opacity duration-300 ${
                  activeCardId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
