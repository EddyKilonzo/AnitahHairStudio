import Link from 'next/link';
import Image from 'next/image';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { InstagramIcon } from './icons/instagram-icon';

export default function Footer() {
  return (
    <footer className="relative bg-background text-foreground py-14 px-4 md:px-8 shadow-[0_-8px_32px_rgba(124,58,237,0.35)]">
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
            <p className="text-sm text-muted-foreground">Premium hair care and styling for everyone.</p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a></li>
              <li><a href="#gallery" className="text-muted-foreground hover:text-foreground transition-colors">Gallery</a></li>
              <li><a href="#team" className="text-muted-foreground hover:text-foreground transition-colors">Team</a></li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Mon - Fri: 9AM - 7PM</li>
              <li>Sat: 10AM - 6PM</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://chat.whatsapp.com/GGSXLi8O8b6BDtoKee6pvC?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-sm"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp Group
              </a>
              <a
                href="https://www.instagram.com/anitahshair_studio1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-sm"
              >
                <InstagramIcon className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Full-width separator that fits the footer edge-to-edge */}
      <div className="-mx-4 md:-mx-8 border-t border-border" />
      <div className="max-w-6xl mx-auto pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Anita's Hair Studio. All rights reserved.</p>
        <p className="mt-2">
          Developed by{' '}
          <a 
            href="https://www.linkedin.com/in/eddy-kilonzo-8879a024b/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:underline transition-colors"
          >
            EDDY MAX
          </a>
        </p>
      </div>
    </footer>
  );
}
