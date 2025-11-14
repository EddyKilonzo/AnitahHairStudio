'use client';

import { WhatsAppIcon } from './icons/whatsapp-icon';
import Calendar from './calendar';

export default function CTA() {

  return (
    <section id="booking" className="py-24 px-4 md:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div
            className="glass rounded-3xl p-8 md:p-12 space-y-8 h-fit"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-pretty leading-tight">
                Ready to Transform?
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Book your appointment today and discover the luxury of Anita's Hair Studio. Our expert stylists are ready to give you the look you deserve.
              </p>
            </div>

            <div className="flex flex-col gap-4 opacity-100">
              <a
                href="https://wa.me/254727833237?text=Hi%20Anita!%20I%27d%20like%20to%20book%20a%20hair%20appointment%20at%20your%20studio.%20Could%20you%20please%20let%20me%20know%20your%20available%20times?%20Thank%20you!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-transparent border-2 border-primary text-primary font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 group w-full md:w-auto z-10 relative"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Book on WhatsApp
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <p className="text-sm text-foreground/60">
                We'll respond within 24 hours with available times
              </p>
            </div>
          </div>

          <div 
            data-aos="fade-left"
            data-aos-duration="800"
            className="flex justify-center w-full"
          >
            <div className="w-full max-w-sm opacity-100">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
