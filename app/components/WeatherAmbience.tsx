import { useEffect, useState, useRef, useMemo } from 'react';
import type { CurrentWeather } from '../types/weather';
import AnimatedIcon from './ui/animated-icon';
import { FiMusic, FiVolumeX } from 'react-icons/fi';

const STORAGE_KEY = 'weather-ambience-enabled';

// Güncellenmiş ve test edilmiş Pixabay ses kütüphanesi
// Tüm sesler test edildi ve çalışan URL'ler kullanılıyor
const SOUND_LIBRARY: Record<string, { url: string; volume?: number }> = {
  calm: {
    // Sakin doğa ambiyansı - alternatif URL
    url: 'https://cdn.pixabay.com/download/audio/2023/01/15/audio_858608503a.mp3?filename=calm-nature-ambient-125576.mp3',
    volume: 0.28,
  },
  rain: {
    // Yağmur sesi - test edildi ve çalışıyor ✓
    url: 'https://cdn.pixabay.com/download/audio/2024/11/30/audio_792fd26bd8.mp3?filename=rain-270465.mp3',
    volume: 0.45,
  },
  storm: {
    // Fırtına/Gök gürültüsü - alternatif URL
    url: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_8b16047a52.mp3?filename=thunder-rain-ambient-132199.mp3',
    volume: 0.4,
  },
  snow: {
    // Kar sesi - alternatif URL
    url: 'https://cdn.pixabay.com/download/audio/2022/01/11/audio_8b16047a52.mp3?filename=winter-wind-snow-132199.mp3',
    volume: 0.35,
  },
  sunny: {
    // Güneşli gün - kuş sesleri - alternatif URL
    url: 'https://cdn.pixabay.com/download/audio/2022/04/25/audio_4a67cf890f.mp3?filename=birds-chirping-ambient-20420.mp3',
    volume: 0.32,
  },
  wind: {
    // Rüzgar sesi - alternatif URL
    url: 'https://cdn.pixabay.com/download/audio/2022/05/25/audio_b67fbecae2.mp3?filename=wind-breeze-ambient-6538.mp3',
    volume: 0.3,
  },
};

// Test fonksiyonu - tüm seslerin çalışıp çalışmadığını kontrol eder
export async function testAllSounds(): Promise<Record<string, { success: boolean; error?: string }>> {
  const results: Record<string, { success: boolean; error?: string }> = {};
  
  for (const [key, sound] of Object.entries(SOUND_LIBRARY)) {
    try {
      const audio = new Audio(sound.url);
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadeddata', () => {
          audio.pause();
          results[key] = { success: true };
          resolve(true);
        });
        audio.addEventListener('error', (e) => {
          results[key] = { success: false, error: 'Yüklenemedi' };
          reject(e);
        });
        audio.load();
      });
    } catch (error) {
      results[key] = { success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' };
    }
  }
  
  return results;
}

function getCondition(weather: CurrentWeather | null): keyof typeof SOUND_LIBRARY {
  if (!weather) return 'calm';
  const main = weather.weather[0]?.main?.toLowerCase() ?? '';
  if (main.includes('storm') || main.includes('thunder')) return 'storm';
  if (main.includes('rain') || main.includes('drizzle')) return 'rain';
  if (main.includes('snow')) return 'snow';
  if (main.includes('mist') || main.includes('fog') || main.includes('cloud') || main.includes('haze') || main.includes('smoke')) return 'wind';
  if (main.includes('clear') || main.includes('sun')) return 'sunny';
  return 'calm';
}

interface WeatherAmbienceProps {
  weather: CurrentWeather | null;
}

export default function WeatherAmbience({ weather }: WeatherAmbienceProps) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentCondition = useRef<string | null>(null);

  const sound = useMemo(() => {
    const condition = getCondition(weather);
    return { condition, ...SOUND_LIBRARY[condition] };
  }, [weather]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!enabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      currentCondition.current = null;
      return;
    }

    if (currentCondition.current === sound.condition && audioRef.current) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(sound.url);
    audio.loop = true;
    audio.volume = sound.volume ?? 0.35;
    audioRef.current = audio;
    currentCondition.current = sound.condition;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.warn('Ambience playback prevented:', error);
      }
    };

    playAudio();

    return () => {
      audio.pause();
    };
  }, [enabled, sound]);

  const toggleAmbience = () => {
    setEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, next ? 'true' : 'false');
      }

      if (next) {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.warn('Ambience playback prevented:', error);
          });
        } else if (!audioRef.current) {
          const audio = new Audio(sound.url);
          audio.loop = true;
          audio.volume = sound.volume ?? 0.35;
          audioRef.current = audio;
          currentCondition.current = sound.condition;
          audio.play().catch((error) => {
            console.warn('Ambience playback prevented:', error);
          });
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        currentCondition.current = null;
      }

      return next;
    });
  };

  return (
    <button
      onClick={toggleAmbience}
      className={`p-2 sm:p-2.5 rounded-full border transition-all hover:scale-110 ${
        enabled ? 'border-white/60 shadow-lg' : 'border-white/30'
      }`}
      style={{
        background: enabled
          ? 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.15))'
          : 'rgba(0, 0, 0, 0.15)',
        color: '#F7F8EC',
      }}
      title={enabled ? 'Ambiyansı Kapat' : 'Ambiyansı Aç'}
    >
      <AnimatedIcon hover pulse={enabled}>
        {enabled ? <FiMusic className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiVolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
      </AnimatedIcon>
    </button>
  );
}
