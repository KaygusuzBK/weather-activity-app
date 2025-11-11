/**
 * Screenshot utilities using html2canvas and Canvas API
 */

import html2canvas from 'html2canvas';

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
  data: {
    city: string;
    temperature: number;
    description: string;
    icon: string;
  },
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

/**
 * Screenshot'ı indir
 */
export function downloadScreenshot(dataUrl: string, filename: string = 'weather-screenshot.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

