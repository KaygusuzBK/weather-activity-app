'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiShare2, FiLink2, FiDownload, FiX } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import type { CurrentWeather } from '../types/weather';
import AnimatedIcon from './ui/animated-icon';
import type { City } from '../data/popular-cities';
import {
  shareNative,
  copyToClipboard,
  getTwitterShareUrl,
  getFacebookShareUrl,
  getWhatsAppShareUrl,
  createShareableLink,
} from '../lib/share-utils';
import {
  captureElementScreenshot,
  createWidgetScreenshot,
  downloadScreenshot,
} from '../lib/screenshot';

interface ShareButtonProps {
  weather: CurrentWeather | null;
  city: City | null;
  location?: { latitude: number; longitude: number; city?: string } | null;
  elementRef?: React.RefObject<HTMLElement | null>;
}

export default function ShareButton({ weather, city, location, elementRef }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const updateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();

    const handleResize = () => updateMenuPosition();
    const handleScroll = () => updateMenuPosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updateMenuPosition]);

  if (!weather) return null;

  const cityName = city?.name || weather.name || location?.city || 'Konumunuz';
  const temperature = Math.round(weather.main.temp);
  const description = weather.weather[0]?.description || '';
  const icon = weather.weather[0]?.icon || '01d';

  const shareUrl = createShareableLink(cityName, city?.lat || location?.latitude, city?.lon || location?.longitude);
  const shareText = `${cityName} - ${temperature}°C, ${description}`;

  const shareData = {
    title: `${cityName} Hava Durumu`,
    text: shareText,
    url: shareUrl,
  };

  const handleNativeShare = async () => {
    const success = await shareNative(shareData);
    if (success) {
      setIsOpen(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScreenshot = async () => {
    try {
      let dataUrl: string;

      if (elementRef?.current) {
        // Element screenshot
        dataUrl = await captureElementScreenshot(elementRef.current);
      } else {
        // Widget screenshot
        dataUrl = createWidgetScreenshot({
          city: cityName,
          temperature,
          description,
          icon,
        });
      }

      downloadScreenshot(dataUrl, `hava-durumu-${cityName}-${Date.now()}.png`);
      setIsOpen(false);
    } catch (error) {
      console.error('Screenshot error:', error);
    }
  };

  const handleSocialShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen) {
            updateMenuPosition();
          }
          setIsOpen((prev) => !prev);
        }}
        className="p-2 sm:p-2.5 rounded-full transition-all hover:scale-110 shadow-lg border border-white/30"
        style={{
          background: 'linear-gradient(135deg, rgba(213, 216, 181, 0.9), rgba(204, 156, 117, 0.8))',
          color: '#2C2C2C',
        }}
        title="Paylaş"
      >
        <AnimatedIcon hover>
          <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#2C2C2C' }} />
        </AnimatedIcon>
      </button>

      {isOpen && menuPosition && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={shareMenuRef}
              className="p-2 rounded-xl shadow-lg min-w-[220px]"
              style={{
                position: 'fixed',
                top: menuPosition.top,
                left: menuPosition.left,
                transform: 'translateX(-100%)',
                backgroundColor: '#D5D8B5',
                border: '1px solid #CC9C75',
                zIndex: 9999,
              }}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b" style={{ borderColor: '#CC9C75' }}>
                <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>Paylaş</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-opacity-20"
                  style={{ color: '#2C2C2C' }}
                >
                  <AnimatedIcon hover>
                    <FiX className="w-4 h-4" />
                  </AnimatedIcon>
                </button>
              </div>

              <div className="space-y-1">
                {'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-all text-left"
                    style={{ backgroundColor: 'rgba(128, 154, 111, 0.12)', color: '#2C2C2C' }}
                  >
                    <AnimatedIcon hover>
                      <FiShare2 className="w-4 h-4" />
                    </AnimatedIcon>
                    <span className="text-sm">Paylaş (Yerel)</span>
                  </button>
                )}

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-all text-left"
                  style={{ backgroundColor: 'rgba(128, 154, 111, 0.12)', color: '#2C2C2C' }}
                >
                  <AnimatedIcon hover>
                    <FiLink2 className="w-4 h-4" />
                  </AnimatedIcon>
                  <span className="text-sm">{copied ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
                </button>

                <button
                  onClick={handleScreenshot}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-all text-left"
                  style={{ backgroundColor: 'rgba(128, 154, 111, 0.12)', color: '#2C2C2C' }}
                >
                  <AnimatedIcon hover>
                    <FiDownload className="w-4 h-4" />
                  </AnimatedIcon>
                  <span className="text-sm">Screenshot İndir</span>
                </button>

                <div className="pt-1 border-t" style={{ borderColor: '#CC9C75' }}>
                  <button
                    onClick={() => handleSocialShare(getTwitterShareUrl(shareData))}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-all text-left"
                    style={{ backgroundColor: 'rgba(128, 154, 111, 0.12)', color: '#2C2C2C' }}
                  >
                    <AnimatedIcon hover>
                      <FaTwitter className="w-4 h-4" />
                    </AnimatedIcon>
                    <span className="text-sm">Twitter</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare(getFacebookShareUrl(shareData))}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-all text-left"
                    style={{ backgroundColor: 'rgba(128, 154, 111, 0.12)', color: '#2C2C2C' }}
                  >
                    <AnimatedIcon hover>
                      <FaFacebook className="w-4 h-4" />
                    </AnimatedIcon>
                    <span className="text-sm">Facebook</span>
                  </button>

                  <button
                    onClick={() => handleSocialShare(getWhatsAppShareUrl(shareData))}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-all text-left"
                    style={{ backgroundColor: 'rgba(128, 154, 111, 0.12)', color: '#2C2C2C' }}
                  >
                    <AnimatedIcon hover>
                      <FaWhatsapp className="w-4 h-4" />
                    </AnimatedIcon>
                    <span className="text-sm">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

