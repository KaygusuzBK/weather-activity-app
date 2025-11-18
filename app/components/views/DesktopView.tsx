"use client";

import CurrentWeather from '../CurrentWeather';
import WeatherForecast from '../WeatherForecast';
import CurrentWeatherSkeleton from '../CurrentWeatherSkeleton';
import WeatherForecastSkeleton from '../WeatherForecastSkeleton';
import CitiesMarquee from '../CitiesMarquee';
import CitySearch from '../CitySearch';
import FavoritesAndRecent from '../FavoritesAndRecent';
import NotificationSettings from '../NotificationSettings';
import ThemeToggle from '../ThemeToggle';
import UnitToggle from '../UnitToggle';
import { HiLocationMarker } from 'react-icons/hi';
import { WiStars } from 'react-icons/wi';
import AnimatedIcon from '../ui/animated-icon';
import { MagicCard } from '../ui/magic-card';
import { City } from '../../data/popular-cities';

interface DesktopViewProps {
    selectedCity: City | null;
    location: any;
    onCitySelect: (city: City) => void;
    onCurrentLocation: () => void;
    locationLoading: boolean;
    locationError: string | null;
}

export default function DesktopView({
    selectedCity,
    location,
    onCitySelect,
    onCurrentLocation,
    locationLoading,
    locationError,
}: DesktopViewProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
            {/* Animated Background Pattern */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Top Marquee Bar */}
            <div className="relative z-10">
                <CitiesMarquee />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Compact Header - All in one line */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                    {/* Logo - Compact */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg shrink-0">
                        <WiStars className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h1 className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Hava Durumu
                        </h1>
                    </div>

                    {/* Search Bar - Flex grow */}
                    <div className="flex-1 w-full sm:w-auto">
                        <CitySearch onCitySelect={onCitySelect} />
                    </div>

                    {/* Controls - Compact */}
                    <div className="flex items-center gap-2 shrink-0">
                        <UnitToggle />
                        <ThemeToggle />

                        {location && (
                            <button
                                onClick={onCurrentLocation}
                                className={`p-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center backdrop-blur-xl border shadow-lg hover:shadow-xl hover:scale-105 ${selectedCity === null
                                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500/50 dark:border-indigo-400/50'
                                        : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-white/20 dark:border-gray-700/20'
                                    }`}
                                title="Konumum"
                            >
                                <AnimatedIcon hover pulse>
                                    <HiLocationMarker className="w-5 h-5" />
                                </AnimatedIcon>
                            </button>
                        )}
                    </div>
                </div>

                {/* Favorites Row - Compact */}
                <div className="mb-4">
                    <FavoritesAndRecent
                        onCitySelect={onCitySelect}
                        onCurrentLocation={onCurrentLocation}
                        selectedCity={selectedCity}
                        showCurrentLocation={!!location}
                    />
                </div>

                {/* Error State - Compact */}
                {locationError && !selectedCity && !location && (
                    <MagicCard className="mb-4">
                        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 text-center shadow-xl">
                            <div className="text-4xl mb-3">🌍</div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                                Konum Tespit Edilemedi
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {locationError}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Lütfen bir şehir arayın veya konum izni verin.
                            </p>
                        </div>
                    </MagicCard>
                )}

                {/* Weather Display */}
                {locationLoading && !selectedCity ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <CurrentWeatherSkeleton />
                        <div className="hidden lg:block">
                            <WeatherForecastSkeleton />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <CurrentWeather city={selectedCity} location={location} />
                        <WeatherForecast city={selectedCity} location={location} />
                    </div>
                )}
            </div>

            {/* Notification Settings Button */}
            <NotificationSettings />
        </div>
    );
}
