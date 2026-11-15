# nasa-space-apps-ttcodersstudio

# 🌍 AeroJukebox — Earth Information Center Telemetry & Sonification

![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Denizli-0B3D91?style=for-the-badge&logo=nasa)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-00D2FF?style=for-the-badge)
![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API-10B981?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-TR%20%7C%20EN%20%7C%20DE%20%7C%20FR%20%7C%20CS-8B5CF6?style=for-the-badge)

**AeroJukebox**, NASA'nın *"The Earth Information Jukebox"* görevi kapsamında geliştirilmiş; gerçek zamanlı uydu telemetrisini, hava kalitesini, aktif orman yangınlarını ve gece ışık kirliliğini **yaşayan prosedürel bir Biyosfer Ağacına**, **sinematik bir müzik deneyimine (Sonifikasyon)** ve **erişilebilir sesli rehbere** dönüştüren çok duyulu bir Dünya gözlemevidir.

---

## 🎯 Problem ve Çözüm

NASA Dünya Bilgi Merkezi (EIC), gezegenimizin değişimini izleyen olağanüstü görselleştirmeler üretir; ancak veriyi yalnızca görsel grafiklerle sunmak görme engelli ve az gören bireyleri dışlar, ayrıca iklim verilerinin duygusal etkisini sınırlar.

**AeroJukebox**, görmeyi sese ve yaşayan bir ekosisteme çevirerek bu boşluğu kapatır:
- Dünyanın herhangi bir noktasına tıklandığında canlı NASA ve çevre verilerini çeker.
- Veriyi **5 evreli fraktal ağaç simülasyonuna** ve **kulak yormayan harmonik müziklere** dönüştürür.
- **5 dilde sesli betimleme**, tam klavye kontrolü ve **Google Gemini AI** asistanı ile bilimsel veriyi herkes için erişilebilir kılar.

---

## ✨ Temel Özellikler

### 1. 🛰️ 3 Bağımsız Küresel Radar Haritası
- **🌫️ Hava Kalitesi Radarı:** Open-Meteo (Copernicus CAMS) ve NASA POWER verilerini birleştirerek `PM2.5`, `PM10`, `NO₂`, `O₃`, `CO`, `NASA Solar Işınım (kWh/m²)`, Sıcaklık (`°C`), Nem (`%`), `EAQI` ve `US AQI` takibi yapar.
- **🔥 Yangın & Termal Risk Radarı:** Hava kalitesinden bağımsız olarak **NASA EONET API** üzerinden dünyadaki aktif orman yangınlarını haritada işaretler ve sıcaklık, nem, toz verileriyle **Fire Weather Index (FWI %5–100)** hesaplar.
- **🌌 Işık Kirliliği Radarı:** **NASA GIBS VIIRS Black Marble** gece ışıkları katmanını haritaya bindirir ve **Bortle Ölçeği (1–9)** üzerinden yapay gökyüzü parlamasını (*Skyglow %*) analiz eder.

### 2. 🌳 ULTRA Prosedürel Fraktal Biyosfer Ağacı (60 FPS Canvas)
- **Hava Modu (5 Evre):** Zümrüt yapraklı ve çiçekli sağlıklı ağaçtan (*Evre 1*), klorofil kaybı ve fiziksel yaprak dökümüne (*Evre 3–4*), oradan çatlamış kuru iskelet ve PM2.5 duman fırtınasına (*Evre 5*) pürüzsüz geçiş yapar.
- **Yangın Modu:** FWI `%50` eşiğini aştığında gövde kömürleşir, dallarda titreyen gerçekçi alev dilleri ve gökyüzüne uçuşan kor kıvılcımları oluşur.
- **Işık Kirliliği Modu:** Karanlık gökyüzünde (*Bortle 1–3*) yıldızlar ve dans eden ateş böcekleri; yoğun şehir parlamasında (*Bortle 7–9*) ise yıldızları silen yapay ışık konisi ve ışığa takılmış gece güveleri belirir.

### 3. 🎵 Sinematik Web Audio API Sonifikasyon Motoru
- Dışarıdan hazır ses dosyası çekmeden tarayıcı içinde sıfır gecikmeyle sentezlenir.
- Çıkış katmanında **`DynamicsCompressor` + `2.2x Makeup Gain`** ile bozulmasız, güçlü ve doygun ses sunar.
- **Veri → Ses Eşleme Tablosu:**

| Mod / Durum | Biyosfer Tepkisi | Müzikal Ölçek & Ses Tasarımı |
| :--- | :--- | :--- |
| **Evre 1 (Mükemmel)** | Gür zümrüt yapraklar, çiçekler, O₂ | C Lydian pad + kristal pentatonik çanlar |
| **Evre 2 (Dengeli)** | Doğal yeşil kanopi | C Maj9 akorları + ılık kalimba nabzı |
| **Evre 3 (Hafif Stres)** | Kehribar sararması, ilk dökülme | D Dorian / Sus4 + melankolik inen notalar |
| **Evre 4 (Yüksek Stres)** | Yoğun yaprak dökümü, sert rüzgar | E Phrygian + kalp atışı ritimli bas |
| **Evre 5 (Kritik Alarm)** | Yapraksız çatlak iskelet, PM2.5 dumanı | 380 Hz low-pass boğuk bas + sonar uyarısı |
| **Yangın (FWI ≥ %50)** | Alev alan dallar & uçuşan korlar | F-Minör bas dronu + odun/kor çıtırtıları |
| **Işık (Bortle 1–3 vs 7–9)** | Yıldızlı gece vs yapay şehir ışığı | Yıldız arpı vs 60 Hz şehir neon uğultusu |

### 4. 🤖 AeroAI (Google Gemini AI Asistanı)
- O an seçili koordinatın tüm canlı uydu verilerini, aktif harita modunu ve tarihsel yılı bağlam olarak alarak derin bilimsel analizler üretir.
- Çok turlu sohbet hafızasına sahiptir, konu dışı gereksiz soruları filtreler ve API anahtarı girilmediğinde dahi çevrimdışı akıllı analiz motoruyla çalışmayı sürdürür.

### 5. ⏳ 1750–2026 Tarihsel Atmosfer Simülatörü & Erişilebilirlik
- **Tarihsel Karşılaştırma:** 2026 canlı uydu verisini, 1750 sanayi öncesi doğal baz değerlerle antropojenik emisyon eğrisi üzerinden kıyaslar.
- **5 Dil Desteği:** Türkçe (`TR`), İngilizce (`EN`), Almanca (`DE`), Fransızca (`FR`) ve Çekçe (`CS`).
- **Kapsayıcı Erişilebilirlik:** Web Speech API sesli okuma (`V`), `aria-live` ekran okuyucu bildirimleri, Açık/Koyu tema, tam mobil uyumluluk ve ilk açılış **Spotlight Rehberi (`H`)**.

---

## 📁 Proje Klasör Yapısı

```text
aerojukebox/
├── index.html                  # Ana uygulama iskeleti, erişilebilir ARIA yapısı ve modallar
├── css/
│   └── style.css               # Uzay telemetri teması (Açık/Koyu), responsive ızgara ve rehber stilleri
├── js/
│   ├── api/
│   │   └── telemetryApi.js     # NASA POWER, NASA EONET, Open-Meteo, Bortle & FWI hesaplamaları
│   ├── audio/
│   │   └── audioEngine.js      # DynamicsCompressor + 2.2x Boost Web Audio sentezleyici
│   ├── map/
│   │   └── mapManager.js       # Leaflet tek renk harita, NASA GIBS VIIRS & EONET yangın pinleri
│   ├── tour/
│   │   └── onboardingTour.js   # 5 dilli interaktif Spotlight başlangıç rehberi
│   ├── tree/
│   │   ├── particleSystem.js   # O₂, dökülen yaprak, smog, alev koru ve ateş böceği fiziği
│   │   └── treeRenderer.js     # Prosedürel fraktal ağaç, yıldızlı gece ve yangın alev çizimleri
│   └── app.js                  # Ana koordinatör, 5 dil sözlüğü (i18n) ve Gemini AI entegrasyonu
└── assets/
    ├── nasa.jpg                # Giriş (Splash) ekranı NASA Space Apps logosu
    └── ttcs.jpg                # Giriş (Splash) ekranı takım logosu
