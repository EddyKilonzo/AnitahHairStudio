'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

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

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-sm text-foreground/70">123 Style Avenue, Fashion District</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-sm text-foreground/70">(555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-foreground/70">hello@anitastudio.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 000-0000"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Tell us about your desired service and preferred date/time..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Book Appointment
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
