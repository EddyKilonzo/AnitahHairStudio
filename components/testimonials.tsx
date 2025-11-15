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
    title: "Client Testimonial 1",
    thumbnail: "Client Review 1",
    videoUrl: "" // Add YouTube or video URL here
  },
  {
    id: 2,
    title: "Client Testimonial 2",
    thumbnail: "Client Review 2",
    videoUrl: "" // Add YouTube or video URL here
  },
  {
    id: 3,
    title: "Client Testimonial 3",
    thumbnail: "Client Review 3",
    videoUrl: "" // Add YouTube or video URL here
  },
];

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState('text');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [focusedTestimonialIndex, setFocusedTestimonialIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

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

  // Close modal with ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedVideo) {
        setSelectedVideo(null);
      }
    };

    if (selectedVideo) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  return (
    <section id="testimonials" className="py-20 px-4 md:px-8 bg-background/50">
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
            className="overflow-hidden -mx-4 md:-mx-8 pt-8 pb-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-hidden pl-8 md:pl-16 pr-8 md:pr-16 items-start pt-4 pb-4"
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
                      className={`w-[260px] sm:w-[300px] md:w-[320px] lg:w-[360px] p-6 md:p-8 rounded-2xl bg-background border border-primary/20 hover:border-primary/60 transition-all duration-300 ${
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
          <div className="grid md:grid-cols-3 gap-6">
            {videoTestimonials.map((video, index) => (
              <div
                key={video.id}
                onClick={() => video.videoUrl && setSelectedVideo(video.videoUrl)}
                className="group relative overflow-hidden rounded-2xl aspect-3/4 bg-[linear-gradient(to_bottom_right,var(--color-primary)/0.2,var(--color-accent)/0.2)] cursor-pointer"
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay={index * 120}
                style={{ 
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                }}
              >
                {/* Video placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center mx-auto group-hover:bg-primary/50 transition-all duration-300">
                      <svg className="w-8 h-8 text-primary fill-current ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-foreground/70 text-sm">{video.thumbnail}</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-primary)/0.6,transparent_50%,transparent)] opacity-0 group-hover:opacity-100 dark:group-hover:opacity-100 transition-opacity duration-300" />

                {/* Glass effect */}
                <div className="absolute inset-0 rounded-2xl glass pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="relative w-full max-w-4xl mx-4 aspect-video animate-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - Top right corner */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-14 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white hover:text-primary transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-white/20"
                aria-label="Close video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* ESC hint */}
              <div className="absolute -top-14 left-0 text-white/60 text-sm">
                Press ESC or click outside to close
              </div>

              <iframe
                src={selectedVideo.includes('youtube.com') || selectedVideo.includes('youtu.be') 
                  ? selectedVideo.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                  : selectedVideo
                }
                className="w-full h-full rounded-2xl shadow-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video testimonial"
              />
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
