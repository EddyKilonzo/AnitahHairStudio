'use client';

import { useState } from 'react';
import { InstagramIcon } from './icons/instagram-icon';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { TikTokIcon } from './icons/tiktok-icon';
import Image from 'next/image';

interface SocialMediaItem {
  id: string;
  type: 'video' | 'image';
  embedUrl?: string;
  imageUrl?: string;
  caption?: string;
}

// Sample data - replace with your actual social media embeds
const socialMediaData = {
  tiktok: [
    {
      id: '1',
      type: 'video' as const,
      embedUrl: 'https://www.tiktok.com/embed/v2/your-video-id',
      caption: 'Latest hairstyle trends'
    },
    {
      id: '2',
      type: 'video' as const,
      embedUrl: 'https://www.tiktok.com/embed/v2/your-video-id-2',
      caption: 'Hair transformation'
    },
    {
      id: '3',
      type: 'video' as const,
      embedUrl: 'https://www.tiktok.com/embed/v2/your-video-id-3',
      caption: 'Coloring tutorial'
    },
  ],
  instagram: [
    {
      id: '1',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Beautiful balayage work'
    },
    {
      id: '2',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Fresh cut and style'
    },
    {
      id: '3',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Summer hair vibes'
    },
    {
      id: '4',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Stunning color transformation'
    },
  ],
  whatsapp: [
    {
      id: '1',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Client testimonial'
    },
    {
      id: '2',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Before & After'
    },
    {
      id: '3',
      type: 'image' as const,
      imageUrl: '/placeholder.jpg',
      caption: 'Happy client'
    },
  ],
};

type Platform = 'tiktok' | 'instagram' | 'whatsapp';

export default function SocialMedia() {
  const [activeTab, setActiveTab] = useState<Platform>('instagram');

  const tabs = [
    {
      id: 'instagram' as Platform,
      label: 'Instagram',
      icon: InstagramIcon,
      color: 'oklch(0.67 0.16 290)',
      bgColor: 'oklch(0.95 0.04 290)',
    },
    {
      id: 'tiktok' as Platform,
      label: 'TikTok',
      icon: TikTokIcon,
      color: 'oklch(0.72 0.14 285)',
      bgColor: 'oklch(0.94 0.04 285)',
    },
    {
      id: 'whatsapp' as Platform,
      label: 'WhatsApp',
      icon: WhatsAppIcon,
      color: 'oklch(0.75 0.12 280)',
      bgColor: 'oklch(0.93 0.03 280)',
    },
  ];

  const currentData = socialMediaData[activeTab];

  return (
    <section 
      id="social-media" 
      className="py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-background to-muted/20"
    >
      <div 
        className="max-w-7xl mx-auto bg-background/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 lg:p-12"
        style={{
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
        }}
      >
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Follow Our <span className="text-primary">Journey</span>
          </h2>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            Stay connected with our latest styles, transformations, and hair inspiration
          </p>
        </div>

        {/* Tabs */}
        <div 
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 lg:mb-12" 
          data-aos="fade-up" 
          data-aos-delay="100"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 rounded-full
                  font-semibold text-sm md:text-base
                  transition-all duration-500 ease-out
                  border-2 backdrop-blur-sm
                  ${isActive 
                    ? 'shadow-lg scale-105 shadow-purple-500/20' 
                    : 'bg-transparent hover:scale-105 hover:shadow-md hover:bg-purple-500/5'
                  }
                `}
                style={{
                  backgroundColor: isActive ? tab.color : 'transparent',
                  borderColor: tab.color,
                  color: isActive ? 'oklch(1 0 0)' : tab.color,
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                }}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 ${isActive ? 'rotate-12 scale-110' : ''}`} />
                <span className="transition-all duration-300">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div 
          className="relative"
          data-aos="fade-up" 
          data-aos-delay="200"
        >
          {/* TikTok Videos */}
          {activeTab === 'tiktok' && (
            <div 
              key="tiktok"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-card transition-all duration-300 hover:scale-105"
                  style={{ 
                    aspectRatio: '9 / 16',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                  }}
                >
                  {item.type === 'video' && item.embedUrl ? (
                    <iframe
                      src={item.embedUrl}
                      className="w-full h-full"
                      allow="encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center p-6">
                        <TikTokIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
                        <p className="text-muted-foreground">Add your TikTok video</p>
                      </div>
                    </div>
                  )}
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm font-medium">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Instagram Posts */}
          {activeTab === 'instagram' && (
            <div 
              key="instagram"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden bg-card transition-all duration-300 hover:scale-105"
                  style={{ 
                    aspectRatio: '1 / 1',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                  }}
                >
                  {item.type === 'image' && item.imageUrl ? (
                    <>
                      <Image
                        src={item.imageUrl}
                        alt={item.caption || 'Instagram post'}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full">
                          <p className="text-white text-sm font-medium">{item.caption}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center p-4">
                        <InstagramIcon className="w-10 h-10 mx-auto mb-2 text-primary" />
                        <p className="text-muted-foreground text-xs">Add Instagram post</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* WhatsApp Content */}
          {activeTab === 'whatsapp' && (
            <div 
              key="whatsapp"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-card transition-all duration-300 hover:scale-105"
                  style={{ 
                    aspectRatio: '4 / 5',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                  }}
                >
                  {item.type === 'image' && item.imageUrl ? (
                    <>
                      <Image
                        src={item.imageUrl}
                        alt={item.caption || 'WhatsApp content'}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                        <div className="p-6 w-full">
                          <div 
                            className="flex items-center gap-2 mb-2"
                            style={{ color: 'oklch(0.75 0.12 280)' }}
                          >
                            <WhatsAppIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold text-white">Client Story</span>
                          </div>
                          <p className="text-white text-sm">{item.caption}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center p-6">
                        <WhatsAppIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
                        <p className="text-muted-foreground">Add WhatsApp content</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div 
          className="text-center mt-12 lg:mt-16" 
          data-aos="fade-up" 
          data-aos-delay="300"
        >
          <p className="text-foreground/70 mb-4">Want to see more? Follow us on social media!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.instagram.com/anitahshair_studio1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary bg-transparent text-primary font-semibold hover:bg-primary/10 hover:scale-105 transition-all duration-300"
            >
              <InstagramIcon className="w-5 h-5" />
              <span>Follow on Instagram</span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary bg-primary text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Follow WhatsApp Channel</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

