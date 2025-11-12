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

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function getStoryTheme(description: string) {
  const desc = description.toLowerCase();

  if (desc.includes('güneş') || desc.includes('clear') || desc.includes('sun')) {
    return {
      gradient: ['#FF9A8B', '#FF6A88', '#FF99AC'],
      accent: '#FFEFD4',
      chip: 'rgba(255, 239, 212, 0.2)',
      shadow: 'rgba(255, 154, 139, 0.35)',
    };
  }

  if (desc.includes('yağmur') || desc.includes('rain')) {
    return {
      gradient: ['#4158D0', '#C850C0', '#FFCC70'],
      accent: '#F2F5FF',
      chip: 'rgba(242, 245, 255, 0.18)',
      shadow: 'rgba(65, 88, 208, 0.35)',
    };
  }

  if (desc.includes('kar') || desc.includes('snow')) {
    return {
      gradient: ['#74EBD5', '#ACB6E5', '#F9F9F9'],
      accent: '#F9FBFF',
      chip: 'rgba(116, 235, 213, 0.18)',
      shadow: 'rgba(172, 182, 229, 0.35)',
    };
  }

  if (desc.includes('bulut') || desc.includes('cloud')) {
    return {
      gradient: ['#89F7FE', '#66A6FF', '#BDD4FF'],
      accent: '#F5FBFF',
      chip: 'rgba(137, 247, 254, 0.2)',
      shadow: 'rgba(102, 166, 255, 0.3)',
    };
  }

  return {
    gradient: ['#809A6F', '#A25B5B', '#CC9C75'],
    accent: '#F7F8EC',
    chip: 'rgba(247, 248, 236, 0.18)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  };
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

  const theme = getStoryTheme(data.description);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, theme.gradient[0]);
  gradient.addColorStop(0.5, theme.gradient[1]);
  gradient.addColorStop(1, theme.gradient[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Overlay gradient shapes
  const overlay = ctx.createLinearGradient(0, 0, width, height);
  overlay.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  overlay.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = overlay;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.2);
  ctx.quadraticCurveTo(width * 0.5, height * 0.35, width, height * 0.22);
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.moveTo(0, height);
  ctx.quadraticCurveTo(width * 0.5, height * 0.78, width, height * 0.9);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

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
  const maxScreenshotHeight = height * 0.5;
  const scale = Math.min(
    maxScreenshotWidth / screenshotImage.width,
    maxScreenshotHeight / screenshotImage.height
  );
  const imgWidth = screenshotImage.width * scale;
  const imgHeight = screenshotImage.height * scale;
  const imgX = (width - imgWidth) / 2;
  const imgY = height * 0.32;

  // Card background with rounded corners
  ctx.save();
  drawRoundedRect(ctx, imgX, imgY, imgWidth, imgHeight, 48);
  ctx.shadowColor = theme.shadow;
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 26;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRect(ctx, imgX, imgY, imgWidth, imgHeight, 48);
  ctx.clip();
  ctx.drawImage(screenshotImage, imgX, imgY, imgWidth, imgHeight);
  ctx.restore();

  const heading = 'Bugünün Hava Durumu';
  drawText(ctx, heading, width / 2, 160, {
    font: '700 72px "Inter", Arial, sans-serif',
    color: theme.accent,
    shadow: { color: 'rgba(0, 0, 0, 0.25)', blur: 28, offsetY: 8 },
  });

  const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  drawText(ctx, dateFormatter.format(new Date()), width / 2, 240, {
    font: '500 40px "Inter", Arial, sans-serif',
    color: 'rgba(255, 255, 255, 0.8)',
  });

  drawText(ctx, data.city, width / 2, 310, {
    font: '700 54px "Inter", Arial, sans-serif',
    color: theme.accent,
    shadow: { color: 'rgba(0, 0, 0, 0.25)', blur: 16, offsetY: 6 },
  });

  drawText(ctx, `${data.temperature}°C`, width / 2, height - 320, {
    font: '800 140px "Inter", Arial, sans-serif',
    color: theme.accent,
    shadow: { color: 'rgba(0, 0, 0, 0.25)', blur: 16, offsetY: 10 },
  });

  drawText(ctx, data.description, width / 2, height - 230, {
    font: '600 48px "Inter", Arial, sans-serif',
    color: 'rgba(255, 255, 255, 0.85)',
  });

  // Weather icon overlay
  try {
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    const iconImage = await loadImage(iconUrl);
    const iconSize = 260;
    ctx.drawImage(iconImage, width / 2 - iconSize / 2, height - 560, iconSize, iconSize);
  } catch (error) {
    console.warn('Weather icon yüklenemedi:', error);
  }

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

