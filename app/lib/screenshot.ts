/**
 * Screenshot utilities using html2canvas and Canvas API
 */

import html2canvas from 'html2canvas';

interface BaseScreenshotData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  feelsLike?: number;
  humidity?: number;
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
      category: 'sunny' as const,
    };
  }

  if (desc.includes('yağmur') || desc.includes('rain')) {
    return {
      gradient: ['#4158D0', '#C850C0', '#FFCC70'],
      accent: '#F2F5FF',
      chip: 'rgba(242, 245, 255, 0.18)',
      shadow: 'rgba(65, 88, 208, 0.35)',
      category: 'rain' as const,
    };
  }

  if (desc.includes('kar') || desc.includes('snow')) {
    return {
      gradient: ['#74EBD5', '#ACB6E5', '#F9F9F9'],
      accent: '#F9FBFF',
      chip: 'rgba(116, 235, 213, 0.18)',
      shadow: 'rgba(172, 182, 229, 0.35)',
      category: 'snow' as const,
    };
  }

  if (desc.includes('bulut') || desc.includes('cloud')) {
    return {
      gradient: ['#89F7FE', '#66A6FF', '#BDD4FF'],
      accent: '#F5FBFF',
      chip: 'rgba(137, 247, 254, 0.2)',
      shadow: 'rgba(102, 166, 255, 0.3)',
      category: 'cloudy' as const,
    };
  }

  return {
    gradient: ['#809A6F', '#A25B5B', '#CC9C75'],
    accent: '#F7F8EC',
    chip: 'rgba(247, 248, 236, 0.18)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    category: 'default' as const,
  };
}

function createRandom(seed: number) {
  return () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

function drawWeatherDecor(ctx: CanvasRenderingContext2D, category: string, width: number, height: number) {
  const random = createRandom(Math.round(width + height));
  switch (category) {
    case 'rain': {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      for (let i = 0; i < 140; i++) {
        const x = random() * width;
        const y = random() * height;
        const length = 80 + random() * 60;
        ctx.globalAlpha = 0.4 + random() * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 18, y + length);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case 'snow': {
      ctx.save();
      for (let i = 0; i < 120; i++) {
        const x = random() * width;
        const y = random() * height;
        const radius = 6 + random() * 6;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case 'sunny': {
      ctx.save();
      const sunX = width * 0.15;
      const sunY = height * 0.18;
      const sunRadius = 140;
      const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 1.6);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 6;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const start = sunRadius * 1.1;
        const end = sunRadius * 1.7;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * start, sunY + Math.sin(angle) * start);
        ctx.lineTo(sunX + Math.cos(angle) * end, sunY + Math.sin(angle) * end);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case 'cloudy': {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      const cloudCount = 6;
      for (let i = 0; i < cloudCount; i++) {
        const baseX = random() * width;
        const baseY = height * (0.15 + random() * 0.2);
        const size = 180 + random() * 120;
        for (let j = 0; j < 4; j++) {
          const offsetX = (random() - 0.5) * size * 0.6;
          const offsetY = (random() - 0.5) * size * 0.3;
          ctx.beginPath();
          ctx.ellipse(baseX + offsetX, baseY + offsetY, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      break;
    }
    default: {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = 0; i < 90; i++) {
        const x = random() * width;
        const y = random() * height;
        const widthRect = 60 + random() * 120;
        const heightRect = 60 + random() * 120;
        ctx.globalAlpha = 0.08 + random() * 0.08;
        ctx.beginPath();
        drawRoundedRect(ctx, x, y, widthRect, heightRect, 24);
        ctx.fill();
      }
      ctx.restore();
    }
  }
}

function drawStoryIcon(
  ctx: CanvasRenderingContext2D,
  category: string,
  centerX: number,
  centerY: number
) {
  const drawCloud = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x - width * 0.2, y, width * 0.35, height * 0.55, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width * 0.05, y - height * 0.25, width * 0.45, height * 0.65, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width * 0.35, y, width * 0.4, height * 0.6, 0, 0, Math.PI * 2);
    ctx.ellipse(x, y + height * 0.15, width * 0.55, height * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(1.1, 1.1);

  switch (category) {
    case 'sunny': {
      const radius = 120;
      const sunGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      sunGradient.addColorStop(0, '#FFF6C7');
      sunGradient.addColorStop(1, '#FFC857');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 224, 140, 0.9)';
      ctx.lineWidth = 14;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.lineTo(Math.cos(angle) * (radius + 60), Math.sin(angle) * (radius + 60));
        ctx.stroke();
      }
      break;
    }

    case 'rain': {
      drawCloud(0, 20, 220, 120, 'rgba(246, 248, 255, 0.95)');
      ctx.fillStyle = '#3B82F6';
      const dropPositions = [-80, -30, 20, 70];
      dropPositions.forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 100);
        ctx.quadraticCurveTo(x - 14, 140, x, 160);
        ctx.quadraticCurveTo(x + 14, 140, x, 100);
        ctx.fill();
      });
      break;
    }

    case 'snow': {
      drawCloud(0, 30, 220, 120, 'rgba(246, 248, 255, 0.95)');
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 6;
      const flakePositions = [-70, -10, 50];
      flakePositions.forEach((x, index) => {
        const y = 140 + index * 20;
        ctx.save();
        ctx.translate(x, y);
        for (let i = 0; i < 6; i++) {
          ctx.rotate(Math.PI / 3);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 36);
          ctx.stroke();
        }
        ctx.restore();
      });
      break;
    }

    case 'cloudy': {
      drawCloud(-40, 0, 200, 120, 'rgba(255, 255, 255, 0.85)');
      drawCloud(50, 30, 220, 130, 'rgba(237, 241, 255, 0.9)');
      break;
    }

    default: {
      const sunGradient = ctx.createRadialGradient(-50, -60, 0, -50, -60, 100);
      sunGradient.addColorStop(0, '#FFE9A3');
      sunGradient.addColorStop(1, '#FFB347');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(-50, -60, 85, 0, Math.PI * 2);
      ctx.fill();

      drawCloud(30, 20, 220, 120, 'rgba(246, 248, 255, 0.94)');
      break;
    }
  }

  ctx.restore();
}

export async function createInstagramStoryScreenshot(
  data: BaseScreenshotData,
  _options?: { element?: HTMLElement | null }
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

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, theme.gradient[0]);
  gradient.addColorStop(0.5, theme.gradient[1]);
  gradient.addColorStop(1, theme.gradient[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawWeatherDecor(ctx, theme.category, width, height);

  const topPadding = 180;
  drawText(ctx, data.city, width / 2, topPadding, {
    font: '800 88px "Inter", Arial, sans-serif',
    color: theme.accent,
    shadow: { color: 'rgba(0,0,0,0.18)', blur: 16, offsetY: 8 },
  });

  const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  drawText(ctx, dateFormatter.format(new Date()), width / 2, topPadding + 90, {
    font: '500 46px "Inter", Arial, sans-serif',
    color: 'rgba(255, 255, 255, 0.85)',
  });

  const iconCircleX = width / 2;
  const iconCircleY = height * 0.42;
  const iconCircleRadius = 190;

  ctx.save();
  const iconGradient = ctx.createRadialGradient(
    iconCircleX,
    iconCircleY,
    iconCircleRadius * 0.3,
    iconCircleX,
    iconCircleY,
    iconCircleRadius
  );
  iconGradient.addColorStop(0, 'rgba(255,255,255,0.92)');
  iconGradient.addColorStop(1, 'rgba(255,255,255,0.2)');
  ctx.fillStyle = iconGradient;
  ctx.beginPath();
  ctx.arc(iconCircleX, iconCircleY, iconCircleRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawStoryIcon(ctx, theme.category, iconCircleX, iconCircleY);

  drawText(ctx, `${Math.round(data.temperature)}°`, width / 2, height * 0.69, {
    font: '900 220px "Inter", Arial, sans-serif',
    color: theme.accent,
    shadow: { color: 'rgba(0,0,0,0.2)', blur: 24, offsetY: 14 },
  });

  drawText(ctx, data.description, width / 2, height * 0.78, {
    font: '400 64px "Inter", Arial, sans-serif',
    color: 'rgba(255, 255, 255, 0.9)',
  });

  const cardWidth = width - 220;
  const cardHeight = 230;
  const cardX = (width - cardWidth) / 2;
  const cardY = height - cardHeight - 140;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 40);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fill();
  ctx.restore();

  const labelColor = '#6B7280';
  const valueColor = '#111827';
  const dividerX = width / 2;
  const centerY = cardY + cardHeight / 2;

  drawText(ctx, 'HİSSEDİLEN', cardX + cardWidth * 0.25, cardY + 70, {
    font: '600 32px "Inter", Arial, sans-serif',
    color: labelColor,
  });
  const feelsLike = data.feelsLike ?? data.temperature;
  drawText(ctx, `${Math.round(feelsLike)}°`, cardX + cardWidth * 0.25, cardY + 150, {
    font: '700 68px "Inter", Arial, sans-serif',
    color: valueColor,
  });

  drawText(ctx, 'NEM', cardX + cardWidth * 0.75, cardY + 70, {
    font: '600 32px "Inter", Arial, sans-serif',
    color: labelColor,
  });
  const humidity = data.humidity ?? 0;
  drawText(ctx, `${humidity}%`, cardX + cardWidth * 0.75, cardY + 150, {
    font: '700 68px "Inter", Arial, sans-serif',
    color: valueColor,
  });

  ctx.save();
  ctx.strokeStyle = 'rgba(156, 163, 175, 0.45)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(dividerX, cardY + 50);
  ctx.lineTo(dividerX, cardY + cardHeight - 50);
  ctx.stroke();
  ctx.restore();

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

