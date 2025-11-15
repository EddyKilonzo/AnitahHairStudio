'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
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
      id="contact" 
      className={`py-20 px-4 md:px-8 bg-card/30 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">Book Your Appointment</h2>
          <p className="text-lg text-foreground/70">Ready for your transformation? Get in touch to schedule your visit.</p>
        </div>

        <div className="flex justify-center">
          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all group">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-sm text-foreground/70">123 Style Avenue, Fashion District</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all group">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-sm text-foreground/70">(555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all group">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-foreground/70">hello@anitastudio.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
