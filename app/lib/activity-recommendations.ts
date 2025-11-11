import type { CurrentWeather } from '../types/weather';

export interface ActivityRecommendation {
  type: 'outdoor' | 'clothing' | 'sports' | 'travel';
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export function getActivityRecommendations(weather: CurrentWeather): ActivityRecommendation[] {
  const recommendations: ActivityRecommendation[] = [];
  const temp = weather.main.temp;
  const feelsLike = weather.main.feels_like;
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed * 3.6; // m/s to km/h
  const weatherMain = weather.weather[0]?.main.toLowerCase() || '';
  const weatherDesc = weather.weather[0]?.description.toLowerCase() || '';
  const isRaining = weatherMain.includes('rain') || weatherDesc.includes('yağmur') || weatherDesc.includes('rain');
  const isSnowing = weatherMain.includes('snow') || weatherDesc.includes('kar') || weatherDesc.includes('snow');
  const isCloudy = weatherMain.includes('cloud') || weatherDesc.includes('bulutlu') || weatherDesc.includes('cloud');
  const isClear = weatherMain.includes('clear') || weatherDesc.includes('açık') || weatherDesc.includes('clear');

  // Dışarı Çıkma Zamanı
  if (isRaining || isSnowing) {
    recommendations.push({
      type: 'outdoor',
      title: 'Dışarı Çıkmak İçin Uygun Değil',
      description: 'Yağışlı hava nedeniyle dışarı çıkmak için uygun değil. Mümkünse evde kalın.',
      icon: '🏠',
      priority: 'high',
    });
  } else if (temp < 5) {
    recommendations.push({
      type: 'outdoor',
      title: 'Çok Soğuk',
      description: 'Hava çok soğuk. Dışarı çıkmak için uygun değil. Sadece gerekli durumlarda çıkın.',
      icon: '🥶',
      priority: 'high',
    });
  } else if (temp >= 5 && temp < 15) {
    recommendations.push({
      type: 'outdoor',
      title: 'Serin Hava',
      description: 'Hava serin. Kısa süreli dışarı çıkışlar yapılabilir. Kalın giyinmeyi unutmayın.',
      icon: '🧥',
      priority: 'medium',
    });
  } else if (temp >= 15 && temp < 25 && isClear) {
    recommendations.push({
      type: 'outdoor',
      title: 'Mükemmel Dışarı Çıkma Zamanı',
      description: 'Hava koşulları mükemmel! Dışarı çıkmak için ideal bir gün.',
      icon: '☀️',
      priority: 'high',
    });
  } else if (temp >= 25 && temp < 30) {
    recommendations.push({
      type: 'outdoor',
      title: 'İyi Dışarı Çıkma Zamanı',
      description: 'Hava sıcak ama dışarı çıkmak için uygun. Güneş koruması kullanmayı unutmayın.',
      icon: '🌤️',
      priority: 'medium',
    });
  } else if (temp >= 30) {
    recommendations.push({
      type: 'outdoor',
      title: 'Çok Sıcak',
      description: 'Hava çok sıcak. Öğle saatlerinde dışarı çıkmaktan kaçının. Sabah veya akşam saatlerini tercih edin.',
      icon: '🔥',
      priority: 'high',
    });
  }

  // Giyim Önerileri
  if (temp < 0) {
    recommendations.push({
      type: 'clothing',
      title: 'Çok Kalın Giyinin',
      description: 'Mont, atkı, eldiven ve şapka giymeyi unutmayın. Çok katmanlı giyinin.',
      icon: '🧤',
      priority: 'high',
    });
  } else if (temp >= 0 && temp < 10) {
    recommendations.push({
      type: 'clothing',
      title: 'Kalın Giyinin',
      description: 'Kalın mont, kazak ve pantolon giymeyi öneriyoruz. Atkı ve şapka da iyi olur.',
      icon: '🧥',
      priority: 'high',
    });
  } else if (temp >= 10 && temp < 18) {
    recommendations.push({
      type: 'clothing',
      title: 'Orta Kalınlıkta Giyinin',
      description: 'Hafif mont veya ceket, uzun kollu tişört ve pantolon uygun olacaktır.',
      icon: '👔',
      priority: 'medium',
    });
  } else if (temp >= 18 && temp < 25) {
    recommendations.push({
      type: 'clothing',
      title: 'Hafif Giyinin',
      description: 'İnce ceket veya hırka yeterli. Uzun veya kısa kollu tişört giyebilirsiniz.',
      icon: '👕',
      priority: 'low',
    });
  } else if (temp >= 25) {
    recommendations.push({
      type: 'clothing',
      title: 'İnce ve Açık Renkli Giyinin',
      description: 'İnce, açık renkli ve nefes alabilen kıyafetler giyin. Şapka ve güneş gözlüğü kullanın.',
      icon: '👗',
      priority: 'medium',
    });
  }

  if (isRaining) {
    recommendations.push({
      type: 'clothing',
      title: 'Yağmurluk veya Şemsiye',
      description: 'Yağmurluk veya şemsiye almayı unutmayın.',
      icon: '☂️',
      priority: 'high',
    });
  }

  // Spor Aktiviteleri
  if (isRaining || isSnowing) {
    recommendations.push({
      type: 'sports',
      title: 'Kapalı Alan Sporları',
      description: 'Yağışlı hava nedeniyle kapalı alan sporları (fitness, yüzme, basketbol salonu) önerilir.',
      icon: '🏋️',
      priority: 'medium',
    });
  } else if (temp >= 15 && temp < 25 && isClear && windSpeed < 20) {
    recommendations.push({
      type: 'sports',
      title: 'Açık Hava Sporları İdeal',
      description: 'Koşu, bisiklet, yürüyüş, futbol gibi açık hava sporları için mükemmel koşullar.',
      icon: '🏃',
      priority: 'high',
    });
  } else if (temp >= 10 && temp < 15 && !isRaining) {
    recommendations.push({
      type: 'sports',
      title: 'Orta Seviye Açık Hava Sporları',
      description: 'Yürüyüş, hafif koşu veya bisiklet yapılabilir. Isınma hareketlerini unutmayın.',
      icon: '🚴',
      priority: 'medium',
    });
  } else if (temp >= 25) {
    recommendations.push({
      type: 'sports',
      title: 'Sabah veya Akşam Sporları',
      description: 'Sıcak hava nedeniyle sabah erken veya akşam geç saatlerde spor yapın. Bol su için.',
      icon: '💧',
      priority: 'high',
    });
  } else if (windSpeed > 25) {
    recommendations.push({
      type: 'sports',
      title: 'Rüzgarlı Hava',
      description: 'Güçlü rüzgar nedeniyle açık hava sporları zor olabilir. Kapalı alan sporları önerilir.',
      icon: '💨',
      priority: 'medium',
    });
  }

  // Seyahat Önerileri
  if (isRaining || isSnowing) {
    recommendations.push({
      type: 'travel',
      title: 'Seyahat İçin Dikkatli Olun',
      description: 'Yağışlı hava nedeniyle yolculuk süreleri uzayabilir. Yavaş ve dikkatli sürün.',
      icon: '🚗',
      priority: 'high',
    });
  } else if (isClear && temp >= 15 && temp < 25) {
    recommendations.push({
      type: 'travel',
      title: 'Seyahat İçin İdeal Hava',
      description: 'Mükemmel hava koşulları! Seyahat için ideal bir gün.',
      icon: '✈️',
      priority: 'low',
    });
  } else if (windSpeed > 30) {
    recommendations.push({
      type: 'travel',
      title: 'Güçlü Rüzgar Uyarısı',
      description: 'Güçlü rüzgar nedeniyle uçak ve deniz yolculuklarında gecikmeler olabilir.',
      icon: '⚠️',
      priority: 'high',
    });
  }

  // Önceliğe göre sırala
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

