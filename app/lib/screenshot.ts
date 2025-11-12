/**
 * Screenshot utilities using html2canvas and Canvas API
 */

import html2canvas from 'html2canvas';

interface BaseScreenshotData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

function ensureClientEnvironment() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Screenshot işlemleri sadece tarayıcı ortamında desteklenir');
  }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  });
}

/**
 * Element'i screenshot olarak al (html2canvas)
 */
export async function captureElementScreenshot(
  element: HTMLElement,
  options?: {
    backgroundColor?: string;
    scale?: number;
    quality?: number;
  }
): Promise<string> {
  ensureClientEnvironment();
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: options?.backgroundColor || '#D5D8B5',
      scale: options?.scale || 2,
      useCORS: true,
      logging: false,
    });

    return canvas.toDataURL('image/png', options?.quality || 0.95);
  } catch (error) {
    console.error('Screenshot capture error:', error);
    throw new Error('Screenshot alınamadı');
  }
}

/**
 * Canvas API ile özel widget screenshot
 */
export function createWidgetScreenshot(
  data: BaseScreenshotData,
  options?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  }
): string {
  const width = options?.width || 400;
  const height = options?.height || 300;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context oluşturulamadı');
  }

  // Background
  ctx.fillStyle = options?.backgroundColor || '#D5D8B5';
  ctx.fillRect(0, 0, width, height);

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#809A6F');
  gradient.addColorStop(1, '#A25B5B');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // City name
  ctx.fillStyle = '#D5D8B5';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(data.city, width / 2, 40);

  // Temperature
  ctx.font = 'bold 64px Arial';
  ctx.fillText(`${data.temperature}°`, width / 2, height / 2);

  // Description
  ctx.font = '18px Arial';
  ctx.fillText(data.description, width / 2, height / 2 + 40);

  return canvas.toDataURL('image/png');
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    font: string;
    color: string;
    textAlign?: CanvasTextAlign;
    shadow?: {
      color: string;
      blur: number;
      offsetX?: number;
      offsetY?: number;
    };
  }
) {
  ctx.save();
  ctx.font = options.font;
  ctx.fillStyle = options.color;
  ctx.textAlign = options.textAlign || 'center';
  if (options.shadow) {
    ctx.shadowColor = options.shadow.color;
    ctx.shadowBlur = options.shadow.blur;
    ctx.shadowOffsetX = options.shadow.offsetX ?? 0;
    ctx.shadowOffsetY = options.shadow.offsetY ?? 0;
  }
  ctx.fillText(text, x, y);
  ctx.restore();
}

export async function createInstagramStoryScreenshot(
  data: BaseScreenshotData,
  options?: {
    element?: HTMLElement | null;
  }
): Promise<string> {
  ensureClientEnvironment();

  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context oluşturulamadı');
  }

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#809A6F');
  gradient.addColorStop(0.5, '#A25B5B');
  gradient.addColorStop(1, '#CC9C75');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Overlay pattern
  ctx.fillStyle = 'rgba(213, 216, 181, 0.15)';
  for (let i = -200; i < width + 200; i += 160) {
    ctx.beginPath();
    ctx.ellipse(i, height / 2, 220, 620, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Capture element screenshot or fallback widget
  let screenshotImage: HTMLImageElement | null = null;
  if (options?.element) {
    try {
      const screenshot = await captureElementScreenshot(options.element, {
        backgroundColor: '#D5D8B5',
        scale: 2,
        quality: 1,
      });
      screenshotImage = await loadImage(screenshot);
    } catch (error) {
      console.error('Instagram story screenshot capture failed, using fallback.', error);
    }
  }

  if (!screenshotImage) {
    const fallback = createWidgetScreenshot(data, { width: 960, height: 720 });
    screenshotImage = await loadImage(fallback);
  }

  const maxScreenshotWidth = width - 240;
  const maxScreenshotHeight = height * 0.55;
  const scale = Math.min(
    maxScreenshotWidth / screenshotImage.width,
    maxScreenshotHeight / screenshotImage.height
  );
  const imgWidth = screenshotImage.width * scale;
  const imgHeight = screenshotImage.height * scale;
  const imgX = (width - imgWidth) / 2;
  const imgY = height * 0.28;

  // Card shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 30;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
  ctx.restore();

  ctx.drawImage(screenshotImage, imgX, imgY, imgWidth, imgHeight);

  // Add title text
  drawText(ctx, 'Bugünün Hava Durumu', width / 2, 200, {
    font: '700 72px "Inter", Arial, sans-serif',
    color: '#F7F8EC',
    shadow: { color: 'rgba(0, 0, 0, 0.35)', blur: 30, offsetY: 8 },
  });

  drawText(ctx, `${data.city}`, width / 2, 320, {
    font: '600 48px "Inter", Arial, sans-serif',
    color: '#F7F8EC',
    shadow: { color: 'rgba(0, 0, 0, 0.3)', blur: 18, offsetY: 6 },
  });

  drawText(ctx, `${data.temperature}°C`, width / 2, height - 320, {
    font: '800 120px "Inter", Arial, sans-serif',
    color: '#F7F8EC',
    shadow: { color: 'rgba(0, 0, 0, 0.3)', blur: 20, offsetY: 10 },
  });

  drawText(ctx, data.description, width / 2, height - 230, {
    font: '600 44px "Inter", Arial, sans-serif',
    color: 'rgba(247, 248, 236, 0.85)',
  });

  // Weather icon overlay
  try {
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    const iconImage = await loadImage(iconUrl);
    const iconSize = 256;
    ctx.drawImage(iconImage, width / 2 - iconSize / 2, height - 540, iconSize, iconSize);
  } catch (error) {
    console.warn('Weather icon yüklenemedi:', error);
  }

  drawText(ctx, 'story.weatherapp', width / 2, height - 80, {
    font: '500 36px "Inter", Arial, sans-serif',
    color: 'rgba(247, 248, 236, 0.75)',
  });

  return canvas.toDataURL('image/png');
}

/**
 * Screenshot'ı indir
 */
export function downloadScreenshot(dataUrl: string, filename: string = 'weather-screenshot.png'): void {
  ensureClientEnvironment();
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

