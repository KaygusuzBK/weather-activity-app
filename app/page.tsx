import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 font-sans">
      <main className="min-h-screen py-8">
        <CurrentWeather />
        <WeatherForecast />
      </main>
    </div>
  );
}
