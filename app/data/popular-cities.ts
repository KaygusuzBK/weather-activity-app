export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  emoji: string;
}

export const popularCities: City[] = [
  { name: "İstanbul", country: "TR", lat: 41.0082, lon: 28.9784, emoji: "🏛️" },
  { name: "Ankara", country: "TR", lat: 39.9334, lon: 32.8597, emoji: "🏛️" },
  { name: "İzmir", country: "TR", lat: 38.4237, lon: 27.1428, emoji: "🌊" },
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278, emoji: "🇬🇧" },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522, emoji: "🇫🇷" },
  { name: "New York", country: "US", lat: 40.7128, lon: -74.0060, emoji: "🗽" },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503, emoji: "🗼" },
  { name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708, emoji: "🏙️" },
  { name: "Barcelona", country: "ES", lat: 41.3851, lon: 2.1734, emoji: "🏖️" },
  { name: "Amsterdam", country: "NL", lat: 52.3676, lon: 4.9041, emoji: "🚲" },
  { name: "Berlin", country: "DE", lat: 52.5200, lon: 13.4050, emoji: "🇩🇪" },
  { name: "Rome", country: "IT", lat: 41.9028, lon: 12.4964, emoji: "🏛️" },
];

