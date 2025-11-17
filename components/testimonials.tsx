'use client';

import { useState, useEffect, useRef } from 'react';

// Helper function to generate avatar initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to encode file paths for URLs
const encodeFilePath = (path: string): string => {
  const parts = path.split('/');
  const directory = parts.slice(0, -1).join('/');
  const filename = parts[parts.length - 1];
  // Encode only the filename, keep directory as is
  return directory + '/' + encodeURIComponent(filename);
};

const allTestimonials = [
  {
    id: 1,
    text: "Anita transformed my hair completely. The attention to detail and her expertise is unmatched. I feel like a new person!",
    author: "Tess",
    title: "Hair Care Enthusiast"
  },
  {
    id: 2,
    text: "Best salon experience ever. The team is so welcoming and professional. Highly recommend Anita's Hair Studio!",
    author: "Noelle",
    title: "Regular Client"
  },
  {
    id: 3,
    text: "My hair has never looked better. Anita really understands what works for my hair type and gives amazing advice.",
    author: "Gloria",
    title: "Client"
  },
  {
    id: 4,
    text: "The results exceeded my expectations. Anita listened to my ideas and created exactly what I envisioned. Truly talented!",
    author: "Faith",
    title: "Bride Client"
  },
  {
    id: 5,
    text: "Outstanding service and atmosphere. From consultation to final result, everything was perfection. I'm already booking my next appointment!",
    author: "Nkirote",
    title: "Loyal Customer"
  },
];

// Create duplicated testimonials for seamless infinite loop
const duplicatedTestimonials = [...allTestimonials, ...allTestimonials, ...allTestimonials];

const videoTestimonials = [
  {
    id: 1,
    title: "Client Review 1",
    thumbnail: "Client Review 1",
    videoUrl: encodeFilePath('/Gallery/#mini twists.mp4')
  },
  {
    id: 2,
    title: "Client Review 2",
    thumbnail: "Client Review 2",
    videoUrl: encodeFilePath('/Gallery/#butterflylocs #retouch #chuka #anitahhairstudio.mp4')
  },
  {
    id: 3,
    title: "Client Review 3",
    thumbnail: "Client Review 3",
    videoUrl: encodeFilePath('/Gallery/#frenchcurls #frenchcurls❤️❤️❤️.mp4')
  },
];

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState('text');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [focusedTestimonialIndex, setFocusedTestimonialIndex] = useState<number | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const [videoLoading, setVideoLoading] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const inlineVideoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    if (activeTab !== 'text' || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let animationId: number | null = null;

    const animate = () => {
      if (!container) return;

      // Only scroll when not hovered
      if (!isHovered) {
        scrollPositionRef.current += 0.5; // Slow scroll speed (pixels per frame)
        
        // Get the width of one testimonial card (including gap)
        const firstCard = container.querySelector('div[class*="shrink-0"]') as HTMLElement;
        if (firstCard) {
          const cardWidth = firstCard.offsetWidth + 24; // card width + gap (gap-6 = 24px)
          const totalWidth = cardWidth * allTestimonials.length;
          
          // Reset position when we've scrolled through one set of testimonials
          // This creates a seamless loop since we have duplicated testimonials
          if (scrollPositionRef.current >= totalWidth) {
            scrollPositionRef.current = 0;
          }
          
          container.scrollLeft = scrollPositionRef.current;
        }
      }
      
      // Always continue the animation loop
      animationId = requestAnimationFrame(animate);
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [activeTab, isHovered]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close modal with ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVideo) {
          setSelectedVideo(null);
        }
        if (playingVideoId) {
          setPlayingVideoId(null);
          const video = inlineVideoRefs.current[playingVideoId];
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        }
      }
    };

    if (selectedVideo || playingVideoId) {
      document.addEventListener('keydown', handleEscape);
      if (selectedVideo) {
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo, playingVideoId]);

  // Autoplay video in modal immediately after opening
  useEffect(() => {
    if (!selectedVideo) return;
    const isFileVideo = /\.(mp4|webm)(\?.*)?$/i.test(selectedVideo);
    if (isFileVideo && modalVideoRef.current) {
      const video = modalVideoRef.current;
      
      // Ensure video is loaded before playing
      if (video.readyState >= 2) {
        // Video has metadata, can try to play
        video.play().catch((error) => {
          console.warn('Autoplay failed, user interaction may be required:', error);
        });
      } else {
        // Wait for video to load metadata
        const handleCanPlay = () => {
          video.play().catch((error) => {
            console.warn('Autoplay failed after load:', error);
          });
          video.removeEventListener('canplay', handleCanPlay);
        };
        video.addEventListener('canplay', handleCanPlay);
        
        // Also try to load if not already loading
        if (video.readyState === 0) {
          video.load();
        }
      }
    }
  }, [selectedVideo]);

  return (
    <section id="testimonials" className="py-20 px-4 md:px-8 bg-background/50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">What Our Clients Say</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Hear from our satisfied clients about their transformation journey.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center gap-4" data-aos="fade-up" data-aos-duration="700" data-aos-delay="200">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-6 md:px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'text'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-background border border-primary/30 text-foreground hover:border-primary/60'
            }`}
          >
            Client Stories
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 md:px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'video'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-background border border-primary/30 text-foreground hover:border-primary/60'
            }`}
          >
            Video Reviews
          </button>
        </div>

        {/* Text Testimonials - Infinite Loop Carousel */}
        {activeTab === 'text' && (
          <div
            className="overflow-hidden pt-8 pb-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-hidden pl-4 md:pl-16 pr-4 md:pr-16 items-start pt-4 pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                willChange: 'scroll-position',
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => {
                const isFocused = focusedTestimonialIndex === index;
                const hasFocus = focusedTestimonialIndex !== null;
                
                return (
                  <div
                    key={`${testimonial.id}-${index}`}
                    className="shrink-0"
                  >
                    <div
                      className={`w-[280px] sm:w-[300px] md:w-[320px] lg:w-[360px] p-6 md:p-8 rounded-2xl bg-background border border-primary/20 hover:border-primary/60 transition-all duration-300 ${
                        hasFocus && !isFocused ? 'blur-sm opacity-60 scale-95' : 'blur-0 opacity-100 hover:-translate-y-1'
                      }`}
                      data-aos="fade-up"
                      data-aos-duration="700"
                      data-aos-delay={index % 3 * 120}
                      onMouseEnter={() => setFocusedTestimonialIndex(index)}
                      onMouseLeave={() => setFocusedTestimonialIndex(null)}
                      style={{
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                      }}
                    >
                    {/* Client Photo Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold shadow-md border-2 border-primary/30">
                        <span>{getInitials(testimonial.author)}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-primary" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    
                    <p className={`text-foreground/80 mb-6 leading-relaxed text-center transition-all duration-300 ${
                      hasFocus && !isFocused ? 'text-foreground/50' : ''
                    }`}>"{testimonial.text}"</p>
                    
                    <div className="border-t border-primary/10 pt-4 text-center">
                      <p className={`font-semibold transition-all duration-300 ${
                        hasFocus && !isFocused ? 'text-foreground/50' : 'text-foreground'
                      }`}>{testimonial.author}</p>
                      <p className={`text-sm transition-all duration-300 ${
                        hasFocus && !isFocused ? 'text-foreground/40' : 'text-foreground/60'
                      }`}>{testimonial.title}</p>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Video Testimonials */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videoTestimonials.map((video, index) => {
              const isPlaying = playingVideoId === video.id;
              const isVideoFile = /\.(mp4|webm)(\?.*)?$/i.test(video.videoUrl);
              
              const handleClick = () => {
                if (!video.videoUrl) return;
                
                if (isMobile && isVideoFile) {
                  // On mobile, play inline
                  if (isPlaying) {
                    // If already playing, pause and reset
                    setPlayingVideoId(null);
                    const videoEl = inlineVideoRefs.current[video.id];
                    if (videoEl) {
                      videoEl.pause();
                      videoEl.currentTime = 0;
                    }
                  } else {
                    // Stop any other playing video
                    if (playingVideoId) {
                      const prevVideo = inlineVideoRefs.current[playingVideoId];
                      if (prevVideo) {
                        prevVideo.pause();
                        prevVideo.currentTime = 0;
                      }
                    }
                    // Play this video
                    setPlayingVideoId(video.id);
                    setTimeout(() => {
                      const videoEl = inlineVideoRefs.current[video.id];
                      if (videoEl) {
                        videoEl.play().catch(console.error);
                      }
                    }, 100);
                  }
                } else {
                  // On desktop or for iframes, open modal
                  setSelectedVideo(video.videoUrl);
                }
              };

              return (
                <div
                  key={video.id}
                  className={`group relative overflow-hidden rounded-2xl bg-[linear-gradient(to_bottom_right,var(--color-primary)/0.2,var(--color-accent)/0.2)] cursor-pointer animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 ${
                    isPlaying && isMobile ? 'col-span-1 sm:col-span-2 md:col-span-3 aspect-video' : 'aspect-3/4'
                  }`}
                  style={{ 
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                    animationDuration: `${1000 + index * 300}ms`
                  }}
                  onClick={handleClick}
                >
                  {/* Video element */}
                  {isVideoFile ? (
                    <>
                      {videoErrors.has(video.id) ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 p-4">
                          <p className="text-foreground/70 text-sm text-center mb-2">{video.title}</p>
                          <p className="text-foreground/50 text-xs text-center">Video unavailable</p>
                        </div>
                      ) : (
                        <video
                          ref={(el) => {
                            inlineVideoRefs.current[video.id] = el;
                          }}
                          src={video.videoUrl}
                          className={`absolute inset-0 w-full h-full rounded-2xl ${
                            isPlaying && isMobile ? 'object-contain' : 'object-cover'
                          } ${isPlaying && isMobile ? '' : 'pointer-events-none'}`}
                          controls={isPlaying && isMobile}
                          muted={!isPlaying}
                          playsInline
                          preload={isPlaying ? "auto" : "metadata"}
                          onLoadStart={() => {
                            setVideoLoading((prev) => new Set(prev).add(video.id));
                            setVideoErrors((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(video.id);
                              return newSet;
                            });
                          }}
                          onLoadedMetadata={() => {
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(video.id);
                              return newSet;
                            });
                          }}
                          onCanPlay={() => {
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(video.id);
                              return newSet;
                            });
                          }}
                          onWaiting={(e) => {
                            // Video is buffering during playback
                            const videoEl = e.currentTarget;
                            if (videoEl.readyState < 3 && isPlaying) {
                              setVideoLoading((prev) => new Set(prev).add(video.id));
                            }
                          }}
                          onPlaying={() => {
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(video.id);
                              return newSet;
                            });
                          }}
                          onStalled={(e) => {
                            // Video download stalled, try to recover
                            const videoEl = e.currentTarget;
                            if (videoEl.networkState === 3 && isPlaying) {
                              // Network error, try to reload
                              setTimeout(() => {
                                if (videoEl.networkState === 3) {
                                  videoEl.load();
                                  if (isPlaying) {
                                    videoEl.play().catch(() => {});
                                  }
                                }
                              }, 1000);
                            }
                          }}
                          onError={(e) => {
                            setVideoErrors((prev) => new Set(prev).add(video.id));
                            setVideoLoading((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(video.id);
                              return newSet;
                            });
                          }}
                          onEnded={() => {
                            if (isMobile) {
                              setPlayingVideoId(null);
                            }
                          }}
                        />
                      )}
                      {videoLoading.has(video.id) && !videoErrors.has(video.id) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <iframe
                      src={video.videoUrl}
                      className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      loading="lazy"
                      title={video.title}
                    />
                  )}

                  {/* Glassy overlay - hide when playing on mobile or when video has error */}
                  {!(isPlaying && isMobile) && !videoErrors.has(video.id) && (
                    <>
                      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/45" />

                      {/* Center play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          aria-label={`Play ${video.title}`}
                          className="w-16 h-16 md:w-18 md:h-18 rounded-full border border-white/25 bg-white/15 text-white shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                        >
                          <svg className="w-7 h-7 md:w-8 md:h-8 fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Close button when playing on mobile */}
                  {isPlaying && isMobile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingVideoId(null);
                        const videoEl = inlineVideoRefs.current[video.id];
                        if (videoEl) {
                          videoEl.pause();
                          videoEl.currentTime = 0;
                        }
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white transition-all duration-300 flex items-center justify-center z-10"
                      aria-label="Close video"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Video Modal - Desktop only */}
        {selectedVideo && !isMobile && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 pt-20 pb-4 px-4 sm:pt-24 sm:pb-6 sm:px-6"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="relative w-full max-w-4xl h-full max-h-[calc(100vh-6rem)] flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - Fixed position, always visible above navbar */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="fixed top-20 right-4 sm:top-24 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm text-black hover:text-primary transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-white/20 shadow-2xl z-[10000]"
                aria-label="Close video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* ESC hint - Fixed position, always visible */}
              <div className="fixed top-20 left-4 sm:top-24 sm:left-6 text-white/80 text-xs sm:text-sm z-[10000] whitespace-nowrap bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                Press ESC or click outside to close
              </div>

              {/* Video container with proper centering */}
              <div className="w-full h-full flex items-center justify-center">
                {/\.(mp4|webm)(\?.*)?$/i.test(selectedVideo) ? (
                  <video
                    src={selectedVideo}
                    className="max-w-full max-h-full w-auto h-auto rounded-2xl shadow-2xl bg-black"
                    style={{ 
                      objectFit: 'contain',
                      maxHeight: 'calc(100vh - 8rem)'
                    }}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    ref={modalVideoRef}
                    onError={(e) => {
                      console.error('Modal video load error:', selectedVideo, e.currentTarget.error);
                    }}
                    onWaiting={(e) => {
                      // Video is buffering
                      const video = e.currentTarget;
                      if (video.readyState < 3) {
                        console.warn('Video buffering, readyState:', video.readyState);
                      }
                    }}
                    onStalled={(e) => {
                      // Video download stalled
                      console.warn('Video stalled, attempting to reload');
                      const video = e.currentTarget;
                      if (video.networkState === 3) {
                        // Network error, try to reload
                        video.load();
                      }
                    }}
                    onCanPlayThrough={() => {
                      // Video can play through without buffering
                      console.log('Video can play through');
                    }}
                  />
                ) : (
                  <iframe
                    src={selectedVideo.includes('youtube.com') || selectedVideo.includes('youtu.be') 
                      ? selectedVideo
                          .replace('watch?v=', 'embed/')
                          .replace('youtu.be/', 'youtube.com/embed/') + (selectedVideo.includes('?') ? '&' : '?') + 'autoplay=1&rel=0'
                      : selectedVideo
                    }
                    className="max-w-full max-h-full w-full h-full rounded-2xl shadow-2xl bg-black"
                    style={{ 
                      maxHeight: 'calc(100vh - 8rem)',
                      aspectRatio: '16/9'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video testimonial"
                  />
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        div[class*="overflow-x-auto"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
