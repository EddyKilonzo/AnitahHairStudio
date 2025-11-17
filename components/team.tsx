'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { TikTokIcon } from './icons/tiktok-icon';

const teamMembers = [
  {
    name: 'Vivian Anita',
    role: 'Head Stylist & Founder',
    bio: 'A passionate hair artist focused on creating stunning transformations and empowering beauty.',
    quote: '"Beauty begins the moment you decide to be yourself."',
    socials: [
      { icon: Instagram, link: 'https://www.instagram.com/vivananitah/', label: 'Instagram' },
      { icon: WhatsAppIcon, link: 'https://wa.me/254727833237?text=Hi%20Vivian!%20I%27d%20love%20to%20learn%20more%20about%20your%20services.', label: 'WhatsApp' },
      { icon: TikTokIcon, link: 'https://www.tiktok.com/@vivananitah?lang=en', label: 'TikTok' },
    ]
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [typewriterStarted, setTypewriterStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Start typewriter when the section enters view; reset when it leaves
  useEffect(() => {
    let startTimer: ReturnType<typeof setTimeout> | null = null;

    if (isVisible) {
      setTypedName('');
      startTimer = setTimeout(() => setTypewriterStarted(true), 350);
    } else {
      setTypewriterStarted(false);
      setTypedName('');
    }

    return () => {
      if (startTimer) clearTimeout(startTimer);
    };
  }, [isVisible]);

  // Typewriter effect for the name — runs only after started
  useEffect(() => {
    const fullName = teamMembers[0].name;
    if (!typewriterStarted || typedName === fullName) return;

    const timer = setTimeout(() => {
      setTypedName(fullName.slice(0, typedName.length + 1));
    }, 140);

    return () => clearTimeout(timer);
  }, [typewriterStarted, typedName]);

  return (
    <section 
      ref={sectionRef}
      id="team" 
      className={`py-20 px-4 md:px-8 bg-card/30 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">Meet Our Team</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Expert professionals dedicated to your hair transformation.
          </p>
        </div>

        <div className="flex justify-center" data-aos="fade-up" data-aos-duration="700" data-aos-delay="250">
          <div className="w-full max-w-md">
            <div 
              className="group relative rounded-3xl overflow-hidden transition-all duration-300 backdrop-blur-xl bg-linear-to-br from-background/80 via-background/90 to-background/70 border border-border/50 shadow-2xl hover:shadow-primary/20 hover:scale-[1.02]"
            >
              {/* Portrait Photo */}
              <div className="relative w-full aspect-3/4 bg-linear-to-br from-primary/30 via-accent/20 to-primary/40 overflow-hidden">
                <Image
                  src="/Gallery/anita_team.jpeg"
                  alt="Vivian Anita portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto text-white">
                <div className="inline-block max-w-[92%] md:max-w-[75%] rounded-2xl p-5 md:p-6 bg-black/45 backdrop-blur-md border border-white/10 shadow-xl">
                  {/* Name with Verification Badge */}
                  <div className="flex items-center gap-2">
                    <h3 
                      className="text-3xl md:text-4xl font-bold drop-shadow-lg relative"
                      aria-label={teamMembers[0].name}
                    >
                      {typedName}
                      <span className="ml-1 align-baseline opacity-80 animate-pulse">
                        {typedName === teamMembers[0].name ? '' : '|'}
                      </span>
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs md:text-sm text-white/80 italic drop-shadow-md border-l-2 border-white/40 pl-3 mt-2">
                    {teamMembers[0].quote}
                  </p>

                  {/* Social Media Icons */}
                  <div className="flex items-center gap-3 pt-2">
                    {teamMembers[0].socials.map((social, idx) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={idx}
                          href={social.link}
                          target={social.link.startsWith('http') ? '_blank' : undefined}
                          rel={social.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 flex items-center justify-center hover:scale-110 shadow-lg"
                          aria-label={social.label}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
