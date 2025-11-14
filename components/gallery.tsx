'use client';

import { useEffect, useRef, useState } from 'react';

const galleryItems = [
  { id: 2, image: 'Hair Transformation 2', size: 'small', src: '/placeholder.jpg' },
  { id: 1, image: 'Hair Transformation 1', size: 'large', src: '/placeholder.jpg' },
  { id: 4, image: 'Hair Transformation 4', size: 'small', src: '/placeholder.jpg' },
  { id: 3, image: 'Hair Transformation 3', size: 'medium', src: '/placeholder.jpg' },
  { id: 7, image: 'Hair Transformation 7', size: 'small', src: '/placeholder.jpg' },
  { id: 5, image: 'Hair Transformation 5', size: 'medium', src: '/placeholder.jpg' },
  { id: 6, image: 'Hair Transformation 6', size: 'large', src: '/placeholder.jpg' },
  { id: 8, image: 'Hair Transformation 8', size: 'small', src: '/placeholder.jpg' },
  { id: 11, image: 'Hair Transformation 11', size: 'small', src: '/placeholder.jpg' },
  { id: 9, image: 'Hair Transformation 9', size: 'medium', src: '/placeholder.jpg' },
  { id: 10, image: 'Hair Transformation 10', size: 'large', src: '/placeholder.jpg' },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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

  return (
    <section 
      ref={sectionRef}
      id="gallery" 
      className={`py-20 px-4 md:px-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">Our Gallery</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore our portfolio of stunning transformations and creative hair designs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]" style={{ gridAutoFlow: 'dense' }}>
          {galleryItems.map((item, index) => {
            let colSpan = 'col-span-1 md:col-span-1 lg:col-span-1';
            let rowSpan = 'row-span-1';
            
            if (item.size === 'large') {
              colSpan = 'col-span-2 md:col-span-2 lg:col-span-2';
              rowSpan = 'row-span-2';
            } else if (item.size === 'medium') {
              colSpan = 'col-span-2 md:col-span-2 lg:col-span-1';
              rowSpan = 'row-span-1 md:row-span-2 lg:row-span-1';
            }

            return (
              <div
                key={item.id}
                className={`${colSpan} ${rowSpan} group relative overflow-hidden rounded-xl md:rounded-2xl`}
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay={index * 70}
                style={{ 
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                }}
              >
                {/* Image placeholder */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--color-primary)/0.4,var(--color-accent)/0.4)] flex items-center justify-center text-foreground/50 font-medium text-sm md:text-base">
                  {item.image}
                </div>

                {/* Hover overlay - subtle gradient */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-primary)/0.8,transparent_50%,transparent)] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                
                {/* Zoom effect */}
                <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-500 origin-center" />

                {/* Info overlay */}
                <div className="absolute inset-0 flex flex-col items-end justify-end p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <div className="text-primary dark:text-white space-y-1">
                    <h3 className="font-semibold text-sm md:text-lg">{item.image}</h3>
                    <p className="text-xs md:text-sm text-primary/80 dark:text-white/80">View this style</p>
                  </div>
                </div>

                {/* Glass border effect */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl glass pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
