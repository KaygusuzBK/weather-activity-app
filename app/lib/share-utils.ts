/**
 * Share utilities for social media and native sharing
 */

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Native Web Share API ile paylaşım
 */
export async function shareNative(data: ShareData): Promise<boolean> {
  if (!('share' in navigator)) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Share error:', error);
    }
    return false;
  }
}

/**
 * Link'i clipboard'a kopyala
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Copy to clipboard error:', error);
    return false;
  }
}

/**
 * Twitter paylaşım URL'i oluştur
 */
export function getTwitterShareUrl(data: ShareData): string {
  const text = encodeURIComponent(`${data.text} ${data.url}`);
  return `https://twitter.com/intent/tweet?text=${text}`;
}

/**
 * Facebook paylaşım URL'i oluştur
 */
export function getFacebookShareUrl(data: ShareData): string {
  const url = encodeURIComponent(data.url);
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
}

/**
 * WhatsApp paylaşım URL'i oluştur
 */
export function getWhatsAppShareUrl(data: ShareData): string {
  const text = encodeURIComponent(`${data.text} ${data.url}`);
  return `https://wa.me/?text=${text}`;
}

/**
 * Shareable link oluştur (şehir bazlı)
 */
export function createShareableLink(cityName?: string, lat?: number, lon?: number): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  if (cityName) {
    return `${baseUrl}?city=${encodeURIComponent(cityName)}`;
  }
  
  if (lat && lon) {
    return `${baseUrl}?lat=${lat}&lon=${lon}`;
  }
  
  return baseUrl;
}

