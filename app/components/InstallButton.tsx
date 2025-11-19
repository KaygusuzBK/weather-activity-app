'use client';

import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Zaten yüklü mü kontrol et
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="flex items-center justify-between gap-4 opacity-50">
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">Ana Ekrana Ekle</span>
        <div className="text-sm text-gray-500 dark:text-gray-400">✓ Yüklü</div>
      </div>
    );
  }

  if (!deferredPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center justify-between gap-4 w-full hover:bg-white/20 dark:hover:bg-gray-700/20 p-2 -m-2 rounded-xl transition-colors"
    >
      <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">Ana Ekrana Ekle</span>
      <div className="flex-shrink-0 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <FiDownload className="w-5 h-5" />
      </div>
    </button>
  );
}

