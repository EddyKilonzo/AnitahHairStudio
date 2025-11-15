'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Scissors, Palette, Wind } from 'lucide-react';

const services = [
  {
    icon: Scissors,
    title: 'Expert Braiding',
    description: 'Beautiful braids and intricate styles tailored to your preferences using expert techniques.'
  },
  {
    icon: Palette,
    title: 'Hair Coloring',
    description: 'Vibrant colors, balayage, and highlights with premium, organic-friendly products.'
  },
  {
    icon: Wind,
    title: 'Blow Dry & Styling',
    description: 'Professional styling services for everyday looks or special occasions.'
  },
  {
    icon: Sparkles,
    title: 'Treatments & Care',
    description: 'Nourishing treatments and scalp care to maintain healthy, luscious hair.'
  }
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedServiceIndex, setFocusedServiceIndex] = useState<number | null>(null);

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
      id="services" 
      className={`py-20 px-4 md:px-8 bg-card/30 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">Our Services</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Experience a comprehensive range of hair services designed to bring out your best self.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const isFocused = focusedServiceIndex === index;
            const hasFocus = focusedServiceIndex !== null;
            
            return (
              <div
                key={index}
                className={`glass group rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                  hasFocus && !isFocused ? 'blur-sm opacity-60 scale-95' : 'blur-0 opacity-100'
                }`}
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay={index * 100}
                onMouseEnter={() => setFocusedServiceIndex(index)}
                onMouseLeave={() => setFocusedServiceIndex(null)}
                style={{ 
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                  hasFocus && !isFocused ? 'text-foreground/50' : ''
                }`}>{service.title}</h3>
                <p className={`text-sm transition-all duration-300 ${
                  hasFocus && !isFocused ? 'text-foreground/40' : 'text-foreground/70'
                }`}>{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
