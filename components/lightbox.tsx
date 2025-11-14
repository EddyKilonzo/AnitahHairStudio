'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2, RotateCw } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
  images: Array<{ id: number; image: string; src?: string }>;
  currentIndex: number;
  onClose: () => void;
  isOpen: boolean;
}

export default function Lightbox({ images, currentIndex, onClose, isOpen }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  // Reset zoom and position when changing images
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [activeIndex]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, handlePrevious, handleNext]);

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          setZoom((prev) => Math.min(prev + 0.2, 3));
        } else {
          setZoom((prev) => Math.max(prev - 0.2, 0.5));
        }
      }
    };

    if (isOpen) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = async () => {
    const currentImage = images[activeIndex];
    // In a real implementation, you'd download the actual image
    // For now, we'll create a download link
    const link = document.createElement('a');
    link.href = currentImage.src || '/placeholder.jpg';
    link.download = `${currentImage.image}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    const currentImage = images[activeIndex];
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.image,
          text: `Check out this amazing transformation from Anita's Hair Studio!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Drag handlers for zoomed image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const currentImage = images[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Header - Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white/80 text-sm">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <span className="text-white/80 text-sm min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Rotate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRotate();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Download */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Download"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 ml-2"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation - Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white transition-all hover:scale-110 flex items-center justify-center shadow-2xl"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
        </button>
      )}

      {/* Image Container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div
          className="relative max-w-full max-h-full transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Image preview container - 75vh height */}
          <div className="relative w-full max-w-[90vw] h-[75vh] flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={currentImage.src || '/placeholder.jpg'}
                alt={currentImage.image}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white transition-all hover:scale-110 flex items-center justify-center shadow-2xl"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
        </button>
      )}

      {/* Footer - Image info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-1">
            {currentImage.image}
          </h3>
          <p className="text-white/60 text-sm">
            Use arrow keys to navigate • ESC to close • Scroll to zoom
          </p>
        </div>
      </div>

      {/* Thumbnail strip (optional) */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-0 right-0 z-10 px-8">
          <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
            {images.slice(Math.max(0, activeIndex - 4), Math.min(images.length, activeIndex + 5)).map((img, idx) => {
              const realIndex = Math.max(0, activeIndex - 4) + idx;
              return (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(realIndex);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    realIndex === activeIndex
                      ? 'border-primary scale-110'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-[8px] text-white/60">
                    {img.image}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

