'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100,
      easing: 'ease-out-cubic',
      mirror: true,
      delay: 0,
      startEvent: 'DOMContentLoaded',
    });
    
    // Add class to body when AOS is initialized
    document.body.classList.add('aos-init');
    
    // Refresh AOS on resize
    const handleResize = () => {
      AOS.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return null;
}

