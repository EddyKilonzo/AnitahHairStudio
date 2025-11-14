'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Scissors, Palette, Wind, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LinePath {
  // Line from scissor icon to image edge
  scissorToImagePath: string;
  // Lines from service icons to Book Appointment button
  iconToButtonPaths: Array<{ path: string; color: string }>;
}

export default function Hero() {
  // Gallery images
  const galleryImages = [
    { src: '/placeholder.jpg', alt: 'Anita\'s Hair Studio - Premium Hair Styling' },
    { src: '/placeholder.jpg', alt: 'Anita\'s Hair Studio - Hair Coloring' },
    { src: '/placeholder.jpg', alt: 'Anita\'s Hair Studio - Hair Cutting' },
  ];

  // Hero images for the three-image stacked design
  const heroImages = [
    { src: '/placeholder.jpg', alt: 'Anita\'s Hair Studio - Hair Styling' },
    { src: '/placeholder.jpg', alt: 'Anita\'s Hair Studio - Hair Services' },
    { src: '/placeholder.jpg', alt: 'Anita\'s Hair Studio - Premium Care' },
  ];

  // Purple theme variations matching Aurora colors (#A97FFF, #C19FFF, #D4B3FF)
  // Only 3 services to stay within image boundaries
  const services = [
    { 
      icon: Scissors, 
      label: 'Cutting', 
      color: 'oklch(0.67 0.16 290)', // Primary purple
      bgColor: 'oklch(0.95 0.04 290)' // Light purple background
    },
    { 
      icon: Palette, 
      label: 'Coloring', 
      color: 'oklch(0.72 0.14 285)', // Slightly lighter purple
      bgColor: 'oklch(0.94 0.04 285)' // Light purple background
    },
    { 
      icon: Wind, 
      label: 'Styling', 
      color: 'oklch(0.75 0.12 280)', // Medium purple (Aurora color)
      bgColor: 'oklch(0.93 0.03 280)' // Light purple background
    },
  ];

  const imageRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const scissorIconRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [linePaths, setLinePaths] = useState<LinePath | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Card configurations for shuffling animation
  // Each configuration defines positions for all 3 cards
  const cardConfigurations = [
    // Configuration 0: Original position - all cards visible
    [
      { width: '100%', height: '100%', pos: 'inset-0', transform: 'translateX(-8px) translateY(12px) rotate(-3deg)', zIndex: 1 },
      { width: '92%', height: '92%', pos: 'left-0 top-0', transform: 'translateX(6px) translateY(6px) rotate(1deg)', zIndex: 2 },
      { width: '85%', height: '88%', pos: 'right-0 top-0', transform: 'translateX(12px) translateY(-6px) rotate(2deg)', zIndex: 3 },
    ],
    // Configuration 1: Shuffled - card 2 moves to back
    [
      { width: '85%', height: '88%', pos: 'left-0 bottom-0', transform: 'translateX(-12px) translateY(10px) rotate(-2deg)', zIndex: 1 },
      { width: '100%', height: '100%', pos: 'inset-0', transform: 'translateX(6px) translateY(6px) rotate(1deg)', zIndex: 2 },
      { width: '92%', height: '92%', pos: 'right-0 top-0', transform: 'translateX(10px) translateY(-10px) rotate(3deg)', zIndex: 3 },
    ],
    // Configuration 2: Shuffled - card 1 moves to front
    [
      { width: '92%', height: '92%', pos: 'left-0 top-0', transform: 'translateX(-8px) translateY(8px) rotate(-1deg)', zIndex: 1 },
      { width: '85%', height: '88%', pos: 'right-0 top-0', transform: 'translateX(12px) translateY(-8px) rotate(2.5deg)', zIndex: 2 },
      { width: '100%', height: '100%', pos: 'inset-0', transform: 'translateX(4px) translateY(-4px) rotate(1.5deg)', zIndex: 3 },
    ],
    // Configuration 3: Shuffled - all cards repositioned
    [
      { width: '88%', height: '90%', pos: 'right-0 bottom-0', transform: 'translateX(8px) translateY(12px) rotate(2deg)', zIndex: 1 },
      { width: '85%', height: '88%', pos: 'left-0 top-0', transform: 'translateX(-6px) translateY(-6px) rotate(-1.5deg)', zIndex: 2 },
      { width: '92%', height: '92%', pos: 'inset-0', transform: 'translateX(3px) translateY(3px) rotate(0.5deg)', zIndex: 3 },
    ],
  ];

  // Shuffling animation effect
  useEffect(() => {
    if (!mounted) return;

    const shuffleInterval = setInterval(() => {
      setShuffleIndex((prev) => (prev + 1) % cardConfigurations.length);
    }, 4000); // Shuffle every 4 seconds

    return () => clearInterval(shuffleInterval);
  }, [mounted, cardConfigurations.length]);

  // Gallery navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  }, [galleryImages.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  }, [galleryImages.length]);

  // Handle ESC key to close preview and arrow keys for navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return;
      
      if (e.key === 'Escape') {
        setIsPreviewOpen(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPreviewOpen, goToPrevious, goToNext]);

  // Prevent body scroll when preview is open
  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreviewOpen]);

  // Handle responsive aspect ratio
  useEffect(() => {
    if (!imageContainerRef.current || typeof window === 'undefined') return;

    const container = imageContainerRef.current;
    const updateAspectRatio = () => {
      if (window.innerWidth >= 1024) {
        container.style.aspectRatio = '3 / 2';
      } else {
        container.style.aspectRatio = '16 / 10';
      }
    };

    updateAspectRatio();
    window.addEventListener('resize', updateAspectRatio);

    return () => {
      window.removeEventListener('resize', updateAspectRatio);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const calculatePaths = () => {
      // Wait for all refs to be set
      const hasAllRefs = 
        imageRef.current && 
        contentContainerRef.current &&
        scissorIconRef.current &&
        buttonRef.current &&
        iconRefs.current.filter(Boolean).length === 3;

      if (!hasAllRefs) {
        // Retry after a short delay
        setTimeout(calculatePaths, 100);
        return;
      }

      if (!sectionRef.current) return;
      
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const imageRect = imageRef.current!.getBoundingClientRect();
      const scissorRect = scissorIconRef.current!.getBoundingClientRect();
      const buttonRect = buttonRef.current!.getBoundingClientRect();

      // Calculate all positions relative to section (for SVG overlay)
      const getPercentX = (rect: DOMRect) => ((rect.left + rect.width / 2 - sectionRect.left) / sectionRect.width) * 100;
      const getPercentY = (rect: DOMRect) => ((rect.top + rect.height / 2 - sectionRect.top) / sectionRect.height) * 100;
      const getPercentXLeft = (rect: DOMRect) => ((rect.left - sectionRect.left) / sectionRect.width) * 100;
      const getPercentXRight = (rect: DOMRect) => ((rect.right - sectionRect.left) / sectionRect.width) * 100;
      const getPercentYTop = (rect: DOMRect) => ((rect.top - sectionRect.top) / sectionRect.height) * 100;
      const getPercentYBottom = (rect: DOMRect) => ((rect.bottom - sectionRect.top) / sectionRect.height) * 100;

      // 1. Line from scissor icon to image edge (touching the left edge of image)
      const scissorCenter = {
        x: getPercentX(scissorRect),
        y: getPercentY(scissorRect)
      };
      // Touch the left edge of the image at a point between top and center
      const imageLeftEdge = {
        x: getPercentXLeft(imageRect),
        y: getPercentYTop(imageRect) + (getPercentYBottom(imageRect) - getPercentYTop(imageRect)) * 0.35 // About 35% from top
      };
      
      // Curved path from scissor to image left edge
      const controlX1 = scissorCenter.x + (imageLeftEdge.x - scissorCenter.x) * 0.5;
      const controlY1 = scissorCenter.y + (imageLeftEdge.y - scissorCenter.y) * 0.4;
      const scissorToImagePath = `M ${scissorCenter.x} ${scissorCenter.y} Q ${controlX1} ${controlY1} ${imageLeftEdge.x} ${imageLeftEdge.y}`;

      // 2. Lines from service icons to Book Appointment button bottom-left
      // Button connection point: bottom-left edge
      const buttonBottomLeft = {
        x: (buttonRect.left - sectionRect.left) / sectionRect.width * 100,
        y: (buttonRect.bottom - sectionRect.top) / sectionRect.height * 100
      };

      // Get icon positions relative to section
      const iconPositions = iconRefs.current
        .filter(Boolean)
        .map((iconRef) => {
          if (!iconRef) return null;
          const iconRect = iconRef.getBoundingClientRect();
          return {
            x: getPercentX(iconRect),
            y: getPercentY(iconRect)
          };
        })
        .filter(Boolean) as Array<{ x: number; y: number }>;

      if (iconPositions.length !== 3) return;

      // Icon to button paths with smooth curves (lines FROM service icons TO button bottom-left)
      const iconToButtonPaths = iconPositions.map((iconPos, index) => {
        // Calculate control points for smooth curved paths (going from icon up to button bottom-left)
        // Curve upward and toward button bottom-left
        const controlX = iconPos.x + (buttonBottomLeft.x - iconPos.x) * 0.95;
        const controlY = iconPos.y - Math.abs(buttonBottomLeft.y - iconPos.y) * 0.4; // Curve upward
        const path = `M ${iconPos.x} ${iconPos.y} Q ${controlX} ${controlY} ${buttonBottomLeft.x} ${buttonBottomLeft.y}`;
        return { path, color: services[index].color };
      });

      setLinePaths({
        scissorToImagePath,
        iconToButtonPaths
      });
    };

    // Delay initial calculation to ensure DOM is ready
    const timeoutId = setTimeout(calculatePaths, 200);
    
    // Calculate on resize and scroll
    window.addEventListener('resize', calculatePaths);
    window.addEventListener('scroll', calculatePaths, true);

    // Use ResizeObserver for more accurate updates
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(calculatePaths, 50);
    });
    
    if (contentContainerRef.current) {
      resizeObserver.observe(contentContainerRef.current);
    }
    if (imageRef.current) {
      resizeObserver.observe(imageRef.current);
    }
    if (scissorIconRef.current) {
      resizeObserver.observe(scissorIconRef.current);
    }
    if (buttonRef.current) {
      resizeObserver.observe(buttonRef.current);
    }
    iconRefs.current.forEach(ref => {
      if (ref) resizeObserver.observe(ref);
    });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculatePaths);
      window.removeEventListener('scroll', calculatePaths, true);
      resizeObserver.disconnect();
    };
  }, [mounted, services]);

  return (
    <section 
      ref={sectionRef}
      id="home"
      className="h-screen flex flex-col pt-16 sm:pt-16 md:pt-20 pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        {/* Top Section - Content and Image */}
        <div className="grid md:grid-cols-2 lg:grid-cols-[2fr_3fr] gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-start flex-1 min-h-0 relative">
          {/* Left Side - Content (40% width) */}
          <div 
            ref={contentContainerRef}
            className="space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-5 relative z-10 flex flex-col justify-center mt-0 sm:mt-0 md:mt-1 lg:mt-8" 
            data-aos="fade-up" 
            data-aos-duration="900"
          >
            {/* Icon with dashed line - moved down to avoid navbar */}
            <div className="relative mb-0.5 sm:mb-1 md:mb-1.5 lg:mb-3">
              <div className="flex items-start gap-2 sm:gap-3 relative">
                <div 
                  ref={scissorIconRef}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full border-2 border-primary/40 flex items-center justify-center bg-primary/10 backdrop-blur-sm shadow-sm"
                >
                  <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight text-pretty">
              <span className="text-foreground">Connections that</span>
              <span className="block text-primary mt-0.5 sm:mt-1">spark beauty.</span>
          </h1>

            {/* Description */}
            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-foreground/70 max-w-xl text-pretty leading-tight">
              Say hello to Anita's Hair Studio — the salon that helps you build confidence through expert hair services, cutting-edge styling, and personalized care.
            </p>

            {/* CTA Button */}
            <div 
              ref={buttonRef}
              className="pt-1 sm:pt-1.5 md:pt-2 lg:pt-2" 
              data-aos="fade-up" 
              data-aos-duration="900" 
              data-aos-delay="200"
            >
              <a 
                href="https://wa.me/254727833237?text=Hi%20Anita!%20I%20would%20like%20to%20book%20an%20appointment%20at%20your%20Hair%20Studio."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-8 lg:py-4 rounded-full border-2 border-primary bg-transparent text-primary font-semibold hover:shadow-xl hover:scale-105 hover:bg-primary/10 transition-all duration-300 text-[10px] sm:text-xs md:text-sm lg:text-lg"
              >
                Book Appointment
              </a>
            </div>

          </div>

          {/* Right Side - Three Stacked Images with Shuffling Animation */}
          <div className="relative flex flex-col items-center md:items-start lg:items-start justify-center lg:justify-end lg:pr-0 pt-2 sm:pt-4 md:pt-6 lg:pt-16 overflow-hidden" data-aos="fade-up" data-aos-duration="900" data-aos-delay="300">
            <div 
              ref={imageRef}
              className="relative w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl h-[200px] sm:h-[260px] md:h-[340px] lg:h-[480px] xl:h-[520px] 2xl:h-[560px] pointer-events-none lg:pointer-events-auto"
            >
              {heroImages.map((image, index) => {
                const config = cardConfigurations[shuffleIndex][index];
                const isTopCard = config.zIndex === 3;
                
                return (
                  <div
                    key={index}
                    className={`absolute ${config.pos} rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl cursor-pointer group lg:pointer-events-auto pointer-events-none`}
                    onClick={() => setIsPreviewOpen(true)}
                    style={{
                      width: config.width,
                      height: config.height,
                      transform: config.transform,
                      zIndex: config.zIndex,
                      transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), width 1.2s cubic-bezier(0.4, 0, 0.2, 1), height 1.2s cubic-bezier(0.4, 0, 0.2, 1), z-index 1.2s ease-in-out',
                    }}
                    suppressHydrationWarning
                  >
                    <div 
                      ref={index === 0 ? imageContainerRef : null}
                      className="relative w-full h-full rounded-xl sm:rounded-2xl lg:rounded-3xl"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={index === 0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                      {/* Decorative border accent on top card */}
                      {isTopCard && (
                        <div className="absolute -inset-1 rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-primary/30 pointer-events-none" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Service Icons - Below images on mobile/tablet, hidden on desktop (shown at bottom) */}
            <div className="lg:hidden w-full mt-2 sm:mt-3 md:mt-4 pt-2">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 relative items-end justify-center max-w-md mx-auto" style={{ zIndex: 10 }} suppressHydrationWarning>
                {services.map((service, index) => {
                  const Icon = service.icon;
                  
                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        iconRefs.current[index] = el;
                      }}
                      className="flex flex-col items-center gap-2 group"
                      data-aos="fade-up"
                      data-aos-duration="700"
                      data-aos-delay={index * 100}
                    >
                      {/* Service Icon - Reduced size */}
                      <div 
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl backdrop-blur-sm"
                        style={{ 
                          borderColor: service.color,
                          backgroundColor: service.bgColor,
                          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                        }}
                      >
                        <Icon 
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" 
                          style={{ 
                            color: service.color
                          }}
                        />
                      </div>

                      {/* Service Label */}
                      <span 
                        className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors text-center"
                      >
                        {service.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Connecting Lines SVG - Full section overlay for scissor-to-image edge and icons-to-button */}
        {mounted && linePaths && (
          <svg 
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ 
              overflow: 'visible'
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Line from scissor icon to image - dashed curved line */}
            <path
              d={linePaths.scissorToImagePath}
              stroke="oklch(0.67 0.16 290)"
              strokeWidth="0.2"
              strokeLinecap="round"
              strokeDasharray="0.5,0.3"
              fill="none"
              opacity="0.35"
            />
            
            {/* Lines from service icons to Book Appointment button */}
            {linePaths.iconToButtonPaths.map((iconPath, index) => (
              <path
                key={`icon-${index}`}
                d={iconPath.path}
                stroke={iconPath.color}
                strokeWidth="0.15"
                strokeLinecap="round"
                strokeDasharray="0.9,0.5"
                fill="none"
                opacity="0.65"
              />
            ))}
          </svg>
        )}

        {/* Bottom Section - Service Icons - Desktop only */}
        <div className="hidden lg:block relative mt-2 lg:mt-4 xl:mt-6 h-[120px] lg:h-[140px] xl:h-[160px] shrink-0">
          {/* Service Icons Grid - 3 circles, constrained to not pass image */}
          {/* Icons stay within left column (40% width) so they don't extend beyond image */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4 xl:gap-6 relative h-full items-end pb-2 lg:max-w-[40%]" style={{ zIndex: 10 }}>
            {services.map((service, index) => {
              const Icon = service.icon;
              
              return (
                <div
                  key={index}
                  ref={(el) => {
                    iconRefs.current[index] = el;
                  }}
                  className="flex flex-col items-center gap-2 group"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay={index * 100}
                >
                  {/* Service Icon - Reduced size */}
                  <div 
                    className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl backdrop-blur-sm"
                    style={{ 
                      borderColor: service.color,
                      backgroundColor: service.bgColor,
                      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                    }}
                  >
                    <Icon 
                      className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 transition-colors" 
                      style={{ 
                        color: service.color
                      }}
                    />
        </div>

                  {/* Service Label */}
                  <span 
                    className="text-[10px] lg:text-xs xl:text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors text-center"
                  >
                    {service.label}
                  </span>
            </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-9999 bg-black/90 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setIsPreviewOpen(false)}
        >
          {/* Modal Container - 50vh height with margins */}
          <div 
            className="relative w-full max-w-5xl h-[50vh] m-4 md:m-6 lg:m-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top right, above navbar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(false);
              }}
              className="absolute -top-12 right-0 md:-top-14 md:right-0 z-10000 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl"
              aria-label="Close preview"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-0 md:-left-14 z-10000 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-0 md:-right-14 z-10000 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full p-4 md:p-8">
              <Image
                src={galleryImages[currentImageIndex].src}
                alt={galleryImages[currentImageIndex].alt}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 95vw, 80vw"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10000 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-sm font-medium text-black shadow-lg">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
