'use client';

import { Calendar, Phone, X } from 'lucide-react';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { InstagramIcon } from './icons/instagram-icon';
import { TikTokIcon } from './icons/tiktok-icon';

interface QuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickActionSheet({ isOpen, onClose }: QuickActionSheetProps) {
  const quickActions = [
    {
      id: 'book',
      icon: Calendar,
      label: 'Book Now',
      description: 'Schedule appointment',
      color: 'oklch(0.67 0.16 290)',
      bgColor: 'oklch(0.95 0.04 290)',
      action: () => {
        const message = encodeURIComponent("Hello! I'd like to book an appointment.");
        window.open(`https://wa.me/254727833237?text=${message}`, '_blank');
        onClose();
      }
    },
    {
      id: 'call',
      icon: Phone,
      label: 'Call Now',
      description: '+254 727 833237',
      color: 'oklch(0.55 0.20 142)',
      bgColor: 'oklch(0.95 0.04 142)',
      action: () => {
        window.location.href = 'tel:+254727833237';
        onClose();
      }
    },
    {
      id: 'whatsapp',
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      description: 'Chat with us',
      color: 'oklch(0.55 0.15 142)',
      bgColor: 'oklch(0.95 0.04 142)',
      action: () => {
        window.open('https://wa.me/254727833237', '_blank');
        onClose();
      }
    }
  ];

  const socialActions = [
    {
      id: 'instagram',
      icon: 'instagram',
      label: 'Instagram',
      action: () => {
        window.open('https://instagram.com/anitashairstudio', '_blank');
      }
    },
    {
      id: 'tiktok',
      icon: 'tiktok',
      label: 'TikTok',
      action: () => {
        window.open('https://tiktok.com/@anitashairstudio', '_blank');
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300 lg:hidden"
        onClick={onClose}
      />

      {/* Action Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
        <div className="mx-4 mb-4 rounded-3xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2 animate-in fade-in duration-300">
            <div className="w-12 h-1.5 rounded-full bg-foreground/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 animate-in fade-in slide-in-from-left-2 duration-400">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-accent/50 transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-5 h-5 transition-transform duration-300" />
            </button>
          </div>

          {/* Main Actions Grid */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="flex flex-col items-start gap-3 p-4 rounded-2xl border-2 border-primary/40 bg-transparent hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 min-h-[96px] active:scale-95 group animate-in fade-in zoom-in slide-in-from-bottom-4"
                    style={{ 
                      animationDelay: `${100 + index * 80}ms`
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      {action.id === 'whatsapp' ? (
                        <Icon
                          className="w-6 h-6 transition-transform duration-300"
                          style={{ color: action.color }}
                        />
                      ) : (
                        <Icon
                          className="w-6 h-6 transition-transform duration-300"
                          style={{ color: action.color }}
                          strokeWidth={2}
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm mb-0.5 transition-colors duration-300 group-hover:text-primary">{action.label}</div>
                      <div className="text-xs text-foreground/60">{action.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '400ms', animationDuration: '500ms' }}>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs font-medium text-foreground/60 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://instagram.com/anitashairstudio', '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium min-h-[52px] active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 group"
                >
                  <InstagramIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-sm">Instagram</span>
                </button>
                <button
                  onClick={() => window.open('https://tiktok.com/@anitashairstudio', '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black text-white font-medium min-h-[52px] active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-black/50 hover:scale-105 group"
                >
                  <TikTokIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-sm">TikTok</span>
                </button>
              </div>
            </div>
          </div>

          {/* Safe area padding */}
          <div className="pb-safe" />
        </div>
      </div>
    </>
  );
}

