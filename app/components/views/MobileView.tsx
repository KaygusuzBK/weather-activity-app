"use client";

import { useState } from "react";
import { Home, Search, Heart, Settings, CloudSun } from "lucide-react";
import { Dock, DockIcon } from "../ui/dock";
import BlurFade from "../ui/blur-fade";
import CurrentWeather from "../CurrentWeather";
import WeatherForecast from "../WeatherForecast";
import CitySearch from "../CitySearch";
import FavoritesAndRecent from "../FavoritesAndRecent";
import NotificationSettings from "../NotificationSettings";
import ThemeToggle from "../ThemeToggle";
import UnitToggle from "../UnitToggle";
import InstallButton from "../InstallButton";
import { City } from "../../data/popular-cities";
import { MagicCard } from "../ui/magic-card";

interface MobileViewProps {
    selectedCity: City | null;
    location: any;
    onCitySelect: (city: City) => void;
    onCurrentLocation: () => void;
    locationLoading: boolean;
    locationError: string | null;
}

export default function MobileView({
    selectedCity,
    location,
    onCitySelect,
    onCurrentLocation,
    locationLoading,
    locationError,
}: MobileViewProps) {
    const [activeTab, setActiveTab] = useState<"home" | "search" | "saved" | "settings">("home");

    return (
        <div className="flex flex-col h-dvh bg-linear-to-b from-blue-50 to-white dark:from-gray-950 dark:to-black overflow-hidden relative">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pb-24 p-4 scrollbar-hide">
                <div className="mt-2 mb-6 flex items-center justify-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-full border border-white/20 dark:border-gray-700/20 shadow-sm">
                        <CloudSun className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Hava Durumu
                        </span>
                    </div>
                </div>

                {activeTab === "home" && (
                    <BlurFade key="home" delay={0.1}>
                        <div className="space-y-4">
                            {locationError && !selectedCity && !location && (
                                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm">
                                    {locationError}
                                </div>
                            )}

                            <CurrentWeather city={selectedCity} location={location} />
                            <WeatherForecast city={selectedCity} location={location} />
                        </div>
                    </BlurFade>
                )}

                {activeTab === "search" && (
                    <BlurFade key="search" delay={0.1}>
                        <div className="space-y-6 pt-4">
                            <h2 className="text-2xl font-bold text-center dark:text-white">Şehir Ara</h2>
                            <CitySearch onCitySelect={(city) => {
                                onCitySelect(city);
                                setActiveTab("home");
                            }} />
                            <div className="mt-8">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 text-center">Popüler Şehirler</h3>
                                {/* We could add a simple list of popular cities here if needed, or rely on the search component suggestions */}
                            </div>
                        </div>
                    </BlurFade>
                )}

                {activeTab === "saved" && (
                    <BlurFade key="saved" delay={0.1}>
                        <div className="space-y-4 pt-4">
                            <h2 className="text-2xl font-bold text-center dark:text-white">Kaydedilenler</h2>
                            <FavoritesAndRecent
                                onCitySelect={(city) => {
                                    onCitySelect(city);
                                    setActiveTab("home");
                                }}
                                onCurrentLocation={() => {
                                    onCurrentLocation();
                                    setActiveTab("home");
                                }}
                                selectedCity={selectedCity}
                                showCurrentLocation={!!location}
                            />
                        </div>
                    </BlurFade>
                )}

                {activeTab === "settings" && (
                    <BlurFade key="settings" delay={0.1}>
                        <div className="space-y-4 pt-4">
                            <h2 className="text-2xl font-bold text-center dark:text-white">Ayarlar</h2>

                            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-5 shadow-xl">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">Tema</span>
                                        <div className="shrink-0">
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-300 dark:bg-gray-700" />
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">Birim</span>
                                        <div className="shrink-0">
                                            <UnitToggle />
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-300 dark:bg-gray-700" />
                                    <NotificationSettings inline={true} />
                                    <div className="h-px bg-gray-300 dark:bg-gray-700" />
                                    <InstallButton />
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                )}
            </div>

            {/* Bottom Dock Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
                <div className="flex justify-center pb-6 px-4">
                    <Dock 
                        magnification={60} 
                        distance={100} 
                        className="bg-white/90 dark:bg-black/90 border-gray-200 dark:border-gray-800 shadow-2xl backdrop-blur-xl"
                    >
                        <DockIcon 
                            onClick={() => setActiveTab("home")} 
                            className={activeTab === "home" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}
                        >
                            <Home className="w-6 h-6" />
                        </DockIcon>
                        <DockIcon 
                            onClick={() => setActiveTab("search")} 
                            className={activeTab === "search" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}
                        >
                            <Search className="w-6 h-6" />
                        </DockIcon>
                        <DockIcon 
                            onClick={() => setActiveTab("saved")} 
                            className={activeTab === "saved" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}
                        >
                            <Heart className="w-6 h-6" />
                        </DockIcon>
                        <DockIcon 
                            onClick={() => setActiveTab("settings")} 
                            className={activeTab === "settings" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}
                        >
                            <Settings className="w-6 h-6" />
                        </DockIcon>
                    </Dock>
                </div>
            </div>
        </div>
    );
}
