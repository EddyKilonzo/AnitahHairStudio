import Link from 'next/link';
import Image from 'next/image';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { InstagramIcon } from './icons/instagram-icon';

export default function Footer() {
  return (
    <footer className="bg-card/70 dark:bg-card/50 border-t border-border/30 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8" data-aos="fade-up" data-aos-duration="700">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/AnitaLogo.png"
                alt="Anitah's Hair Studio Logo"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-foreground/70">Premium hair care and styling for everyone.</p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="text-foreground/70 hover:text-primary transition-colors">Services</a></li>
              <li><a href="#gallery" className="text-foreground/70 hover:text-primary transition-colors">Gallery</a></li>
              <li><a href="#team" className="text-foreground/70 hover:text-primary transition-colors">Team</a></li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold">Hours</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>Mon - Fri: 9AM - 7PM</li>
              <li>Sat: 10AM - 6PM</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://whatsapp.com/channel/0029VaXxXxXxXxXxXxXxXx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors text-foreground/70 hover:text-primary text-sm"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp Channel
              </a>
              <a
                href="https://www.instagram.com/anitahshair_studio1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors text-foreground/70 hover:text-primary text-sm"
              >
                <InstagramIcon className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 text-center text-sm text-foreground/50">
          <p>&copy; 2025 Anita's Hair Studio. All rights reserved.</p>
          <p className="mt-2">
            Developed by{' '}
            <a 
              href="https://www.linkedin.com/in/eddy-kilonzo-8879a024b/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              EDDY MAX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
