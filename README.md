# 🌤️ Hava Durumu Uygulaması

Modern, hızlı ve kullanıcı dostu Progressive Web App (PWA) hava durumu uygulaması. Gerçek zamanlı hava durumu bilgileri, 5 günlük tahmin, aktivite önerileri ve daha fazlası.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square)

## 📸 Özellikler

### ⚡ Ana Özellikler
- 🌍 **Otomatik Konum Tespiti** - IP bazlı veya GPS ile otomatik konum bulma
- 🔍 **Şehir Arama** - OpenWeatherMap Geocoding API ile gelişmiş şehir arama
- 📊 **5 Günlük Tahmin** - Detaylı günlük hava durumu tahminleri
- ⏰ **24 Saatlik Tahmin** - 3 saatlik aralıklarla saatlik tahmin
- 🎯 **Aktivite Önerileri** - Hava durumuna göre akıllı aktivite önerileri
- 🌡️ **Detaylı Bilgiler** - Sıcaklık, nem, rüzgar, hissedilen sıcaklık
- ⭐ **Favori Şehirler** - Sık kullanılan şehirleri kaydetme
- 🕐 **Son Arananlar** - En son aranan şehirleri görüntüleme
- 📱 **Mobil Uyumlu** - Responsive tasarım, iOS ve Android desteği
- 🎨 **Dark/Light Mode** - Koyu ve açık tema desteği
- 🌡️ **Birim Dönüştürme** - Celsius ve Fahrenheit arası geçiş
- 🔔 **Bildirimler** - Push notification desteği (PWA)
- 📤 **Paylaşım** - Hava durumunu sosyal medyada paylaşma
- 📸 **Screenshot** - Instagram story formatında görsel oluşturma
- 🎵 **Hava Ambiyansı** - Hava durumuna göre ambient ses efektleri
- 💾 **Offline Çalışma** - Service Worker ile offline destek
- ⚡ **Hızlı ve Optimize** - Akıllı cache stratejileri

### 🎨 UI/UX Özellikleri
- Modern ve şık arayüz
- Smooth animasyonlar (Framer Motion)
- Glassmorphism tasarım
- Skeleton loading states
- Error boundaries ile hata yönetimi
- Toast notifications
- Gradient backgrounds
- Interactive hover effects
- Mobile-first design

## 🛠️ Teknolojiler

### Frontend Framework
- **[Next.js 16.0.1](https://nextjs.org/)** - React framework (App Router)
- **[React 19.2.0](https://react.dev/)** - UI library
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Type safety

### Styling & UI
- **[Tailwind CSS 4.x](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12.23](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Modern icon library
- **[React Icons 5.5](https://react-icons.github.io/react-icons/)** - Icon library
- **[class-variance-authority](https://cva.style/docs)** - CSS utility management
- **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - className utilities

### State Management & Data Fetching
- **[SWR 2.3.6](https://swr.vercel.app/)** - Data fetching ve caching
- **React Context API** - Global state (Theme, Units)
- **Custom Hooks** - Reusable logic

### APIs
- **[OpenWeatherMap API](https://openweathermap.org/api)** - Hava durumu verileri
  - Current Weather API
  - 5 Day / 3 Hour Forecast API
  - Geocoding API
- **[ipapi.co](https://ipapi.co/)** - IP bazlı konum tespiti
- **[ip-api.com](http://ip-api.com/)** - Alternatif IP lokasyon servisi

### PWA & Optimization
- **Service Worker** - Offline support ve cache management
- **Web App Manifest** - PWA configuration
- **Push Notifications** - Notification API
- **localStorage** - Client-side storage
- **IndexedDB ready** - Future enhancement

### Image & Media
- **[html2canvas 1.4.1](https://html2canvas.hertzen.com/)** - Screenshot capture
- **Canvas API** - Custom image generation

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **Geist Font** - Modern font family

## 📁 Proje Yapısı

```
weather-activity-app/
├── app/
│   ├── components/           # React components
│   │   ├── views/           # View components (Mobile, Desktop)
│   │   │   ├── DesktopView.tsx
│   │   │   └── MobileView.tsx
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── animated-icon.tsx
│   │   │   ├── blur-fade.tsx
│   │   │   ├── dock.tsx
│   │   │   ├── magic-card.tsx
│   │   │   └── skeleton.tsx
│   │   ├── ActivityRecommendations.tsx
│   │   ├── CitiesMarquee.tsx
│   │   ├── CitySearch.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── CurrentWeatherSkeleton.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorFallback.tsx
│   │   ├── FavoritesAndRecent.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── ServiceWorkerRegistration.tsx
│   │   ├── ShareButton.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── UnitToggle.tsx
│   │   ├── WeatherAmbience.tsx
│   │   └── WeatherForecast.tsx
│   ├── contexts/            # React contexts
│   │   ├── ThemeContext.tsx
│   │   └── UnitContext.tsx
│   ├── data/                # Static data
│   │   └── popular-cities.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocation.ts
│   │   ├── useNotifications.ts
│   │   └── useWeather.ts
│   ├── lib/                 # Utility functions
│   │   ├── activity-recommendations.ts
│   │   ├── cache.ts
│   │   ├── error-handler.ts
│   │   ├── retry.ts
│   │   ├── screenshot.ts
│   │   ├── share-utils.ts
│   │   ├── storage.ts
│   │   ├── utils.ts
│   │   └── weather-api.ts
│   ├── providers/           # Context providers
│   │   └── SWRProvider.tsx
│   ├── types/               # TypeScript types
│   │   └── weather.ts
│   ├── utils/               # Additional utilities
│   │   ├── cn.ts
│   │   └── location.ts
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── public/                  # Static files
│   ├── icon.png            # PWA icon
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker
├── .env.example            # Environment variables example
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## 🏗️ Mimari ve Tasarım Kararları

### 🎯 State Management
- **SWR** ile data fetching ve automatic caching
- **React Context** ile global state (theme, units)
- **localStorage** ile persistent storage (favorites, recent cities)

### 📦 Cache Stratejisi
- **SWR Cache**: 10 dakika TTL, 10 saniye deduping
- **Service Worker Cache**: 10 dakika TTL, max 50 item
- **localStorage Cache**: 5 dakika TTL
- Network-first strategy for API calls
- Cache-first strategy for static assets

### 🔄 Error Handling
- Retry mechanism with exponential backoff
- Error boundaries for component errors
- Graceful fallbacks for API failures
- User-friendly error messages

### 🎨 Design System
- Mobile-first responsive design
- Consistent color palette with CSS variables
- Reusable component library
- Glassmorphism and modern UI trends
- Dark mode support with system preference detection

### ⚡ Performance Optimizations
- Code splitting with Next.js App Router
- Image optimization
- Lazy loading for heavy components
- Debounced search inputs
- Optimistic UI updates
- Request deduplication
- Automatic cache invalidation

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18.x veya üzeri
- npm, yarn, pnpm veya bun
- OpenWeatherMap API Key (ücretsiz)

### 1️⃣ Projeyi Klonlayın
```bash
git clone https://github.com/KaygusuzBK/weather-activity-app.git
cd weather-activity-app
```

### 2️⃣ Bağımlılıkları Yükleyin
```bash
npm install
# veya
yarn install
# veya
pnpm install
# veya
bun install
```

### 3️⃣ Environment Variables
1. `.env.example` dosyasını `.env.local` olarak kopyalayın:
   ```bash
   cp .env.example .env.local
   ```

2. [OpenWeatherMap](https://openweathermap.org/api) sitesinden ücretsiz API key alın

3. `.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### 4️⃣ Development Server'ı Başlatın
```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
# veya
bun dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### 5️⃣ Production Build
```bash
npm run build
npm run start
```

## 📱 PWA Kurulumu

### Masaüstü (Chrome/Edge)
1. Uygulamayı açın
2. Adres çubuğundaki "Yükle" ikonuna tıklayın
3. Kurulumu onaylayın

### iOS (Safari)
1. Uygulamayı Safari'de açın
2. Paylaş butonuna dokunun
3. "Ana Ekrana Ekle" seçeneğini seçin

### Android (Chrome)
1. Uygulamayı açın
2. Menüden "Ana ekrana ekle" seçeneğini seçin
3. Kurulumu onaylayın

## 🔑 API Kullanımı

### OpenWeatherMap API Endpoints
```typescript
// Current Weather
GET https://api.openweathermap.org/data/2.5/weather
?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=tr

// 5 Day Forecast
GET https://api.openweathermap.org/data/2.5/forecast
?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=tr

// Geocoding
GET https://api.openweathermap.org/geo/1.0/direct
?q={city_name}&limit=10&appid={API_KEY}
```

### Rate Limits
- Free Plan: 60 calls/minute, 1,000,000 calls/month
- No credit card required

## 🎯 Kullanım

### Ana Sayfa
- Otomatik olarak konumunuz tespit edilir
- Mevcut hava durumu ve tahminler gösterilir
- Aktivite önerileri sunulur

### Şehir Arama
- Arama kutusuna şehir adı yazın
- Önerilerden birini seçin
- Seçilen şehrin hava durumu gösterilir

### Favori Şehirler
- Şehir üzerinde ⭐ simgesine tıklayın
- Favorilerinize ekleyin
- Hızlı erişim için favoriler listesini kullanın

### Tema Değiştirme
- Sağ üstteki 🌙/☀️ ikonuna tıklayın
- Koyu/Açık tema arasında geçiş yapın

### Birim Değiştirme
- °C/°F butonuna tıklayın
- Celsius ve Fahrenheit arasında geçiş yapın

### Paylaşım
- 📤 Paylaş butonuna tıklayın
- Sosyal medya, link veya screenshot seçeneklerini kullanın
- Instagram Story formatında görsel oluşturun

## 🧪 Test

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 📊 Performans Metrikleri

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## 🐛 Bilinen Sorunlar ve Sınırlamalar

- Ücretsiz OpenWeatherMap API 1 milyon çağrı/ay ile sınırlıdır
- IP bazlı konum tespiti %100 doğru olmayabilir
- Bazı eski tarayıcılarda PWA özellikleri çalışmayabilir
- Service Worker HTTPS gerektirir (localhost hariç)

## 🔮 Gelecek Geliştirmeler

- [ ] Hava durumu uyarıları ve bildirimler
- [ ] Hava durumu radarı ve haritalar
- [ ] Hava kalitesi indeksi (AQI)
- [ ] UV indeksi ve güneş doğuş/batış saatleri
- [ ] Çoklu dil desteği (i18n)
- [ ] Widget'lar ve özelleştirilebilir dashboard
- [ ] Geçmiş hava durumu verileri ve grafikler
- [ ] Seyahat planlaması için çok şehir karşılaştırma
- [ ] Hava durumu tabanlı giyim önerileri
- [ ] Admin paneli ve analytics

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Kaygusuz BK**
- GitHub: [@KaygusuzBK](https://github.com/KaygusuzBK)

## 🙏 Teşekkürler

- [OpenWeatherMap](https://openweathermap.org/) - Hava durumu API'si
- [Vercel](https://vercel.com/) - Hosting ve deployment
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animasyon kütüphanesi
- [SWR](https://swr.vercel.app/) - Data fetching kütüphanesi

## 📞 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

**Made with ❤️ and ☕**
