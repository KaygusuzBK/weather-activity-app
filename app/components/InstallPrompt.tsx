'use client';

import { useEffect, useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import { IoPhonePortraitOutline } from 'react-icons/io5';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Kullanıcı daha önce reddetmediyse göster
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Zaten yüklü mü kontrol et
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-5 border border-white/20">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          aria-label="Kapat"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
            <IoPhonePortraitOutline className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="text-white font-bold text-lg mb-1">
              Uygulamayı Yükle
            </h3>
            <p className="text-white/90 text-sm mb-4">
              Ana ekranınıza ekleyerek hızlı erişim sağlayın
            </p>
            
            <button
              onClick={handleInstall}
              className="w-full bg-white text-indigo-600 font-semibold py-2.5 px-4 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <FiDownload className="w-5 h-5" />
              <span>Yükle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

