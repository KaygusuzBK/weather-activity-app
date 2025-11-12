import { useEffect, useState, useRef, useMemo } from 'react';
import type { CurrentWeather } from '../types/weather';
import AnimatedIcon from './ui/animated-icon';
import { FiMusic, FiVolumeX } from 'react-icons/fi';

const STORAGE_KEY = 'weather-ambience-enabled';

const SOUND_LIBRARY: Record<string, { url: string; volume?: number }> = {
  calm: {
    url: 'https://cdn.pixabay.com/download/audio/2022/11/15/audio_858608503a.mp3?filename=calm-nature-ambient-125576.mp3',
    volume: 0.28,
  },
  rain: {
    url: 'https://cdn.pixabay.com/download/audio/2024/11/30/audio_792fd26bd8.mp3?filename=rain-270465.mp3',
    volume: 0.45,
  },
  storm: {
    url: 'https://cdn.pixabay.com/download/audio/2021/09/18/audio_939518f4e9.mp3?filename=thunderstorm-ambient-6547.mp3',
    volume: 0.4,
  },
  snow: {
    url: 'https://cdn.pixabay.com/download/audio/2021/09/18/audio_c6c5681a57.mp3?filename=snow-step-chime-6553.mp3',
    volume: 0.35,
  },
  sunny: {
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4a67cf890f.mp3?filename=morning-birds-ambient-20420.mp3',
    volume: 0.32,
  },
  wind: {
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_b67fbecae2.mp3?filename=wind-ambience-6538.mp3',
    volume: 0.3,
  },
};

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
